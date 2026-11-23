import { clamp, degToRad, lerp, smoothstep } from '../utils/math.js';
import { resolveMotionDefinition } from './catalog.js';
import { ViewAdapter } from './view-adapter.js';

const CHANNEL_ORDER = ['base', 'locomotion', 'head', 'gesture'];
const FACE_PARTS = new Set(['eyes', 'brows', 'mouth', 'blush']);

const CANONICAL_ACCUM_PARTS = [
  'body', 'skirt', 'midriff', 'top', 'neck', 'head',
  'hairBack', 'hairFront', 'hairUpper', 'hairCrown',
  'braidL', 'braidR',
  'leftUpperArm', 'leftForearm', 'leftHand',
  'rightUpperArm', 'rightForearm', 'rightHand',
  'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR',
];

function isFacePart(name) {
  if (FACE_PARTS.has(name)) return true;
  return (
    name.startsWith('eyes_') ||
    name.startsWith('brows_') ||
    name.startsWith('mouth_') ||
    name.startsWith('smile') ||
    name.startsWith('open')
  );
}

function createEmptySlot() {
  return {
    active: null, // { def, time, duration, loop, speed, weight, fadeIn, fadeOut, fadingOut, elapsedFadeOut }
    previous: null, // outgoing clip during crossfade
  };
}

/**
 * Deterministic multi-channel animation controller for 2D cutout puppets.
 *
 * Channels:
 * - `base`: continuous subtle life (idle, breathing, bodySway, weightShift)
 * - `locomotion`: full-body & leg actions (walk, run, jump, crouch, recoil, laugh, bow)
 * - `head`: independent head & gaze-linked motions (nod, shake, tilt, look directions)
 * - `gesture`: independent arm/hand actions (wave, point, shrug, clap, explain, raiseHands)
 *
 * Multi-View Architecture:
 * All motion evaluators run in canonical semantic space (using the reference walkRig
 * when present) and commit through the active `ViewAdapter`. Switching views rebinds
 * the target skeleton & adapter WITHOUT resetting channel clips, timers, phase, speed,
 * loop, or pause state.
 */
export class AnimationController {
  constructor(skeleton, expressionController = null, options = {}) {
    this.skeleton = skeleton;
    this.referenceSkeleton = options.referenceSkeleton || skeleton;
    this.expressionController = expressionController;
    this.viewAdapter = options.viewAdapter || new ViewAdapter(skeleton?.manifest?.viewId || 'front', skeleton?.manifest?.view);

    this.speed = 1.0;
    this.paused = false;
    this.globalLoopOverride = null; // null = use motion defaultLoop, true/false = override

    this.channels = {
      base: createEmptySlot(),
      locomotion: createEmptySlot(),
      head: createEmptySlot(),
      gesture: createEmptySlot(),
    };

    // Pre-allocated canonical pose accumulator covering all canonical parts + skeleton parts
    this._poseAccum = new Map();
    this._ensurePoseKeys(skeleton);
  }

  _ensurePoseKeys(skeleton) {
    for (const partName of CANONICAL_ACCUM_PARTS) {
      if (!this._poseAccum.has(partName)) {
        this._poseAccum.set(partName, { x: 0, y: 0, rot: 0, scaleX: 1, scaleY: 1 });
      }
    }
    if (skeleton?.parts) {
      for (const partName of skeleton.parts.keys()) {
        if (!this._poseAccum.has(partName)) {
          this._poseAccum.set(partName, { x: 0, y: 0, rot: 0, scaleX: 1, scaleY: 1 });
        }
      }
    }
  }

  /**
   * Rebind to a new directional view skeleton & ViewAdapter while preserving
   * 100% of active channel clips, normalized time/phase, speed, loop, and pause state.
   */
  rebindSkeleton(skeleton, viewAdapter = null) {
    this.skeleton = skeleton;
    this.viewAdapter =
      viewAdapter ||
      new ViewAdapter(skeleton?.manifest?.viewId || 'front', skeleton?.manifest?.view);
    this._ensurePoseKeys(skeleton);
    // Immediately apply current composed pose without advancing time (safe when paused!)
    this.applyCurrentPose();
    return this;
  }

