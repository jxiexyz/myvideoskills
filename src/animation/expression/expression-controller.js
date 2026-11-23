import { clamp, damp, degToRad, lerp, smoothstep } from '../../utils/math.js';
import { EXPRESSION_PRESETS, resolveExpressionPreset } from './expression-presets.js';
import { BlinkController } from './blink-controller.js';

const VISEME_MOUTH_MAP = {
  rest: null, // restores active expression mouth
  A: 'mouth_open',
  E: 'mouth_smile',
  I: 'mouth_teeth',
  O: 'mouth_small_o',
  U: 'mouth_small_o',
  M: 'mouth_neutral',
  F: 'mouth_determined',
};

const TALK_SEQUENCE = ['mouth_open', 'mouth_small_o', 'mouth_smile', 'mouth_open', 'mouth_neutral'];

/**
 * Manages the character's 16-expression system, smooth transitions,
 * gaze coordination, non-destructive blinking, and talking/viseme overlays.
 * Operates strictly on facial layers — never fights head/body/gesture channels.
 */
export class ExpressionController {
  constructor(skeleton, gazeController = null, options = {}) {
    this.skeleton = skeleton;
    this.gazeController = gazeController;
    this.blinkController = new BlinkController(options.blink);

    this.currentName = 'neutral';
    this._fromPreset = EXPRESSION_PRESETS.neutral;
    this._targetPreset = EXPRESSION_PRESETS.neutral;
    this._transitionDuration = 0;
    this._transitionElapsed = 0;
    this._swappedLayers = true;

    // Smooth gaze state (user lookAt target + channel look bias + expression default)
    this._userGaze = null; // { x, y } | null
    this._channelGaze = null; // { x, y } | null (set by head channel lookLeft/lookRight/etc.)
    this._gazeCurrent = { x: 0, y: 0 };
    this._gazeSpeed = 12;

    // Non-destructive talking & viseme state
    this._talking = false;
    this._talkElapsed = 0;
    this._talkRate = 7.5; // syllables/sec
    this._viseme = null;

    // Facial visibility policy for multi-view rigs (back/top/bottom hide front facial features while preserving internal state)
    this._facialVisibility = options.facialVisibility ||
      skeleton?.manifest?.view?.facialVisibility || {
        faceVisible: true,
        eyes: true,
        brows: true,
        mouth: true,
        blush: true,
        gaze: true,
        talking: true,
      };

    // Discover face swap layers on the skeleton once
    this._eyeLayers = this._collectLayers('eyes');
    this._browLayers = this._collectLayers('brows');
    this._mouthLayers = this._collectLayers('mouth');
    this._hasBlush = Boolean(this.skeleton.get('blush'));
    this._hasDynamicGaze = Boolean(this.gazeController);

    // Apply initial neutral expression immediately
    this.setExpression('neutral', { transition: 0 });
  }

  /**
   * Rebind to a new directional view skeleton & optional gaze controller while
   * preserving 100% of current expression, transition, talking, viseme, blink, and gaze state!
   */
  rebindSkeleton(skeleton, gazeController = null, facialVisibility = null) {
    this.skeleton = skeleton;
    this.gazeController = gazeController;
    this._facialVisibility =
      facialVisibility ||
      skeleton?.manifest?.view?.facialVisibility || {
        faceVisible: true,
        eyes: true,
        brows: true,
        mouth: true,
        blush: true,
        gaze: true,
        talking: true,
      };

    this._eyeLayers = this._collectLayers('eyes');
    this._browLayers = this._collectLayers('brows');
    this._mouthLayers = this._collectLayers('mouth');
    this._hasBlush = Boolean(this.skeleton.get('blush'));
    this._hasDynamicGaze = Boolean(this.gazeController);

    // Immediately sync facial layers on the newly bound view without advancing timers
    const activePreset = this._swappedLayers ? this._targetPreset : this._fromPreset;
    const alpha =
      this._transitionDuration > 0.001
        ? clamp(this._transitionElapsed / this._transitionDuration, 0, 1)
        : 1;
    this._applyDiscreteLayers(activePreset, this.blinkController.progress);
    this._applyProceduralState(this._fromPreset, this._targetPreset, alpha, this.blinkController.progress);
    if (this._facialVisibility.faceVisible && this._hasDynamicGaze && activePreset.gazeProfile) {
      this.gazeController.setProfile(activePreset.gazeProfile);
      this.gazeController.setBlinkProgress(this.blinkController.progress);
      this.gazeController.apply(this._gazeCurrent);
    }
    return this;
  }

