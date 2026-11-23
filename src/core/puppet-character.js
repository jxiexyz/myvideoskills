import * as THREE from 'three';
import { loadCharacterImage } from '../assets/image-loader.js';
import { PuppetSkeleton } from '../rig/skeleton.js';
import { AnimationLibrary } from '../animation/library.js';
import { AnimationController } from '../animation/animation-controller.js';
import { ViewAdapter } from '../animation/view-adapter.js';
import { ExpressionController } from '../animation/expression/expression-controller.js';
import { createGazeController } from '../animation/gaze-controller.js';
import { clamp, smoothstep } from '../utils/math.js';
import {
  COMBINED_PRESETS,
  listExpressions,
  listMotions,
  listPresets,
  resolveMotionDefinition,
} from '../animation/catalog.js';
import {
  VIEW_CONVENTIONS,
  getMotionSupportForView,
} from '../../assets/characters/main-character/shared/semantic-rig-map.js';

async function loadManifestImages(manifest, fallbackImage = undefined) {
  const layers = await Promise.all(
    manifest.parts
      .filter((part) => part.image)
      .map(async (part) => [part.name, await loadCharacterImage(part.image)])
  );
  const partImages = new Map(layers);
  const decoded = fallbackImage
    ? await loadCharacterImage(fallbackImage)
    : partImages.get('body') || partImages.values().next().value;
  if (!decoded) {
    throw new Error('PuppetKit: provide either `image` or per-part `image` URLs in manifest.');
  }
  return { decoded, partImages };
}

function setSkeletonOpacity(skeleton, opacity) {
  const a = clamp(opacity, 0, 1);
  for (const [name, part] of skeleton.parts.entries()) {
    const mat = part.mesh?.material;
    if (!mat) continue;
    if (name === 'blush') {
      // Preserve blush's subtle expression alpha by scaling relative to its base opacity
      const base = part._baseOpacity ?? mat.opacity ?? 1;
      mat.opacity = base * a;
    } else {
      mat.opacity = a;
    }
  }
}

export class PuppetCharacter {
  /**
   * Load a character from a manifest (and optional base atlas image).
   * Supports both single-view manifests and multi-view manifests (`manifest.views`).
   * @param {{ image?: any, manifest: any, initialView?: string, worldHeight?: number, autoIdle?: boolean, autoBlink?: boolean, scale?: number, position?: number[], [key: string]: any }} config
   */
  static async create({ image = undefined, manifest, initialView = undefined, ...options }) {
    if (!manifest?.parts?.length) {
      throw new Error('PuppetKit: manifest.parts is required.');
    }

    const startViewId = initialView || manifest.viewId || 'front';
    const activeManifest = manifest.views?.[startViewId] || manifest;
    const { decoded, partImages } = await loadManifestImages(activeManifest, image);

    const char = new PuppetCharacter(decoded, manifest, {
      ...options,
      partImages,
      initialView: startViewId,
      activeManifest,
    });
    return char;
  }