  /**
   * Play a motion by name on its natural channel (or an explicit channel override).
   * Supports smooth crossfade from the previous clip on that channel.
   */
  play(name, options = {}) {
    const def = resolveMotionDefinition(name);
    if (!def) {
      throw new Error(`Unknown motion "${name}".`);
    }
    const channelName = options.channel || def.channel;
    const slot = this.channels[channelName];
    if (!slot) {
      throw new Error(`Unknown animation channel "${channelName}".`);
    }

    const transition = options.transition ?? 0.16;
    const loop =
      options.loop !== undefined
        ? Boolean(options.loop)
        : this.globalLoopOverride !== null && channelName !== 'base'
          ? this.globalLoopOverride
          : def.defaultLoop;
    const duration = options.duration ?? def.duration;
    const speed = options.speed ?? 1;

    // Move currently active clip into `previous` for smooth crossfade without snapping
    if (slot.active && transition > 0.001) {
      slot.previous = {
        ...slot.active,
        fadingOut: true,
        fadeOut: transition,
        elapsedFadeOut: 0,
        startFadeWeight: slot.active.weight,
      };
    } else {
      slot.previous = null;
    }

    slot.active = {
      def,
      time: options.startTime ?? 0,
      duration,
      loop,
      speed,
      weight: transition > 0.001 ? 0 : 1,
      fadeIn: transition,
      fadeOut: options.fadeOut ?? 0.16,
      fadingOut: false,
      elapsedFadeOut: 0,
      startFadeWeight: 1,
      onComplete: options.onComplete || null,
    };

    return this;
  }

  /** Stop a single channel (smooth fade-out back to rest pose by default). */
  stopChannel(channelName, { transition = 0.16 } = {}) {
    const slot = this.channels[channelName];
    if (!slot) return this;
    if (transition <= 0.001) {
      slot.active = null;
      slot.previous = null;
    } else if (slot.active && !slot.active.fadingOut) {
      slot.active.fadingOut = true;
      slot.active.fadeOut = transition;
      slot.active.elapsedFadeOut = 0;
      slot.active.startFadeWeight = slot.active.weight;
    }
    if (channelName === 'head') {
      this.expressionController?.setChannelGaze(null);
    }
    return this;
  }

  /** Stop active action channels (locomotion, head, gesture), optionally stopping base too. */
  stopAll({ includeBase = false, transition = 0.14 } = {}) {
    for (const ch of CHANNEL_ORDER) {
      if (!includeBase && ch === 'base') continue;
      this.stopChannel(ch, { transition });
    }
    if (includeBase && transition <= 0.001) {
      this.skeleton.resetToRestPose(false);
    }
    return this;
  }

  /** Hard reset to neutral standing rest pose (optionally keeping idle base off or on). */
  setBasePose(poseName = 'standing', { keepIdle = false } = {}) {
    this.stopAll({ includeBase: true, transition: 0 });
    this.skeleton.resetToRestPose(false);
    this.expressionController?.setChannelGaze(null);
    if (keepIdle && poseName === 'standing') {
      this.play('idle', { transition: 0, loop: true });
    }
    return this;
  }

  pause() {
    this.paused = true;
    return this;
  }

  resume() {
    this.paused = false;
    return this;
  }

  restart() {
    for (const ch of CHANNEL_ORDER) {
      const clip = this.channels[ch].active;
      if (clip) {
        clip.time = 0;
        clip.fadingOut = false;
        clip.elapsedFadeOut = 0;
      }
    }
    this.paused = false;
    return this;
  }

  /**
   * Deterministically scrub active channels to a normalized phase `0..1`
   * (useful for multi-view contact sheet comparison and automated testing).
   */
  setNormalizedPhase(phase01) {
    const p = clamp(Number(phase01) || 0, 0, 0.9999);
    for (const ch of CHANNEL_ORDER) {
      const clip = this.channels[ch].active;
      if (clip && !clip.fadingOut) {
        clip.time = clip.duration * p;
        clip.weight = 1;
      }
      this.channels[ch].previous = null;
    }
    this.applyCurrentPose();
    return this;
  }

  setSpeed(speed) {
    this.speed = clamp(Number(speed) || 1, 0.1, 4.0);
    return this;
  }

  setLoop(loop) {
    this.globalLoopOverride = loop === null ? null : Boolean(loop);
    for (const ch of ['locomotion', 'head', 'gesture']) {
      const clip = this.channels[ch].active;
      if (clip && !clip.fadingOut && this.globalLoopOverride !== null) {
        clip.loop = this.globalLoopOverride;
      }
    }
    return this;
  }