  get faceVisible() {
    return this._facialVisibility?.faceVisible !== false;
  }

  _collectLayers(prefix) {
    const list = [];
    for (const key of this.skeleton.parts.keys()) {
      if (key === prefix || key.startsWith(`${prefix}_`)) list.push(key);
    }
    return list;
  }

  /**
   * Switch to any of the 16 expressions (or legacy aliases) with optional transition blending.
   */
  setExpression(name, { transition = 0.2 } = {}) {
    const preset = resolveExpressionPreset(name);
    if (!preset) {
      throw new Error(
        `Unknown expression "${name}". Available: ${Object.keys(EXPRESSION_PRESETS).join(', ')}`
      );
    }
    this._fromPreset = this._targetPreset || EXPRESSION_PRESETS.neutral;
    this._targetPreset = preset;
    this.currentName = preset.id;
    this._transitionDuration = Math.max(0, transition);
    this._transitionElapsed = 0;
    this._swappedLayers = this._transitionDuration <= 0.001;

    if (this._swappedLayers) {
      this._applyDiscreteLayers(preset, 0);
      this._applyProceduralState(preset, preset, 1, 0);
    }
    return this;
  }

  resetExpression(options = { transition: 0.18 }) {
    this._viseme = null;
    this._talking = false;
    return this.setExpression('neutral', options);
  }

  blink() {
    this.blinkController.trigger();
    return this;
  }

  setAutoBlink(enabled) {
    this.blinkController.setAutoBlink(enabled);
    return this;
  }

  /**
   * Point eyes toward normalized target `{ x: -1..1, y: -1..1 }` or named direction.
   * Pass `null` or `'center'` to clear manual override.
   */
  lookAt(target, { amount = 1 } = {}) {
    if (target == null || target === 'reset') {
      this._userGaze = null;
      return this;
    }
    const named = {
      center: { x: 0, y: 0 },
      left: { x: -0.85, y: 0 },
      right: { x: 0.85, y: 0 },
      up: { x: 0, y: -0.85 },
      down: { x: 0, y: 0.85 },
      upLeft: { x: -0.7, y: -0.65 },
      upRight: { x: 0.7, y: -0.65 },
      downLeft: { x: -0.7, y: 0.65 },
      downRight: { x: 0.7, y: 0.65 },
    };
    const vec = typeof target === 'string' ? named[target] || named.center : target;
    const amt = clamp(amount, 0, 1);
    this._userGaze = {
      x: clamp((vec.x ?? 0) * amt, -1, 1),
      y: clamp((vec.y ?? 0) * amt, -1, 1),
    };
    return this;
  }

  /** Used internally by head motions (`lookLeft`, `glance`, `lookAround`) without erasing user gaze permanently. */
  setChannelGaze(gaze) {
    this._channelGaze = gaze ? { x: clamp(gaze.x, -1, 1), y: clamp(gaze.y, -1, 1) } : null;
  }

  /** Enable or disable procedural talking mouth overlay (never overwrites active expression permanently). */
  setTalking(active, { rate = 7.5 } = {}) {
    this._talking = Boolean(active);
    this._talkRate = rate;
    if (!this._talking) {
      this._talkElapsed = 0;
      this._applyDiscreteLayers(this._targetPreset, this.blinkController.progress);
    }
    return this;
  }

  /**
   * Future lip-sync / phoneme cue hook.
   * Accepts `'rest' | 'A' | 'E' | 'I' | 'O' | 'U' | 'M' | 'F'` or `null` to release.
   */
  setViseme(viseme) {
    this._viseme = viseme && viseme !== 'rest' ? viseme : null;
    this._applyDiscreteLayers(this._targetPreset, this.blinkController.progress);
    return this;
  }

  getState() {
    return {
      expression: this.currentName,
      talking: this._talking,
      viseme: this._viseme,
      autoBlink: this.blinkController.autoBlink,
      isBlinking: this.blinkController.isBlinking,
      faceVisible: this.faceVisible,
      gaze: { ...this._gazeCurrent },
    };
  }

  _pickExisting(preferred, fallback, pool) {
    if (preferred && this.skeleton.parts.has(preferred)) return preferred;
    if (fallback && this.skeleton.parts.has(fallback)) return fallback;
    return pool[0] || null;
  }

