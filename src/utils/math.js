export const degToRad = (degrees) => (degrees * Math.PI) / 180;
export const radToDeg = (radians) => (radians * 180) / Math.PI;
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (t) => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
export const easeInCubic = (t) => {
  const c = clamp(t, 0, 1);
  return c * c * c;
};
export const easeOutBack = (t) => {
  const c = clamp(t, 0, 1);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(c - 1, 3) + c1 * Math.pow(c - 1, 2);
};
/** Frame-rate independent exponential damping factor (0..1). */
export const dampFactor = (speed, dt) => 1 - Math.exp(-speed * Math.max(0, dt));
export const damp = (current, target, speed, dt) => lerp(current, target, dampFactor(speed, dt));

/**
 * Evaluate a keyframe array `[{ t, v, ease? }]` where `t` is normalized (0..1) or seconds.
 */
export function sampleKeyframes(frames, time) {
  if (!frames || !frames.length) return 0;
  if (time <= frames[0].t) return frames[0].v;
  const last = frames[frames.length - 1];
  if (time >= last.t) return last.v;
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (time >= a.t && time <= b.t) {
      const span = b.t - a.t;
      const raw = span > 1e-6 ? (time - a.t) / span : 1;
      const eased = b.ease === 'linear'
        ? raw
        : b.ease === 'outCubic'
          ? easeOutCubic(raw)
          : b.ease === 'inCubic'
            ? easeInCubic(raw)
            : b.ease === 'outBack'
              ? easeOutBack(raw)
              : smoothstep(raw);
      return lerp(a.v, b.v, eased);
    }
  }
  return last.v;
}
