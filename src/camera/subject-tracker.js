/**
 * Smart Subject Tracking System, Multi-Event Camera Timeline (with Priority & Blending),
 * and Intelligent Narration-Driven Camera Choreography Director.
 *
 * Strictly deterministic — zero Math.random(), zero Date.now().
 */

import { clamp01, CAMERA_COMPOSITIONS } from './compositions-and-effects.js';
import { CAMERA_PRESETS, DEFAULT_BASE_FRAME, evaluateCameraPreset, sanitizeCameraState } from './presets.js';
import { evaluateCameraTransition, evaluateCameraCombination } from './transitions-and-combos.js';

// ═════════════════════════════════════════════════════════════════════════════
// 1. SMART SUBJECT TRACKING REGISTRY
// ═════════════════════════════════════════════════════════════════════════════

export const DEFAULT_SHOWCASE_TARGETS = {
  character: {
    id: 'character',
    label: 'Main Character',
    x: -1.14,
    y: 0.04,
    z: 0,
    width: 0.72,
    height: 1.78,
    viewHeight: 2.15,
    tiltX: -0.04,
    tiltY: 0.03,
  },
  character_face: {
    id: 'character_face',
    label: 'Character Face',
    x: -1.14,
    y: 0.48,
    z: 0,
    width: 0.42,
    height: 0.56,
    viewHeight: 1.02,
    tiltX: 0,
    tiltY: 0.01,
  },
  smartphone: {
    id: 'smartphone',
    label: 'Smartphone & Dynamic Island',
    x: 0.14,
    y: 0.1,
    z: -0.26,
    width: 0.46,
    height: 0.82,
    viewHeight: 1.18,
    tiltX: 0.04,
    tiltY: 0.02,
  },
  bank_balance: {
    id: 'bank_balance',
    label: 'Bank Balance Screen',
    x: 0.14,
    y: 0.18,
    z: -0.26,
    width: 0.4,
    height: 0.56,
    viewHeight: 0.96,
    tiltX: 0.03,
    tiltY: 0.01,
  },
  sports_car: {
    id: 'sports_car',
    label: 'Sports Car',
    x: 1.98,
    y: -0.26,
    z: -1.18,
    width: 2.25,
    height: 0.96,
    viewHeight: 1.65,
    tiltX: 0.08,
    tiltY: 0.03,
  },
  private_jet: {
    id: 'private_jet',
    label: 'Private Jet',
    x: 2.45,
    y: 0.2,
    z: -3.55,
    width: 3.2,
    height: 1.45,
    viewHeight: 2.25,
    tiltX: 0.1,
    tiltY: 0.06,
  },
  mansion: {
    id: 'mansion',
    label: 'Hillside Mansion',
    x: -2.15,
    y: 0.45,
    z: -6.2,
    width: 4.1,
    height: 2.3,
    viewHeight: 2.65,
    tiltX: -0.08,
    tiltY: 0.08,
  },
  financial_popup: {
    id: 'financial_popup',
    label: '$1,000,000 Financial Popup',
    x: 0.14,
    y: 0.36,
    z: 0,
    width: 2.2,
    height: 1.1,
    viewHeight: 2.35,
    tiltX: 0.03,
    tiltY: 0.04,
  },
};

export const SHOWCASE_TARGET_LIST = Object.values(DEFAULT_SHOWCASE_TARGETS);

export class SubjectTargetRegistry {
  constructor(initialTargets = DEFAULT_SHOWCASE_TARGETS) {
    this.targets = new Map();
    for (const [id, spec] of Object.entries(initialTargets || {})) {
      this.register(id, spec);
    }
  }

