import { clamp, sampleKeyframes } from '../../utils/math.js';

const TAU = Math.PI * 2;

/**
 * Arm & hand gesture motions (channel: 'gesture').
 * Gestures override only the arm(s) they use, so breathing, idle, walk, head nods,
 * and facial expressions keep running smoothly underneath.
 *
 * Sign convention on front-facing 2D cutout rig (Three.js +Z CCW):
 * - rightUpperArm (+deg) raises outward/up to viewer-right; (-deg) brings inward across chest.
 * - leftUpperArm  (-deg) raises outward/up to viewer-left;  (+deg) brings inward across chest.
 */
export const GESTURE_MOTIONS = {
  wave: {
    id: 'wave',
    label: 'Wave (Loop)',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: true,
    duration: 1.2,
    ownsParts: ['rightUpperArm', 'rightForearm', 'rightHand'],
    description: 'Friendly raised right-arm wave with rhythmic forearm and wrist follow-through.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const swing = Math.sin(p * 2);
      const wristLag = Math.sin(p * 2 - 0.65);
      return {
        parts: {
          rightUpperArm: { rot: 112 + swing * 8 },
          rightForearm: { rot: 34 + swing * 24 },
          rightHand: { rot: 6 + wristLag * 18 },
        },
      };
    },
  },

  waveOnce: {
    id: 'waveOnce',
    label: 'Wave Once',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 1.55,
    ownsParts: ['rightUpperArm', 'rightForearm', 'rightHand'],
    description: 'Raises right hand, waves cleanly twice, and lowers back to rest pose.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const raise = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.2, v: 1, ease: 'outCubic' },
        { t: 0.78, v: 1 },
        { t: 1, v: 0 },
      ], u);
      const waveSwing = u > 0.18 && u < 0.82
        ? Math.sin(((u - 0.18) / 0.64) * TAU * 2) * raise
        : 0;
      return {
        parts: {
          rightUpperArm: { rot: 114 * raise + waveSwing * 7 },
          rightForearm: { rot: 32 * raise + waveSwing * 24 },
          rightHand: { rot: 6 * raise + waveSwing * 16 },
        },
      };
    },
  },

  point: {
    id: 'point',
    label: 'Point (Right)',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 1.35,
    ownsParts: ['rightUpperArm', 'rightForearm', 'rightHand'],
    description: 'Extends right arm cleanly to point outward right, holds briefly, and returns.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.24, v: 1, ease: 'outCubic' },
        { t: 0.74, v: 1 },
        { t: 1, v: 0 },
      ], u);
      const settle = Math.sin(u * Math.PI) * 3;
      return {
        parts: {
          rightUpperArm: { rot: 84 * env + settle },
          rightForearm: { rot: 8 * env },
          rightHand: { rot: 4 * env },
        },
      };
    },
  },

  pointRight: {
    id: 'pointRight',
    label: 'Point Right',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 1.35,
    ownsParts: ['rightUpperArm', 'rightForearm', 'rightHand'],
    description: 'Extends right arm horizontally toward viewer-right with crisp settle.',
    evaluate(t, duration) {
      return GESTURE_MOTIONS.point.evaluate(t, duration);
    },
  },

  pointLeft: {
    id: 'pointLeft',
    label: 'Point Left',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 1.35,
    ownsParts: ['leftUpperArm', 'leftForearm', 'leftHand'],
    description: 'Extends left arm horizontally toward viewer-left with crisp settle.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.24, v: 1, ease: 'outCubic' },
        { t: 0.74, v: 1 },
        { t: 1, v: 0 },
      ], u);
      const settle = Math.sin(u * Math.PI) * 3;
      return {
        parts: {
          leftUpperArm: { rot: -84 * env - settle },
          leftForearm: { rot: -8 * env },
          leftHand: { rot: -4 * env },
        },
      };
    },
  },

  raiseLeftHand: {
    id: 'raiseLeftHand',
    label: 'Raise Left Hand',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 1.4,
    ownsParts: ['leftUpperArm', 'leftForearm', 'leftHand'],
    description: 'Lifts viewer-left arm high overhead and lowers cleanly to rest.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.28, v: 1, ease: 'outCubic' },
        { t: 0.74, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          leftUpperArm: { rot: -142 * env },
          leftForearm: { rot: -18 * env },
          leftHand: { rot: -8 * env },
        },
      };
    },
  },

  raiseRightHand: {
    id: 'raiseRightHand',
    label: 'Raise Right Hand',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 1.4,
    ownsParts: ['rightUpperArm', 'rightForearm', 'rightHand'],
    description: 'Lifts viewer-right arm high overhead and lowers cleanly to rest.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.28, v: 1, ease: 'outCubic' },
        { t: 0.74, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          rightUpperArm: { rot: 142 * env },
          rightForearm: { rot: 18 * env },
          rightHand: { rot: 8 * env },
        },
      };
    },
  },

  raiseBothHands: {
    id: 'raiseBothHands',
    label: 'Raise Both Hands',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 1.5,
    ownsParts: [
      'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
    ],
    description: 'Raises both arms joyfully overhead with energetic micro-bounce.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.24, v: 1, ease: 'outCubic' },
        { t: 0.76, v: 1 },
        { t: 1, v: 0 },
      ], u);
      const cheer = Math.sin(u * TAU * 2) * 6 * env;
      return {
        parts: {
          leftUpperArm: { rot: -142 * env - cheer },
          leftForearm: { rot: -16 * env - cheer * 0.5 },
          leftHand: { rot: -10 * env },
          rightUpperArm: { rot: 142 * env + cheer },
          rightForearm: { rot: 16 * env + cheer * 0.5 },
          rightHand: { rot: 10 * env },
        },
      };
    },
  },

  handsUp: {
    id: 'handsUp',
    label: 'Hands Up',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: true,
    duration: 1.6,
    ownsParts: [
      'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
    ],
    description: 'Sustained celebratory/surrender hands-up hold with gentle organic sway.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const sway = Math.sin(p) * 5;
      return {
        parts: {
          leftUpperArm: { rot: -124 + sway },
          leftForearm: { rot: -34 + sway * 0.7 },
          leftHand: { rot: -12 - sway * 0.5 },
          rightUpperArm: { rot: 124 - sway },
          rightForearm: { rot: 34 - sway * 0.7 },
          rightHand: { rot: 12 + sway * 0.5 },
        },
      };
    },
  },

  lowerHands: {
    id: 'lowerHands',
    label: 'Lower Hands',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 0.55,
    ownsParts: [
      'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
    ],
    description: 'Smoothly brings both arms down to a calm relaxed rest pose.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const settle = sampleKeyframes([
        { t: 0, v: 1 },
        { t: 0.6, v: -0.15 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          leftUpperArm: { rot: -8 * settle },
          leftForearm: { rot: 6 * settle },
          leftHand: { rot: 0 },
          rightUpperArm: { rot: 8 * settle },
          rightForearm: { rot: -6 * settle },
          rightHand: { rot: 0 },
        },
      };
    },
  },

  shrug: {
    id: 'shrug',
    label: 'Shrug',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 1.15,
    ownsParts: [
      'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
    ],
    description: 'Classic shoulder lift with outward bent forearms and open hands.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const env = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.26, v: 1, ease: 'outCubic' },
        { t: 0.68, v: 1 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          leftUpperArm: { y: 0.022 * env, rot: -26 * env },
          leftForearm: { rot: -66 * env },
          leftHand: { rot: -16 * env },
          rightUpperArm: { y: 0.022 * env, rot: 26 * env },
          rightForearm: { rot: 66 * env },
          rightHand: { rot: 16 * env },
        },
      };
    },
  },

  clap: {
    id: 'clap',
    label: 'Clap',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: true,
    duration: 0.72,
    ownsParts: [
      'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
    ],
    description: 'Rhythmic two-hand applause cycle bringing forearms together at chest height.',
    evaluate(t, duration) {
      const u = (t % duration) / duration;
      const strike = sampleKeyframes([
        { t: 0, v: 0.35 },
        { t: 0.22, v: 1.0, ease: 'inCubic' },
        { t: 0.45, v: 0.25 },
        { t: 0.72, v: 1.0, ease: 'inCubic' },
        { t: 1, v: 0.35 },
      ], u);
      return {
        parts: {
          leftUpperArm: { rot: 16 + strike * 26 },
          leftForearm: { rot: 22 + strike * 34 },
          leftHand: { rot: 12 + strike * 16 },
          rightUpperArm: { rot: -16 - strike * 26 },
          rightForearm: { rot: -22 - strike * 34 },
          rightHand: { rot: -12 - strike * 16 },
        },
      };
    },
  },

  explain: {
    id: 'explain',
    label: 'Explain',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: true,
    duration: 1.9,
    ownsParts: [
      'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
    ],
    description: 'Alternating conversational hand gestures ideal for pairing with talking.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const a = 0.5 + 0.5 * Math.sin(p);
      const b = 0.5 + 0.5 * Math.sin(p + Math.PI * 0.85);
      return {
        parts: {
          leftUpperArm: { rot: -16 - a * 20 },
          leftForearm: { rot: -32 - a * 34 },
          leftHand: { rot: -8 - a * 18 },
          rightUpperArm: { rot: 16 + b * 24 },
          rightForearm: { rot: 30 + b * 38 },
          rightHand: { rot: 8 + b * 18 },
        },
      };
    },
  },

  talkingGesture: {
    id: 'talkingGesture',
    label: 'Talking Gesture',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: true,
    duration: 1.6,
    ownsParts: [
      'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
    ],
    description: 'Subtle expressive forearm cadence designed for dialogue delivery.',
    evaluate(t, duration) {
      const p = (t / duration) * TAU;
      const r = Math.sin(p);
      const l = Math.sin(p + 1.4);
      return {
        parts: {
          leftUpperArm: { rot: -10 - l * 10 },
          leftForearm: { rot: -26 - l * 18 },
          leftHand: { rot: -6 - l * 14 },
          rightUpperArm: { rot: 14 + r * 14 },
          rightForearm: { rot: 34 + r * 20 },
          rightHand: { rot: 8 + r * 14 },
        },
      };
    },
  },

  emphasisGesture: {
    id: 'emphasisGesture',
    label: 'Emphasis Gesture',
    channel: 'gesture',
    category: 'gesture',
    defaultLoop: false,
    duration: 0.85,
    ownsParts: [
      'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
    ],
    description: 'Crisp accented beat gesture punctuating an important spoken point.',
    evaluate(t, duration) {
      const u = clamp(t / duration, 0, 1);
      const beat = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.22, v: 1.15, ease: 'outCubic' },
        { t: 0.55, v: 0.72 },
        { t: 1, v: 0 },
      ], u);
      return {
        parts: {
          leftUpperArm: { rot: -22 * beat },
          leftForearm: { rot: -48 * beat },
          leftHand: { rot: -14 * beat },
          rightUpperArm: { rot: 34 * beat },
          rightForearm: { rot: 52 * beat },
          rightHand: { rot: 18 * beat },
        },
      };
    },
  },
};
