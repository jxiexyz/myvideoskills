import { VIEW_CONVENTIONS, VIEW_FACIAL_VISIBILITY } from '../../shared/semantic-rig-map.js';

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

/**
 * True Rear-Facing View Manifest for Main Character (Heroine).
 *
 * Anatomical mapping:
 * - Facing away from camera, so semantic `rightUpperArm` (her waving arm) sits on viewer-LEFT,
 *   and semantic `leftUpperArm` sits on viewer-RIGHT.
 * - Similarly `thighR`/`shinR`/`footR` sit on viewer-LEFT and `thighL`/`shinL`/`footL` on viewer-RIGHT.
 * - Zero front facial layers exist on this view so eyes/mouth can never leak onto the back of the head.
 */
const parts = [
  layer('body', null, 12, 256, 717, [115, 388, 396, 650]),
  layer('skirt', 'body', 15, 256, 744, [82, 712, 430, 1106]),

  // Rear legs (thighR on viewer-left, thighL on viewer-right)
  layer('thighR', 'body', 7, 190, 850, [130, 814, 252, 1164]),
  layer('shinR', 'thighR', 8, 190, 1127, [134, 1094, 246, 1546]),
  layer('footR', 'shinR', 9, 190, 1520, [142, 1490, 238, 1564]),

  layer('thighL', 'body', 7, 320, 850, [260, 814, 382, 1164]),
  layer('shinL', 'thighL', 8, 320, 1127, [264, 1094, 376, 1546]),
  layer('footL', 'shinL', 9, 320, 1520, [272, 1490, 368, 1564]),

  // Torso clothing & nape
  layer('midriff', 'body', 11, 256, 624, [144, 600, 368, 784]),
  layer('top', 'body', 18, 256, 532, [138, 480, 376, 656]),
  layer('neck', 'body', 17, 256, 405, [186, 326, 326, 456]),

  // Head & full back hair (covers rear cranium completely)
  layer('head', 'neck', 28, 256, 395, [116, 84, 396, 364]),
  layer('hairBack', 'head', 30, 256, 395, [64, 46, 448, 448]),
  layer('hairUpper', 'head', 34, 256, 140, [88, 46, 424, 402]),
  layer('braidR', 'head', 36, 148, 360, [96, 316, 214, 576]),
  layer('braidL', 'head', 36, 364, 360, [298, 316, 416, 576]),

  // Articulated arms (rightUpperArm on viewer-left, leftUpperArm on viewer-right)
  layer('rightUpperArm', 'body', 10, 137, 450, [82, 412, 182, 636]),
  layer('rightForearm', 'rightUpperArm', 22, 123, 593, [60, 565, 162, 744]),
  layer('rightHand', 'rightForearm', 21, 108, 718, [68, 696, 146, 808]),

  layer('leftUpperArm', 'body', 10, 373, 450, [330, 412, 430, 636]),
  layer('leftForearm', 'leftUpperArm', 22, 387, 593, [350, 565, 452, 744]),
  layer('leftHand', 'leftForearm', 21, 402, 718, [366, 696, 444, 808]),
];

export const backViewManifest = {
  id: 'main-character-back',
  characterId: 'main-character',
  viewId: 'back',
  name: 'Main Character (Back View)',
  version: '2.1.0',
  view: {
    ...VIEW_CONVENTIONS.back,
    facialVisibility: VIEW_FACIAL_VISIBILITY.back,
  },
  coordinateSpace: { width: ART_W, height: ART_H, offsetX: OFFSET_X, offsetY: OFFSET_Y },
  absoluteDrawOrder: true,
  gazeRig: null,
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
    bodyPivotX: 256,
    bodyPivotY: 717,
    hipXLeft: 320,
    hipXRight: 190,
    hipY: 850,
    thighLength: 277,
    shinLength: 393,
    floorY: 1520,
  },
  floorNormalizedY: (1546 + OFFSET_Y) / ART_H,
  restPose: {
    rightUpperArm: -6,
    rightForearm: 5,
    leftUpperArm: 6,
    leftForearm: -5,
  },
  framing: {
    fullBody: { viewHeight: 2.05, cameraY: -0.02 },
    faceCloseup: { viewHeight: 0.62, cameraY: 0.52 },
  },
  parts,
  expressions: {},
};

export default backViewManifest;
