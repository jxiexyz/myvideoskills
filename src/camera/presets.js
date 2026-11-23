/**
 * Complete Cinematic Camera Preset Library (66 Distinct Presets across 5 Categories)
 *
 * Categories:
 *  A. Zoom Presets (16)
 *  B. Pan & Tilt Presets (12)
 *  C. Tracking Presets (12)
 *  D. Orbit & Rotation Presets (10)
 *  E. Dynamic Cinematic Presets (16)
 *
 * Every preset is 100% deterministic: identical inputs & timestamp always produce identical camera state.
 * Safe 2.5D bounds guarantee the 2D character never distorts, clips, or disappears off-plane.
 */

import {
  clamp01,
  lerp,
  resolveEasing,
  deterministicWave,
  CAMERA_COMPOSITIONS,
  evaluateCameraMovementEffects,
  evaluateCameraVisualEffects,
} from './compositions-and-effects.js';

export const CAMERA_PRESET_CATEGORIES = [
  { id: 'zoom', label: 'Zoom Presets', count: 16 },
  { id: 'pan_tilt', label: 'Pan & Tilt', count: 12 },
  { id: 'tracking', label: 'Tracking', count: 12 },
  { id: 'orbit', label: 'Orbit & Rotation', count: 10 },
  { id: 'dynamic', label: 'Dynamic Cinematic', count: 16 },
];

export const DEFAULT_BASE_FRAME = {
  x: 0.12,
  y: 0.16,
  viewHeight: 2.75,
  fov: 24,
  orbitYaw: 0,
  orbitPitch: 0,
  dollyZ: 0,
  lookAtZ: 0,
  tiltX: 0,
  tiltY: 0.04,
  roll: 0,
};

function definePreset(spec) {
  return {
    defaultDuration: 3.0,
    defaultEasing: 'easeInOutCubic',
    defaultIntensity: 1.0,
    recommendedTarget: 'character',
    defaultComposition: 'wide',
    defaultTransition: 'cinematic_ease_transition',
    defaultEffects: { subtleVignette: 0.35 },
    secondaryMove: 'subtle_parallax',
    ...spec,
  };
}

