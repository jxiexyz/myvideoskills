/**
 * Deterministic Motion Graphics Effects & Transitions Library for PuppetKit.
 * Every evaluator is a pure function of normalized progress `p` (0..1) or absolute time `t`.
 * Zero Math.random(), zero Date.now(), zero accumulated state.
 */

export function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function easeOutCubic(t) {
  const u = clamp01(t);
  return 1 - Math.pow(1 - u, 3);
}

export function easeInCubic(t) {
  const u = clamp01(t);
  return u * u * u;
}

export function easeInOutCubic(t) {
  const u = clamp01(t);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

export function easeOutBack(t, overshoot = 1.70158) {
  const u = clamp01(t);
  const c3 = overshoot + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + overshoot * Math.pow(u - 1, 2);
}

export function easeOutElastic(t) {
  const u = clamp01(t);
  if (u === 0 || u === 1) return u;
  return Math.pow(2, -10 * u) * Math.sin((u * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
}

export function easeOutBounce(t) {
  let x = clamp01(t);
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

// ── 12 Entrance Effects ────────────────────────────────────────────────────
export const ENTRANCE_EFFECTS = [
  { id: 'smooth_fade_in', label: 'Smooth Fade In' },
  { id: 'slide_up_overshoot', label: 'Slide Up + Overshoot' },
  { id: 'slide_down_bounce', label: 'Slide Down + Bounce' },
  { id: 'slide_left_mask', label: 'Slide Left Mask Reveal' },
  { id: 'slide_right_mask', label: 'Slide Right Mask Reveal' },
  { id: 'elastic_pop_in', label: 'Elastic Pop-In' },
  { id: 'kinetic_scale_punch', label: 'Kinetic Scale Punch' },
  { id: 'staggered_reveal', label: 'Staggered Word/Char Reveal' },
  { id: 'line_draw_reveal', label: 'Line Draw Reveal' },
  { id: 'clip_path_wipe', label: 'Clip-Path Wipe' },
  { id: 'rotate_settle', label: 'Rotate & Settle' },
  { id: 'blur_to_sharp', label: 'Focus Snap Reveal' },
];

// ── 10 Impact Effects ──────────────────────────────────────────────────────
export const IMPACT_EFFECTS = [
  { id: 'none', label: 'None' },
  { id: 'micro_bounce', label: 'Micro-Bounce' },
  { id: 'pulse_emphasis', label: 'Pulse Emphasis' },
  { id: 'highlight_sweep', label: 'Highlight Sweep' },
  { id: 'underline_draw', label: 'Underline Draw' },
  { id: 'color_accent_flash', label: 'Color Accent Flash' },
  { id: 'subtle_impact_shake', label: 'Subtle Impact Shake' },
  { id: 'badge_stamp_drop', label: 'Badge Stamp Drop' },
  { id: 'radial_accent_burst', label: 'Radial Accent Burst' },
  { id: 'number_count_pop', label: 'Number Count Pop' },
];

// ── 10 Continuous Effects ──────────────────────────────────────────────────
export const CONTINUOUS_EFFECTS = [
  { id: 'none', label: 'None' },
  { id: 'gentle_float', label: 'Gentle Float' },
  { id: 'soft_breathing_scale', label: 'Soft Breathing Scale' },
  { id: 'light_shimmer_sweep', label: 'Light Shimmer Sweep' },
  { id: 'subtle_tilt_sway', label: 'Subtle Tilt Sway' },
  { id: 'animated_border_travel', label: 'Animated Border Travel' },
  { id: 'accent_dot_pulse', label: 'Accent Dot Pulse' },
  { id: 'background_pattern_drift', label: 'Background Pattern Drift' },
  { id: 'chart_line_pulse', label: 'Chart Line Pulse' },
  { id: 'notification_attention_bob', label: 'Notification Attention Bob' },
];

// ── 8 Exit Effects ─────────────────────────────────────────────────────────
export const EXIT_EFFECTS = [
  { id: 'clean_fade_out', label: 'Clean Fade Out' },
  { id: 'slide_out_ease', label: 'Slide Out + Ease' },
  { id: 'mask_collapse', label: 'Mask Collapse' },
  { id: 'scale_down_snap', label: 'Scale Down Snap' },
  { id: 'staggered_exit', label: 'Staggered Exit' },
  { id: 'swipe_away', label: 'Swipe Away' },
  { id: 'fold_collapse', label: 'Fold Collapse' },
  { id: 'blur_fade_exit', label: 'Soft Dissolve Exit' },
];

// ── 10 Graphic Transitions ─────────────────────────────────────────────────
export const GRAPHIC_TRANSITIONS = [
  { id: 'none', label: 'None' },
  { id: 'shape_wipe', label: 'Shape Wipe' },
  { id: 'directional_slide', label: 'Directional Slide' },
  { id: 'zoom_morph', label: 'Zoom Morph' },
  { id: 'panel_split_reveal', label: 'Panel Split Reveal' },
  { id: 'ink_band_sweep', label: 'Cartoon Ink Band Sweep' },
  { id: 'diagonal_ribbon_cut', label: 'Diagonal Ribbon Cut' },
  { id: 'card_flip_swap', label: 'Card Flip Swap' },
  { id: 'iris_circle_expand', label: 'Iris Circle Expand' },
  { id: 'clean_cross_morph', label: 'Clean Cross Morph' },
];

/**
 * Evaluate deterministic entrance transform state at normalized progress `p` (0..1).
 */
export function evaluateEntrance(effectId, p) {
  const u = clamp01(p);
  const state = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    clipProgress: 1,
    clipDir: 'none',
    staggerProgress: u,
    lineProgress: 1,
    focusOffset: 0,
  };

  switch (effectId) {
    case 'smooth_fade_in':
      state.opacity = easeOutCubic(u);
      state.scaleX = state.scaleY = lerp(0.96, 1, easeOutCubic(u));
      break;
    case 'slide_up_overshoot': {
      const e = easeOutBack(u, 1.55);
      state.y = lerp(64, 0, e);
      state.opacity = clamp01(u * 2.4);
      break;
    }
    case 'slide_down_bounce': {
      const e = easeOutBounce(u);
      state.y = lerp(-85, 0, e);
      state.opacity = clamp01(u * 3.0);
      break;
    }
    case 'slide_left_mask': {
      const e = easeOutCubic(u);
      state.x = lerp(52, 0, e);
      state.clipDir = 'left';
      state.clipProgress = e;
      state.opacity = clamp01(u * 2.5);
      break;
    }
    case 'slide_right_mask': {
      const e = easeOutCubic(u);
      state.x = lerp(-52, 0, e);
      state.clipDir = 'right';
      state.clipProgress = e;
      state.opacity = clamp01(u * 2.5);
      break;
    }
    case 'elastic_pop_in': {
      const e = easeOutElastic(u);
      state.scaleX = state.scaleY = Math.max(0.01, lerp(0.35, 1, e));
      state.opacity = clamp01(u * 3.5);
      break;
    }
    case 'kinetic_scale_punch': {
      const s = u < 0.65
        ? lerp(1.55, 0.94, easeOutCubic(u / 0.65))
        : lerp(0.94, 1.0, easeOutBack((u - 0.65) / 0.35, 1.3));
      state.scaleX = state.scaleY = s;
      state.opacity = clamp01(u * 3.2);
      break;
    }
    case 'staggered_reveal':
      state.staggerProgress = u;
      state.y = lerp(22, 0, easeOutCubic(u));
      state.opacity = clamp01(u * 2.2);
      break;
    case 'line_draw_reveal':
      state.lineProgress = easeOutCubic(u);
      state.opacity = clamp01(u * 2.4);
      break;
    case 'clip_path_wipe':
      state.clipDir = 'horizontal';
      state.clipProgress = easeInOutCubic(u);
      state.opacity = clamp01(u * 4.0);
      break;
    case 'rotate_settle': {
      const e = easeOutBack(u, 1.4);
      state.rotation = lerp(-0.18, 0, e);
      state.y = lerp(28, 0, e);
      state.opacity = clamp01(u * 2.4);
      break;
    }
    case 'blur_to_sharp': {
      const e = easeOutCubic(u);
      state.scaleX = state.scaleY = lerp(1.12, 1, e);
      state.focusOffset = lerp(8, 0, e);
      state.opacity = e;
      break;
    }
    default:
      state.opacity = easeOutCubic(u);
  }
  return state;
}

/**
 * Evaluate deterministic impact accent at normalized progress `p` (0..1 during impact window).
 */
export function evaluateImpact(effectId, p) {
  const u = clamp01(p);
  const res = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    sweepProgress: -1,
    underlineProgress: 0,
    flashAlpha: 0,
    burstProgress: -1,
    stampScale: 1,
    countPulse: 1,
  };

  if (effectId === 'none' || u <= 0) return res;

  switch (effectId) {
    case 'micro_bounce': {
      const wave = Math.sin(u * Math.PI * 2) * Math.exp(-u * 3.2);
      res.y = -wave * 14;
      res.scaleY = 1 + wave * 0.08;
      res.scaleX = 1 - wave * 0.04;
      break;
    }
    case 'pulse_emphasis': {
      const pulse = Math.sin(u * Math.PI);
      res.scaleX = res.scaleY = 1 + pulse * 0.1;
      break;
    }
    case 'highlight_sweep':
      res.sweepProgress = easeInOutCubic(u);
      break;
    case 'underline_draw':
      res.underlineProgress = easeOutCubic(u);
      break;
    case 'color_accent_flash':
      res.flashAlpha = Math.sin(u * Math.PI) * 0.55;
      res.scaleX = res.scaleY = 1 + Math.sin(u * Math.PI) * 0.05;
      break;
    case 'subtle_impact_shake': {
      const damp = Math.exp(-u * 4.5);
      res.x = Math.sin(u * Math.PI * 6) * 8 * damp;
      res.y = Math.cos(u * Math.PI * 5) * 4 * damp;
      break;
    }
    case 'badge_stamp_drop': {
      const s = u < 0.45 ? lerp(1.32, 0.94, easeOutCubic(u / 0.45)) : lerp(0.94, 1.0, easeOutBack((u - 0.45) / 0.55));
      res.stampScale = s;
      res.scaleX = res.scaleY = s;
      break;
    }
    case 'radial_accent_burst':
      res.burstProgress = u;
      res.scaleX = res.scaleY = 1 + Math.sin(u * Math.PI) * 0.06;
      break;
    case 'number_count_pop':
      res.countPulse = 1 + Math.sin(u * Math.PI) * 0.14;
      res.scaleX = res.scaleY = res.countPulse;
      break;
    default:
      break;
  }
  return res;
}

/**
 * Evaluate deterministic continuous alive motion at absolute time `t` (seconds).
 */
export function evaluateContinuous(effectId, t) {
  const time = Math.max(0, Number(t) || 0);
  const res = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    shimmerPos: -1,
    borderDashOffset: 0,
    dotScale: 1,
    patternDriftX: 0,
    chartPulse: 0,
  };

  switch (effectId) {
    case 'gentle_float':
      res.y = Math.sin(time * 2.1) * 5.5;
      break;
    case 'soft_breathing_scale': {
      const s = 1 + Math.sin(time * 2.4) * 0.022;
      res.scaleX = res.scaleY = s;
      break;
    }
    case 'light_shimmer_sweep':
      res.shimmerPos = ((time * 0.62) % 1.6) - 0.3;
      break;
    case 'subtle_tilt_sway':
      res.rotation = Math.sin(time * 1.8) * 0.022;
      break;
    case 'animated_border_travel':
      res.borderDashOffset = -time * 42;
      break;
    case 'accent_dot_pulse':
      res.dotScale = 1 + Math.sin(time * 4.2) * 0.25;
      break;
    case 'background_pattern_drift':
      res.patternDriftX = (time * 22) % 36;
      break;
    case 'chart_line_pulse':
      res.chartPulse = 0.5 + 0.5 * Math.sin(time * 3.5);
      break;
    case 'notification_attention_bob':
      res.y = Math.sin(time * 3.8) * 4.5;
      res.rotation = Math.sin(time * 1.9) * 0.015;
      break;
    default:
      break;
  }
  return res;
}

/**
 * Evaluate deterministic exit transform state at normalized exit progress `p` (0..1).
 */
export function evaluateExit(effectId, p) {
  const u = clamp01(p);
  const res = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    clipProgress: 1,
    clipDir: 'none',
  };
  if (u <= 0) return res;

  switch (effectId) {
    case 'clean_fade_out':
      res.opacity = 1 - easeInCubic(u);
      break;
    case 'slide_out_ease':
      res.y = lerp(0, -48, easeInCubic(u));
      res.opacity = 1 - u;
      break;
    case 'mask_collapse':
      res.clipDir = 'horizontal';
      res.clipProgress = 1 - easeInOutCubic(u);
      res.opacity = 1 - easeInCubic(u) * 0.7;
      break;
    case 'scale_down_snap': {
      const s = Math.max(0.01, lerp(1, 0.25, easeInCubic(u)));
      res.scaleX = res.scaleY = s;
      res.opacity = 1 - easeInCubic(u);
      break;
    }
    case 'staggered_exit':
      res.y = lerp(0, 32, easeInCubic(u));
      res.opacity = 1 - easeInCubic(u);
      break;
    case 'swipe_away':
      res.x = lerp(0, 120, easeInCubic(u));
      res.rotation = lerp(0, 0.08, easeInCubic(u));
      res.opacity = 1 - u;
      break;
    case 'fold_collapse':
      res.scaleY = Math.max(0.01, 1 - easeInCubic(u));
      res.opacity = 1 - u * 0.85;
      break;
    case 'blur_fade_exit':
      res.scaleX = res.scaleY = lerp(1, 1.09, easeInCubic(u));
      res.opacity = 1 - easeInCubic(u);
      break;
    default:
      res.opacity = 1 - u;
  }
  return res;
}

/**
 * Evaluate deterministic full-frame or graphic transition progress `p` (0..1).
 * Peak coverage occurs around p = 0.5 for wipe/band/iris transitions.
 */
export function evaluateTransition(transitionId, p) {
  const u = clamp01(p);
  const bell = Math.sin(u * Math.PI);
  return {
    id: transitionId || 'none',
    progress: u,
    coverage: transitionId && transitionId !== 'none' ? bell : 0,
    eased: easeInOutCubic(u),
  };
}