  register(id, spec = {}) {
    if (!id) return null;
    const entry = {
      id,
      label: spec.label || id,
      x: Number(spec.x) || 0,
      y: Number(spec.y) || 0,
      z: Number(spec.z) || 0,
      width: Math.max(0.2, Number(spec.width) || 1.0),
      height: Math.max(0.2, Number(spec.height) || 1.2),
      viewHeight: Math.max(0.65, Number(spec.viewHeight) || Math.max(1.2, (Number(spec.height) || 1.2) * 1.45)),
      tiltX: Number(spec.tiltX) || 0,
      tiltY: Number(spec.tiltY) || 0.03,
    };
    this.targets.set(id, entry);
    return entry;
  }

  /** Sync live 3D anchors from EnvironmentComposer + live Heroine root position. */
  syncFromScene({ anchors = null, floorY = -0.88, characterPos = null } = {}) {
    if (characterPos) {
      this.register('character', {
        ...DEFAULT_SHOWCASE_TARGETS.character,
        x: characterPos.x ?? -0.98,
        y: (characterPos.y ?? 0) + 0.04,
        z: characterPos.z ?? 0,
      });
      this.register('character_face', {
        ...DEFAULT_SHOWCASE_TARGETS.character_face,
        x: characterPos.x ?? -0.98,
        y: (characterPos.y ?? 0) + 0.48,
        z: characterPos.z ?? 0,
      });
    }

    if (anchors && typeof anchors === 'object') {
      const aliasMap = { car: 'sports_car', jet: 'private_jet' };
      for (const [key, vec] of Object.entries(anchors)) {
        if (!vec || !Number.isFinite(vec.x)) continue;
        const canonical = aliasMap[key] || key;
        const defaults = DEFAULT_SHOWCASE_TARGETS[canonical] || {};
        this.register(canonical, {
          ...defaults,
          id: canonical,
          x: vec.x,
          y: vec.y + floorY,
          z: vec.z ?? 0,
        });
      }
    }
  }

  get(id) {
    return this.targets.get(id) || this.targets.get('character') || DEFAULT_SHOWCASE_TARGETS.character;
  }

  list() {
    return Array.from(this.targets.values());
  }

