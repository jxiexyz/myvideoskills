import { VIEW_CONVENTIONS, VIEW_FACIAL_VISIBILITY } from '../../shared/semantic-rig-map.js';

const ART_W = 1024;
const ART_H = 1600;

const point = (x, y) => ({
  x: x / ART_W,
  y: y / ART_H,
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
 * Worm's-Eye Low-Angle Underside View Manifest for Main Character (Heroine).
 *
 * Depth layering (far -> near camera):
 * - Hanging hair & braid ends behind chin (z=4..10)
 * - Underside of chin/jaw & neck (z=8..12)
 * - Upper chest, midriff, underside of off-shoulder maroon crop top & bell sleeves (z=13..22)
 * - Dark interior underside of pleated skirt (z=24)
 * - Foreshortened thighs & shins emerging downward toward camera (z=28..32)
 * - Large foreground shoe soles with molded treads closest to camera (z=38)
 */
const parts = [
  layer('body', null, 14, 512, 520, [326, 392, 698, 550]),

  // Underside torso & skirt
  layer('midriff', 'body', 16, 512, 620, [326, 536, 698, 718]),
  layer('top', 'body', 18, 512, 520, [332, 444, 692, 612]),
  layer('skirt', 'body', 24, 512, 740, [212, 622, 812, 980]),

  // Foreshortened legs emerging from dark skirt underside to large foreground shoe soles
  layer('thighL', 'body', 28, 426, 828, [348, 786, 488, 1054]),
  layer('shinL', 'thighL', 32, 408, 1012, [320, 978, 468, 1270]),
  layer('footL', 'shinL', 38, 399, 1230, [306, 1152, 492, 1514]),

  layer('thighR', 'body', 28, 598, 828, [536, 786, 676, 1054]),
  layer('shinR', 'thighR', 32, 616, 1012, [556, 978, 704, 1270]),
  layer('footR', 'shinR', 38, 625, 1230, [532, 1152, 718, 1514]),

  // Neck, underside of chin/jaw, hanging hair & braids (farthest from low camera)
  layer('neck', 'body', 12, 512, 420, [420, 322, 604, 468]),
  layer('head', 'neck', 8, 512, 344, [374, 146, 650, 386]),
  layer('hairBack', 'head', 4, 512, 344, [264, 94, 760, 498]),
  layer('braidL', 'head', 10, 362, 344, [324, 322, 402, 536]),
  layer('braidR', 'head', 10, 662, 344, [622, 322, 700, 536]),

  // Arms & open bell sleeves seen from below
  layer('leftUpperArm', 'body', 13, 356, 476, [276, 436, 398, 636]),
  layer('leftForearm', 'leftUpperArm', 20, 322, 606, [224, 574, 360, 774]),
  layer('leftHand', 'leftForearm', 22, 286, 738, [236, 714, 324, 836]),

  layer('rightUpperArm', 'body', 13, 668, 476, [626, 436, 748, 636]),
  layer('rightForearm', 'rightUpperArm', 20, 702, 606, [664, 574, 800, 774]),
  layer('rightHand', 'rightForearm', 22, 738, 738, [700, 714, 788, 836]),
];

export const bottomViewManifest = {
  id: 'main-character-bottom',
  characterId: 'main-character',
  viewId: 'bottom',
  name: 'Main Character (Bottom / Underside View)',
  version: '2.1.0',
  view: {
    ...VIEW_CONVENTIONS.bottom,
    facialVisibility: VIEW_FACIAL_VISIBILITY.bottom,
  },
  coordinateSpace: { width: ART_W, height: ART_H, offsetX: 0, offsetY: 0 },
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
  worldHeightScale: 0.96,
  floorNormalizedY: null,
  restPose: {
    leftUpperArm: -6,
    leftForearm: 4,
    rightUpperArm: 6,
    rightForearm: -4,
  },
  framing: {
    fullBody: { viewHeight: 2.05, cameraY: -0.02 },
    faceCloseup: { viewHeight: 0.72, cameraY: 0.48 },
  },
  parts,
  expressions: {},
};

export default bottomViewManifest;