  constructor(image, manifest, options = {}) {
    if (!manifest?.parts?.length) {
      throw new Error('PuppetKit: manifest.parts is required.');
    }
    this.baseManifest = manifest;
    this._createOptions = {
      worldHeight: options.worldHeight ?? 2.0,
      scale: options.scale ?? 1,
      position: options.position ? [...options.position] : [0, 0, 0],
      autoBlink: options.autoBlink ?? true,
    };

    // Stable container added to Three.js scene; individual view skeletons mount inside this.root
    this.root = new THREE.Group();
    this.root.name = manifest.name || 'PuppetCharacter';

    // Build view manifest registry (always includes at least 'front' or manifest.viewId)
    this._viewManifests = new Map();
    const defaultViewId = manifest.viewId || 'front';
    if (manifest.views && typeof manifest.views === 'object') {
      const preferredOrder = ['front', 'back', 'top', 'bottom'];
      for (const id of preferredOrder) {
        if (manifest.views[id]) this._viewManifests.set(id, manifest.views[id]);
      }
      for (const [id, viewManifest] of Object.entries(manifest.views)) {
        if (viewManifest && !this._viewManifests.has(id)) {
          this._viewManifests.set(id, viewManifest);
        }
      }
    }
    if (!this._viewManifests.has(defaultViewId)) {
      this._viewManifests.set(defaultViewId, manifest);
    }

    this.activeView = options.initialView && this._viewManifests.has(options.initialView)
      ? options.initialView
      : defaultViewId;
    this.manifest = options.activeManifest || this._viewManifests.get(this.activeView) || manifest;

    // Cache of instantiated view entries: Map<viewId, { viewId, manifest, skeleton, adapter, gazeController }>
    this._viewCache = new Map();
    this._viewRequestSeq = 0;
    this._viewTransition = null; // { from, to, elapsed, duration } | null
    this._debugVisible = false;
    this._debugScene = null;

    const initialEntry = this._createViewEntry(this.activeView, image, this.manifest, options);
    this._viewCache.set(this.activeView, initialEntry);
    this.root.add(initialEntry.skeleton.root);

    this.skeleton = initialEntry.skeleton;
    this.gazeController = initialEntry.gazeController;
    this.viewAdapter = initialEntry.adapter;

    // Reference skeleton used by walk/run/crouch IK evaluators so phase & canonical poses remain
    // identical even when viewing from `top` or `bottom`!
    this._referenceSkeleton =
      this.activeView === 'front' ? initialEntry.skeleton : initialEntry.skeleton;

    // Legacy Timeline holder (kept for backward compatibility)
    this.current = null;

    // Channel 5: Facial expressions, auto-blink, gaze, talking & visemes
    this.expressions = new ExpressionController(this.skeleton, this.gazeController, {
      blink: { autoBlink: this._createOptions.autoBlink },
      facialVisibility: initialEntry.adapter.facialVisibility,
    });

    // Channels 1–4: Base, Locomotion, Head, Gesture
    this.controller = new AnimationController(this.skeleton, this.expressions, {
      viewAdapter: initialEntry.adapter,
      referenceSkeleton: this._referenceSkeleton,
    });

    // Start in clean standing idle by default unless caller disables autoIdle
    if (options.autoIdle !== false) {
      this.controller.play('idle', { loop: true, transition: 0 });
    }
    this.update(0);
  }

  _createViewEntry(viewId, image, viewManifest, extraOptions = {}) {
    const effectiveWorldHeight =
      (this._createOptions.worldHeight || 2.0) * (viewManifest.worldHeightScale ?? 1.0);
    const skeleton = new PuppetSkeleton(image, viewManifest, {
      ...extraOptions,
      worldHeight: effectiveWorldHeight,
      scale: this._createOptions.scale,
      position: this._createOptions.position,
    });
    skeleton.root.name = `${viewManifest.name || 'Puppet'}-${viewId}`;

    let gazeController = null;
    const faceVisible = viewManifest.view?.facialVisibility?.faceVisible !== false;
    if (faceVisible && viewManifest.gazeRig && skeleton.get('eyes') && typeof document !== 'undefined') {
      try {
        gazeController = createGazeController({ skeleton }, viewManifest.gazeRig);
      } catch {
        gazeController = null;
      }
    }

    const adapter = new ViewAdapter(viewId, viewManifest.view || VIEW_CONVENTIONS[viewId]);
    return {
      viewId,
      manifest: viewManifest,
      skeleton,
      adapter,
      gazeController,
    };
  }

  /**
   * Register a custom/pre-built view skeleton (also used for extensible future views
   * like `leftProfile`/`rightProfile` and deterministic headless tests).
   */
  registerView(viewId, viewManifest, prebuiltSkeleton = null, prebuiltGaze = null) {
    if (!viewId || !viewManifest?.parts?.length) {
      throw new Error('PuppetKit: registerView requires a viewId and manifest with parts.');
    }
    this._viewManifests.set(viewId, viewManifest);
    if (prebuiltSkeleton) {
      const adapter = new ViewAdapter(viewId, viewManifest.view || VIEW_CONVENTIONS[viewId]);
      const entry = {
        viewId,
        manifest: viewManifest,
        skeleton: prebuiltSkeleton,
        adapter,
        gazeController: prebuiltGaze,
      };
      prebuiltSkeleton.root.visible = viewId === this.activeView;
      if (!prebuiltSkeleton.root.parent) {
        this.root.add(prebuiltSkeleton.root);
      }
      this._viewCache.set(viewId, entry);
      if (viewId === 'front') {
        this._referenceSkeleton = prebuiltSkeleton;
        this.controller.referenceSkeleton = prebuiltSkeleton;
      }
    }
    return this;
  }

