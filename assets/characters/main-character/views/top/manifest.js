import { VIEW_CONVENTIONS, VIEW_FACIAL_VISIBILITY } from '../../shared/semantic-rig-map.js';

const ART_W = 1024;
const ART_H = 1024;

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
 * Bird's-Eye Top-Down View Manifest for Main Character (Heroine).
 *
 * Screen convention:
 * - Camera looks straight down (-Y).
 * - Character faces SCREEN-DOWN (+Y in SVG / -Y in Three.js) so viewer-left matches Front view.
 * - Arms extend left & right from shoulders and articulate cleanly in the horizontal plane.
 * - Feet/toes step forward and back from underneath the circular pleated skirt.
 */
const parts = [
  layer('body', null, 18, 512, 512, [308, 408, 716, 602]),

  // Overhead legs & feet peeking out beneath circular pleated skirt
  layer('thighL', 'body', 4, 448, 532, [392, 468, 504, 596]),
  layer('footL', 'thighL', 6, 448, 560, [400, 520, 496, 668]),
  layer('thighR', 'body', 4, 576, 532, [520, 468, 632, 596]),
  layer('footR', 'thighR', 6, 576, 560, [528, 520, 624, 668]),

  // Circular pleated skirt & off-shoulder maroon collar
  layer('skirt', 'body', 10, 512, 512, [276, 312, 748, 714]),
  layer('top', 'body', 22, 512, 518, [328, 440, 696, 616]),

  // Horizontally extending arms (left = viewer-left, right = viewer-right)
  layer('leftUpperArm', 'body', 16, 342, 512, [196, 460, 374, 572]),
  layer('leftForearm', 'leftUpperArm', 20, 232, 518, [102, 468, 256, 588]),
  layer('leftHand', 'leftForearm', 19, 132, 528, [44, 482, 148, 574]),

  layer('rightUpperArm', 'body', 16, 682, 512, [650, 460, 828, 572]),
  layer('rightForearm', 'rightUpperArm', 20, 792, 518, [768, 468, 922, 588]),
  layer('rightHand', 'rightForearm', 19, 892, 528, [876, 482, 980, 574]),

  // Head crown, hair part & forward-draped braids
  layer('head', 'body', 28, 512, 510, [374, 380, 650, 646]),
  layer('braidL', 'head', 30, 418, 562, [362, 524, 468, 704]),
  layer('braidR', 'head', 30, 606, 562, [556, 524, 662, 704]),
  layer('hairCrown', 'head', 35, 512, 490, [328, 312, 696, 644]),
];

export const topViewManifest = {
  id: 'main-character-top',
  characterId: 'main-character',
  viewId: 'top',
  name: 'Main Character (Top / Bird\'s-Eye View)',
  version: '2.1.0',
  view: {
    ...VIEW_CONVENTIONS.top,
    facialVisibility: VIEW_FACIAL_VISIBILITY.top,
  },
  coordinateSpace: { width: ART_W, height: ART_H, offsetX: 0, offsetY: 0 },
  absoluteDrawOrder: true,
  gazeRig: null,
  partAliases: {
    leftArm: 'leftUpperArm',
    rightArm: 'rightUpperArm',
    leftLeg: 'thighL',
    rightLeg: 'thighR',
    leftFoot: 'footL',
    rightFoot: 'footR',
  },
  // No upright vertical ground plane in overhead view; use balanced centered framing
  worldHeightScale: 0.72,
  floorNormalizedY: null,
  restPose: {
    leftUpperArm: 36,
    leftForearm: 22,
    rightUpperArm: -36,
    rightForearm: -22,
  },
  framing: {
    fullBody: { viewHeight: 1.75, cameraY: 0.0 },
    faceCloseup: { viewHeight: 0.78, cameraY: 0.0 },
  },
  parts,
  expressions: {},
};

export default topViewManifest;
