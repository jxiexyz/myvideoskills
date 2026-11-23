/**
 * Camera Composition Library (22 Presets), Camera Effects Library (16 Effects),
 * Cinematic Easing Curves, and Stylized 2D Canvas Camera Visual FX Overlay.
 *
 * Strictly deterministic: zero Math.random(), zero Date.now(), zero accumulated drift.
 */

export const clamp01 = (v) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Deterministic pseudo-noise from continuous time (smooth, organic, zero randomness). */
export function deterministicWave(t, seed = 1) {
  return (
    Math.sin(t * 1.7 + seed * 3.1) * 0.52 +
    Math.sin(t * 3.9 + seed * 7.3) * 0.31 +
    Math.cos(t * 7.1 + seed * 11.7) * 0.17
  );
}

export const CAMERA_EASINGS = {
  linear: (t) => clamp01(t),
  easeOutCubic: (t) => {
    const p = clamp01(t);
    return 1 - Math.pow(1 - p, 3);
  },
  easeInOutCubic: (t) => {
    const p = clamp01(t);
    return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  },
  easeInOutQuart: (t) => {
    const p = clamp01(t);
    return p < 0.5 ? 8 * p * p * p * p : 1 - Math.pow(-2 * p + 2, 4) / 2;
  },
  easeOutExpo: (t) => {
    const p = clamp01(t);
    return p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
  },
  easeInOutExpo: (t) => {
    const p = clamp01(t);
    if (p === 0 || p === 1) return p;
    return p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2;
  },
  easeOutBack: (t) => {
    const p = clamp01(t);
    const c1 = 1.65;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  },
  easeOutElastic: (t) => {
    const p = clamp01(t);
    if (p === 0 || p === 1) return p;
    return Math.pow(2, -9 * p) * Math.sin((p * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  cinematicSine: (t) => {
    const p = clamp01(t);
    return -(Math.cos(Math.PI * p) - 1) / 2;
  },
  whipSnap: (t) => {
    const p = clamp01(t);
    // Ultra-fast mid-curve acceleration with crisp deceleration settle
    return p < 0.5 ? 16 * Math.pow(p, 5) : 1 - Math.pow(-2 * p + 2, 5) / 2;
  },
};

export const CAMERA_EASING_LIST = [
  { id: 'easeInOutCubic', label: 'Cinematic Ease' },
  { id: 'easeOutCubic', label: 'Smooth Decel' },
  { id: 'easeInOutQuart', label: 'Dramatic Curve' },
  { id: 'easeOutExpo', label: 'Fast Punch' },
  { id: 'whipSnap', label: 'Whip Snap' },
  { id: 'easeOutBack', label: 'Overshoot Back' },
  { id: 'easeOutElastic', label: 'Elastic Settle' },
  { id: 'cinematicSine', label: 'Gentle Drift' },
  { id: 'linear', label: 'Linear Track' },
];

export function resolveEasing(easingId = 'easeInOutCubic') {
  if (typeof easingId === 'function') return easingId;
  return CAMERA_EASINGS[easingId] || CAMERA_EASINGS.easeInOutCubic;
}

// ═════════════════════════════════════════════════════════════════════════════
// 22 CAMERA COMPOSITION PRESETS (Character [8] + Object [6] + Storytelling [8])
// ═════════════════════════════════════════════════════════════════════════════

export const CAMERA_COMPOSITION_CATEGORIES = [
  { id: 'character', label: 'Character Framing', count: 8 },
  { id: 'object', label: 'Object Framing', count: 6 },
  { id: 'storytelling', label: 'Storytelling Composition', count: 8 },
];

export const CAMERA_COMPOSITIONS = {
  // ── A. Character Framing (8) ──────────────────────────────────────────────
  extreme_wide: {
    id: 'extreme_wide',
    name: 'Extreme Wide Shot',
    category: 'character',
    description: 'Expansive architectural framing showing character inside full 2.5D estate & sky.',
    viewHeight: 3.45,
    offsetX: 0.35,
    offsetY: 0.28,
    tiltX: 0.04,
    tiltY: 0.08,
    orbitYaw: 0,
    safeZone916: { topClearance: 0.22, bottomCaption: 0.16 },
  },
  wide: {
    id: 'wide',
    name: 'Wide Shot',
    category: 'character',
    description: 'Full environment establishing frame with generous prop & popup space.',
    viewHeight: 2.95,
    offsetX: 0.18,
    offsetY: 0.18,
    tiltX: 0.03,
    tiltY: 0.05,
    orbitYaw: 0,
    safeZone916: { topClearance: 0.2, bottomCaption: 0.16 },
  },
  full_body: {
    id: 'full_body',
    name: 'Full Body Shot',
    category: 'character',
    description: 'Head-to-toe character framing grounded cleanly on floor plane.',
    viewHeight: 2.35,
    offsetX: 0.0,
    offsetY: 0.04,
    tiltX: 0,
    tiltY: 0.03,
    orbitYaw: 0,
    safeZone916: { topClearance: 0.18, bottomCaption: 0.14 },
  },
  medium_full: {
    id: 'medium_full',
    name: 'Medium Full Shot',
    category: 'character',
    description: 'Knees-up editorial framing balancing posture gestures and environment.',
    viewHeight: 1.92,
    offsetX: 0.0,
    offsetY: 0.16,
    tiltX: 0.02,
    tiltY: 0.02,
    orbitYaw: 0,
    safeZone916: { topClearance: 0.18, bottomCaption: 0.15 },
  },
  medium: {
    id: 'medium',
    name: 'Medium Shot',
    category: 'character',
    description: 'Waist-up narration framing ideal for hand gestures and titles.',
    viewHeight: 1.56,
    offsetX: 0.0,
    offsetY: 0.28,
    tiltX: 0.02,
    tiltY: 0.01,
    orbitYaw: 0,
    safeZone916: { topClearance: 0.18, bottomCaption: 0.15 },
  },
  medium_closeup: {
    id: 'medium_closeup',
    name: 'Medium Close-Up',
    category: 'character',
    description: 'Chest-up expressive framing highlighting reactions and dialogue.',
    viewHeight: 1.26,
    offsetX: 0.0,
    offsetY: 0.39,
    tiltX: 0.01,
    tiltY: 0.01,
    orbitYaw: 0,
    safeZone916: { topClearance: 0.15, bottomCaption: 0.15 },
  },
  closeup: {
    id: 'closeup',
    name: 'Close-Up',
    category: 'character',
    description: 'Intimate facial reaction framing keeping eyes on upper-third line.',
    viewHeight: 0.96,
    offsetX: 0.0,
    offsetY: 0.48,
    tiltX: 0,
    tiltY: 0,
    orbitYaw: 0,
    safeZone916: { topClearance: 0.14, bottomCaption: 0.15 },
  },
  extreme_closeup: {
    id: 'extreme_closeup',
    name: 'Extreme Close-Up',
    category: 'character',
    description: 'High-tension eye/expression detail beat for dramatic realization.',
    viewHeight: 0.68,
    offsetX: 0.0,
    offsetY: 0.53,
    tiltX: 0,
    tiltY: 0,
    orbitYaw: 0,
    safeZone916: { topClearance: 0.12, bottomCaption: 0.14 },
  },

  // ── B. Object Framing (6) ─────────────────────────────────────────────────
  object_hero: {
    id: 'object_hero',
    name: 'Object Hero Shot',
    category: 'object',
    description: 'Heroic centerpiece framing for sports cars, jets, smartphones, or mansions.',
    viewHeight: 1.85,
    offsetX: 0.0,
    offsetY: 0.05,
    tiltX: 0.08,
    tiltY: 0.04,
    orbitYaw: 0.08,
    safeZone916: { topClearance: 0.2, bottomCaption: 0.16 },
  },
  object_detail: {
    id: 'object_detail',
    name: 'Object Detail Shot',
    category: 'object',
    description: 'Tight inspection shot ideal for smartphone Dynamic Island or car badges.',
    viewHeight: 0.92,
    offsetX: 0.0,
    offsetY: 0.02,
    tiltX: 0.04,
    tiltY: 0.02,
    orbitYaw: 0.05,
    safeZone916: { topClearance: 0.16, bottomCaption: 0.14 },
  },
  product_showcase: {
    id: 'product_showcase',
    name: 'Product Showcase Shot',
    category: 'object',
    description: 'Commercial-grade clean product frame with subtle three-quarter polish.',
    viewHeight: 1.48,
    offsetX: 0.04,
    offsetY: 0.06,
    tiltX: 0.12,
    tiltY: 0.05,
    orbitYaw: 0.14,
    safeZone916: { topClearance: 0.22, bottomCaption: 0.16 },
  },
  overhead_object: {
    id: 'overhead_object',
    name: 'Overhead Object Shot',
    category: 'object',
    description: 'Elevated high-angle showcase angle looking slightly down onto target.',
    viewHeight: 1.95,
    offsetX: 0.0,
    offsetY: 0.12,
    tiltX: 0.0,
    tiltY: 0.22,
    orbitYaw: 0.0,
    orbitPitch: 0.16,
    safeZone916: { topClearance: 0.18, bottomCaption: 0.16 },
  },
  three_quarter_object: {
    id: 'three_quarter_object',
    name: 'Three-Quarter Object Shot',
    category: 'object',
    description: 'Classic 3/4 automotive & aviation perspective angle revealing silhouette.',
    viewHeight: 1.78,
    offsetX: -0.08,
    offsetY: 0.06,
    tiltX: -0.14,
    tiltY: 0.06,
    orbitYaw: -0.2,
    safeZone916: { topClearance: 0.2, bottomCaption: 0.16 },
  },
  wide_object_reveal: {
    id: 'wide_object_reveal',
    name: 'Wide Object Reveal Shot',
    category: 'object',
    description: 'Generous establishing framing highlighting scale of jet or mansion.',
    viewHeight: 2.88,
    offsetX: 0.12,
    offsetY: 0.22,
    tiltX: 0.08,
    tiltY: 0.08,
    orbitYaw: 0.06,
    safeZone916: { topClearance: 0.22, bottomCaption: 0.16 },
  },

  // ── C. Storytelling Composition (8) ───────────────────────────────────────
  rule_of_thirds: {
    id: 'rule_of_thirds',
    name: 'Rule of Thirds Framing',
    category: 'storytelling',
    description: 'Places subject along vertical third line, opening breathable editorial space.',
    viewHeight: 2.38,
    offsetX: 0.36,
    offsetY: 0.12,
    tiltX: 0.05,
    tiltY: 0.04,
    orbitYaw: 0.04,
    safeZone916: { topClearance: 0.2, bottomCaption: 0.16 },
  },
  centered_hero: {
    id: 'centered_hero',
    name: 'Centered Hero Framing',
    category: 'storytelling',
    description: 'Symmetrical focal anchor for authority statements and financial reveals.',
    viewHeight: 2.28,
    offsetX: 0.0,
    offsetY: 0.1,
    tiltX: 0.0,
    tiltY: 0.03,
    orbitYaw: 0.0,
    safeZone916: { topClearance: 0.22, bottomCaption: 0.16 },
  },
  left_subject: {
    id: 'left_subject',
    name: 'Left Subject Composition',
    category: 'storytelling',
    description: 'Anchors subject left-of-center to leave right frame clear for popups/props.',
    viewHeight: 2.48,
    offsetX: 0.48,
    offsetY: 0.14,
    tiltX: 0.07,
    tiltY: 0.04,
    orbitYaw: 0.05,
    safeZone916: { topClearance: 0.2, bottomCaption: 0.16 },
  },
  right_subject: {
    id: 'right_subject',
    name: 'Right Subject Composition',
    category: 'storytelling',
    description: 'Anchors subject right-of-center to balance left callouts or charts.',
    viewHeight: 2.48,
    offsetX: -0.48,
    offsetY: 0.14,
    tiltX: -0.07,
    tiltY: 0.04,
    orbitYaw: -0.05,
    safeZone916: { topClearance: 0.2, bottomCaption: 0.16 },
  },
  character_object_split: {
    id: 'character_object_split',
    name: 'Character + Object Split',
    category: 'storytelling',
    description: 'Balanced two-subject stage framing both Heroine and hero prop cleanly.',
    viewHeight: 2.68,
    offsetX: 0.52,
    offsetY: 0.16,
    tiltX: 0.08,
    tiltY: 0.04,
    orbitYaw: 0.05,
    safeZone916: { topClearance: 0.22, bottomCaption: 0.16 },
  },
  foreground_framing: {
    id: 'foreground_framing',
    name: 'Foreground Framing',
    category: 'storytelling',
    description: 'Leans slightly wider to include foreground foliage depth edges.',
    viewHeight: 2.82,
    offsetX: 0.16,
    offsetY: 0.12,
    tiltX: 0.11,
    tiltY: 0.05,
    orbitYaw: 0.08,
    safeZone916: { topClearance: 0.2, bottomCaption: 0.16 },
  },
  negative_space: {
    id: 'negative_space',
    name: 'Negative Space Framing',
    category: 'storytelling',
    description: 'Shifts subject low-left to reserve clean sky canvas for kinetic typography.',
    viewHeight: 2.65,
    offsetX: 0.56,
    offsetY: 0.34,
    tiltX: 0.05,
    tiltY: 0.06,
    orbitYaw: 0.04,
    safeZone916: { topClearance: 0.3, bottomCaption: 0.15 },
  },
  over_the_shoulder: {
    id: 'over_the_shoulder',
    name: 'Over-the-Shoulder Framing',
    category: 'storytelling',
    description: 'Intimate angled perspective looking past Heroine toward smartphone or prop.',
    viewHeight: 1.72,
    offsetX: 0.52,
    offsetY: 0.18,
    tiltX: 0.16,
    tiltY: 0.03,
    orbitYaw: 0.18,
    safeZone916: { topClearance: 0.18, bottomCaption: 0.15 },
  },
};

export const CAMERA_COMPOSITION_LIST = Object.values(CAMERA_COMPOSITIONS);

// ═════════════════════════════════════════════════════════════════════════════
// 16 CAMERA EFFECTS LIBRARY (9 Movement Effects + 7 Visual Effects)
// ═════════════════════════════════════════════════════════════════════════════

export const CAMERA_EFFECT_DEFINITIONS = {
  // ── Movement Effects (9) ──────────────────────────────────────────────────
  motionBlur: { id: 'motionBlur', name: 'Motion Blur', group: 'movement', description: 'Velocity-reactive directional cartoon motion streaks.' },
  whipPanBlur: { id: 'whipPanBlur', name: 'Whip Pan Blur', group: 'movement', description: 'High-speed horizontal smear lines during whip pans.' },
  cameraShake: { id: 'cameraShake', name: 'Camera Shake', group: 'movement', description: 'Damped rhythmic impact shake for punchy reveals.' },
  microShake: { id: 'microShake', name: 'Micro Shake', group: 'movement', description: 'Tight subtle vibration on emphasis beats.' },
  smoothDrift: { id: 'smoothDrift', name: 'Smooth Drift', group: 'movement', description: 'Gentle floating tripod breathing motion.' },
  handheld: { id: 'handheld', name: 'Handheld Motion', group: 'movement', description: 'Controlled documentary organic sway.' },
  speedRamp: { id: 'speedRamp', name: 'Speed Ramp', group: 'movement', description: 'Non-linear acceleration burst into smooth slow settle.' },
  motionOvershoot: { id: 'motionOvershoot', name: 'Motion Overshoot', group: 'movement', description: 'Cartoon-crisp slight overshoot before locking on target.' },
  cameraSettle: { id: 'cameraSettle', name: 'Camera Settle', group: 'movement', description: 'Soft spring landing cushion at end of movement.' },

  // ── Visual Effects (7) ────────────────────────────────────────────────────
  subtleVignette: { id: 'subtleVignette', name: 'Subtle Vignette', group: 'visual', description: 'Warm editorial edge darkening to anchor subject focus.' },
  focusEmphasis: { id: 'focusEmphasis', name: 'Focus Emphasis', group: 'visual', description: 'Subtle stylized spotlight framing around focal subject.' },
  depthOfField: { id: 'depthOfField', name: 'Depth of Field', group: 'visual', description: 'Soft foreground/edge atmospheric focus veil.' },
  zoomBlur: { id: 'zoomBlur', name: 'Zoom Blur', group: 'visual', description: 'Radial kinetic speed-lines during punch or crash zooms.' },
  directionalBlur: { id: 'directionalBlur', name: 'Directional Blur', group: 'visual', description: 'Angled stylized speed streaks synced to camera motion.' },
  impactFlash: { id: 'impactFlash', name: 'Impact Flash', group: 'visual', description: 'Brief crisp golden-white editorial flash on hit frames.' },
  cinematicFraming: { id: 'cinematicFraming', name: 'Cinematic Framing', group: 'visual', description: 'Clean cinema letterbox bars & framing reticle.' },
};

export const CAMERA_EFFECT_LIST = Object.values(CAMERA_EFFECT_DEFINITIONS);

/**
 * Evaluate deterministic movement offsets from active camera effects at timestamp `time` and progress `p`.
 */
export function evaluateCameraMovementEffects(activeEffects = {}, { time = 0, progress = 0, intensity = 1 } = {}) {
  const amp = Math.max(0, Math.min(2, Number(intensity) || 1));
  let shakeX = 0;
  let shakeY = 0;
  let rollDelta = 0;
  let tiltXDelta = 0;
  let tiltYDelta = 0;
  let viewHeightDelta = 0;

  if (activeEffects.cameraShake) {
    const w = typeof activeEffects.cameraShake === 'number' ? activeEffects.cameraShake : 1;
    const pulse = Math.exp(-Math.abs(progress - 0.35) * 7.5);
    shakeX += Math.sin(time * 46) * 0.042 * amp * w * Math.max(0.25, pulse);
    shakeY += Math.cos(time * 39) * 0.028 * amp * w * Math.max(0.25, pulse);
    rollDelta += Math.sin(time * 32) * 0.012 * amp * w * Math.max(0.25, pulse);
  }

  if (activeEffects.microShake) {
    const w = typeof activeEffects.microShake === 'number' ? activeEffects.microShake : 1;
    shakeX += Math.sin(time * 58) * 0.013 * amp * w;
    shakeY += Math.cos(time * 51) * 0.01 * amp * w;
  }

  if (activeEffects.smoothDrift) {
    const w = typeof activeEffects.smoothDrift === 'number' ? activeEffects.smoothDrift : 1;
    tiltXDelta += Math.sin(time * 0.95) * 0.035 * amp * w;
    tiltYDelta += Math.cos(time * 0.72) * 0.018 * amp * w;
  }

  if (activeEffects.handheld) {
    const w = typeof activeEffects.handheld === 'number' ? activeEffects.handheld : 1;
    shakeX += deterministicWave(time * 1.15, 2) * 0.026 * amp * w;
    shakeY += deterministicWave(time * 1.05, 5) * 0.02 * amp * w;
    rollDelta += deterministicWave(time * 0.8, 9) * 0.014 * amp * w;
  }

  if (activeEffects.motionOvershoot) {
    const w = typeof activeEffects.motionOvershoot === 'number' ? activeEffects.motionOvershoot : 1;
    const bump = Math.sin(clamp01(progress) * Math.PI) * Math.sin(clamp01(progress) * Math.PI * 2.1);
    viewHeightDelta += -0.055 * bump * amp * w;
  }

  if (activeEffects.cameraSettle) {
    const w = typeof activeEffects.cameraSettle === 'number' ? activeEffects.cameraSettle : 1;
    if (progress > 0.72) {
      const sp = (progress - 0.72) / 0.28;
      const damp = Math.exp(-sp * 5.2) * Math.sin(sp * Math.PI * 2.5);
      shakeY += damp * 0.016 * amp * w;
    }
  }

  return { shakeX, shakeY, rollDelta, tiltXDelta, tiltYDelta, viewHeightDelta };
}

/**
 * Evaluate stylized visual FX parameters (0..1 intensities) from active effects & motion velocity.
 */
export function evaluateCameraVisualEffects(activeEffects = {}, { progress = 0, velocity = 0, directionX = 1, intensity = 1 } = {}) {
  const amp = Math.max(0, Math.min(2, Number(intensity) || 1));
  const speed = clamp01(velocity * 1.35 * amp);
  const bell = Math.sin(clamp01(progress) * Math.PI);

  return {
    motionBlur: activeEffects.motionBlur ? clamp01(speed * (typeof activeEffects.motionBlur === 'number' ? activeEffects.motionBlur : 0.85)) : 0,
    whipPanBlur: activeEffects.whipPanBlur ? clamp01(Math.max(speed, bell * 0.9) * (typeof activeEffects.whipPanBlur === 'number' ? activeEffects.whipPanBlur : 1)) : 0,
    subtleVignette: activeEffects.subtleVignette ? clamp01(typeof activeEffects.subtleVignette === 'number' ? activeEffects.subtleVignette : 0.55) : 0,
    focusEmphasis: activeEffects.focusEmphasis ? clamp01(typeof activeEffects.focusEmphasis === 'number' ? activeEffects.focusEmphasis : 0.65) : 0,
    depthOfField: activeEffects.depthOfField ? clamp01(typeof activeEffects.depthOfField === 'number' ? activeEffects.depthOfField : 0.55) : 0,
    zoomBlur: activeEffects.zoomBlur ? clamp01(Math.max(speed, bell * 0.85) * (typeof activeEffects.zoomBlur === 'number' ? activeEffects.zoomBlur : 0.85)) : 0,
    directionalBlur: activeEffects.directionalBlur ? clamp01(Math.max(speed, bell * 0.75) * (typeof activeEffects.directionalBlur === 'number' ? activeEffects.directionalBlur : 0.8)) : 0,
    impactFlash: activeEffects.impactFlash
      ? clamp01(Math.exp(-Math.abs(progress - 0.22) * 14) * (typeof activeEffects.impactFlash === 'number' ? activeEffects.impactFlash : 0.75))
      : 0,
    cinematicFraming: activeEffects.cinematicFraming ? 1 : 0,
    directionX: directionX >= 0 ? 1 : -1,
    progress: clamp01(progress),
  };
}

/**
 * Render stylized cartoon-compatible cinematic camera visual effects + optional 9:16 vertical safe-frame guides
 * onto the 2D overlay canvas (cleanly layered above WebGL with zero CSS backdrop-filter overhead).
 */
export function renderCameraVisualEffects(ctx, W, H, fx = null, { showSafeFrame916 = false } = {}) {
  if (!ctx) return;

  if (fx) {
    // 1. Subtle Vignette & Focus Emphasis
    const vig = Math.max(fx.subtleVignette || 0, (fx.focusEmphasis || 0) * 0.65);
    if (vig > 0.01) {
      ctx.save();
      const cx = W * 0.5;
      const cy = H * 0.48;
      const rInner = Math.min(W, H) * (fx.focusEmphasis ? 0.28 : 0.38);
      const rOuter = Math.hypot(W, H) * 0.58;
      const grad = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
      grad.addColorStop(0, 'rgba(10, 14, 22, 0)');
      grad.addColorStop(0.68, `rgba(10, 14, 22, ${(0.12 * vig).toFixed(3)})`);
      grad.addColorStop(1, `rgba(8, 10, 16, ${(0.48 * vig).toFixed(3)})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // 2. Stylized Depth-of-Field Soft Edge Haze
    if ((fx.depthOfField || 0) > 0.01) {
      const d = fx.depthOfField;
      ctx.save();
      const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.16);
      topGrad.addColorStop(0, `rgba(248, 244, 236, ${(0.16 * d).toFixed(3)})`);
      topGrad.addColorStop(1, 'rgba(248, 244, 236, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, H * 0.16);

      const botGrad = ctx.createLinearGradient(0, H, 0, H * 0.84);
      botGrad.addColorStop(0, `rgba(14, 18, 28, ${(0.22 * d).toFixed(3)})`);
      botGrad.addColorStop(1, 'rgba(14, 18, 28, 0)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, H * 0.84, W, H * 0.16);
      ctx.restore();
    }

    // 3. Whip Pan / Directional / Motion Blur Cartoon Streaks
    const dirBlur = Math.max(fx.whipPanBlur || 0, fx.directionalBlur || 0, (fx.motionBlur || 0) * 0.75);
    if (dirBlur > 0.04) {
      ctx.save();
      const dir = fx.directionX || 1;
      const count = fx.whipPanBlur > 0.2 ? 20 : 12;
      ctx.lineCap = 'round';
      for (let i = 0; i < count; i++) {
        const y = ((i + 0.5) / count) * H;
        const phase = ((i * 0.37 + fx.progress * 2.4) % 1);
        const len = W * (0.14 + 0.26 * dirBlur) * (0.65 + 0.35 * Math.sin(i * 2.1));
        const x0 = dir > 0 ? phase * W * 1.15 - len : W - phase * W * 1.15;
        ctx.strokeStyle = i % 3 === 0
          ? `rgba(242, 184, 75, ${(0.28 * dirBlur).toFixed(3)})`
          : `rgba(255, 252, 245, ${(0.26 * dirBlur).toFixed(3)})`;
        ctx.lineWidth = 2.5 + (i % 3) * 1.8;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x0 + len * dir, y + (fx.directionalBlur ? -10 * dir : 0));
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Radial Zoom Blur Cartoon Speed Lines
    if ((fx.zoomBlur || 0) > 0.04) {
      const zb = fx.zoomBlur;
      ctx.save();
      const cx = W * 0.5;
      const cy = H * 0.48;
      const rays = 24;
      const outer = Math.hypot(W, H) * 0.62;
      const inner = Math.min(W, H) * (0.36 - 0.08 * zb);
      ctx.lineCap = 'round';
      for (let i = 0; i < rays; i++) {
        const ang = (i / rays) * Math.PI * 2 + fx.progress * 0.15;
        const rStart = inner + (i % 3) * 24;
        ctx.strokeStyle = i % 4 === 0
          ? `rgba(242, 184, 75, ${(0.34 * zb).toFixed(3)})`
          : `rgba(255, 255, 255, ${(0.24 * zb).toFixed(3)})`;
        ctx.lineWidth = 2.2 + (i % 2) * 1.6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * rStart, cy + Math.sin(ang) * rStart);
        ctx.lineTo(cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Focus Emphasis Subtle Corner Reticle
    if ((fx.focusEmphasis || 0) > 0.05) {
      const fe = fx.focusEmphasis;
      ctx.save();
      const boxW = Math.min(W * 0.56, H * 0.72);
      const boxH = H * 0.64;
      const x = (W - boxW) * 0.5;
      const y = (H - boxH) * 0.48;
      const arm = 22;
      ctx.strokeStyle = `rgba(242, 184, 75, ${(0.42 * fe).toFixed(3)})`;
      ctx.lineWidth = 2;
      const corners = [
        [x, y, 1, 1],
        [x + boxW, y, -1, 1],
        [x, y + boxH, 1, -1],
        [x + boxW, y + boxH, -1, -1],
      ];
      for (const [px, py, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(px + dx * arm, py);
        ctx.lineTo(px, py);
        ctx.lineTo(px, py + dy * arm);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 6. Crisp Impact Flash
    if ((fx.impactFlash || 0) > 0.02) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 248, 232, ${(0.38 * fx.impactFlash).toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // 7. Cinematic Letterbox Bars
    if ((fx.cinematicFraming || 0) > 0.05) {
      const barH = Math.round(H * 0.075);
      ctx.save();
      ctx.fillStyle = 'rgba(11, 15, 23, 0.92)';
      ctx.fillRect(0, 0, W, barH);
      ctx.fillRect(0, H - barH, W, barH);
      ctx.restore();
    }
  }

  // 8. Optional 9:16 Vertical Storytelling Safe-Frame Overlay (Shorts / Reels / TikTok crop guide)
  if (showSafeFrame916) {
    ctx.save();
    const frameH = H - 24;
    const frameW = Math.min(W - 32, Math.round((frameH * 9) / 16));
    const fx0 = Math.round((W - frameW) * 0.5);
    const fy0 = 12;

    // Dim outside 9:16 crop gently
    ctx.fillStyle = 'rgba(9, 12, 18, 0.42)';
    ctx.fillRect(0, 0, fx0, H);
    ctx.fillRect(fx0 + frameW, 0, W - (fx0 + frameW), H);

    // Outer 9:16 boundary
    ctx.strokeStyle = 'rgba(242, 184, 75, 0.85)';
    ctx.lineWidth = 2;
    ctx.strokeRect(fx0, fy0, frameW, frameH);

    // Rule-of-thirds + Top popup / Bottom caption safe zones inside 9:16 frame
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 1;
    // Vertical thirds
    for (const frac of [1 / 3, 2 / 3]) {
      ctx.beginPath();
      ctx.moveTo(fx0 + frameW * frac, fy0);
      ctx.lineTo(fx0 + frameW * frac, fy0 + frameH);
      ctx.stroke();
    }
    // Top popup safe zone & bottom caption safe zone
    const topSafeY = fy0 + frameH * 0.2;
    const botSafeY = fy0 + frameH * 0.84;
    ctx.strokeStyle = 'rgba(94, 234, 212, 0.65)';
    ctx.beginPath();
    ctx.moveTo(fx0, topSafeY);
    ctx.lineTo(fx0 + frameW, topSafeY);
    ctx.moveTo(fx0, botSafeY);
    ctx.lineTo(fx0 + frameW, botSafeY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Compact corner tag
    ctx.fillStyle = 'rgba(11, 15, 23, 0.85)';
    ctx.fillRect(fx0 + 8, fy0 + 8, 122, 22);
    ctx.fillStyle = '#f2b84b';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('9:16 SAFE FRAME', fx0 + 16, fy0 + 23);
    ctx.restore();
  }
}
