import baseGazeRig from '../../../presets/heroine-eye-rig.js';
import { backViewManifest } from './views/back/manifest.js';
import { topViewManifest } from './views/top/manifest.js';
import { bottomViewManifest } from './views/bottom/manifest.js';
import { VIEW_CONVENTIONS, VIEW_FACIAL_VISIBILITY } from './shared/semantic-rig-map.js';

const OFFSET_X = 242;
const OFFSET_Y = 224.074074074;
const ART_W = 1024;
const ART_H = 2000;

const point = (x, y) => ({
  x: (x + OFFSET_X) / ART_W,
  y: (y + OFFSET_Y) / ART_H,
});

function layer(name, parent, z, x, y, [l, t, r, b], relPath = `./${name}.svg`, extra = {}) {
  return {
    name,
    parent,
    z,
    pivot: point(x, y),
    polygon: [point(l, t), point(r, t), point(r, b), point(l, b)],
    image: new URL(relPath, import.meta.url).href,
    ...extra,
  };
}

const EYE_BOX = [146, 200, 372, 276];
const BROW_BOX = [148, 152, 366, 238];
const MOUTH_BOX = [204, 274, 326, 356];
const BLUSH_BOX = [154, 260, 366, 304];

/**
 * Extended gaze rig supporting expression-specific eyelid masks so eye tracking
 * and smooth blinks work naturally across all open-eye expressions.
 */
const gazeRig = {
  ...baseGazeRig,
  offset: { x: OFFSET_X, y: OFFSET_Y },
  travel: { x: 14, y: 4.5 },
  profiles: {
    neutral: {
      eyes: baseGazeRig.eyes,
      lidPath: baseGazeRig.lidPath,
      irisRadius: { x: 13, y: 11 },
      pupilRadius: { x: 7, y: 9 },
    },
    wide: {
      eyes: [
        { cx: 203, cy: 242, path: 'M164 241 Q201 206 238 247 Q203 267 167 250Z' },
        { cx: 318, cy: 242, path: 'M284 247 Q317 206 354 241 Q323 267 284 247Z' },
      ],
      lidPath: 'M161 234 L166 241 Q201 206 238 247 M284 247 Q317 206 353 241 L358 234',
      lowerLidPath: 'M172 254 Q203 265 233 252 M289 252 Q319 265 349 254',
      irisRadius: { x: 14.2, y: 13.5 },
      pupilRadius: { x: 7.8, y: 10 },
      extraGlint: true,
    },
    scared: {
      eyes: [
        { cx: 203, cy: 244, path: 'M164 242 Q201 208 238 248 Q203 266 167 251Z' },
        { cx: 318, cy: 244, path: 'M284 248 Q317 208 354 242 Q323 266 284 248Z' },
      ],
      lidPath: 'M161 236 L166 242 Q201 208 238 248 M284 248 Q317 208 353 242 L358 236',
      lowerLidPath: 'M174 256 Q203 263 232 254 M290 254 Q319 263 347 256',
      irisRadius: { x: 9.8, y: 9.8 },
      pupilRadius: { x: 5.0, y: 6.0 },
    },
    sad: {
      eyes: [
        { cx: 203, cy: 246, path: 'M167 248 Q203 224 236 244 Q202 260 169 251Z' },
        { cx: 318, cy: 246, path: 'M286 244 Q317 224 351 248 Q322 260 286 244Z' },
      ],
      lidPath: 'M165 247 Q203 223 237 244 M285 244 Q317 223 353 247',
      irisRadius: { x: 13, y: 10.5 },
      pupilRadius: { x: 7, y: 8.5 },
      tearHighlight: true,
    },
    angry: {
      eyes: [
        { cx: 204, cy: 246, path: 'M168 236 L237 250 Q202 261 170 248Z' },
        { cx: 317, cy: 246, path: 'M350 236 L285 250 Q319 261 348 248Z' },
      ],
      lidPath: 'M164 231 L169 236 L238 250 M284 250 L349 236 L355 231',
      irisRadius: { x: 12, y: 9.5 },
      pupilRadius: { x: 6.5, y: 7.8 },
    },
    sleepy: {
      eyes: [
        { cx: 203, cy: 250, path: 'M168 244 L236 246 Q203 260 170 250Z' },
        { cx: 318, cy: 250, path: 'M286 246 L350 244 Q320 260 286 246Z' },
      ],
      lidPath: 'M166 243 Q202 246 237 246 M285 246 Q319 246 352 243',
      creasePath: 'M174 237 Q202 239 232 240 M290 240 Q319 239 346 237',
      irisRadius: { x: 12, y: 7.5 },
      pupilRadius: { x: 6.5, y: 5.8 },
    },
    shy: {
      eyes: [
        { cx: 203, cy: 245, path: 'M167 245 Q202 222 236 250 Q202 258 170 248Z' },
        { cx: 318, cy: 245, path: 'M286 250 Q314 222 350 245 Q323 258 286 250Z' },
      ],
      lidPath: 'M164 239 L169 245 Q202 222 236 250 M286 250 Q314 222 350 245 L355 239',
      irisRadius: { x: 12.5, y: 10.5 },
      pupilRadius: { x: 6.8, y: 8.4 },
    },
    disgusted: {
      eyes: [
        { cx: 203, cy: 246, path: 'M169 241 Q203 235 236 249 Q203 254 172 249Z' },
        { cx: 318, cy: 246, path: 'M286 249 Q318 235 349 241 Q322 254 286 249Z' },
      ],
      lidPath: 'M166 239 Q203 234 237 249 M285 249 Q318 234 352 239',
      lowerLidPath: 'M174 252 Q203 249 233 253 M289 253 Q318 249 346 252',
      irisRadius: { x: 11.5, y: 7.2 },
      pupilRadius: { x: 6.0, y: 5.5 },
    },
  },
};