export const CAMERA_PRESETS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // A. ZOOM PRESETS (16)
  // ═══════════════════════════════════════════════════════════════════════════
  cinematic_push_in: definePreset({
    id: 'cinematic_push_in',
    name: 'Cinematic Push-In',
    category: 'zoom',
    purpose: 'Smooth storytelling dolly push toward focal subject to deepen engagement.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 0.45, subtleVignette: 0.38 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y, ctx.target.y, ctx.eased),
      viewHeight: lerp(ctx.start.viewHeight, ctx.target.viewHeight * 0.72, ctx.eased),
      tiltX: lerp(ctx.start.tiltX, ctx.target.tiltX + 0.04 * ctx.intensity, ctx.eased),
      tiltY: lerp(ctx.start.tiltY, ctx.target.tiltY, ctx.eased),
      orbitYaw: lerp(ctx.start.orbitYaw, 0.04 * ctx.intensity, ctx.eased),
      lookAtZ: lerp(ctx.start.lookAtZ, ctx.target.z * 0.5, ctx.eased),
    }),
  }),
  cinematic_pull_out: definePreset({
    id: 'cinematic_pull_out',
    name: 'Cinematic Pull-Out',
    category: 'zoom',
    purpose: 'Graceful wide reveal pulling back from subject to show broader 2.5D context.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 0.35, subtleVignette: 0.32 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x, ctx.base.x + 0.15, ctx.eased),
      y: lerp(ctx.target.y, ctx.base.y + 0.14, ctx.eased),
      viewHeight: lerp(ctx.target.viewHeight * 0.78, Math.min(3.75, ctx.base.viewHeight * 1.24), ctx.eased),
      tiltX: lerp(0.05 * ctx.intensity, -0.04 * ctx.intensity, ctx.eased),
      tiltY: lerp(0.02, 0.08 * ctx.intensity, ctx.eased),
      orbitYaw: lerp(0.05 * ctx.intensity, -0.04 * ctx.intensity, ctx.eased),
    }),
  }),
  slow_dramatic_zoom: definePreset({
    id: 'slow_dramatic_zoom',
    name: 'Slow Dramatic Zoom',
    category: 'zoom',
    purpose: 'Tension-building deliberate push into face or key prop with tightening vignette.',
    defaultDuration: 4.2,
    defaultEasing: 'cinematicSine',
    recommendedTarget: 'character_face',
    defaultEffects: { subtleVignette: 0.65, focusEmphasis: 0.55 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y, ctx.target.y, ctx.eased),
      viewHeight: lerp(ctx.start.viewHeight * 0.92, Math.max(0.76, ctx.target.viewHeight * 0.68), ctx.eased),
      fov: lerp(24, 21.5, ctx.eased * ctx.intensity),
      orbitYaw: lerp(0, 0.05 * ctx.intensity, ctx.eased),
    }),
  }),
  fast_punch_zoom: definePreset({
    id: 'fast_punch_zoom',
    name: 'Fast Punch Zoom',
    category: 'zoom',
    purpose: 'High-energy punch-in for comedic beats, numbers, or sudden realization.',
    defaultDuration: 1.5,
    defaultEasing: 'easeOutExpo',
    recommendedTarget: 'character_face',
    defaultEffects: { zoomBlur: 0.72, microShake: 0.6, impactFlash: 0.45 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y, ctx.target.y, ctx.eased),
      viewHeight: lerp(ctx.start.viewHeight, Math.max(0.82, ctx.target.viewHeight * 0.65), ctx.eased),
      roll: Math.sin(ctx.p * Math.PI) * 0.025 * ctx.intensity,
    }),
  }),
  snap_zoom_in: definePreset({
    id: 'snap_zoom_in',
    name: 'Snap Zoom In',
    category: 'zoom',
    purpose: 'Ultra-crisp instantaneous-feel zoom snap landing tightly on target.',
    defaultDuration: 1.2,
    defaultEasing: 'whipSnap',
    recommendedTarget: 'sports_car',
    defaultEffects: { zoomBlur: 0.85, cameraSettle: 0.85, impactFlash: 0.5 },
    evaluate: (ctx) => {
      const snap = clamp01(ctx.p * 2.1);
      const e = resolveEasing('whipSnap')(snap);
      return {
        x: lerp(ctx.start.x, ctx.target.x, e),
        y: lerp(ctx.start.y, ctx.target.y, e),
        viewHeight: lerp(ctx.start.viewHeight, Math.max(0.85, ctx.target.viewHeight * 0.7), e),
        orbitYaw: lerp(0, 0.08 * ctx.intensity, e),
        lookAtZ: lerp(0, ctx.target.z * 0.55, e),
      };
    },
  }),
  snap_zoom_out: definePreset({
    id: 'snap_zoom_out',
    name: 'Snap Zoom Out',
    category: 'zoom',
    purpose: 'Punchy snap pullback exposing the full stage or surprise object beside character.',
    defaultDuration: 1.4,
    defaultEasing: 'whipSnap',
    recommendedTarget: 'character',
    defaultEffects: { zoomBlur: 0.65, cameraSettle: 0.7 },
    evaluate: (ctx) => {
      const snap = clamp01(ctx.p * 1.9);
      const e = resolveEasing('whipSnap')(snap);
      return {
        x: lerp(ctx.target.x, ctx.base.x + 0.18, e),
        y: lerp(ctx.target.y, ctx.base.y + 0.12, e),
        viewHeight: lerp(Math.max(0.88, ctx.target.viewHeight * 0.62), Math.min(3.55, ctx.base.viewHeight * 1.22), e),
      };
    },
  }),
  micro_zoom_emphasis: definePreset({
    id: 'micro_zoom_emphasis',
    name: 'Micro Zoom Emphasis',
    category: 'zoom',
    purpose: 'Subtle 10-16% editorial push emphasizing a spoken statistic or key sentence.',
    defaultDuration: 2.4,
    defaultEasing: 'easeOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 0.3, subtleVignette: 0.25 },
    evaluate: (ctx) => {
      const zoomDrop = 0.15 * ctx.intensity;
      return {
        x: lerp(ctx.start.x, lerp(ctx.start.x, ctx.target.x, 0.45), ctx.eased),
        y: lerp(ctx.start.y, lerp(ctx.start.y, ctx.target.y, 0.45), ctx.eased),
        viewHeight: ctx.start.viewHeight * (1 - zoomDrop * ctx.eased),
        tiltX: lerp(0, 0.03 * ctx.intensity, ctx.eased),
      };
    },
  }),
  progressive_zoom: definePreset({
    id: 'progressive_zoom',
    name: 'Progressive Zoom',
    category: 'zoom',
    purpose: 'Stepped multi-beat zoom advancing closer in 3 clean narrative pulses.',
    defaultDuration: 3.6,
    defaultEasing: 'easeOutCubic',
    recommendedTarget: 'character_face',
    defaultEffects: { microShake: 0.35, focusEmphasis: 0.45 },
    evaluate: (ctx) => {
      const s1 = resolveEasing('easeOutExpo')(clamp01(ctx.p * 3));
      const s2 = resolveEasing('easeOutExpo')(clamp01((ctx.p - 0.33) * 3));
      const s3 = resolveEasing('easeOutExpo')(clamp01((ctx.p - 0.66) * 3));
      const stepBlend = (s1 + s2 + s3) / 3;
      return {
        x: lerp(ctx.start.x, ctx.target.x, stepBlend),
        y: lerp(ctx.start.y, ctx.target.y, stepBlend),
        viewHeight: lerp(ctx.start.viewHeight, Math.max(0.84, ctx.target.viewHeight * 0.66), stepBlend),
      };
    },
  }),
  zoom_through: definePreset({
    id: 'zoom_through',
    name: 'Zoom Through',
    category: 'zoom',
    purpose: 'High-momentum forward rush pushing straight into focal depth plane.',
    defaultDuration: 2.0,
    defaultEasing: 'easeInOutExpo',
    recommendedTarget: 'smartphone',
    defaultEffects: { zoomBlur: 0.9, motionBlur: 0.75, subtleVignette: 0.5 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y, ctx.target.y, ctx.eased),
      viewHeight: lerp(ctx.start.viewHeight * 1.05, Math.max(0.62, ctx.target.viewHeight * 0.52), ctx.eased),
      dollyZ: lerp(0.4, -0.75 * ctx.intensity, ctx.eased),
      lookAtZ: lerp(0, ctx.target.z * 0.7, ctx.eased),
    }),
  }),
  zoom_reveal: definePreset({
    id: 'zoom_reveal',
    name: 'Zoom Reveal',
    category: 'zoom',
    purpose: 'Starts tight on detail then zooms back smoothly to unveil entire hero subject.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'private_jet',
    defaultEffects: { subtleVignette: 0.42, smoothDrift: 0.35 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 0.25, ctx.target.x + 0.08, ctx.eased),
      y: lerp(ctx.target.y, ctx.target.y + 0.14, ctx.eased),
      viewHeight: lerp(Math.max(0.85, ctx.target.viewHeight * 0.58), Math.min(3.45, ctx.target.viewHeight * 1.48), ctx.eased),
      orbitYaw: lerp(-0.12 * ctx.intensity, 0.08 * ctx.intensity, ctx.eased),
      lookAtZ: ctx.target.z * 0.5,
    }),
  }),
  zoom_into_object: definePreset({
    id: 'zoom_into_object',
    name: 'Zoom Into Object',
    category: 'zoom',
    purpose: 'Purpose-built focus zoom locking cleanly onto a showcase hero prop.',
    defaultDuration: 2.6,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'sports_car',
    defaultEffects: { focusEmphasis: 0.65, subtleVignette: 0.42 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y, ctx.target.y, ctx.eased),
      viewHeight: lerp(ctx.start.viewHeight, Math.max(1.05, ctx.target.viewHeight * 0.86), ctx.eased),
      orbitYaw: lerp(0, -0.1 * ctx.intensity, ctx.eased),
      lookAtZ: lerp(0, ctx.target.z * 0.65, ctx.eased),
    }),
  }),
  zoom_into_character: definePreset({
    id: 'zoom_into_character',
    name: 'Zoom Into Character',
    category: 'zoom',
    purpose: 'Moves cleanly from wide stage into Heroine medium close-up for emotional beat.',
    defaultDuration: 2.8,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character_face',
    defaultEffects: { subtleVignette: 0.45, smoothDrift: 0.3 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y, ctx.target.y, ctx.eased),
      viewHeight: lerp(ctx.start.viewHeight, 1.08, ctx.eased),
      tiltX: lerp(0.06, 0.01, ctx.eased),
    }),
  }),
  zoom_into_smartphone: definePreset({
    id: 'zoom_into_smartphone',
    name: 'Zoom Into Smartphone',
    category: 'zoom',
    purpose: 'Precision zoom framing the 2.5D smartphone screen and Dynamic Island notification.',
    defaultDuration: 2.4,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'smartphone',
    defaultEffects: { focusEmphasis: 0.72, depthOfField: 0.48, subtleVignette: 0.4 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y, ctx.target.y + 0.02, ctx.eased),
      viewHeight: lerp(ctx.start.viewHeight, 1.14, ctx.eased),
      orbitYaw: lerp(0.03, -0.04 * ctx.intensity, ctx.eased),
      lookAtZ: lerp(0, ctx.target.z * 0.85, ctx.eased),
    }),
  }),
  zoom_out_establishing: definePreset({
    id: 'zoom_out_establishing',
    name: 'Zoom Out Establishing',
    category: 'zoom',
    purpose: 'Sweeping pullback from Heroine out to full mansion, jet, car, and sky skyline.',
    defaultDuration: 3.8,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 0.4, subtleVignette: 0.3 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x, 0.25, ctx.eased),
      y: lerp(ctx.target.y + 0.1, 0.32, ctx.eased),
      viewHeight: lerp(1.38, 3.65, ctx.eased),
      tiltY: lerp(0.01, 0.1 * ctx.intensity, ctx.eased),
      orbitPitch: lerp(0, 0.05 * ctx.intensity, ctx.eased),
    }),
  }),
  zoom_with_overshoot: definePreset({
    id: 'zoom_with_overshoot',
    name: 'Zoom With Overshoot',
    category: 'zoom',
    purpose: 'Stylized cartoon punch-in that briefly overshoots tight then eases back cleanly.',
    defaultDuration: 1.9,
    defaultEasing: 'easeOutBack',
    recommendedTarget: 'sports_car',
    defaultEffects: { motionOvershoot: 0.75, zoomBlur: 0.55 },
    evaluate: (ctx) => {
      const e = resolveEasing('easeOutBack')(ctx.p);
      return {
        x: lerp(ctx.start.x, ctx.target.x, clamp01(ctx.eased)),
        y: lerp(ctx.start.y, ctx.target.y, clamp01(ctx.eased)),
        viewHeight: Math.max(0.72, lerp(ctx.start.viewHeight, ctx.target.viewHeight * 0.76, e)),
        lookAtZ: lerp(0, ctx.target.z * 0.5, clamp01(ctx.eased)),
      };
    },
  }),
  elastic_zoom_settle: definePreset({
    id: 'elastic_zoom_settle',
    name: 'Elastic Zoom Settle',
    category: 'zoom',
    purpose: 'Playful spring-damped zoom bounce ideal for money reveals and popups.',
    defaultDuration: 2.2,
    defaultEasing: 'easeOutElastic',
    recommendedTarget: 'financial_popup',
    defaultEffects: { cameraSettle: 0.8, subtleVignette: 0.32 },
    evaluate: (ctx) => {
      const el = resolveEasing('easeOutElastic')(ctx.p);
      return {
        x: lerp(ctx.start.x, ctx.target.x, clamp01(ctx.p * 1.4)),
        y: lerp(ctx.start.y, ctx.target.y, clamp01(ctx.p * 1.4)),
        viewHeight: Math.max(0.75, lerp(ctx.start.viewHeight, ctx.target.viewHeight * 0.78, el)),
      };
    },
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // B. PAN & TILT PRESETS (12)
  // ═══════════════════════════════════════════════════════════════════════════
  smooth_pan_left: definePreset({
    id: 'smooth_pan_left',
    name: 'Smooth Pan Left',
    category: 'pan_tilt',
    purpose: 'Silky horizontal camera glide panning left across layered 2.5D depth planes.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'mansion',
    defaultEffects: { smoothDrift: 0.25 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x + 1.35 * ctx.intensity, ctx.target.x - 0.35 * ctx.intensity, ctx.eased),
      y: ctx.target.y + 0.08,
      viewHeight: Math.max(2.1, ctx.target.viewHeight),
      tiltX: lerp(0.08, -0.08, ctx.eased) * ctx.intensity,
    }),
  }),
  smooth_pan_right: definePreset({
    id: 'smooth_pan_right',
    name: 'Smooth Pan Right',
    category: 'pan_tilt',
    purpose: 'Silky horizontal camera glide panning right from Heroine across vehicles & skyline.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'sports_car',
    defaultEffects: { smoothDrift: 0.25 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 1.5 * ctx.intensity, ctx.target.x + 0.15 * ctx.intensity, ctx.eased),
      y: ctx.target.y + 0.06,
      viewHeight: Math.max(2.15, ctx.target.viewHeight),
      tiltX: lerp(-0.08, 0.08, ctx.eased) * ctx.intensity,
    }),
  }),
  fast_pan_left: definePreset({
    id: 'fast_pan_left',
    name: 'Fast Pan Left',
    category: 'pan_tilt',
    purpose: 'Brisk energetic pan left with subtle directional cartoon speed streaks.',
    defaultDuration: 1.5,
    defaultEasing: 'easeOutExpo',
    recommendedTarget: 'character',
    defaultEffects: { directionalBlur: 0.65, motionBlur: 0.6 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x + 1.85 * ctx.intensity, ctx.target.x, ctx.eased),
      y: ctx.target.y + 0.04,
      viewHeight: Math.max(1.9, ctx.target.viewHeight),
      tiltX: lerp(0.14, -0.04, ctx.eased) * ctx.intensity,
      directionX: -1,
    }),
  }),
  fast_pan_right: definePreset({
    id: 'fast_pan_right',
    name: 'Fast Pan Right',
    category: 'pan_tilt',
    purpose: 'Brisk energetic pan right revealing luxury assets with directional momentum.',
    defaultDuration: 1.5,
    defaultEasing: 'easeOutExpo',
    recommendedTarget: 'sports_car',
    defaultEffects: { directionalBlur: 0.65, motionBlur: 0.6 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 1.9 * ctx.intensity, ctx.target.x, ctx.eased),
      y: ctx.target.y + 0.04,
      viewHeight: Math.max(1.9, ctx.target.viewHeight),
      tiltX: lerp(-0.14, 0.05, ctx.eased) * ctx.intensity,
      directionX: 1,
    }),
  }),
  cinematic_tilt_up: definePreset({
    id: 'cinematic_tilt_up',
    name: 'Cinematic Tilt Up',
    category: 'pan_tilt',
    purpose: 'Vertical upward tilt from ground level up toward sky, mansion, or Heroine face.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: ctx.target.x,
      y: lerp(ctx.target.y - 0.55 * ctx.intensity, ctx.target.y + 0.42 * ctx.intensity, ctx.eased),
      viewHeight: Math.max(1.75, ctx.target.viewHeight * 0.92),
      orbitPitch: lerp(-0.12, 0.09, ctx.eased) * ctx.intensity,
      tiltY: lerp(-0.08, 0.1, ctx.eased) * ctx.intensity,
    }),
  }),
  cinematic_tilt_down: definePreset({
    id: 'cinematic_tilt_down',
    name: 'Cinematic Tilt Down',
    category: 'pan_tilt',
    purpose: 'Descending tilt from sky/estate roofline down to foreground subject or car.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'sports_car',
    defaultEffects: { subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: ctx.target.x,
      y: lerp(ctx.target.y + 0.85 * ctx.intensity, ctx.target.y - 0.05, ctx.eased),
      viewHeight: Math.max(1.85, ctx.target.viewHeight),
      orbitPitch: lerp(0.12, -0.05, ctx.eased) * ctx.intensity,
      tiltY: lerp(0.12, -0.02, ctx.eased) * ctx.intensity,
    }),
  }),
  diagonal_pan: definePreset({
    id: 'diagonal_pan',
    name: 'Diagonal Pan',
    category: 'pan_tilt',
    purpose: 'Combined X/Y diagonal glide linking Heroine foreground to background estate/jet.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'private_jet',
    defaultEffects: { smoothDrift: 0.3, subtleVignette: 0.32 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x - 0.85 * ctx.intensity, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y - 0.28 * ctx.intensity, ctx.target.y + 0.16, ctx.eased),
      viewHeight: lerp(2.2, Math.max(2.05, ctx.target.viewHeight), ctx.eased),
      tiltX: lerp(-0.08, 0.1, ctx.eased) * ctx.intensity,
      tiltY: lerp(-0.04, 0.08, ctx.eased) * ctx.intensity,
    }),
  }),
  reveal_pan: definePreset({
    id: 'reveal_pan',
    name: 'Reveal Pan',
    category: 'pan_tilt',
    purpose: 'Begins behind foreground planter depth plane and pans smoothly to unveil subject.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'sports_car',
    defaultEffects: { depthOfField: 0.45, subtleVignette: 0.38 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 2.1 * ctx.intensity, ctx.target.x, ctx.eased),
      y: lerp(ctx.target.y + 0.1, ctx.target.y + 0.02, ctx.eased),
      viewHeight: lerp(2.05, Math.max(1.72, ctx.target.viewHeight * 0.92), ctx.eased),
      orbitYaw: lerp(-0.18, 0.06, ctx.eased) * ctx.intensity,
    }),
  }),
  character_to_object_pan: definePreset({
    id: 'character_to_object_pan',
    name: 'Character to Object Pan',
    category: 'pan_tilt',
    purpose: 'Starts framed on speaking Heroine, then pans directly onto referenced prop.',
    defaultDuration: 2.8,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'sports_car',
    defaultEffects: { motionBlur: 0.42, focusEmphasis: 0.45 },
    evaluate: (ctx) => ({
      x: lerp(ctx.character.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.character.y + 0.12, ctx.target.y + 0.04, ctx.eased),
      viewHeight: lerp(2.05, Math.max(1.55, ctx.target.viewHeight * 0.92), ctx.eased),
      orbitYaw: lerp(-0.05, 0.1 * ctx.intensity, ctx.eased),
      lookAtZ: lerp(0, ctx.target.z * 0.6, ctx.eased),
    }),
  }),
  object_to_character_pan: definePreset({
    id: 'object_to_character_pan',
    name: 'Object to Character Pan',
    category: 'pan_tilt',
    purpose: 'Starts focused on hero prop, then glides smoothly back to Heroine reaction.',
    defaultDuration: 2.8,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'sports_car',
    defaultEffects: { motionBlur: 0.4, subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x, ctx.character.x, ctx.eased),
      y: lerp(ctx.target.y + 0.04, ctx.character.y + 0.24, ctx.eased),
      viewHeight: lerp(Math.max(1.45, ctx.target.viewHeight * 0.9), 1.62, ctx.eased),
      orbitYaw: lerp(0.1 * ctx.intensity, -0.04, ctx.eased),
      lookAtZ: lerp(ctx.target.z * 0.5, 0, ctx.eased),
    }),
  }),
  environmental_sweep: definePreset({
    id: 'environmental_sweep',
    name: 'Environmental Sweep',
    category: 'pan_tilt',
    purpose: 'Grand panoramic left-to-right estate sweep showcasing all 4 depth layers.',
    defaultDuration: 4.5,
    defaultEasing: 'cinematicSine',
    recommendedTarget: 'mansion',
    defaultEffects: { smoothDrift: 0.35, subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: lerp(-1.85 * ctx.intensity, 1.85 * ctx.intensity, ctx.eased),
      y: 0.36 + Math.sin(ctx.p * Math.PI) * 0.16 * ctx.intensity,
      viewHeight: 3.1 + Math.sin(ctx.p * Math.PI) * 0.25,
      tiltX: lerp(-0.14, 0.14, ctx.eased) * ctx.intensity,
      orbitYaw: lerp(-0.14, 0.14, ctx.eased) * ctx.intensity,
    }),
  }),
  wide_horizontal_reveal: definePreset({
    id: 'wide_horizontal_reveal',
    name: 'Wide Horizontal Reveal',
    category: 'pan_tilt',
    purpose: 'Expansive establishing horizontal slide opening up runway, car, and skyline.',
    defaultDuration: 3.8,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'private_jet',
    defaultEffects: { subtleVignette: 0.3, smoothDrift: 0.25 },
    evaluate: (ctx) => ({
      x: lerp(-1.35 * ctx.intensity, 1.35 * ctx.intensity, ctx.eased),
      y: 0.26,
      viewHeight: lerp(2.65, 3.25, ctx.eased),
      tiltX: lerp(-0.1, 0.12, ctx.eased) * ctx.intensity,
    }),
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // C. TRACKING PRESETS (12)
  // ═══════════════════════════════════════════════════════════════════════════
  character_follow: definePreset({
    id: 'character_follow',
    name: 'Character Follow',
    category: 'tracking',
    purpose: 'Responsive damped camera lock tracking the Heroine smoothly with natural breathing.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 0.55 },
    evaluate: (ctx) => {
      const walkBob = Math.sin(ctx.time * 2.8) * 0.025 * ctx.intensity;
      return {
        x: lerp(ctx.character.x - 0.18 * ctx.intensity, ctx.character.x + 0.22 * ctx.intensity, ctx.eased),
        y: ctx.character.y + 0.14 + walkBob,
        viewHeight: 2.12,
        tiltX: Math.sin(ctx.time * 1.4) * 0.05 * ctx.intensity,
      };
    },
  }),
  side_tracking: definePreset({
    id: 'side_tracking',
    name: 'Side Tracking',
    category: 'tracking',
    purpose: 'Lateral dolly-track sliding parallel to the scene plane for crisp parallax separation.',
    defaultDuration: 3.6,
    defaultEasing: 'linear',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 0.25 },
    evaluate: (ctx) => ({
      x: lerp(-1.25 * ctx.intensity, 1.45 * ctx.intensity, ctx.eased),
      y: 0.14,
      viewHeight: 2.48,
      tiltX: lerp(-0.12, 0.12, ctx.eased) * ctx.intensity,
      orbitYaw: lerp(-0.1, 0.1, ctx.eased) * ctx.intensity,
    }),
  }),
  forward_tracking: definePreset({
    id: 'forward_tracking',
    name: 'Forward Tracking',
    category: 'tracking',
    purpose: 'Steady forward dolly gliding closer into the 2.5D stage depth along center axis.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'smartphone',
    defaultEffects: { depthOfField: 0.35, subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y, ctx.target.y, ctx.eased),
      viewHeight: lerp(2.95, Math.max(1.25, ctx.target.viewHeight * 0.85), ctx.eased),
      dollyZ: lerp(0.5, -0.55 * ctx.intensity, ctx.eased),
      lookAtZ: lerp(0, ctx.target.z * 0.65, ctx.eased),
    }),
  }),
  backward_tracking: definePreset({
    id: 'backward_tracking',
    name: 'Backward Tracking',
    category: 'tracking',
    purpose: 'Smooth reverse dolly retreating from subject to reveal surrounding environment.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 0.35, subtleVignette: 0.3 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x, ctx.base.x + 0.12, ctx.eased),
      y: lerp(ctx.target.y + 0.1, ctx.base.y + 0.18, ctx.eased),
      viewHeight: lerp(1.55, 3.25, ctx.eased),
      dollyZ: lerp(-0.35, 0.65 * ctx.intensity, ctx.eased),
    }),
  }),
  object_tracking: definePreset({
    id: 'object_tracking',
    name: 'Object Tracking',
    category: 'tracking',
    purpose: 'Locks center framing cleanly onto chosen target object with subtle lateral dolly.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'sports_car',
    defaultEffects: { focusEmphasis: 0.55, subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: ctx.target.x + lerp(-0.22, 0.22, ctx.eased) * ctx.intensity,
      y: ctx.target.y + 0.04,
      viewHeight: Math.max(1.35, ctx.target.viewHeight * 0.94),
      orbitYaw: lerp(-0.15, 0.15, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.65,
    }),
  }),
  vehicle_tracking: definePreset({
    id: 'vehicle_tracking',
    name: 'Vehicle Tracking',
    category: 'tracking',
    purpose: 'Low automotive tracking dolly gliding across the sports car silhouette with road feel.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'sports_car',
    defaultEffects: { motionBlur: 0.5, subtleVignette: 0.42 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 0.85 * ctx.intensity, ctx.target.x + 0.42 * ctx.intensity, ctx.eased),
      y: ctx.target.y - 0.08,
      viewHeight: lerp(1.88, 1.52, ctx.eased),
      orbitYaw: lerp(-0.22, 0.14, ctx.eased) * ctx.intensity,
      orbitPitch: -0.05 * ctx.intensity,
      lookAtZ: ctx.target.z * 0.72,
    }),
  }),
  smartphone_tracking: definePreset({
    id: 'smartphone_tracking',
    name: 'Smartphone Tracking',
    category: 'tracking',
    purpose: 'Tracks gently around the floating 2.5D smartphone screen keeping Dynamic Island crisp.',
    defaultDuration: 3.0,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'smartphone',
    defaultEffects: { focusEmphasis: 0.65, depthOfField: 0.45 },
    evaluate: (ctx) => ({
      x: ctx.target.x + Math.sin(ctx.p * Math.PI) * 0.08 * ctx.intensity,
      y: ctx.target.y + 0.04 + Math.sin(ctx.time * 1.5 + 0.4) * 0.022,
      viewHeight: lerp(1.32, 0.92, ctx.eased),
      orbitYaw: lerp(-0.12, 0.1, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.85,
    }),
  }),
  moving_subject_follow: definePreset({
    id: 'moving_subject_follow',
    name: 'Moving Subject Follow',
    category: 'tracking',
    purpose: 'Predictively tracks a moving subject across left-to-right story motion.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'private_jet',
    defaultEffects: { motionBlur: 0.38, smoothDrift: 0.3 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 1.15 * ctx.intensity, ctx.target.x + 0.65 * ctx.intensity, ctx.eased),
      y: lerp(ctx.target.y - 0.05, ctx.target.y + 0.18, ctx.eased),
      viewHeight: Math.max(1.8, ctx.target.viewHeight),
      tiltX: lerp(-0.09, 0.11, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.55,
    }),
  }),
  lead_tracking: definePreset({
    id: 'lead_tracking',
    name: 'Lead Tracking',
    category: 'tracking',
    purpose: 'Frames generous lead space ahead of subject direction for forward story momentum.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 0.35 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x + 0.15, ctx.target.x + 0.95 * ctx.intensity, ctx.eased),
      y: ctx.target.y + 0.1,
      viewHeight: 2.38,
      orbitYaw: lerp(0.04, 0.14, ctx.eased) * ctx.intensity,
    }),
  }),
  follow_behind: definePreset({
    id: 'follow_behind',
    name: 'Follow Behind',
    category: 'tracking',
    purpose: 'Over-the-shoulder advancing track trailing behind Heroine toward hero assets ahead.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { handheld: 0.35, depthOfField: 0.35 },
    evaluate: (ctx) => ({
      x: lerp(ctx.character.x + 0.15, ctx.character.x + 0.72 * ctx.intensity, ctx.eased),
      y: lerp(ctx.character.y + 0.18, ctx.character.y + 0.22, ctx.eased),
      viewHeight: lerp(2.15, 1.68, ctx.eased),
      orbitYaw: lerp(0.14, 0.22, ctx.eased) * ctx.intensity,
      dollyZ: lerp(0.3, -0.35 * ctx.intensity, ctx.eased),
    }),
  }),
  reveal_while_tracking: definePreset({
    id: 'reveal_while_tracking',
    name: 'Reveal While Tracking',
    category: 'tracking',
    purpose: 'Tracks laterally past Heroine while pulling slightly wider to unveil jet & mansion.',
    defaultDuration: 3.8,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'private_jet',
    defaultEffects: { subtleVignette: 0.35, smoothDrift: 0.3 },
    evaluate: (ctx) => ({
      x: lerp(ctx.character.x + 0.2, ctx.target.x - 0.35, ctx.eased),
      y: lerp(0.12, 0.32, ctx.eased),
      viewHeight: lerp(1.95, 3.15, ctx.eased),
      orbitYaw: lerp(-0.1, 0.14, ctx.eased) * ctx.intensity,
    }),
  }),
  tracking_with_zoom: definePreset({
    id: 'tracking_with_zoom',
    name: 'Tracking With Zoom',
    category: 'tracking',
    purpose: 'Simultaneous lateral track and smooth dolly push closing in on hero target.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'sports_car',
    defaultEffects: { focusEmphasis: 0.5, subtleVignette: 0.4 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x - 0.7 * ctx.intensity, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y + 0.14, ctx.target.y + 0.02, ctx.eased),
      viewHeight: lerp(2.85, Math.max(1.22, ctx.target.viewHeight * 0.8), ctx.eased),
      orbitYaw: lerp(-0.16, 0.12, ctx.eased) * ctx.intensity,
      lookAtZ: lerp(0, ctx.target.z * 0.65, ctx.eased),
    }),
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // D. ORBIT & ROTATION PRESETS (10) — 2.5D-Safe Perspective Arcs
  // ═══════════════════════════════════════════════════════════════════════════
  slow_orbit_left: definePreset({
    id: 'slow_orbit_left',
    name: 'Slow Orbit Left',
    category: 'orbit',
    purpose: 'Gentle controlled counter-clockwise 2.5D orbit keeping flat character clean.',
    defaultDuration: 3.8,
    defaultEasing: 'cinematicSine',
    recommendedTarget: 'character',
    defaultEffects: { subtleVignette: 0.32 },
    evaluate: (ctx) => ({
      x: ctx.target.x,
      y: ctx.target.y + 0.08,
      viewHeight: Math.max(1.75, ctx.target.viewHeight),
      orbitYaw: lerp(0.16, -0.22, ctx.eased) * ctx.intensity,
      tiltX: lerp(0.06, -0.08, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.55,
    }),
  }),
  slow_orbit_right: definePreset({
    id: 'slow_orbit_right',
    name: 'Slow Orbit Right',
    category: 'orbit',
    purpose: 'Gentle controlled clockwise 2.5D orbit showcasing layered spatial parallax.',
    defaultDuration: 3.8,
    defaultEasing: 'cinematicSine',
    recommendedTarget: 'sports_car',
    defaultEffects: { subtleVignette: 0.32 },
    evaluate: (ctx) => ({
      x: ctx.target.x,
      y: ctx.target.y + 0.06,
      viewHeight: Math.max(1.75, ctx.target.viewHeight),
      orbitYaw: lerp(-0.18, 0.24, ctx.eased) * ctx.intensity,
      tiltX: lerp(-0.06, 0.08, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.65,
    }),
  }),
  half_orbit: definePreset({
    id: 'half_orbit',
    name: 'Half Orbit',
    category: 'orbit',
    purpose: 'Broad 2.5D-safe semicircular showcase arc sweeping across full hero facade.',
    defaultDuration: 4.0,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'sports_car',
    defaultEffects: { subtleVignette: 0.4, focusEmphasis: 0.42 },
    evaluate: (ctx) => ({
      x: ctx.target.x,
      y: ctx.target.y + 0.08 + Math.sin(ctx.p * Math.PI) * 0.08,
      viewHeight: Math.max(1.7, ctx.target.viewHeight * 0.96),
      orbitYaw: lerp(-0.34, 0.34, ctx.eased) * ctx.intensity,
      orbitPitch: Math.sin(ctx.p * Math.PI) * 0.08 * ctx.intensity,
      lookAtZ: ctx.target.z * 0.72,
    }),
  }),
  quarter_orbit: definePreset({
    id: 'quarter_orbit',
    name: 'Quarter Orbit',
    category: 'orbit',
    purpose: 'Clean 45-degree 2.5D perspective pivot transitioning from front to three-quarter angle.',
    defaultDuration: 2.8,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'smartphone',
    defaultEffects: { subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: ctx.target.x,
      y: ctx.target.y + 0.06,
      viewHeight: Math.max(1.25, ctx.target.viewHeight * 0.92),
      orbitYaw: lerp(0.0, 0.26, ctx.eased) * ctx.intensity,
      orbitPitch: lerp(0.0, 0.05, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.75,
    }),
  }),
  full_orbit: definePreset({
    id: 'full_orbit',
    name: 'Full Orbit (2.5D Loop)',
    category: 'orbit',
    purpose: 'Continuous figure-arc orbital sweep engineered for 2.5D scenes without plane-edge clipping.',
    defaultDuration: 4.4,
    defaultEasing: 'cinematicSine',
    recommendedTarget: 'sports_car',
    defaultEffects: { subtleVignette: 0.42, smoothDrift: 0.3 },
    evaluate: (ctx) => ({
      x: ctx.target.x + Math.sin(ctx.p * Math.PI * 2) * 0.16 * ctx.intensity,
      y: ctx.target.y + 0.08 + Math.cos(ctx.p * Math.PI * 2) * 0.06 * ctx.intensity,
      viewHeight: Math.max(1.72, ctx.target.viewHeight * (0.96 - 0.08 * Math.sin(ctx.p * Math.PI))),
      orbitYaw: Math.sin(ctx.p * Math.PI * 2) * 0.36 * ctx.intensity,
      orbitPitch: (0.04 + Math.cos(ctx.p * Math.PI * 2) * 0.07) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.75,
    }),
  }),
  hero_object_orbit: definePreset({
    id: 'hero_object_orbit',
    name: 'Hero Object Orbit',
    category: 'orbit',
    purpose: 'Commercial hero turntable arc around sports car, smartphone, or private jet.',
    defaultDuration: 3.6,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'sports_car',
    defaultEffects: { focusEmphasis: 0.58, subtleVignette: 0.45 },
    evaluate: (ctx) => ({
      x: ctx.target.x,
      y: ctx.target.y + 0.04,
      viewHeight: lerp(ctx.target.viewHeight * 1.05, ctx.target.viewHeight * 0.86, ctx.eased),
      orbitYaw: lerp(-0.28, 0.24, ctx.eased) * ctx.intensity,
      orbitPitch: lerp(0.08, 0.02, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.78,
    }),
  }),
  character_reveal_orbit: definePreset({
    id: 'character_reveal_orbit',
    name: 'Character Reveal Orbit',
    category: 'orbit',
    purpose: 'Gentle 2.5D-safe arc around Heroine keeping cutout plane crisp while shifting background.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { subtleVignette: 0.38 },
    evaluate: (ctx) => ({
      x: ctx.character.x + lerp(-0.12, 0.14, ctx.eased) * ctx.intensity,
      y: ctx.character.y + 0.14,
      viewHeight: lerp(2.35, 1.85, ctx.eased),
      // Keep yaw modest on 2D cutout Heroine so anatomy remains natural
      orbitYaw: lerp(-0.18, 0.18, ctx.eased) * ctx.intensity,
      tiltX: lerp(-0.1, 0.1, ctx.eased) * ctx.intensity,
    }),
  }),
  arc_shot: definePreset({
    id: 'arc_shot',
    name: 'Arc Shot',
    category: 'orbit',
    purpose: 'Classic cinema parallax arc curving smoothly across character and background estate.',
    defaultDuration: 3.6,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { subtleVignette: 0.4, smoothDrift: 0.25 },
    evaluate: (ctx) => ({
      x: ctx.target.x + Math.sin(ctx.p * Math.PI) * 0.22 * ctx.intensity,
      y: ctx.target.y + 0.12,
      viewHeight: Math.max(1.8, ctx.target.viewHeight * (1.0 - 0.1 * Math.sin(ctx.p * Math.PI))),
      orbitYaw: lerp(-0.26, 0.26, ctx.eased) * ctx.intensity,
      orbitPitch: 0.04 * ctx.intensity,
      lookAtZ: ctx.target.z * 0.5,
    }),
  }),
  dynamic_circular_reveal: definePreset({
    id: 'dynamic_circular_reveal',
    name: 'Dynamic Circular Reveal',
    category: 'orbit',
    purpose: 'High-polish sweeping arc combined with elevation lift unveiling jet & mansion.',
    defaultDuration: 3.8,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'private_jet',
    defaultEffects: { subtleVignette: 0.45, focusEmphasis: 0.45 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 0.55 * ctx.intensity, ctx.target.x + 0.25 * ctx.intensity, ctx.eased),
      y: lerp(ctx.target.y - 0.15, ctx.target.y + 0.24, ctx.eased),
      viewHeight: lerp(1.9, Math.min(3.15, ctx.target.viewHeight * 1.18), ctx.eased),
      orbitYaw: lerp(-0.32, 0.28, ctx.eased) * ctx.intensity,
      orbitPitch: lerp(-0.04, 0.11, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.65,
    }),
  }),
  orbit_with_push_in: definePreset({
    id: 'orbit_with_push_in',
    name: 'Orbit With Push-In',
    category: 'orbit',
    purpose: 'Signature prestige move: simultaneous 2.5D orbit arc and forward dolly push-in.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'sports_car',
    defaultEffects: { focusEmphasis: 0.55, subtleVignette: 0.45 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y + 0.1, ctx.target.y + 0.04, ctx.eased),
      viewHeight: lerp(2.85, Math.max(1.25, ctx.target.viewHeight * 0.78), ctx.eased),
      orbitYaw: lerp(-0.26, 0.22, ctx.eased) * ctx.intensity,
      orbitPitch: lerp(0.08, 0.01, ctx.eased) * ctx.intensity,
      lookAtZ: lerp(0, ctx.target.z * 0.72, ctx.eased),
    }),
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // E. DYNAMIC CINEMATIC PRESETS (16)
  // ═══════════════════════════════════════════════════════════════════════════
  whip_pan: definePreset({
    id: 'whip_pan',
    name: 'Whip Pan',
    category: 'dynamic',
    purpose: 'Lightning-fast horizontal whip snap from Heroine to target with stylized smear streaks.',
    defaultDuration: 1.35,
    defaultEasing: 'whipSnap',
    recommendedTarget: 'sports_car',
    defaultEffects: { whipPanBlur: 0.95, cameraSettle: 0.85, motionOvershoot: 0.45 },
    evaluate: (ctx) => {
      const e = resolveEasing('whipSnap')(ctx.p);
      return {
        x: lerp(ctx.character.x, ctx.target.x, e),
        y: lerp(ctx.character.y + 0.12, ctx.target.y + 0.04, e),
        viewHeight: lerp(2.25, Math.max(1.58, ctx.target.viewHeight * 0.94), e),
        roll: Math.sin(ctx.p * Math.PI) * -0.045 * ctx.intensity,
        orbitYaw: lerp(-0.08, 0.12, e) * ctx.intensity,
        lookAtZ: lerp(0, ctx.target.z * 0.6, e),
        directionX: ctx.target.x >= ctx.character.x ? 1 : -1,
      };
    },
  }),
  whip_zoom: definePreset({
    id: 'whip_zoom',
    name: 'Whip Zoom',
    category: 'dynamic',
    purpose: 'Explosive radial snap-zoom combining whip acceleration with crisp cartoon speed lines.',
    defaultDuration: 1.3,
    defaultEasing: 'whipSnap',
    recommendedTarget: 'smartphone',
    defaultEffects: { zoomBlur: 0.95, impactFlash: 0.55, cameraSettle: 0.8 },
    evaluate: (ctx) => {
      const e = resolveEasing('whipSnap')(ctx.p);
      return {
        x: lerp(ctx.start.x, ctx.target.x, e),
        y: lerp(ctx.start.y, ctx.target.y + 0.04, e),
        viewHeight: lerp(2.95, Math.max(0.86, ctx.target.viewHeight * 0.62), e),
        roll: Math.sin(ctx.p * Math.PI) * 0.04 * ctx.intensity,
        lookAtZ: lerp(0, ctx.target.z * 0.72, e),
      };
    },
  }),
  dolly_zoom: definePreset({
    id: 'dolly_zoom',
    name: 'Dolly Zoom (Vertigo)',
    category: 'dynamic',
    purpose: 'Authentic Hitchcock vertigo effect: modulates FOV (16°→40°) while locking subject height so background warps dramatically.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { subtleVignette: 0.62, focusEmphasis: 0.55 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x, ctx.target.x, ctx.eased),
      y: ctx.target.y + 0.14,
      // Keep foreground framing locked while sweeping perspective FOV cleanly
      viewHeight: Math.max(1.55, ctx.target.viewHeight * 0.92),
      fov: lerp(16, 16 + 24 * ctx.intensity, ctx.eased),
      orbitYaw: Math.sin(ctx.p * Math.PI) * 0.04 * ctx.intensity,
    }),
  }),
  crash_zoom: definePreset({
    id: 'crash_zoom',
    name: 'Crash Zoom',
    category: 'dynamic',
    purpose: 'Dramatic rapid crash into tight face/object close-up with impact hit shake.',
    defaultDuration: 1.4,
    defaultEasing: 'easeOutExpo',
    recommendedTarget: 'character_face',
    defaultEffects: { zoomBlur: 0.92, cameraShake: 0.85, impactFlash: 0.65 },
    evaluate: (ctx) => {
      const pFast = resolveEasing('easeOutExpo')(clamp01(ctx.p * 1.55));
      return {
        x: lerp(ctx.start.x, ctx.target.x, pFast),
        y: lerp(ctx.start.y, ctx.target.y, pFast),
        viewHeight: lerp(2.95, Math.max(0.76, ctx.target.viewHeight * 0.55), pFast),
        roll: Math.sin(ctx.p * Math.PI) * -0.032 * ctx.intensity,
      };
    },
  }),
  snap_reframe: definePreset({
    id: 'snap_reframe',
    name: 'Snap Reframe',
    category: 'dynamic',
    purpose: 'Snappy editorial beat shift switching composition quickly without a hard cut.',
    defaultDuration: 1.25,
    defaultEasing: 'whipSnap',
    recommendedTarget: 'smartphone',
    defaultEffects: { motionBlur: 0.62, cameraSettle: 0.7 },
    evaluate: (ctx) => {
      const e = resolveEasing('whipSnap')(clamp01(ctx.p * 1.65));
      return {
        x: lerp(ctx.start.x - 0.55, ctx.target.x + 0.12, e),
        y: lerp(ctx.start.y + 0.16, ctx.target.y + 0.04, e),
        viewHeight: lerp(2.55, Math.max(1.38, ctx.target.viewHeight * 0.88), e),
      };
    },
  }),
  fast_reveal: definePreset({
    id: 'fast_reveal',
    name: 'Fast Reveal',
    category: 'dynamic',
    purpose: 'Rapid punchy pullback & lateral unveil highlighting big story payoff.',
    defaultDuration: 1.7,
    defaultEasing: 'easeOutExpo',
    recommendedTarget: 'private_jet',
    defaultEffects: { directionalBlur: 0.6, impactFlash: 0.35, subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: lerp(ctx.character.x, ctx.target.x - 0.15, ctx.eased),
      y: lerp(ctx.character.y + 0.1, ctx.target.y + 0.16, ctx.eased),
      viewHeight: lerp(1.55, Math.min(3.2, ctx.target.viewHeight * 1.15), ctx.eased),
      orbitYaw: lerp(-0.18, 0.1, ctx.eased) * ctx.intensity,
    }),
  }),
  camera_rush: definePreset({
    id: 'camera_rush',
    name: 'Camera Rush',
    category: 'dynamic',
    purpose: 'Forward kinetic rush accelerating toward subject before settling smoothly.',
    defaultDuration: 1.9,
    defaultEasing: 'easeOutExpo',
    recommendedTarget: 'sports_car',
    defaultEffects: { zoomBlur: 0.8, speedRamp: 1.0, cameraSettle: 0.75 },
    evaluate: (ctx) => ({
      x: lerp(ctx.start.x - 0.4, ctx.target.x, ctx.eased),
      y: lerp(ctx.start.y + 0.2, ctx.target.y, ctx.eased),
      viewHeight: lerp(3.35, Math.max(1.28, ctx.target.viewHeight * 0.82), ctx.eased),
      dollyZ: lerp(0.8, -0.5 * ctx.intensity, ctx.eased),
      lookAtZ: lerp(0, ctx.target.z * 0.65, ctx.eased),
    }),
  }),
  dramatic_pullback: definePreset({
    id: 'dramatic_pullback',
    name: 'Dramatic Pullback',
    category: 'dynamic',
    purpose: 'Emotional slow-to-fast retreat revealing scale and isolation or triumph.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'character',
    defaultEffects: { subtleVignette: 0.55, cinematicFraming: 1 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x, 0.24, ctx.eased),
      y: lerp(ctx.target.y + 0.22, 0.36, ctx.eased),
      viewHeight: lerp(1.18, 3.55, ctx.eased),
      orbitPitch: lerp(-0.02, 0.08 * ctx.intensity, ctx.eased),
    }),
  }),
  push_through_reveal: definePreset({
    id: 'push_through_reveal',
    name: 'Push-Through Reveal',
    category: 'dynamic',
    purpose: 'Pushes cleanly past foreground depth plants into open midground showcase stage.',
    defaultDuration: 3.2,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'mansion',
    defaultEffects: { depthOfField: 0.55, subtleVignette: 0.38 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 0.85 * ctx.intensity, ctx.target.x, ctx.eased),
      y: lerp(ctx.target.y - 0.12, ctx.target.y + 0.14, ctx.eased),
      viewHeight: lerp(3.3, Math.max(1.75, ctx.target.viewHeight * 0.95), ctx.eased),
      dollyZ: lerp(0.75, -0.45 * ctx.intensity, ctx.eased),
      lookAtZ: lerp(0, ctx.target.z * 0.5, ctx.eased),
    }),
  }),
  parallax_sweep: definePreset({
    id: 'parallax_sweep',
    name: 'Parallax Sweep',
    category: 'dynamic',
    purpose: 'Showcases 4-layer 2.5D separation with sweeping lateral travel and counter-orbit.',
    defaultDuration: 3.8,
    defaultEasing: 'cinematicSine',
    recommendedTarget: 'sports_car',
    defaultEffects: { subtleVignette: 0.35, smoothDrift: 0.35 },
    evaluate: (ctx) => ({
      x: lerp(-1.45 * ctx.intensity, 1.55 * ctx.intensity, ctx.eased),
      y: 0.22,
      viewHeight: 2.55,
      orbitYaw: lerp(0.24, -0.24, ctx.eased) * ctx.intensity,
      tiltX: lerp(-0.14, 0.14, ctx.eased) * ctx.intensity,
    }),
  }),
  focused_object_reveal: definePreset({
    id: 'focused_object_reveal',
    name: 'Focused Object Reveal',
    category: 'dynamic',
    purpose: 'Glides onto hero object with focus reticle and gentle three-quarter reveal.',
    defaultDuration: 2.9,
    defaultEasing: 'easeInOutQuart',
    recommendedTarget: 'sports_car',
    defaultEffects: { focusEmphasis: 0.72, depthOfField: 0.45, subtleVignette: 0.42 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 0.45 * ctx.intensity, ctx.target.x, ctx.eased),
      y: lerp(ctx.target.y + 0.2, ctx.target.y + 0.02, ctx.eased),
      viewHeight: lerp(2.35, Math.max(1.32, ctx.target.viewHeight * 0.85), ctx.eased),
      orbitYaw: lerp(-0.2, 0.12, ctx.eased) * ctx.intensity,
      lookAtZ: ctx.target.z * 0.7,
    }),
  }),
  cinematic_hero_shot: definePreset({
    id: 'cinematic_hero_shot',
    name: 'Cinematic Hero Shot',
    category: 'dynamic',
    purpose: 'Low-angle prestige push-in with subtle letterbox bars making subject feel iconic.',
    defaultDuration: 3.4,
    defaultEasing: 'easeInOutCubic',
    recommendedTarget: 'character',
    defaultEffects: { cinematicFraming: 1, subtleVignette: 0.48, smoothDrift: 0.3 },
    evaluate: (ctx) => ({
      x: lerp(ctx.target.x - 0.15, ctx.target.x + 0.08, ctx.eased),
      y: lerp(ctx.target.y - 0.08, ctx.target.y + 0.12, ctx.eased),
      viewHeight: lerp(2.45, 1.82, ctx.eased),
      orbitPitch: lerp(-0.1, -0.04, ctx.eased) * ctx.intensity,
      orbitYaw: lerp(-0.12, 0.1, ctx.eased) * ctx.intensity,
    }),
  }),
  dynamic_establishing_shot: definePreset({
    id: 'dynamic_establishing_shot',
    name: 'Dynamic Establishing Shot',
    category: 'dynamic',
    purpose: 'High-altitude swooping descent opening onto full multi-subject 2.5D stage.',
    defaultDuration: 3.8,
    defaultEasing: 'easeOutCubic',
    recommendedTarget: 'mansion',
    defaultEffects: { subtleVignette: 0.36, smoothDrift: 0.25 },
    evaluate: (ctx) => ({
      x: lerp(-0.55 * ctx.intensity, 0.22, ctx.eased),
      y: lerp(0.95 * ctx.intensity, 0.24, ctx.eased),
      viewHeight: lerp(3.75, 2.72, ctx.eased),
      orbitPitch: lerp(0.14, 0.02, ctx.eased) * ctx.intensity,
      orbitYaw: lerp(-0.12, 0.05, ctx.eased) * ctx.intensity,
    }),
  }),
  impact_camera_shake: definePreset({
    id: 'impact_camera_shake',
    name: 'Impact Camera Shake',
    category: 'dynamic',
    purpose: 'Punchy hit frame with rhythmic damped shake & flash for $1,000,000 drops.',
    defaultDuration: 1.8,
    defaultEasing: 'easeOutExpo',
    recommendedTarget: 'financial_popup',
    defaultEffects: { cameraShake: 1.25, impactFlash: 0.72, subtleVignette: 0.45 },
    evaluate: (ctx) => ({
      x: ctx.target.x,
      y: ctx.target.y,
      viewHeight: lerp(ctx.start.viewHeight * 0.96, ctx.start.viewHeight * 0.84, Math.sin(ctx.p * Math.PI)),
      roll: Math.sin(ctx.time * 38) * 0.024 * Math.exp(-ctx.p * 4.5) * ctx.intensity,
    }),
  }),
  controlled_handheld: definePreset({
    id: 'controlled_handheld',
    name: 'Controlled Handheld',
    category: 'dynamic',
    purpose: 'Organic documentary-style handheld sway keeping editorial storytelling intimate.',
    defaultDuration: 3.6,
    defaultEasing: 'cinematicSine',
    recommendedTarget: 'character',
    defaultEffects: { handheld: 1.0, subtleVignette: 0.35 },
    evaluate: (ctx) => ({
      x: ctx.target.x + deterministicWave(ctx.time * 0.9, 1) * 0.07 * ctx.intensity,
      y: ctx.target.y + 0.14 + deterministicWave(ctx.time * 0.8, 3) * 0.045 * ctx.intensity,
      viewHeight: lerp(2.02, 1.86, ctx.eased),
      roll: deterministicWave(ctx.time * 0.7, 7) * 0.018 * ctx.intensity,
    }),
  }),
  slow_cinematic_drift: definePreset({
    id: 'slow_cinematic_drift',
    name: 'Slow Cinematic Drift',
    category: 'dynamic',
    purpose: 'Weightless floating tripod drift keeping static talking beats visually alive.',
    defaultDuration: 4.4,
    defaultEasing: 'cinematicSine',
    recommendedTarget: 'character',
    defaultEffects: { smoothDrift: 1.0, subtleVignette: 0.28 },
    evaluate: (ctx) => ({
      x: ctx.target.x + Math.sin(ctx.p * Math.PI * 2) * 0.14 * ctx.intensity,
      y: ctx.target.y + 0.12 + Math.cos(ctx.p * Math.PI * 2) * 0.05 * ctx.intensity,
      viewHeight: lerp(2.28, 2.12, Math.sin(ctx.p * Math.PI)),
      tiltX: Math.sin(ctx.p * Math.PI * 2) * 0.07 * ctx.intensity,
      orbitYaw: Math.sin(ctx.p * Math.PI * 2) * 0.07 * ctx.intensity,
    }),
  }),
};