  /** Return all views available on this character pack. */
  listViews() {
    const out = [];
    for (const [id, m] of this._viewManifests.entries()) {
      const meta = m.view || VIEW_CONVENTIONS[id] || {
        id,
        label: id.charAt(0).toUpperCase() + id.slice(1),
        shortLabel: id,
        facing: id,
        projection: 'orthographic-2d',
        showGround: id === 'front' || id === 'back',
        faceVisible: id === 'front',
      };
      out.push({
        id,
        label: meta.label || id,
        shortLabel: meta.shortLabel || meta.label || id,
        direction: meta.direction || id,
        facing: meta.facing || id,
        projection: meta.projection || 'orthographic-2d',
        showGround: meta.showGround ?? (id === 'front' || id === 'back'),
        faceVisible: meta.faceVisible ?? (id === 'front'),
        framingConvention: meta.framingConvention || '',
        description: meta.description || '',
        partCount: m.parts?.length || 0,
        loaded: this._viewCache.has(id),
      });
    }
    return out;
  }

  /** Preload and cache view packs ahead of time for instant zero-latency switching. */
  async preloadViews(viewIds = null) {
    const ids = Array.isArray(viewIds) ? viewIds : Array.from(this._viewManifests.keys());
    await Promise.all(ids.map((id) => this._ensureViewLoaded(id)));
    return this.listViews();
  }

  async _ensureViewLoaded(viewId) {
    if (this._viewCache.has(viewId)) {
      return this._viewCache.get(viewId);
    }
    const viewManifest = this._viewManifests.get(viewId);
    if (!viewManifest) {
      throw new Error(
        `Unknown view "${viewId}". Available views: ${Array.from(this._viewManifests.keys()).join(', ')}`
      );
    }
    const { decoded, partImages } = await loadManifestImages(viewManifest);
    // Double-check cache in case a parallel call loaded it while awaiting
    if (this._viewCache.has(viewId)) {
      return this._viewCache.get(viewId);
    }
    const entry = this._createViewEntry(viewId, decoded, viewManifest, { partImages });
    entry.skeleton.root.visible = false;
    this.root.add(entry.skeleton.root);
    this._viewCache.set(viewId, entry);
    if (viewId === 'front') {
      this._referenceSkeleton = entry.skeleton;
      this.controller.referenceSkeleton = entry.skeleton;
    }
    return entry;
  }

  /**
   * Switch active directional view (`front`, `back`, `top`, `bottom`, ...) smoothly
   * while preserving active motions, exact normalized timeline phase, speed, loop,
   * pause state, expression, talking, viseme, blink, and gaze!
   *
   * @param {string} viewId
   * @param {{ transition?: number, preserveAnimationState?: boolean }} [options]
   */
  async setView(viewId, { transition = 0.25, preserveAnimationState = true } = {}) {
    if (!this._viewManifests.has(viewId)) {
      throw new Error(
        `Unknown view "${viewId}". Available views: ${Array.from(this._viewManifests.keys()).join(', ')}`
      );
    }

    const reqSeq = ++this._viewRequestSeq;
    const nextEntry = await this._ensureViewLoaded(viewId);

    // Cancel stale async switch if a newer setView() call superseded this one
    if (reqSeq !== this._viewRequestSeq) {
      return this.getViewState();
    }

    const prevEntry = this._viewCache.get(this.activeView);

    // Finalize any in-flight previous transition cleanly before starting the new one
    if (this._viewTransition) {
      const oldFrom = this._viewTransition.from;
      if (oldFrom && oldFrom !== nextEntry && oldFrom !== prevEntry) {
        oldFrom.skeleton.root.visible = false;
        setSkeletonOpacity(oldFrom.skeleton, 1);
      }
      this._viewTransition = null;
    }

    if (prevEntry === nextEntry) {
      nextEntry.skeleton.root.visible = true;
      setSkeletonOpacity(nextEntry.skeleton, 1);
      if (!preserveAnimationState) {
        this.controller.setBasePose('standing', { keepIdle: true });
        this.expressions.resetExpression({ transition: 0 });
      }
      return this.getViewState();
    }

    // Update active view references
    this.activeView = viewId;
    this.manifest = nextEntry.manifest;
    this.skeleton = nextEntry.skeleton;
    this.gazeController = nextEntry.gazeController;
    this.viewAdapter = nextEntry.adapter;

    // Rebind animation & expression controllers WITHOUT resetting timers, phase, or pause state!
    if (preserveAnimationState) {
      this.controller.rebindSkeleton(nextEntry.skeleton, nextEntry.adapter);
      this.expressions.rebindSkeleton(
        nextEntry.skeleton,
        nextEntry.gazeController,
        nextEntry.adapter.facialVisibility
      );
    } else {
      this.controller.rebindSkeleton(nextEntry.skeleton, nextEntry.adapter);
      this.controller.setBasePose('standing', { keepIdle: true });
      this.expressions.rebindSkeleton(
        nextEntry.skeleton,
        nextEntry.gazeController,
        nextEntry.adapter.facialVisibility
      );
      this.expressions.resetExpression({ transition: 0 });
    }

    // Move Rig Debug cleanly to the newly active view skeleton (never leave stale markers!)
    if (this._debugVisible && this._debugScene) {
      prevEntry?.skeleton?.setDebugVisible(false, this._debugScene);
      nextEntry.skeleton.setDebugVisible(true, this._debugScene);
    }

    const dur = Math.max(0, Number(transition) || 0);
    if (dur > 0.001 && prevEntry) {
      prevEntry.skeleton.root.visible = true;
      nextEntry.skeleton.root.visible = true;
      setSkeletonOpacity(prevEntry.skeleton, 1);
      setSkeletonOpacity(nextEntry.skeleton, 0);
      this._viewTransition = {
        from: prevEntry,
        to: nextEntry,
        elapsed: 0,
        duration: dur,
      };
    } else {
      if (prevEntry) {
        prevEntry.skeleton.root.visible = false;
        setSkeletonOpacity(prevEntry.skeleton, 1);
      }
      nextEntry.skeleton.root.visible = true;
      setSkeletonOpacity(nextEntry.skeleton, 1);
      this._viewTransition = null;
    }

    return this.getViewState();
  }

