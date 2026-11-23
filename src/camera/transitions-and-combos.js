/**
 * 14 Cinematic Camera Transitions & 5 Multi-Layer Camera Preset Combinations.
 * Strictly deterministic: identical inputs & timestamp always produce identical blended states.
 */

import {
  clamp01,
  lerp,
  resolveEasing,
  evaluateCameraVisualEffects,
} from './compositions-and-effects.js';
import { evaluateCameraPreset, sanitizeCameraState, DEFAULT_BASE_FRAME } from './presets.js';

// ═════════════════════════════════════════════════════════════════════════════
// 14 CINEMATIC CAMERA TRANSITIONS
// ═════════════════════════════════════════════════════════════════════════════

export const CAMERA_TRANSITIONS = {
  smooth_reframe: {
    id: 'smooth_reframe',
    name: 'Smooth Reframe',
    description: 'Silky cubic interpolation from previous camera framing into the next shot.',
    easing: 'easeInOutCubic',
    fx: {},
  },
  whip_pan_transition: {
    id: 'whip_pan_transition',
    name: 'Whip Pan Transition',
    description: 'High-speed lateral whip snap with horizontal cartoon speed streaks.',
    easing: 'whipSnap',
    fx: { whipPanBlur: 1.0 },
    rollPeak: -0.055,
  },
  zoom_through_transition: {
    id: 'zoom_through_transition',
    name: 'Zoom-Through Transition',
    description: 'Plunges rapidly inward at midpoint then emerges cleanly onto next target.',
    easing: 'easeInOutExpo',
    fx: { zoomBlur: 0.95 },
    zoomDip: 0.58,
  },
  snap_zoom_transition: {
    id: 'snap_zoom_transition',
    name: 'Snap Zoom Transition',
    description: 'Punchy snap-scale transition with crisp editorial hit flash.',
    easing: 'whipSnap',
    fx: { zoomBlur: 0.85, impactFlash: 0.55 },
    zoomDip: 0.74,
  },
  match_position_transition: {
    id: 'match_position_transition',
    name: 'Match Position Transition',
    description: 'Preserves subject screen anchor smoothly across framing or environment shifts.',
    easing: 'easeInOutQuart',
    fx: { subtleVignette: 0.35 },
  },
  match_object_transition: {
    id: 'match_object_transition',
    name: 'Match Object Transition',
    description: 'Centers focal object through midpoint zoom swell into next composition.',
    easing: 'easeInOutQuart',
    fx: { focusEmphasis: 0.65, subtleVignette: 0.4 },
    zoomDip: 0.85,
  },
  dolly_transition: {
    id: 'dolly_transition',
    name: 'Dolly Transition',
    description: 'Physical Z-axis push-glide across depth layers into the next camera state.',
    easing: 'easeInOutCubic',
    fx: { depthOfField: 0.5 },
    dollyArc: -0.45,
  },
  orbit_transition: {
    id: 'orbit_transition',
    name: 'Orbit Transition',
    description: 'Sweeping 2.5D yaw-arc linking two shots with dramatic parallax.',
    easing: 'easeInOutCubic',
    fx: { motionBlur: 0.48 },
    orbitArc: 0.24,
  },
  directional_motion_blur_transition: {
    id: 'directional_motion_blur_transition',
    name: 'Directional Motion Blur Transition',
    description: 'Fast angled slide layered with stylized directional speed-lines.',
    easing: 'whipSnap',
    fx: { directionalBlur: 0.95, motionBlur: 0.85 },
  },
  parallax_transition: {
    id: 'parallax_transition',
    name: 'Parallax Transition',
    description: 'Amplifies foreground/background layer separation as camera slides between subjects.',
    easing: 'easeInOutQuart',
    fx: { subtleVignette: 0.38 },
    tiltArc: 0.18,
  },
  push_in_to_pull_out_transition: {
    id: 'push_in_to_pull_out_transition',
    name: 'Push-In to Pull-Out Transition',
    description: 'Brief tight punch-in midpoint followed by expansive pullback onto new subject.',
    easing: 'easeInOutCubic',
    fx: { zoomBlur: 0.65 },
    zoomDip: 0.66,
  },
  focus_shift_transition: {
    id: 'focus_shift_transition',
    name: 'Focus Shift Transition',
    description: 'Rack-focus atmospheric veil transitioning cleanly from foreground to background.',
    easing: 'cinematicSine',
    fx: { depthOfField: 0.9, focusEmphasis: 0.7 },
  },
  fast_camera_sweep: {
    id: 'fast_camera_sweep',
    name: 'Fast Camera Sweep',
    description: 'Energetic curved sweep with subtle Dutch-roll accent and speed streaks.',
    easing: 'easeOutExpo',
    fx: { directionalBlur: 0.8, whipPanBlur: 0.65 },
    rollPeak: 0.045,
    orbitArc: -0.16,
  },
  cinematic_ease_transition: {
    id: 'cinematic_ease_transition',
    name: 'Cinematic Ease Transition',
    description: 'Balanced studio-grade ease-in-out curve for effortless editorial continuity.',
    easing: 'easeInOutCubic',
    fx: { subtleVignette: 0.32 },
  },
};

