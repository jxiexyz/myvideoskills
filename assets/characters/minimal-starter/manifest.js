const W = 1024;
const H = 1600;
const pt = (x, y) => ({ x: x / W, y: y / H });

function layer(name, parent, z, px, py, [l, t, r, b], relPath = `./${name}.svg`, extra = {}) {
  return {
    name,
    parent,
    z,
    pivot: pt(px, py),
    polygon: [pt(l, t), pt(r, t), pt(r, b), pt(l, b)],
    image: new URL(relPath, import.meta.url).href,
    ...extra,
  };
}

const EYE_BOX = [380, 390, 644, 510];
const BROW_BOX = [390, 336, 634, 424];
const MOUTH_BOX = [436, 500, 588, 602];
const BLUSH_BOX = [370, 470, 654, 524];

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
  layer('body', null, 10, 512, 840, [386, 660, 638, 1020]),
  layer('leftLeg', 'body', 6, 456, 990, [420, 976, 486, 1290]),
  layer('leftFoot', 'leftLeg', 7, 450, 1272, [386, 1258, 482, 1316]),
  layer('rightLeg', 'body', 6, 568, 990, [538, 976, 604, 1290]),
  layer('rightFoot', 'rightLeg', 7, 574, 1272, [542, 1258, 638, 1316]),
  layer('leftUpperArm', 'body', 8, 406, 742, [320, 720, 424, 895]),
  layer('leftForearm', 'leftUpperArm', 9, 340, 875, [294, 856, 360, 1028]),
  layer('leftHand', 'leftForearm', 11, 314, 1008, [280, 992, 348, 1058]),
  layer('rightUpperArm', 'body', 8, 618, 742, [600, 720, 704, 895]),
  layer('rightForearm', 'rightUpperArm', 9, 684, 875, [664, 856, 730, 1028]),
  layer('rightHand', 'rightForearm', 11, 710, 1008, [676, 992, 744, 1058]),
  layer('head', 'body', 20, 512, 625, [320, 258, 704, 642]),
  layer('blush', 'head', 21, 512, 496, BLUSH_BOX, './face/blush.svg', { visible: false }),
  ...EYE_VARIANTS.map(([name, p, visible]) => layer(name, 'head', 22, 512, 445, EYE_BOX, p, { visible })),
  ...BROW_VARIANTS.map(([name, p, visible]) => layer(name, 'head', 23, 512, 390, BROW_BOX, p, { visible })),
  ...MOUTH_VARIANTS.map(([name, p, visible]) => layer(name, 'head', 24, 512, 540, MOUTH_BOX, p, { visible })),
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

export const minimalStarterManifest = {
  id: 'minimal-starter',
  name: 'Minimal Starter (Demo Rig)',
  version: '2.0.0',
  coordinateSpace: { width: W, height: H },
  absoluteDrawOrder: true,
  partAliases: {
    leftArm: 'leftUpperArm',
    rightArm: 'rightUpperArm',
    thighL: 'leftLeg',
    thighR: 'rightLeg',
    footL: 'leftFoot',
    footR: 'rightFoot',
  },
  floorNormalizedY: 1303 / H,
  restPose: {},
  framing: {
    fullBody: { viewHeight: 1.85, cameraY: 0.04 },
    faceCloseup: { viewHeight: 0.62, cameraY: 0.44 },
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
  },
};

export default minimalStarterManifest;