  /** Resolve framing for a target combined with any of the 22 Camera Composition Presets. */
  resolveFraming(targetId = 'character', compositionId = null) {
    const tgt = this.get(targetId);
    const comp = compositionId ? CAMERA_COMPOSITIONS[compositionId] : null;
    if (!comp) return { ...tgt };
    return {
      ...tgt,
      x: tgt.x + comp.offsetX * 0.45,
      y: tgt.y + comp.offsetY * 0.35,
      viewHeight: Math.max(0.68, (tgt.viewHeight * 0.45 + comp.viewHeight * 0.55)),
      tiltX: comp.tiltX ?? tgt.tiltX,
      tiltY: comp.tiltY ?? tgt.tiltY,
      orbitYaw: comp.orbitYaw ?? 0,
      orbitPitch: comp.orbitPitch ?? 0,
      skipCompositionOffset: true,
    };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. MULTI-EVENT CAMERA TIMELINE WITH PRIORITY & SMOOTH TRANSITION BLENDING
// ═════════════════════════════════════════════════════════════════════════════

export class CameraTimeline {
  /**
   * @param {Array<object>} events
   *   Event schema: { id, preset, combination, target, start, duration, startFraming, endFraming,
   *                   composition, easing, intensity, transition, transitionDuration, effects, priority }
   */
  constructor(events = [], { baseFrame = DEFAULT_BASE_FRAME } = {}) {
    this.baseFrame = sanitizeCameraState(baseFrame);
    this.events = [];
    for (const ev of events) {
      this.addEvent(ev);
    }
  }

  addEvent(raw = {}) {
    const start = Math.max(0, Number(raw.start) || 0);
    const duration = Math.max(0.25, Number(raw.duration) || 3.0);
    const event = {
      id: raw.id || `cam_ev_${this.events.length + 1}`,
      preset: raw.preset || 'cinematic_push_in',
      combination: raw.combination || null,
      target: raw.target || 'character',
      start,
      duration,
      end: start + duration,
      startFraming: raw.startFraming || null,
      endFraming: raw.endFraming || null,
      composition: raw.composition || null,
      easing: raw.easing || null,
      intensity: Number.isFinite(raw.intensity) ? raw.intensity : 1.0,
      transition: raw.transition || 'cinematic_ease_transition',
      transitionDuration: Math.min(duration * 0.45, Math.max(0.15, Number(raw.transitionDuration) || 0.45)),
      effects: raw.effects || null,
      priority: Number.isFinite(raw.priority) ? raw.priority : 0,
      order: this.events.length,
    };
    this.events.push(event);
    this.events.sort((a, b) => a.start - b.start || a.order - b.order);
    return event;
  }

  get totalDuration() {
    return this.events.reduce((max, ev) => Math.max(max, ev.end), 0);
  }

  _evalSingleEvent(ev, localTime, registry, seedFrame) {
    const resolveTarget = (id) => registry.resolveFraming(id, ev.composition);
    if (ev.combination) {
      return evaluateCameraCombination(ev.combination, {
        time: localTime,
        duration: ev.duration,
        intensity: ev.intensity,
        resolveTarget,
        baseFrame: ev.startFraming || seedFrame,
      });
    }
    return evaluateCameraPreset(ev.preset, {
      time: localTime,
      duration: ev.duration,
      intensity: ev.intensity,
      easing: ev.easing,
      startFrame: ev.startFraming || seedFrame,
      targetFrame: ev.endFraming || resolveTarget(ev.target),
      characterFrame: registry.get('character'),
      compositionId: ev.composition,
      effects: ev.effects,
    });
  }

  /**
   * Deterministically evaluate the timeline at `timeSec`.
   * Resolves overlapping events by highest priority (tie-break: latest start time)
   * and smoothly blends transitions so there are zero camera jumps or conflicts.
   */
  evaluateAt(timeSec = 0, registry = new SubjectTargetRegistry()) {
    const t = Math.max(0, Number(timeSec) || 0);
    if (this.events.length === 0) {
      return {
        time: t,
        activeEvent: null,
        camera: this.baseFrame,
        effects: {},
      };
    }

    // Find all active events covering timestamp `t`
    const active = this.events.filter((ev) => t >= ev.start && t <= ev.end);
    let chosen = null;
    if (active.length > 0) {
      // Highest priority wins; ties broken by latest start, then later insertion order
      active.sort((a, b) => b.priority - a.priority || b.start - a.start || b.order - a.order);
      chosen = active[0];
    } else {
      // Hold last completed event or baseFrame before first event
      const past = this.events.filter((ev) => ev.end < t);
      if (past.length === 0) {
        return { time: t, activeEvent: null, camera: this.baseFrame, effects: {} };
      }
      chosen = past[past.length - 1];
      const holdEval = this._evalSingleEvent(chosen, chosen.duration, registry, this.baseFrame);
      return {
        time: t,
        activeEvent: chosen,
        camera: holdEval.camera,
        effects: holdEval.effects,
      };
    }

    // Determine previous completed or lower-priority event for smooth entry transition blending
    const prevCandidates = this.events.filter((ev) => ev.id !== chosen.id && ev.start < chosen.start);
    const prevEvent = prevCandidates.length > 0 ? prevCandidates[prevCandidates.length - 1] : null;
    const prevEndState = prevEvent
      ? this._evalSingleEvent(prevEvent, Math.min(prevEvent.duration, Math.max(0, chosen.start - prevEvent.start)), registry, this.baseFrame).camera
      : this.baseFrame;

    const localTime = Math.max(0, Math.min(chosen.duration, t - chosen.start));
    const currentEval = this._evalSingleEvent(chosen, localTime, registry, prevEndState);

    // Smooth entry cross-blend during first `transitionDuration` seconds of the event
    if (prevEvent && localTime < chosen.transitionDuration) {
      const trP = clamp01(localTime / chosen.transitionDuration);
      const blended = evaluateCameraTransition(
        chosen.transition,
        prevEndState,
        currentEval.camera,
        trP,
        chosen.intensity
      );
      return {
        time: t,
        activeEvent: chosen,
        inTransition: true,
        transitionId: chosen.transition,
        camera: blended.camera,
        effects: {
          ...currentEval.effects,
          ...blended.effects,
        },
      };
    }

    return {
      time: t,
      activeEvent: chosen,
      inTransition: false,
      camera: currentEval.camera,
      effects: currentEval.effects,
    };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. INTELLIGENT NARRATION-DRIVEN CAMERA CHOREOGRAPHY DIRECTOR
// ═════════════════════════════════════════════════════════════════════════════

export class CameraChoreographyDirector {
  constructor() {
    this.history = [];
  }

  resetHistory() {
    this.history = [];
  }

  _pickNonRepeating(candidates, previousPreset = null) {
    const last = previousPreset || this.history[this.history.length - 1] || null;
    for (const id of candidates) {
      if (id !== last && CAMERA_PRESETS[id]) return id;
    }
    return candidates[0];
  }

  /**
   * Choose context-aware camera preset, combination, composition, target, transition, and effects
   * for any storytelling narration sentence — avoiding repetitive consecutive presets.
   */
  directShot({
    narration = '',
    targets = [],
    previousPreset = null,
    characterGaze = 'front',
    popupPosition = 'top_center',
  } = {}) {
    const s = String(narration || '').toLowerCase();
    const targetSet = new Set(targets);
    let plan = null;

    if (/(sports car|supercar|ferrari|lamborghini|driveway|car)/.test(s) || targetSet.has('sports_car')) {
      const preset = this._pickNonRepeating(['whip_pan', 'orbit_with_push_in', 'vehicle_tracking'], previousPreset);
      plan = {
        label: 'Sports Car Reveal',
        preset,
        combination: 'combo_sports_car_reveal',
        target: 'sports_car',
        composition: 'three_quarter_object',
        transition: 'whip_pan_transition',
        effects: { whipPanBlur: 0.75, focusEmphasis: 0.55, subtleVignette: 0.42 },
        duration: 4.6,
      };
    } else if (/(private jet|jet|aviation|hangar|runway|fly)/.test(s) || targetSet.has('private_jet')) {
      const preset = this._pickNonRepeating(['wide_horizontal_reveal', 'reveal_while_tracking', 'dynamic_circular_reveal'], previousPreset);
      plan = {
        label: 'Private Jet Wide Reveal + Tracking',
        preset,
        combination: 'combo_private_jet_reveal',
        target: 'private_jet',
        composition: 'wide_object_reveal',
        transition: 'parallax_transition',
        effects: { subtleVignette: 0.38, smoothDrift: 0.35 },
        duration: 4.8,
      };
    } else if (/(bank account|bank balance|smartphone|phone|nine zeros|9 zeros|dynamic island)/.test(s) || targetSet.has('smartphone')) {
      const preset = this._pickNonRepeating(['zoom_into_smartphone', 'smartphone_tracking', 'whip_zoom'], previousPreset);
      plan = {
        label: 'Smartphone Bank Account Focus',
        preset,
        combination: 'combo_smartphone_reveal',
        target: 'smartphone',
        composition: 'object_detail',
        transition: 'zoom_through_transition',
        effects: { focusEmphasis: 0.75, depthOfField: 0.48, subtleVignette: 0.42 },
        duration: 5.0,
      };
    } else if (/(1,000,000|one million|million|billion|83,333)/.test(s)) {
      const preset = this._pickNonRepeating(['snap_zoom_in', 'impact_camera_shake', 'elastic_zoom_settle'], previousPreset);
      plan = {
        label: 'Financial Milestone Reveal',
        preset,
        combination: 'combo_million_dollar_reveal',
        target: 'financial_popup',
        composition: popupPosition === 'top_center' ? 'negative_space' : 'left_subject',
        transition: 'snap_zoom_transition',
        effects: { zoomBlur: 0.65, microShake: 0.7, impactFlash: 0.48, subtleVignette: 0.45 },
        duration: 4.5,
      };
    } else if (/(here's the problem|problem|mistake|trap|but |wait|realize)/.test(s)) {
      const preset = this._pickNonRepeating(['dolly_zoom', 'slow_dramatic_zoom', 'controlled_handheld'], previousPreset);
      plan = {
        label: 'Dramatic Realization Push-In',
        preset,
        combination: 'combo_dramatic_realization',
        target: 'character_face',
        composition: 'closeup',
        transition: 'focus_shift_transition',
        effects: { handheld: 0.55, subtleVignette: 0.65, focusEmphasis: 0.5 },
        duration: 4.4,
      };
    } else if (/(everything changes|breakthrough|transform|finally|freedom)/.test(s)) {
      const preset = this._pickNonRepeating(['dramatic_pullback', 'cinematic_hero_shot', 'zoom_out_establishing'], previousPreset);
      plan = {
        label: 'Breakthrough Hero Shot',
        preset,
        combination: null,
        target: 'character',
        composition: 'centered_hero',
        transition: 'push_in_to_pull_out_transition',
        effects: { cinematicFraming: 1, subtleVignette: 0.45, smoothDrift: 0.35 },
        duration: 4.4,
      };
    } else if (/(imagine|picture this|suppose|what if)/.test(s)) {
      const preset = this._pickNonRepeating(['cinematic_push_in', 'slow_cinematic_drift', 'arc_shot'], previousPreset);
      plan = {
        label: 'Opening Imagination Push-In',
        preset,
        combination: null,
        target: 'character',
        composition: characterGaze === 'right' ? 'left_subject' : 'rule_of_thirds',
        transition: 'cinematic_ease_transition',
        effects: { smoothDrift: 0.5, subtleVignette: 0.32 },
        duration: 4.2,
      };
    } else if (/(mansion|estate|villa|house)/.test(s) || targetSet.has('mansion')) {
      const preset = this._pickNonRepeating(['environmental_sweep', 'dynamic_establishing_shot', 'push_through_reveal'], previousPreset);
      plan = {
        label: 'Estate Panoramic Sweep',
        preset,
        combination: null,
        target: 'mansion',
        composition: 'wide',
        transition: 'parallax_transition',
        effects: { subtleVignette: 0.35, smoothDrift: 0.3 },
        duration: 4.5,
      };
    } else {
      const preset = this._pickNonRepeating(['micro_zoom_emphasis', 'slow_cinematic_drift', 'smooth_pan_right', 'character_follow'], previousPreset);
      plan = {
        label: 'Editorial Narrative Framing',
        preset,
        combination: null,
        target: 'character',
        composition: 'left_subject',
        transition: 'smooth_reframe',
        effects: { smoothDrift: 0.4, subtleVignette: 0.28 },
        duration: 4.2,
      };
    }

    this.history.push(plan.preset);
    return plan;
  }

  /** Generate a complete non-repeating multi-beat CameraTimeline from a narration script array. */
  buildTimelineFromNarration(sentences = []) {
    this.resetHistory();
    const timeline = new CameraTimeline();
    let cursor = 0;
    for (let i = 0; i < sentences.length; i++) {
      const shot = this.directShot({ narration: sentences[i] });
      timeline.addEvent({
        id: `shot_${i + 1}`,
        preset: shot.preset,
        combination: shot.combination,
        target: shot.target,
        composition: shot.composition,
        transition: shot.transition,
        effects: shot.effects,
        start: cursor,
        duration: shot.duration,
        priority: 1,
      });
      cursor += shot.duration;
    }
    return timeline;
  }
}