const EYE_VARIANTS = [
  ['eyes', './face/eyes_neutral.svg', true],
  ['eyes_happy', './face/eyes_happy.svg', false],
  ['eyes_closed', './face/eyes_closed.svg', false],
  ['eyes_wide', './face/eyes_wide.svg', false],
  ['eyes_scared', './face/eyes_scared.svg', false],
  ['eyes_sad', './face/eyes_sad.svg', false],
  ['eyes_angry', './face/eyes_angry.svg', false],
  ['eyes_sleepy', './face/eyes_sleepy.svg', false],
  ['eyes_shy', './face/eyes_shy.svg', false],
  ['eyes_disgusted', './face/eyes_disgusted.svg', false],
];

const BROW_VARIANTS = [
  ['brows', './face/brows_neutral.svg', true],
  ['brows_raised', './face/brows_raised.svg', false],
  ['brows_angry', './face/brows_angry.svg', false],
  ['brows_sad', './face/brows_sad.svg', false],
  ['brows_confused', './face/brows_confused.svg', false],
  ['brows_worried', './face/brows_worried.svg', false],
  ['brows_determined', './face/brows_determined.svg', false],
  ['brows_sleepy', './face/brows_sleepy.svg', false],
];

const MOUTH_VARIANTS = [
  ['mouth', './face/mouth_neutral.svg', true],
  ['mouth_smile', './face/mouth_smile.svg', false],
  ['mouth_frown', './face/mouth_frown.svg', false],
  ['mouth_open', './face/mouth_open.svg', false],
  ['mouth_small_o', './face/mouth_small_o.svg', false],
  ['mouth_wide', './face/mouth_wide.svg', false],
  ['mouth_teeth', './face/mouth_teeth.svg', false],
  ['mouth_laugh', './face/mouth_laugh.svg', false],
  ['mouth_shy', './face/mouth_shy.svg', false],
  ['mouth_disgusted', './face/mouth_disgusted.svg', false],
  ['mouth_determined', './face/mouth_determined.svg', false],
  ['mouth_thinking', './face/mouth_thinking.svg', false],
  ['mouth_worried', './face/mouth_worried.svg', false],
  ['mouth_bored', './face/mouth_bored.svg', false],
];

const parts = [
  // Core body & lower limbs
  layer('body', null, 12, 255, 717, [115, 375, 405, 620]),
  layer('skirt', 'body', 15, 253, 744, [95, 711, 430, 1080]),
  layer('thighL', 'body', 7, 190, 850, [130, 810, 255, 1160]),
  layer('shinL', 'thighL', 8, 190, 1127, [130, 1090, 255, 1550]),
  layer('footL', 'shinL', 9, 190, 1520, [130, 1480, 255, 1560]),
  layer('thighR', 'body', 7, 320, 850, [260, 810, 385, 1160]),
  layer('shinR', 'thighR', 8, 320, 1127, [260, 1090, 385, 1550]),
  layer('footR', 'shinR', 9, 320, 1520, [260, 1480, 385, 1560]),

  // Torso clothing & neck
  layer('midriff', 'body', 11, 250, 624, [143, 578, 371, 788]),
  layer('top', 'body', 18, 254, 532, [144, 471, 377, 655]),
  layer('neck', 'body', 17, 260, 405, [193, 307, 329, 462]),

  // Head & hair
  layer('head', 'neck', 30, 260, 395, [114, 100, 398, 374]),
  layer('hairBack', 'head', 3, 260, 395, [71, 51, 441, 442]),
  layer('hairFront', 'head', 35, 260, 114, [86, 54, 437, 412]),
  layer('blush', 'head', 30.5, 260, 282, BLUSH_BOX, './face/blush.svg', { visible: false }),

  // Face swap layers (all attached to head)
  ...EYE_VARIANTS.map(([name, path, visible]) =>
    layer(name, 'head', 31, 259, 244, EYE_BOX, path, { visible })
  ),
  ...BROW_VARIANTS.map(([name, path, visible]) =>
    layer(name, 'head', 32, 259, 204, BROW_BOX, path, { visible })
  ),
  ...MOUTH_VARIANTS.map(([name, path, visible]) =>
    layer(name, 'head', 33, 263, 308, MOUTH_BOX, path, { visible })
  ),

  // Signature facial mark & braids
  layer('mole', 'head', 32, 337, 266, [329, 258, 345, 274]),
  layer('braidL', 'head', 27, 149, 347, [102, 286, 222, 580]),
  layer('braidR', 'head', 27, 373, 346, [285, 285, 421, 581]),

  // Articulated arms (left = viewer's left, right = viewer's right)
  layer('leftUpperArm', 'body', 10, 137, 450, [84, 415, 180, 632]),
  layer('leftForearm', 'leftUpperArm', 22, 123, 593, [62, 567, 158, 735]),
  layer('leftHand', 'leftForearm', 21, 108, 718, [66, 700, 145, 807]),
  layer('rightUpperArm', 'body', 9, 373, 431, [330, 396, 426, 613]),
  layer('rightForearm', 'rightUpperArm', 25, 387, 574, [352, 548, 448, 716]),
  layer('rightHand', 'rightForearm', 24, 402, 699, [365, 681, 444, 788]),
];