  _resolveActiveMouth(preset) {
    if (this._viseme && VISEME_MOUTH_MAP[this._viseme]) {
      return this._pickExisting(VISEME_MOUTH_MAP[this._viseme], preset.mouth, this._mouthLayers);
    }
    if (this._talking) {
      const seriousExprs = new Set(['scared', 'worried', 'sad', 'angry', 'disgusted', 'surprised', 'confused']);
      const seq = seriousExprs.has(preset.id)
        ? ['mouth_open', 'mouth_small_o', preset.mouth || 'mouth_frown', 'mouth_open', preset.mouth || 'mouth_neutral']
        : TALK_SEQUENCE;
      const idx = Math.floor(this._talkElapsed * this._talkRate) % seq.length;
      const candidate = seq[idx];
      return this._pickExisting(candidate, preset.mouth, this._mouthLayers);
    }
    return this._pickExisting(preset.mouth, 'mouth', this._mouthLayers);
  }

  _applyDiscreteLayers(preset, blinkProgress) {
    if (!this.faceVisible) {
      for (const name of this._eyeLayers) this.skeleton.setVisible(name, false);
      for (const name of this._browLayers) this.skeleton.setVisible(name, false);
      for (const name of this._mouthLayers) this.skeleton.setVisible(name, false);
      if (this._hasBlush) this.skeleton.setVisible('blush', false);
      return;
    }

    // 1. Eyes: if dynamic gaze controller is active and expression supports open-eye gaze,
    // keep base `eyes` mesh visible and render the expression's eyelid profile + blink on its canvas!
    const useDynamicGazeEyes = this._hasDynamicGaze && Boolean(preset.gazeProfile);
    let activeEye;
    if (useDynamicGazeEyes) {
      activeEye = 'eyes';
    } else if (blinkProgress >= 0.65 && this.skeleton.parts.has('eyes_closed')) {
      activeEye = 'eyes_closed';
    } else {
      activeEye = this._pickExisting(preset.eyes, 'eyes', this._eyeLayers);
    }

    for (const name of this._eyeLayers) {
      this.skeleton.setVisible(name, name === activeEye);
    }

    // 2. Brows
    const activeBrow = this._pickExisting(preset.brows, 'brows', this._browLayers);
    for (const name of this._browLayers) {
      this.skeleton.setVisible(name, name === activeBrow);
    }

    // 3. Mouth (respecting non-destructive talking/viseme overlay)
    const activeMouth = this._resolveActiveMouth(preset);
    for (const name of this._mouthLayers) {
      this.skeleton.setVisible(name, name === activeMouth);
    }

    // Legacy sub-parts (e.g. smileTeeth/openTeeth on heroine-walk) follow parent mouth visibility
    for (const childName of ['smileTeeth', 'smileTongue', 'openTeeth', 'openTongue']) {
      const p = this.skeleton.parts.get(childName);
      if (p) {
        p.group.visible = p.definition.parent === activeMouth;
      }
    }

    // 4. Cheek blush
    if (this._hasBlush) {
      const blushPart = this.skeleton.get('blush');
      if (blushPart) {
        blushPart.group.visible = preset.blush > 0.02;
      }
    }
  }