export const CAMERA_PRESET_LIST = Object.values(CAMERA_PRESETS);

/**
 * Clamp and sanitize any camera state so it stays strictly finite and within safe 2.5D visual bounds.
 */
export function sanitizeCameraState(raw = {}) {
  const num = (v, fb = 0) => (Number.isFinite(v) ? v : fb);
  return {
    x: Math.max(-5.5, Math.min(5.5, num(raw.x, DEFAULT_BASE_FRAME.x))),
    y: Math.max(-1.6, Math.min(3.5, num(raw.y, DEFAULT_BASE_FRAME.y))),
    viewHeight: Math.max(0.55, Math.min(4.6, num(raw.viewHeight, DEFAULT_BASE_FRAME.viewHeight))),
    fov: Math.max(15, Math.min(44, num(raw.fov, 24))),
    orbitYaw: Math.max(-0.4, Math.min(0.4, num(raw.orbitYaw, 0))),
    orbitPitch: Math.max(-0.2, Math.min(0.2, num(raw.orbitPitch, 0))),
    dollyZ: Math.max(-1.4, Math.min(1.8, num(raw.dollyZ, 0))),
    lookAtZ: Math.max(-4.2, Math.min(1.5, num(raw.lookAtZ, 0))),
    tiltX: Math.max(-0.35, Math.min(0.35, num(raw.tiltX, 0))),
    tiltY: Math.max(-0.25, Math.min(0.25, num(raw.tiltY, 0.04))),
    roll: Math.max(-0.2, Math.min(0.2, num(raw.roll, 0))),
    shakeX: Math.max(-0.25, Math.min(0.25, num(raw.shakeX, 0))),
    shakeY: Math.max(-0.25, Math.min(0.25, num(raw.shakeY, 0))),
  };
}