  getState() {
    const pick = (ch) => {
      const a = this.channels[ch].active;
      if (!a || a.fadingOut) return null;
      const phase = a.duration > 0 ? clamp(a.time / a.duration, 0, 1) : 0;
      return {
        id: a.def.id,
        label: a.def.label,
        loop: a.loop,
        time: Number(a.time.toFixed(4)),
        duration: a.duration,
        phase: Number(phase.toFixed(4)),
        weight: Number(a.weight.toFixed(3)),
      };
    };
    return {
      paused: this.paused,
      speed: this.speed,
      loopOverride: this.globalLoopOverride,
      activeView: this.viewAdapter?.viewId || 'front',
      channels: {
        base: pick('base'),
        locomotion: pick('locomotion'),
        head: pick('head'),
        gesture: pick('gesture'),
      },
    };
  }

  _advanceClip(clip, dt) {
    if (!clip) return null;
    const step = dt * this.speed * clip.speed;

    if (clip.fadingOut) {
      clip.elapsedFadeOut += dt;
      const ratio = clip.fadeOut > 1e-4 ? clamp(clip.elapsedFadeOut / clip.fadeOut, 0, 1) : 1;
      clip.weight = clip.startFadeWeight * (1 - smoothstep(ratio));
      clip.time = clip.loop ? (clip.time + step) % clip.duration : Math.min(clip.duration, clip.time + step);
      return ratio >= 1 ? null : clip;
    }

    if (clip.fadeIn > 1e-4 && clip.weight < 1) {
      clip.weight = clamp(clip.weight + dt / clip.fadeIn, 0, 1);
    } else {
      clip.weight = 1;
    }

    clip.time += step;
    if (clip.loop) {
      if (clip.duration > 0) {
        clip.time = ((clip.time % clip.duration) + clip.duration) % clip.duration;
      }
      return clip;
    }

    if (clip.time >= clip.duration) {
      clip.time = clip.duration;
      if (clip.onComplete) {
        const cb = clip.onComplete;
        clip.onComplete = null;
        cb(clip.def.id);
      }
      if (clip.fadeOut > 1e-4) {
        clip.fadingOut = true;
        clip.elapsedFadeOut = 0;
        clip.startFadeWeight = clip.weight;
        return clip;
      }
      return null;
    }
    return clip;
  }

  _evalSlot(slot) {
    // Always evaluate motion curves against the canonical reference skeleton (front walkRig)
    // so walk/run/crouch IK produces identical canonical phase values across ALL views!
    const evalSkeleton = this.referenceSkeleton || this.skeleton;
    const ctx = { skeleton: evalSkeleton };
    const samples = [];
    if (slot.previous && slot.previous.weight > 1e-4) {
      samples.push({
        pose: slot.previous.def.evaluate(slot.previous.time, slot.previous.duration, ctx),
        weight: smoothstep(slot.previous.weight),
        def: slot.previous.def,
      });
    }
    if (slot.active && slot.active.weight > 1e-4) {
      samples.push({
        pose: slot.active.def.evaluate(slot.active.time, slot.active.duration, ctx),
        weight: smoothstep(slot.active.weight),
        def: slot.active.def,
      });
    }
    return samples;
  }