  _applyProceduralState(from, to, alpha, blinkProgress) {
    if (!this.faceVisible) return;

    const a = smoothstep(alpha);
    const pFrom = from.procedural;
    const pTo = to.procedural;

    const browY = lerp(pFrom.browY, pTo.browY, a);
    const browRot = degToRad(lerp(pFrom.browRotDeg, pTo.browRotDeg, a));
    const eyeScaleY = lerp(pFrom.eyeScaleY, pTo.eyeScaleY, a);
    const mouthY = lerp(pFrom.mouthY, pTo.mouthY, a);
    let mouthScaleX = lerp(pFrom.mouthScaleX, pTo.mouthScaleX, a);
    let mouthScaleY = lerp(pFrom.mouthScaleY, pTo.mouthScaleY, a);

    // Subtle talking jaw pulse when talking is active
    if (this._talking) {
      const pulse = 0.5 + 0.5 * Math.sin(this._talkElapsed * this._talkRate * Math.PI * 2);
      mouthScaleY *= 0.88 + pulse * 0.34;
      mouthScaleX *= 1.04 - pulse * 0.08;
    }

    // Scale world offsets cleanly relative to skeleton worldHeight
    const unit = this.skeleton.worldHeight * 0.5;
    const useDynamicGazeEyes = this._hasDynamicGaze && Boolean(to.gazeProfile);

    // Subtle transition dip on swap-layer midpoint so expression changes feel cushioned, not jarring
    const transitionPulse =
      this._transitionDuration > 0.001 && alpha < 1
        ? Math.sin(alpha * Math.PI) * 0.04
        : 0;

    for (const name of this._browLayers) {
      const part = this.skeleton.parts.get(name);
      if (!part) continue;
      const r = part.restTransform;
      part.group.position.set(r.x, r.y + browY * unit, r.z);
      part.group.rotation.z = r.rotation + browRot;
      part.group.scale.set(r.scaleX, r.scaleY, 1);
    }

    for (const name of this._eyeLayers) {
      const part = this.skeleton.parts.get(name);
      if (!part) continue;
      const r = part.restTransform;
      const blinkScale = useDynamicGazeEyes
        ? 1
        : this.skeleton.parts.has('eyes_closed') && blinkProgress >= 0.65
          ? 1
          : 1 - blinkProgress * 0.9;
      part.group.position.set(r.x, r.y, r.z);
      part.group.rotation.z = r.rotation;
      part.group.scale.set(
        r.scaleX,
        r.scaleY * (useDynamicGazeEyes ? 1 + (eyeScaleY - 1) * 0.25 : eyeScaleY) * blinkScale * (1 - transitionPulse),
        1
      );
    }

    for (const name of this._mouthLayers) {
      const part = this.skeleton.parts.get(name);
      if (!part) continue;
      const r = part.restTransform;
      part.group.position.set(r.x, r.y + mouthY * unit, r.z);
      part.group.rotation.z = r.rotation;
      part.group.scale.set(
        r.scaleX * (1 + (mouthScaleX - 1) * 0.35),
        r.scaleY * (1 + (mouthScaleY - 1) * 0.35) * (1 - transitionPulse),
        1
      );
    }

    if (this._hasBlush) {
      const blushPart = this.skeleton.get('blush');
      if (blushPart) {
        const blushOpacity = lerp(from.blush, to.blush, a);
        blushPart.group.visible = blushOpacity > 0.02;
        if (blushPart.mesh?.material) {
          blushPart.mesh.material.opacity = blushOpacity;
        }
      }
    }
  }

  update(dt) {
    // 1. Expression transition timer (continues advancing even in non-face views so returning to front is synced!)
    let alpha = 1;
    if (this._transitionDuration > 0.001 && this._transitionElapsed < this._transitionDuration) {
      this._transitionElapsed = Math.min(this._transitionDuration, this._transitionElapsed + dt);
      alpha = clamp(this._transitionElapsed / this._transitionDuration, 0, 1);
      if (!this._swappedLayers && alpha >= 0.35) {
        this._swappedLayers = true;
      }
    } else {
      this._swappedLayers = true;
    }

    const activePreset = this._swappedLayers ? this._targetPreset : this._fromPreset;

    // 2. Blink envelope
    const blinkProgress = this.blinkController.update(dt, activePreset.allowBlink);

    // 3. Talking cycle (stays running internally across view switches)
    if (this._talking) {
      this._talkElapsed += dt;
    }

    // 4. Smooth gaze update
    const targetGaze = this._channelGaze || this._userGaze || activePreset.defaultGaze || { x: 0, y: 0 };
    if (dt <= 0) {
      this._gazeCurrent.x = targetGaze.x;
      this._gazeCurrent.y = targetGaze.y;
    } else {
      this._gazeCurrent.x = damp(this._gazeCurrent.x, targetGaze.x, this._gazeSpeed, dt);
      this._gazeCurrent.y = damp(this._gazeCurrent.y, targetGaze.y, this._gazeSpeed, dt);
    }

    // 5. Discrete layers & procedural transforms (suppressed cleanly on non-face views)
    this._applyDiscreteLayers(activePreset, blinkProgress);
    this._applyProceduralState(this._fromPreset, this._targetPreset, alpha, blinkProgress);

    if (this.faceVisible && this._hasDynamicGaze && activePreset.gazeProfile) {
      this.gazeController.setProfile(activePreset.gazeProfile);
      this.gazeController.setBlinkProgress(blinkProgress);
      this.gazeController.apply(this._gazeCurrent);
    }
  }

  dispose() {
    this.gazeController?.dispose?.();
  }
}