const ALL_FACE_PARTS = [
  ...EYE_VARIANTS.map(([n]) => n),
  ...BROW_VARIANTS.map(([n]) => n),
  ...MOUTH_VARIANTS.map(([n]) => n),
  'blush',
];

function faceMap(eye, brow, mouth, blush = false) {
  const active = new Set([eye, brow, mouth]);
  if (blush) active.add('blush');
  return Object.fromEntries(ALL_FACE_PARTS.map((name) => [name, active.has(name)]));
}

export const mainCharacterManifest = {
  id: 'main-character',
  viewId: 'front',
  name: 'Main Character (Heroine)',
  version: '2.1.0',
  view: {
    ...VIEW_CONVENTIONS.front,
    facialVisibility: VIEW_FACIAL_VISIBILITY.front,
  },
  coordinateSpace: { width: ART_W, height: ART_H, offsetX: OFFSET_X, offsetY: OFFSET_Y },
  absoluteDrawOrder: true,
  gazeRig,
  partAliases: {
    leftArm: 'leftUpperArm',
    rightArm: 'rightUpperArm',
    leftLeg: 'thighL',
    rightLeg: 'thighR',
    leftLowerLeg: 'shinL',
    rightLowerLeg: 'shinR',
    leftFoot: 'footL',
    rightFoot: 'footR',
  },
  walkRig: {
    artWidth: ART_W,
    artHeight: ART_H,
    bodyPivotX: 255,
    bodyPivotY: 717,
    hipXLeft: 190,
    hipXRight: 320,
    hipY: 850,
    thighLength: 277,
    shinLength: 393,
    floorY: 1520,
  },
  // Ground plane y in normalized image space (feet rest cleanly on floor line)
  floorNormalizedY: (1546 + OFFSET_Y) / ART_H,
  // Subtle natural standing pose (degrees) applied at rest
  restPose: {
    leftUpperArm: -6,
    leftForearm: 5,
    rightUpperArm: 6,
    rightForearm: -5,
  },
  // Clean camera framing presets (viewHeight & center Y in world units where character height = 2.0)
  framing: {
    fullBody: { viewHeight: 2.05, cameraY: -0.02 },
    faceCloseup: { viewHeight: 0.56, cameraY: 0.52 },
  },
  parts,
  expressions: {
    neutral: faceMap('eyes', 'brows', 'mouth', false),
    happy: faceMap('eyes', 'brows_raised', 'mouth_smile', true),
    excited: faceMap('eyes_wide', 'brows_raised', 'mouth_wide', true),
    laughing: faceMap('eyes_happy', 'brows_raised', 'mouth_laugh', true),
    sad: faceMap('eyes_sad', 'brows_sad', 'mouth_frown', false),
    angry: faceMap('eyes_angry', 'brows_angry', 'mouth_teeth', false),
    surprised: faceMap('eyes_wide', 'brows_raised', 'mouth_small_o', false),
    confused: faceMap('eyes', 'brows_confused', 'mouth_thinking', false),
    worried: faceMap('eyes_sad', 'brows_worried', 'mouth_worried', false),
    scared: faceMap('eyes_scared', 'brows_worried', 'mouth_open', false),
    shy: faceMap('eyes_shy', 'brows_sad', 'mouth_shy', true),
    sleepy: faceMap('eyes_sleepy', 'brows_sleepy', 'mouth_small_o', false),
    bored: faceMap('eyes_sleepy', 'brows_sleepy', 'mouth_bored', false),
    thinking: faceMap('eyes', 'brows_confused', 'mouth_thinking', false),
    disgusted: faceMap('eyes_disgusted', 'brows_angry', 'mouth_disgusted', false),
    determined: faceMap('eyes_angry', 'brows_determined', 'mouth_determined', false),
    // Legacy aliases preserved for backward compatibility
    greeting: faceMap('eyes', 'brows_raised', 'mouth_smile', true),
    laugh: faceMap('eyes_happy', 'brows_raised', 'mouth_laugh', true),
  },
  views: {
    back: backViewManifest,
    top: topViewManifest,
    bottom: bottomViewManifest,
  },
};

// Self-register front view on the multi-view registry without duplicating parts
mainCharacterManifest.views.front = mainCharacterManifest;

export default mainCharacterManifest;
