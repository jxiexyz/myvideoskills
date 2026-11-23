import { BODY_MOTIONS } from './channels/body-motions.js';
import { HEAD_MOTIONS } from './channels/head-motions.js';
import { GESTURE_MOTIONS } from './channels/gesture-motions.js';
import { LOCOMOTION_MOTIONS } from './channels/locomotion-motions.js';
import { EXPRESSION_PRESETS } from './expression/expression-presets.js';

export const MOTION_DEFINITIONS = {
  ...BODY_MOTIONS,
  ...HEAD_MOTIONS,
  ...GESTURE_MOTIONS,
  ...LOCOMOTION_MOTIONS,
};

/** Legacy motion name aliases for backward compatibility with earlier PuppetKit scripts. */
export const MOTION_ALIASES = {
  tilt: 'tiltRight',
  surprised: 'surprisedReaction',
};

/**
 * Explicitly documented motions that are NOT natively faked because the supplied
 * 2D cutout hand artwork lacks dedicated finger-pose replacement art.
 */
export const UNSUPPORTED_MOTIONS = {
  thumbsUp: {
    id: 'thumbsUp',
    label: 'Thumbs Up',
    supported: false,
    reason: 'Requires dedicated thumb-extended hand swap SVG artwork; current rig uses a single open hand cutout per side.',
  },
};

/**
 * Combined Action Presets coordinate multiple independent channels (body, head,
 * gesture, expression, gaze, talking) without duplicating motion logic.
 */
export const COMBINED_PRESETS = {
  greeting: {
    id: 'greeting',
    label: 'Greeting',
    description: 'Friendly wave + warm happy expression + subtle idle breathing.',
    expression: 'happy',
    base: 'idle',
    gesture: 'waveOnce',
    head: 'tiltRight',
    talking: false,
  },
  explaining: {
    id: 'explaining',
    label: 'Explaining',
    description: 'Conversational talking mouth + alternating explain gesture + gentle nodding.',
    expression: 'determined',
    base: 'breathing',
    gesture: 'explain',
    head: 'nodLoop',
    talking: true,
  },
  celebrating: {
    id: 'celebrating',
    label: 'Celebrating',
    description: 'Both hands raised high + excited sparkling expression + joyful bounce.',
    expression: 'excited',
    base: 'bodySway',
    gesture: 'raiseBothHands',
    head: 'nod',
    talking: false,
  },
  confusedReaction: {
    id: 'confusedReaction',
    label: 'Confused Reaction',
    description: 'Head tilt + confused expression + light shoulder shrug.',
    expression: 'confused',
    base: 'idle',
    gesture: 'shrug',
    head: 'tiltLeft',
    talking: false,
  },
  sadReaction: {
    id: 'sadReaction',
    label: 'Sad Reaction',
    description: 'Downcast gaze + subtle head dip + sad expression + calm lowered hands.',
    expression: 'sad',
    base: 'breathing',
    gesture: 'lowerHands',
    head: 'lookDown',
    talking: false,
  },
  surprisedReaction: {
    id: 'surprisedReaction',
    label: 'Surprised Reaction',
    description: 'Startled recoil motion + wide-eyed surprised expression.',
    expression: 'surprised',
    base: 'idle',
    locomotion: 'recoil',
    gesture: null,
    head: null,
    talking: false,
  },
  thinkingPose: {
    id: 'thinkingPose',
    label: 'Thinking Pose',
    description: 'Upward-side glance + thoughtful expression + gentle weight shift.',
    expression: 'thinking',
    base: 'weightShift',
    gesture: 'lowerHands',
    head: 'tiltRight',
    gaze: { x: 0.62, y: -0.68 },
    talking: false,
  },
};

export function resolveMotionDefinition(name) {
  const canonical = MOTION_ALIASES[name] || name;
  return MOTION_DEFINITIONS[canonical] || null;
}

/**
 * @param {string | null} [filterCategory=null]
 */
export function listMotions(filterCategory = null) {
  return Object.values(MOTION_DEFINITIONS)
    .filter((m) => !filterCategory || m.category === filterCategory)
    .map(({ id, label, channel, category, defaultLoop, duration, description, cutoutLimitation }) => ({
      id,
      label,
      channel,
      category,
      defaultLoop,
      duration,
      description,
      ...(cutoutLimitation ? { cutoutLimitation } : {}),
    }));
}

export function listExpressions() {
  return Object.values(EXPRESSION_PRESETS).map(({ id, label, category, description, blush, gazeProfile }) => ({
    id,
    label,
    category,
    description,
    blush,
    supportsGaze: Boolean(gazeProfile),
  }));
}

export function listPresets() {
  return Object.values(COMBINED_PRESETS).map(({ id, label, description, expression, base, locomotion, head, gesture, talking }) => ({
    id,
    label,
    description,
    expression,
    base: base || null,
    locomotion: locomotion || null,
    head: head || null,
    gesture: gesture || null,
    talking: Boolean(talking),
  }));
}