export const CAMERA_TRANSITION_LIST = Object.values(CAMERA_TRANSITIONS);

/**
 * Deterministically blend between two camera states using any of the 14 Cinematic Transitions.
 */
export function evaluateCameraTransition(transitionId, fromState, toState, progress = 0, intensity = 1.0) {
  const tr = CAMERA_TRANSITIONS[transitionId] || CAMERA_TRANSITIONS.cinematic_ease_transition;
  const p = clamp01(progress);
  const e = resolveEasing(tr.easing)(p);
  const bell = Math.sin(p * Math.PI);
  const amp = Math.max(0.2, Math.min(2.0, Number(intensity) || 1.0));

  const a = sanitizeCameraState(fromState || DEFAULT_BASE_FRAME);
  const b = sanitizeCameraState(toState || DEFAULT_BASE_FRAME);

  let viewHeight = lerp(a.viewHeight, b.viewHeight, e);
  if (tr.zoomDip) {
    viewHeight *= lerp(1, tr.zoomDip, bell * Math.min(1.2, amp));
  }

  const camera = sanitizeCameraState({
    x: lerp(a.x, b.x, e),
    y: lerp(a.y, b.y, e),
    viewHeight,
    fov: lerp(a.fov, b.fov, e),
    orbitYaw: lerp(a.orbitYaw, b.orbitYaw, e) + (tr.orbitArc || 0) * bell * amp,
    orbitPitch: lerp(a.orbitPitch, b.orbitPitch, e),
    dollyZ: lerp(a.dollyZ, b.dollyZ, e) + (tr.dollyArc || 0) * bell * amp,
    lookAtZ: lerp(a.lookAtZ, b.lookAtZ, e),
    tiltX: lerp(a.tiltX, b.tiltX, e) + (tr.tiltArc || 0) * bell * amp,
    tiltY: lerp(a.tiltY, b.tiltY, e),
    roll: lerp(a.roll, b.roll, e) + (tr.rollPeak || 0) * bell * amp,
    shakeX: lerp(a.shakeX, b.shakeX, e),
    shakeY: lerp(a.shakeY, b.shakeY, e),
  });

  const effects = evaluateCameraVisualEffects(tr.fx || {}, {
    progress: p,
    velocity: bell * 1.1,
    directionX: b.x >= a.x ? 1 : -1,
    intensity: amp * bell,
  });

  return {
    transitionId: tr.id,
    progress: p,
    camera,
    effects,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// 5 ADVANCED MULTI-LAYER CAMERA PRESET COMBINATIONS
// ═════════════════════════════════════════════════════════════════════════════

export const CAMERA_COMBINATIONS = {
  combo_sports_car_reveal: {
    id: 'combo_sports_car_reveal',
    name: 'Sports Car Reveal Combo',
    subtitle: 'Whip Pan + Motion Blur + Push-In + Small Orbit + Settle',
    description: 'Starts on Heroine, whip-pans across the driveway with stylized speed blur, pushes into the sports car, and finishes with a prestige 3/4 orbit settle.',
    defaultDuration: 4.8,
    recommendedTarget: 'sports_car',
    phases: [
      { label: 'Whip Pan to Car', startFrac: 0.0, endFrac: 0.34, preset: 'whip_pan', target: 'sports_car', effects: { whipPanBlur: 0.95, motionBlur: 0.8 } },
      { label: 'Hero Push-In + Orbit', startFrac: 0.34, endFrac: 0.78, preset: 'orbit_with_push_in', target: 'sports_car', effects: { focusEmphasis: 0.6, subtleVignette: 0.45 } },
      { label: 'Prestige Settle', startFrac: 0.78, endFrac: 1.0, preset: 'hero_object_orbit', target: 'sports_car', effects: { cameraSettle: 0.9, subtleVignette: 0.42 } },
    ],
  },
  combo_million_dollar_reveal: {
    id: 'combo_million_dollar_reveal',
    name: 'Million Dollar Reveal Combo',
    subtitle: 'Slow Push-In + Snap Zoom + Micro Shake + Pullback',
    description: 'Builds tension with a slow push-in, lands a punchy snap zoom + impact shake as $1,000,000 hits, then pulls back cleanly to celebrate.',
    defaultDuration: 4.8,
    recommendedTarget: 'financial_popup',
    phases: [
      { label: 'Tension Push-In', startFrac: 0.0, endFrac: 0.38, preset: 'slow_dramatic_zoom', target: 'character', effects: { subtleVignette: 0.5 } },
      { label: 'Snap Impact Hit', startFrac: 0.38, endFrac: 0.68, preset: 'snap_zoom_in', target: 'financial_popup', effects: { zoomBlur: 0.85, microShake: 1.1, impactFlash: 0.68 } },
      { label: 'Triumphant Pullback', startFrac: 0.68, endFrac: 1.0, preset: 'cinematic_pull_out', target: 'character', effects: { subtleVignette: 0.35, cameraSettle: 0.75 } },
    ],
  },
  combo_private_jet_reveal: {
    id: 'combo_private_jet_reveal',
    name: 'Private Jet Reveal Combo',
    subtitle: 'Wide Establishing + Horizontal Tracking + Slow Dolly-In + Slight Arc',
    description: 'Establishes the full estate & runway, tracks laterally across the tarmac onto the private jet, then arcs smoothly forward.',
    defaultDuration: 5.2,
    recommendedTarget: 'private_jet',
    phases: [
      { label: 'Wide Establishing', startFrac: 0.0, endFrac: 0.32, preset: 'dynamic_establishing_shot', target: 'mansion', effects: { subtleVignette: 0.35 } },
      { label: 'Runway Tracking', startFrac: 0.32, endFrac: 0.68, preset: 'reveal_while_tracking', target: 'private_jet', effects: { motionBlur: 0.35, smoothDrift: 0.3 } },
      { label: 'Jet Dolly Arc', startFrac: 0.68, endFrac: 1.0, preset: 'orbit_with_push_in', target: 'private_jet', effects: { focusEmphasis: 0.55, subtleVignette: 0.42 } },
    ],
  },
  combo_dramatic_realization: {
    id: 'combo_dramatic_realization',
    name: 'Dramatic Realization Combo',
    subtitle: 'Medium Character + Slow Push-In + Handheld Drift + Tight Close-Up',
    description: 'Transitions from conversational medium shot into an intimate Vertigo-style handheld close-up on Heroine eyes.',
    defaultDuration: 4.6,
    recommendedTarget: 'character_face',
    phases: [
      { label: 'Medium Setup', startFrac: 0.0, endFrac: 0.34, preset: 'controlled_handheld', target: 'character', effects: { handheld: 0.75, subtleVignette: 0.35 } },
      { label: 'Vertigo Push-In', startFrac: 0.34, endFrac: 0.72, preset: 'dolly_zoom', target: 'character_face', effects: { handheld: 0.65, subtleVignette: 0.62 } },
      { label: 'Tight Close-Up', startFrac: 0.72, endFrac: 1.0, preset: 'zoom_into_character', target: 'character_face', effects: { focusEmphasis: 0.65, subtleVignette: 0.68 } },
    ],
  },
  combo_smartphone_reveal: {
    id: 'combo_smartphone_reveal',
    name: 'Smartphone Reveal Combo',
    subtitle: 'Character Follow + Object Tracking + Zoom Into Screen + Focus + Pullback',
    description: 'Follows Heroine gaze over to the 2.5D smartphone plinth, zooms tightly into the Dynamic Island bank alert, then pulls back to frame both.',
    defaultDuration: 5.0,
    recommendedTarget: 'smartphone',
    phases: [
      { label: 'Character Follow', startFrac: 0.0, endFrac: 0.28, preset: 'character_follow', target: 'character', effects: { smoothDrift: 0.45 } },
      { label: 'Zoom Into Screen', startFrac: 0.28, endFrac: 0.7, preset: 'zoom_into_smartphone', target: 'smartphone', effects: { focusEmphasis: 0.78, depthOfField: 0.52, subtleVignette: 0.45 } },
      { label: 'Reaction Pullback', startFrac: 0.7, endFrac: 1.0, preset: 'object_to_character_pan', target: 'smartphone', effects: { cameraSettle: 0.75, subtleVignette: 0.35 } },
    ],
  },
};

export const CAMERA_COMBINATION_LIST = Object.values(CAMERA_COMBINATIONS);

/**
 * Evaluate any of the 5 multi-layer Camera Combinations deterministically with seamless phase cross-blending.
 * @param {string} comboId
 * @param {{ time?: number, duration?: number | null, intensity?: number, resolveTarget?: ((id: string) => any) | null, baseFrame?: any }} [options]
 */
export function evaluateCameraCombination(comboId, {
  time = 0,
  duration = null,
  intensity = 1.0,
  resolveTarget = null,
  baseFrame = DEFAULT_BASE_FRAME,
} = {}) {
  const combo = CAMERA_COMBINATIONS[comboId] || CAMERA_COMBINATIONS.combo_sports_car_reveal;
  const dur = Math.max(1.2, Number(duration) || combo.defaultDuration || 4.8);
  const t = Math.max(0, Number(time) || 0);
  const overallP = clamp01(t / dur);

  const getTarget = (id) => (typeof resolveTarget === 'function' ? resolveTarget(id) : null);
  const characterFrame = getTarget('character');

  // Evaluate each phase sequentially so phase[i] starts smoothly from phase[i-1]'s end frame
  let prevEndCamera = sanitizeCameraState(baseFrame);
  let activePhase = combo.phases[0];
  let activeEval = null;
  let prevPhaseEndEval = null;
  let phaseLocalP = 0;

  for (let i = 0; i < combo.phases.length; i++) {
    const ph = combo.phases[i];
    const span = Math.max(0.05, ph.endFrac - ph.startFrac);
    const phaseDur = dur * span;
    const targetFrame = getTarget(ph.target);

    if (overallP >= ph.startFrac && (overallP <= ph.endFrac || i === combo.phases.length - 1)) {
      activePhase = ph;
      phaseLocalP = clamp01((overallP - ph.startFrac) / span);
      activeEval = evaluateCameraPreset(ph.preset, {
        time: phaseLocalP * phaseDur,
        duration: phaseDur,
        progress: phaseLocalP,
        intensity,
        startFrame: prevEndCamera,
        targetFrame,
        characterFrame,
        effects: ph.effects,
      });

      // Soft 15% entry cross-blend with previous phase's final camera state to eliminate any micro-jump
      if (i > 0 && phaseLocalP < 0.18 && prevPhaseEndEval) {
        const blend = evaluateCameraTransition(
          'smooth_reframe',
          prevPhaseEndEval.camera,
          activeEval.camera,
          phaseLocalP / 0.18,
          intensity
        );
        activeEval = {
          ...activeEval,
          camera: blend.camera,
        };
      }
      break;
    }

    // Compute exact deterministic end camera of this earlier phase to seed the next phase
    prevPhaseEndEval = evaluateCameraPreset(ph.preset, {
      time: phaseDur,
      duration: phaseDur,
      progress: 1,
      intensity,
      startFrame: prevEndCamera,
      targetFrame,
      characterFrame,
      effects: ph.effects,
    });
    prevEndCamera = prevPhaseEndEval.camera;
  }

  return {
    comboId: combo.id,
    comboName: combo.name,
    phaseLabel: activePhase.label,
    presetId: activePhase.preset,
    time: t,
    duration: dur,
    progress: overallP,
    phaseProgress: phaseLocalP,
    camera: activeEval?.camera || sanitizeCameraState(baseFrame),
    effects: activeEval?.effects || {},
  };
}