  /**
   * Compose all 4 body channels into canonical semantic pose deltas (`this._poseAccum`).
   * Does NOT advance timers, so calling it after a view rebind or during crossfade is pure & idempotent.
   */
  composeCanonicalPose() {
    const refSkeleton = this.referenceSkeleton || this.skeleton;

    for (const acc of this._poseAccum.values()) {
      acc.x = 0;
      acc.y = 0;
      acc.rot = 0;
      acc.scaleX = 1;
      acc.scaleY = 1;
    }

    const gestureSamples = this._evalSlot(this.channels.gesture);
    const gestureWeightByPart = new Map();
    for (const s of gestureSamples) {
      const owned = s.def.ownsParts || Object.keys(s.pose.parts || {});
      for (const rawName of owned) {
        const name = refSkeleton.resolveName(rawName);
        gestureWeightByPart.set(name, clamp((gestureWeightByPart.get(name) || 0) + s.weight, 0, 1));
      }
    }

    const locoSamples = this._evalSlot(this.channels.locomotion);
    let locoWeight = 0;
    for (const s of locoSamples) locoWeight = clamp(locoWeight + s.weight, 0, 1);

    const applySample = (sample, mode, scaleWeight = 1, partMaskFn = null) => {
      const w = sample.weight * scaleWeight;
      if (w <= 1e-4 || !sample.pose?.parts) return;
      for (const [rawName, delta] of Object.entries(sample.pose.parts)) {
        const name = refSkeleton.resolveName(rawName);
        if (isFacePart(name)) continue;
        let acc = this._poseAccum.get(name);
        if (!acc) {
          acc = { x: 0, y: 0, rot: 0, scaleX: 1, scaleY: 1 };
          this._poseAccum.set(name, acc);
        }
        const partW = partMaskFn ? w * partMaskFn(name) : w;
        if (partW <= 1e-4) continue;

        if (mode === 'override') {
          if (delta.x !== undefined) acc.x = lerp(acc.x, delta.x, partW);
          if (delta.y !== undefined) acc.y = lerp(acc.y, delta.y, partW);
          if (delta.rot !== undefined) acc.rot = lerp(acc.rot, delta.rot, partW);
          if (delta.scaleX !== undefined) acc.scaleX = lerp(acc.scaleX, delta.scaleX, partW);
          if (delta.scaleY !== undefined) acc.scaleY = lerp(acc.scaleY, delta.scaleY, partW);
        } else {
          if (delta.x !== undefined) acc.x += delta.x * partW;
          if (delta.y !== undefined) acc.y += delta.y * partW;
          if (delta.rot !== undefined) acc.rot += delta.rot * partW;
          if (delta.scaleX !== undefined) acc.scaleX *= 1 + (delta.scaleX - 1) * partW;
          if (delta.scaleY !== undefined) acc.scaleY *= 1 + (delta.scaleY - 1) * partW;
        }
      }
    };

    // 1. Base channel
    const baseSamples = this._evalSlot(this.channels.base);
    for (const s of baseSamples) {
      applySample(s, 'additive', 1, (partName) => {
        if (
          locoWeight > 0 &&
          (partName === 'body' ||
            partName.startsWith('thigh') ||
            partName.startsWith('shin') ||
            partName.startsWith('foot') ||
            partName.includes('Leg') ||
            partName.includes('Foot'))
        ) {
          return 1 - locoWeight * 0.85;
        }
        if (gestureWeightByPart.has(partName)) {
          return 1 - gestureWeightByPart.get(partName) * 0.9;
        }
        return 1;
      });
    }

    // 2. Locomotion channel
    for (const s of locoSamples) {
      applySample(s, 'override', 1, (partName) => {
        if (gestureWeightByPart.has(partName)) {
          return 1 - gestureWeightByPart.get(partName);
        }
        return 1;
      });
    }

    // 3. Head channel + gaze bias
    const headSamples = this._evalSlot(this.channels.head);
    let headGazeX = 0;
    let headGazeY = 0;
    let headGazeW = 0;
    for (const s of headSamples) {
      applySample(s, 'additive', 1);
      if (s.pose?.gaze) {
        headGazeX += s.pose.gaze.x * s.weight;
        headGazeY += s.pose.gaze.y * s.weight;
        headGazeW = clamp(headGazeW + s.weight, 0, 1);
      }
    }
    if (this.expressionController) {
      this.expressionController.setChannelGaze(
        headGazeW > 0.01 ? { x: headGazeX, y: headGazeY } : null
      );
    }

    // 4. Gesture channel
    for (const s of gestureSamples) {
      applySample(s, 'override', 1);
    }

    return this._poseAccum;
  }

  /**
   * Commit the latest composed canonical pose onto any target view skeleton
   * via its ViewAdapter (used for active view AND outgoing view during crossfades!).
   */
  applyCanonicalPoseTo(targetSkeleton, targetAdapter) {
    if (!targetSkeleton) return;
    const adapter = targetAdapter || this.viewAdapter;
    const adapted = adapter.adaptPose(this._poseAccum, targetSkeleton);
    const posUnit = targetSkeleton.worldHeight * 0.5;

    for (const [name, part] of targetSkeleton.parts.entries()) {
      if (isFacePart(name)) continue;
      const acc = adapted.get(name);
      if (!acc) continue;
      const r = part.restTransform;
      part.group.position.set(r.x + acc.x * posUnit, r.y + acc.y * posUnit, r.z);
      part.group.rotation.z = r.rotation + degToRad(acc.rot);
      part.group.scale.set(r.scaleX * acc.scaleX, r.scaleY * acc.scaleY, 1);
    }
  }

  /** Re-evaluate & commit current pose without advancing any timers. */
  applyCurrentPose() {
    this.composeCanonicalPose();
    this.applyCanonicalPoseTo(this.skeleton, this.viewAdapter);
  }

  update(dt) {
    const safeDt = Math.max(0, dt || 0);
    if (!this.paused) {
      for (const ch of CHANNEL_ORDER) {
        const slot = this.channels[ch];
        slot.previous = this._advanceClip(slot.previous, safeDt);
        slot.active = this._advanceClip(slot.active, safeDt);
      }
    }
    this.applyCurrentPose();
  }

  dispose() {
    this.stopAll({ includeBase: true, transition: 0 });
    this._poseAccum.clear();
  }
}
