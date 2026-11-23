import { clamp, sampleKeyframes, smoothstep } from '../../utils/math.js';

const TAU = Math.PI * 2;

/**
 * Base body & full-body expressive reaction motions.
 * All angles are in DEGREES (converted to radians by AnimationController).
 * All x/y offsets are normalized to character worldHeight (multiplied by worldHeight * 0.5).
 */
export const BODY_MOTIONS = {
  idle: {
    id: 'idle',
    label: 'Idle',
    channel: 'base',
    category: 'basic',
    defaultLoop: true,
    duration: 3.2,
    description: 'Subtle breathing, gentle weight settle, micro head float, and soft braid sway.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const breath = Math.sin(p);
      const sway = Math.sin(p * 0.5);
      return {
        parts: {
          body: { y: breath * 0.008, rot: sway * 0.8 },
          head: { y: breath * 0.004, rot: Math.sin(p - 0.5) * 1.4 },
          leftUpperArm: { rot: -breath * 1.6 - sway * 0.8 },
          leftForearm: { rot: breath * 1.2 },
          rightUpperArm: { rot: breath * 1.6 - sway * 0.8 },
          rightForearm: { rot: -breath * 1.2 },
          braidL: { rot: Math.sin(p - 0.8) * 2.4 },
          braidR: { rot: Math.sin(p - 1.1) * 2.2 },
        },
      };
    },
  },

  breathing: {
    id: 'breathing',
    label: 'Breathing',
    channel: 'base',
    category: 'basic',
    defaultLoop: true,
    duration: 2.8,
    description: 'Rhythmic chest rise and shoulder lift suitable as an always-on base layer.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const b = 0.5 - 0.5 * Math.cos(p); // 0 -> 1 -> 0 seamlessly
      return {
        parts: {
          body: { y: b * 0.014, scaleY: 1 + b * 0.008 },
          top: { y: b * 0.005 },
          head: { y: b * 0.004, rot: (b - 0.5) * 1.0 },
          leftUpperArm: { y: b * 0.006, rot: -b * 2.6 },
          rightUpperArm: { y: b * 0.006, rot: b * 2.6 },
          braidL: { rot: (b - 0.5) * 1.8 },
          braidR: { rot: -(b - 0.5) * 1.8 },
        },
      };
    },
  },

  bodySway: {
    id: 'bodySway',
    label: 'Body Sway',
    channel: 'base',
    category: 'basic',
    defaultLoop: true,
    duration: 3.4,
    description: 'Gentle side-to-side torso sway with secondary head counterbalance and braid lag.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const s = Math.sin(p);
      const lift = Math.abs(Math.cos(p)) * 0.006;
      return {
        parts: {
          body: { x: s * 0.022, y: lift, rot: -s * 2.8 },
          skirt: { rot: s * 1.8 },
          head: { rot: s * 3.2 },
          leftUpperArm: { rot: -4 + s * 3.5 },
          rightUpperArm: { rot: 4 + s * 3.5 },
          braidL: { rot: Math.sin(p - 0.7) * 5.2 },
          braidR: { rot: Math.sin(p - 0.9) * 5.2 },
        },
      };
    },
  },

  weightShift: {
    id: 'weightShift',
    label: 'Weight Shift',
    channel: 'base',
    category: 'basic',
    defaultLoop: true,
    duration: 3.6,
    description: 'Natural standing hip shift from left leg to right leg with torso counterbalance.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const s = Math.sin(p);
      const dip = (1 - Math.cos(p * 2)) * 0.006;
      return {
        parts: {
          body: { x: s * 0.032, y: -dip, rot: s * 2.4 },
          skirt: { rot: -s * 1.6 },
          thighL: { rot: -s * 4.5 },
          shinL: { rot: Math.max(0, -s) * 5.5 },
          thighR: { rot: -s * 4.5 },
          shinR: { rot: Math.max(0, s) * 5.5 },
          head: { rot: -s * 2.6 },
          leftUpperArm: { rot: -3 - s * 4 },
          rightUpperArm: { rot: 3 - s * 4 },
          braidL: { rot: Math.sin(p - 0.5) * 4.0 },
          braidR: { rot: Math.sin(p - 0.7) * 4.0 },
        },
      };
    },
  },

  recoil: {
    id: 'recoil',
    label: 'Recoil',
    channel: 'locomotion',
    category: 'reaction',
    defaultLoop: false,
    duration: 0.72,
    description: 'Sharp startled recoil leaning back with defensive forearm lift and smooth recovery.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const lean = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.16, v: 1, ease: 'outCubic' },
        { t: 0.42, v: 0.78 },
        { t: 1, v: 0 },
      ], u);
      const drop = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.15, v: -0.045, ease: 'outCubic' },
        { t: 0.45, v: -0.02 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          body: { x: -0.065 * lean, y: drop, rot: 7.5 * lean },
          head: { y: 0.01 * lean, rot: -9.5 * lean },
          thighL: { rot: -8 * lean },
          shinL: { rot: 14 * lean },
          footL: { rot: -6 * lean },
          thighR: { rot: 6 * lean },
          shinR: { rot: 12 * lean },
          footR: { rot: -18 * lean },
          leftUpperArm: { rot: -26 * lean },
          leftForearm: { rot: -58 * lean },
          rightUpperArm: { rot: 28 * lean },
          rightForearm: { rot: 62 * lean },
          braidL: { rot: -14 * lean },
          braidR: { rot: -10 * lean },
        },
      };
    },
  },

  surprisedReaction: {
    id: 'surprisedReaction',
    label: 'Surprised Pop',
    channel: 'locomotion',
    category: 'reaction',
    defaultLoop: false,
    duration: 0.68,
    description: 'Quick upward jolt with wide arms and sudden head lift before settling back.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const pop = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.16, v: 1, ease: 'outCubic' },
        { t: 0.36, v: 0.65 },
        { t: 0.6, v: -0.12 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          body: { y: 0.055 * pop, rot: -2.2 * pop },
          head: { y: 0.018 * pop, rot: 4.5 * pop },
          leftUpperArm: { rot: -48 * Math.max(0, pop) },
          leftForearm: { rot: -44 * Math.max(0, pop) },
          rightUpperArm: { rot: 48 * Math.max(0, pop) },
          rightForearm: { rot: 44 * Math.max(0, pop) },
          braidL: { rot: 11 * pop },
          braidR: { rot: -11 * pop },
        },
      };
    },
  },

  laugh: {
    id: 'laugh',
    label: 'Laugh',
    channel: 'locomotion',
    category: 'reaction',
    defaultLoop: true,
    duration: 0.9,
    description: 'Rhythmic shoulder chuckle, torso bounce, and happy head tip.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const bounce = Math.abs(Math.sin(p * 2));
      const sway = Math.sin(p);
      return {
        parts: {
          body: { y: bounce * 0.022, rot: sway * 2.4 },
          head: { y: bounce * 0.008, rot: 5.5 + sway * 4.5 },
          leftUpperArm: { y: bounce * 0.012, rot: -14 - bounce * 8 },
          leftForearm: { rot: 22 + bounce * 10 },
          rightUpperArm: { y: bounce * 0.012, rot: 14 + bounce * 8 },
          rightForearm: { rot: -22 - bounce * 10 },
          braidL: { rot: -6 - sway * 6 },
          braidR: { rot: 6 - sway * 6 },
        },
      };
    },
  },

  bow: {
    id: 'bow',
    label: 'Bow',
    channel: 'locomotion',
    category: 'reaction',
    defaultLoop: false,
    duration: 1.5,
    description: 'Polite forward bow with torso dip, tucked arms, and smooth upright return.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.34, v: 1 },
        { t: 0.62, v: 1 },
        { t: 1, v: 0 },
      ], u);
      const bend = smoothstep(env);
      return {
        parts: {
          body: { y: -0.052 * bend, scaleY: 1 - 0.055 * bend, rot: -6.5 * bend },
          neck: { y: -0.015 * bend },
          head: { y: -0.035 * bend, scaleY: 1 - 0.06 * bend, rot: -10 * bend },
          leftUpperArm: { rot: 14 * bend },
          leftForearm: { rot: 18 * bend },
          rightUpperArm: { rot: -14 * bend },
          rightForearm: { rot: -18 * bend },
          braidL: { rot: 12 * bend },
          braidR: { rot: -12 * bend },
        },
      };
    },
  },
};
