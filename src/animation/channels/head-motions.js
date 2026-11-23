import { clamp, sampleKeyframes } from '../../utils/math.js';

const TAU = Math.PI * 2;

/**
 * Independent head & gaze-coordinated motions (channel: 'head').
 * All head motions layer cleanly on top of base/locomotion/gesture without fighting expressions.
 */
export const HEAD_MOTIONS = {
  nod: {
    id: 'nod',
    label: 'Nod',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 0.72,
    description: 'Single clear affirmative head nod with natural downward dip and rebound.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const dip = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.24, v: 1, ease: 'outCubic' },
        { t: 0.56, v: -0.18 },
        { t: 0.8, v: 0.14 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          head: { y: -0.032 * dip, scaleY: 1 - 0.045 * Math.max(0, dip), rot: -5.5 * dip },
          neck: { y: -0.008 * dip },
          braidL: { rot: 4.5 * dip },
          braidR: { rot: -4.5 * dip },
        },
      };
    },
  },

  nodLoop: {
    id: 'nodLoop',
    label: 'Nod Loop',
    channel: 'head',
    category: 'head',
    defaultLoop: true,
    duration: 1.0,
    description: 'Continuous rhythmic listening nods with seamless loop boundary.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const dip = 0.5 - 0.5 * Math.cos(p);
      return {
        parts: {
          head: { y: -0.026 * dip, scaleY: 1 - 0.035 * dip, rot: -4.5 * dip },
          neck: { y: -0.006 * dip },
          braidL: { rot: Math.sin(p - 0.5) * 4.0 },
          braidR: { rot: -Math.sin(p - 0.5) * 4.0 },
        },
      };
    },
  },

  shake: {
    id: 'shake',
    label: 'Shake Head',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 0.78,
    description: 'Clear horizontal head shake ("no") with opposing braid momentum.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const side = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.16, v: -1 },
        { t: 0.36, v: 1 },
        { t: 0.58, v: -0.78 },
        { t: 0.78, v: 0.42 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          head: {
            x: side * 0.024,
            rot: side * 6.5,
            scaleX: 1 - Math.abs(side) * 0.045,
          },
          braidL: { rot: -side * 9.5 },
          braidR: { rot: -side * 9.5 },
        },
      };
    },
  },

  tiltLeft: {
    id: 'tiltLeft',
    label: 'Tilt Left',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 1.05,
    description: 'Curious head tilt toward viewer-left with subtle neck lean and braid drape.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.28, v: 1 },
        { t: 0.72, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          neck: { rot: 2.5 * env },
          head: { rot: 14.5 * env, x: -0.01 * env },
          braidL: { rot: -7.5 * env },
          braidR: { rot: -4.5 * env },
        },
      };
    },
  },

  tiltRight: {
    id: 'tiltRight',
    label: 'Tilt Right',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 1.05,
    description: 'Curious head tilt toward viewer-right with subtle neck lean and braid drape.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.28, v: 1 },
        { t: 0.72, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          neck: { rot: -2.5 * env },
          head: { rot: -14.5 * env, x: 0.01 * env },
          braidL: { rot: 4.5 * env },
          braidR: { rot: 7.5 * env },
        },
      };
    },
  },

  lookLeft: {
    id: 'lookLeft',
    label: 'Look Left',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 1.25,
    description: 'Coordinates eye gaze left with subtle head turn bias.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.22, v: 1 },
        { t: 0.76, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        gaze: { x: -0.92 * env, y: 0 },
        parts: {
          head: { x: -0.016 * env, rot: 4.2 * env, scaleX: 1 - 0.03 * env },
          braidL: { rot: 3.2 * env },
          braidR: { rot: 2.0 * env },
        },
      };
    },
  },

  lookRight: {
    id: 'lookRight',
    label: 'Look Right',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 1.25,
    description: 'Coordinates eye gaze right with subtle head turn bias.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.22, v: 1 },
        { t: 0.76, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        gaze: { x: 0.92 * env, y: 0 },
        parts: {
          head: { x: 0.016 * env, rot: -4.2 * env, scaleX: 1 - 0.03 * env },
          braidL: { rot: -2.0 * env },
          braidR: { rot: -3.2 * env },
        },
      };
    },
  },

  lookUp: {
    id: 'lookUp',
    label: 'Look Up',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 1.25,
    description: 'Directs gaze upward with a slight chin lift.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.24, v: 1 },
        { t: 0.76, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        gaze: { x: 0, y: -0.9 * env },
        parts: {
          head: { y: 0.022 * env, rot: 2.0 * env },
          braidL: { rot: -2.5 * env },
          braidR: { rot: 2.5 * env },
        },
      };
    },
  },

  lookDown: {
    id: 'lookDown',
    label: 'Look Down',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 1.25,
    description: 'Directs gaze downward with gentle head dip.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.24, v: 1 },
        { t: 0.76, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        gaze: { x: 0, y: 0.9 * env },
        parts: {
          head: { y: -0.024 * env, scaleY: 1 - 0.03 * env, rot: -3.0 * env },
          braidL: { rot: 3.5 * env },
          braidR: { rot: -3.5 * env },
        },
      };
    },
  },

  glance: {
    id: 'glance',
    label: 'Glance',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 0.9,
    description: 'Quick side eye glance and immediate return to camera.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const gx = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.16, v: 0.9, ease: 'outCubic' },
        { t: 0.62, v: 0.85 },
        { t: 1, v: 0 },
      ], u);
      return {
        gaze: { x: gx, y: -0.1 * Math.abs(gx) },
        parts: {
          head: { rot: -2.5 * gx, x: 0.008 * gx },
        },
      };
    },
  },

  lookAround: {
    id: 'lookAround',
    label: 'Look Around',
    channel: 'head',
    category: 'head',
    defaultLoop: true,
    duration: 3.0,
    description: 'Scans left, pauses, scans right, and settles smoothly back to center.',
    evaluate(t, duration) {
      const u = (t % duration) / duration;
      const gx = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.18, v: -0.88 },
        { t: 0.36, v: -0.85 },
        { t: 0.62, v: 0.88 },
        { t: 0.82, v: 0.85 },
        { t: 1, v: 0 },
      ], u);
      const gy = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.25, v: -0.18 },
        { t: 0.5, v: 0.08 },
        { t: 0.72, v: -0.15 },
        { t: 1, v: 0 },
      ], u);
      return {
        gaze: { x: gx, y: gy },
        parts: {
          head: { x: gx * 0.015, y: -gy * 0.012, rot: -gx * 4.8, scaleX: 1 - Math.abs(gx) * 0.025 },
          braidL: { rot: -gx * 3.5 },
          braidR: { rot: -gx * 3.5 },
        },
      };
    },
  },

  headTurnLeft: {
    id: 'headTurnLeft',
    label: 'Head Turn Left',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 1.2,
    cutoutLimitation: '2D front-facing cutout approximation (subtle X shift, foreshortening, and gaze; not a 3/4 profile swap).',
    description: 'Subtle 2D cutout head turn left via parallax shift, slight scale foreshortening, and gaze.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.26, v: 1 },
        { t: 0.74, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        gaze: { x: -0.95 * env, y: 0 },
        parts: {
          head: { x: -0.026 * env, rot: 5.5 * env, scaleX: 1 - 0.065 * env },
          hairFront: { x: -0.014 * env },
          hairBack: { x: 0.012 * env },
          braidL: { x: -0.01 * env, rot: 5.5 * env },
          braidR: { x: -0.012 * env, rot: 4.0 * env },
        },
      };
    },
  },

  headTurnRight: {
    id: 'headTurnRight',
    label: 'Head Turn Right',
    channel: 'head',
    category: 'head',
    defaultLoop: false,
    duration: 1.2,
    cutoutLimitation: '2D front-facing cutout approximation (subtle X shift, foreshortening, and gaze; not a 3/4 profile swap).',
    description: 'Subtle 2D cutout head turn right via parallax shift, slight scale foreshortening, and gaze.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.26, v: 1 },
        { t: 0.74, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        gaze: { x: 0.95 * env, y: 0 },
        parts: {
          head: { x: 0.026 * env, rot: -5.5 * env, scaleX: 1 - 0.065 * env },
          hairFront: { x: 0.014 * env },
          hairBack: { x: -0.012 * env },
          braidL: { x: 0.012 * env, rot: -4.0 * env },
          braidR: { x: 0.01 * env, rot: -5.5 * env },
        },
      };
    },
  },
};