  /**
   * Synchronize rig debug overlay across view switches automatically.
   */
  setDebugVisible(visible, scene) {
    this._debugVisible = Boolean(visible);
    this._debugScene = scene || this._debugScene;
    for (const entry of this._viewCache.values()) {
      const show = this._debugVisible && entry.viewId === this.activeView;
      entry.skeleton.setDebugVisible(show, this._debugScene);
    }
    return this;
  }

  /** Return structured state about the active view, transition progress, and conventions. */
  getViewState() {
    const meta = this.manifest?.view || VIEW_CONVENTIONS[this.activeView] || {};
    const progress = this._viewTransition
      ? clamp(this._viewTransition.elapsed / Math.max(1e-4, this._viewTransition.duration), 0, 1)
      : 1;
    return {
      activeView: this.activeView,
      availableViews: Array.from(this._viewManifests.keys()),
      isTransitioning: Boolean(this._viewTransition),
      transitionProgress: Number(progress.toFixed(3)),
      faceVisible: this.viewAdapter?.faceVisible ?? true,
      showGround: meta.showGround ?? (this.activeView === 'front' || this.activeView === 'back'),
      framingConvention: meta.framingConvention || '',
      label: meta.label || this.activeView,
    };
  }

  /** Return honest support status (`native` | `adapted` | `limited` | `hidden` | `unsupported`) for a motion in a view. */
  getViewMotionSupport(motionId, viewId = this.activeView) {
    return getMotionSupportForView(motionId, viewId);
  }

  get expressionState() {
    return this.expressions.currentName;
  }

  /**
   * Play any registered body, head, gesture, or locomotion motion on its channel.
   * Non-conflicting channels continue running smoothly.
   */
  play(name, options = {}) {
    if (name === 'talking') {
      this.talk(true, options);
      return this;
    }
    const def = resolveMotionDefinition(name);
    if (def) {
      this.current?.stop();
      this.current = null;
      this.controller.play(def.id, options);
      return this;
    }
    const factory = AnimationLibrary[name];
    if (!factory) {
      throw new Error(`Unknown animation "${name}".`);
    }
    this.current?.stop();
    this.current = factory(this.skeleton).play(options);
    return this;
  }

  gesture(name, options = {}) {
    return this.play(name, { ...options, channel: 'gesture' });
  }

  head(name, options = {}) {
    return this.play(name, { ...options, channel: 'head' });
  }

  locomotion(name, options = {}) {
    return this.play(name, { ...options, channel: 'locomotion' });
  }

  /** Switch to any of the 16 expressions with smooth transition blending. */
  expression(name, options = {}) {
    this.expressions.setExpression(name, options);
    return this;
  }

  resetExpression(options = {}) {
    this.expressions.resetExpression(options);
    return this;
  }

  blink() {
    this.expressions.blink();
    return this;
  }

  setAutoBlink(enabled) {
    this.expressions.setAutoBlink(enabled);
    return this;
  }

  lookAt(target, options = {}) {
    this.expressions.lookAt(target, options);
    return this;
  }

  talk(active = true, options = {}) {
    this.expressions.setTalking(active, options);
    return this;
  }

  setViseme(viseme) {
    this.expressions.setViseme(viseme);
    return this;
  }