/**
 * Deterministically evaluate any of the 66 cinematic camera presets at timestamp `time` / `progress`.
 * @param {string} presetId
 * @param {{ time?: number, duration?: number | null, progress?: number | null, intensity?: number, easing?: string | Function | null, startFrame?: any, targetFrame?: any, characterFrame?: any, compositionId?: string | null, effects?: Record<string, any> | null }} [options]
 */
export function evaluateCameraPreset(presetId, {
  time = 0,
  duration = null,
  progress = null,
  intensity = 1.0,
  easing = null,
  startFrame = null,
  targetFrame = null,
  characterFrame = null,
  compositionId = null,
  effects = null,
} = {}) {
  const preset = CAMERA_PRESETS[presetId] || CAMERA_PRESETS.cinematic_push_in;
  const dur = Math.max(0.25, Number(duration) || preset.defaultDuration || 3.0);
  const t = Math.max(0, Number(time) || 0);
  const p = progress !== null && Number.isFinite(progress) ? clamp01(progress) : clamp01(t / dur);

  const easeFn = resolveEasing(easing || preset.defaultEasing);
  const activeEffects = { ...(preset.defaultEffects || {}), ...(effects || {}) };
  // Optional speedRamp curves mid-progress acceleration cleanly
  const rampedP = activeEffects.speedRamp
    ? clamp01(p < 0.45 ? Math.pow(p / 0.45, 1.8) * 0.65 : 0.65 + ((p - 0.45) / 0.55) * 0.35)
    : p;
  const eased = easeFn(rampedP);

  const comp = compositionId ? CAMERA_COMPOSITIONS[compositionId] : null;
  const base = { ...DEFAULT_BASE_FRAME, ...(startFrame || {}) };
  const target = {
    x: targetFrame?.x ?? base.x,
    y: targetFrame?.y ?? base.y,
    z: targetFrame?.z ?? 0,
    viewHeight: targetFrame?.viewHeight ?? (comp?.viewHeight || 2.1),
    tiltX: targetFrame?.tiltX ?? (comp?.tiltX || 0),
    tiltY: targetFrame?.tiltY ?? (comp?.tiltY || 0.03),
  };
  if (comp && !targetFrame?.skipCompositionOffset) {
    target.x += comp.offsetX * 0.35;
    target.y += comp.offsetY * 0.25;
  }

  const character = {
    x: characterFrame?.x ?? -0.98,
    y: characterFrame?.y ?? 0.08,
    z: characterFrame?.z ?? 0,
    viewHeight: characterFrame?.viewHeight ?? 2.15,
  };

  const amp = Math.max(0.15, Math.min(2.0, Number(intensity) || preset.defaultIntensity || 1.0));
  const raw = preset.evaluate({
    p: rampedP,
    eased,
    time: t,
    duration: dur,
    intensity: amp,
    start: base,
    base,
    target,
    character,
  });

  // Approximate deterministic normalized velocity for motion/whip/zoom blur effects
  const eps = 0.02;
  const pNext = clamp01(rampedP + eps);
  const eNext = easeFn(pNext);
  const velocity = Math.abs(eNext - eased) / eps / 2.2;

  const moveFx = evaluateCameraMovementEffects(activeEffects, { time: t, progress: p, intensity: amp });
  const visualFx = evaluateCameraVisualEffects(activeEffects, {
    progress: p,
    velocity,
    directionX: raw.directionX ?? (target.x >= base.x ? 1 : -1),
    intensity: amp,
  });

  const camera = sanitizeCameraState({
    ...base,
    ...raw,
    viewHeight: (raw.viewHeight ?? base.viewHeight) + moveFx.viewHeightDelta,
    tiltX: (raw.tiltX ?? base.tiltX) + moveFx.tiltXDelta,
    tiltY: (raw.tiltY ?? base.tiltY) + moveFx.tiltYDelta,
    roll: (raw.roll ?? base.roll) + moveFx.rollDelta,
    shakeX: (raw.shakeX ?? 0) + moveFx.shakeX,
    shakeY: (raw.shakeY ?? 0) + moveFx.shakeY,
  });

  return {
    presetId: preset.id,
    presetName: preset.name,
    category: preset.category,
    time: t,
    duration: dur,
    progress: p,
    camera,
    effects: visualFx,
  };
}