  /**
   * Trigger one of the 7 Combined Action Presets.
   */
  preset(name, options = {}) {
    const spec = COMBINED_PRESETS[name];
    if (!spec) {
      throw new Error(
        `Unknown preset "${name}". Available: ${Object.keys(COMBINED_PRESETS).join(', ')}`
      );
    }
    const transition = options.transition ?? 0.2;
    this.controller.stopChannel('locomotion', { transition });
    this.controller.stopChannel('gesture', { transition });
    this.controller.stopChannel('head', { transition });

    if (spec.base) this.controller.play(spec.base, { transition, loop: true });
    if (spec.locomotion) this.controller.play(spec.locomotion, { transition });
    if (spec.gesture) this.controller.play(spec.gesture, { transition });
    if (spec.head) this.controller.play(spec.head, { transition });
    if (spec.expression) this.expressions.setExpression(spec.expression, { transition });
    if (spec.gaze) {
      this.expressions.lookAt(spec.gaze);
    } else {
      this.expressions.lookAt(null);
    }
    this.expressions.setTalking(Boolean(spec.talking));
    return this;
  }

  stop(channel = null, options = {}) {
    this.current?.stop();
    this.current = null;
    if (channel) {
      this.controller.stopChannel(channel, options);
    } else {
      this.controller.stopAll({ includeBase: false, ...options });
      this.expressions.setTalking(false);
    }
    return this;
  }

  stopAll(options = {}) {
    this.current?.stop();
    this.current = null;
    this.controller.stopAll({ includeBase: true, ...options });
    this.expressions.setTalking(false);
    this.expressions.lookAt(null);
    return this;
  }

  pause() {
    this.current?.pause();
    this.controller.pause();
    return this;
  }

  resume() {
    this.controller.resume();
    return this;
  }

  restart() {
    this.controller.restart();
    return this;
  }

  setSpeed(speed) {
    this.controller.setSpeed(speed);
    return this;
  }

  setLoop(loop) {
    this.controller.setLoop(loop);
    return this;
  }

  setBasePose(poseName = 'standing', options = {}) {
    this.current?.stop();
    this.current = null;
    this.controller.setBasePose(poseName, options);
    this.expressions.setTalking(false);
    this.expressions.lookAt(null);
    return this;
  }

  /** Legacy direct part rotation helpers (degrees). */
  headRotate(degrees) {
    this.skeleton.setRotation('head', degrees);
    return this;
  }

  armRotate(side, degrees) {
    this.skeleton.setRotation(side === 'left' ? 'leftUpperArm' : 'rightUpperArm', degrees);
    return this;
  }

  update(delta = 0) {
    const safeDt = Math.max(0, delta || 0);
    if (this.current) {
      this.current.update(safeDt);
    } else {
      this.controller.update(safeDt);
    }
    this.expressions.update(safeDt);

    // Advance view transition cleanly EVEN when animation playback is paused!
    if (this._viewTransition) {
      const tr = this._viewTransition;
      tr.elapsed = Math.min(tr.duration, tr.elapsed + safeDt);
      const u = tr.duration > 1e-4 ? clamp(tr.elapsed / tr.duration, 0, 1) : 1;

      // Keep outgoing silhouette locked to exact same live animation phase while dissolving out
      if (!this.current) {
        this.controller.applyCanonicalPoseTo(tr.from.skeleton, tr.from.adapter);
      }

      // Crisp non-ghosting envelope: outgoing fades 0..0.52, incoming fades 0.36..1.0
      const outAlpha = 1 - smoothstep(clamp(u / 0.52, 0, 1));
      const inAlpha = smoothstep(clamp((u - 0.36) / 0.64, 0, 1));
      setSkeletonOpacity(tr.from.skeleton, outAlpha);
      setSkeletonOpacity(tr.to.skeleton, inAlpha);

      if (u >= 1) {
        tr.from.skeleton.root.visible = false;
        setSkeletonOpacity(tr.from.skeleton, 1);
        setSkeletonOpacity(tr.to.skeleton, 1);
        this._viewTransition = null;
      }
    }
  }

  getState() {
    return {
      ...this.controller.getState(),
      view: this.getViewState(),
      face: this.expressions.getState(),
    };
  }

  validateRig() {
    return this.skeleton.validateRig();
  }

  static listMotions(category) {
    return listMotions(category);
  }

  static listExpressions() {
    return listExpressions();
  }

  static listPresets() {
    return listPresets();
  }

  dispose() {
    this._viewRequestSeq++;
    this._viewTransition = null;
    this.stopAll({ transition: 0 });
    this.controller.dispose();
    for (const entry of this._viewCache.values()) {
      entry.gazeController?.dispose?.();
      entry.skeleton.dispose();
    }
    this._viewCache.clear();
  }
}
