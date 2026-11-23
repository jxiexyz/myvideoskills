/**
 * Shared Semantic Rig Contract & Multi-View Support Matrix for PuppetKit.
 *
 * Defines the canonical bone/part vocabulary, facial visibility rules,
 * directional projection conventions, and honest per-view motion support
 * classifications across all 4 implemented views (`front`, `back`, `top`, `bottom`)
 * plus extensible registry slots for future profile and 3/4 views.
 */

export const SUPPORTED_VIEW_IDS = ['front', 'back', 'top', 'bottom'];

/**
 * Extensible view slot descriptors reserved for future directional packs.
 * The view registry supports registering these at runtime without modifying core code.
 */
export const EXTENSIBLE_VIEW_SLOTS = [
  { id: 'leftProfile', label: 'Left Profile', status: 'planned' },
  { id: 'rightProfile', label: 'Right Profile', status: 'planned' },
  { id: 'frontThreeQuarterLeft', label: '3/4 Front Left', status: 'planned' },
  { id: 'frontThreeQuarterRight', label: '3/4 Front Right', status: 'planned' },
];

export const CANONICAL_SEMANTIC_PARTS = [
  'body',
  'skirt',
  'midriff',
  'top',
  'neck',
  'head',
  'hairBack',
  'hairFront',
  'hairCrown',
  'hairUpper',
  'braidL',
  'braidR',
  'leftUpperArm',
  'leftForearm',
  'leftHand',
  'rightUpperArm',
  'rightForearm',
  'rightHand',
  'thighL',
  'shinL',
  'footL',
  'thighR',
  'shinR',
  'footR',
];

export const VIEW_CONVENTIONS = {
  front: {
    id: 'front',
    label: 'Front',
    shortLabel: 'Front',
    direction: 'front',
    facing: 'toward-camera',
    projection: 'orthographic-front',
    showGround: true,
    faceVisible: true,
    description: 'Front-facing character rig with full 16-expression face, dynamic eye gaze, blink, and lip-sync.',
    framingConvention: 'Character faces viewer (+Z). Viewer-left is anatomical right; viewer-right is anatomical left.',
  },
  back: {
    id: 'back',
    label: 'Back',
    shortLabel: 'Back',
    direction: 'back',
    facing: 'away-from-camera',
    projection: 'orthographic-back',
    showGround: true,
    faceVisible: false,
    description: 'True rear-facing layered artwork showing full back hair volume, shoulder braids, rear maroon crop top, pleated skirt back, and shoe heels.',
    framingConvention: 'Character faces away from viewer (-Z). Semantic left/right limbs map to their true anatomical side (waving arm stays the same physical arm, now on viewer-left with mirrored Z rotation).',
  },
  top: {
    id: 'top',
    label: 'Top',
    shortLabel: 'Top',
    direction: 'top',
    facing: 'down-screen',
    projection: 'orthographic-top-down',
    showGround: false,
    faceVisible: false,
    description: 'Bird\'s-eye overhead layered artwork looking straight down onto crown hair part, off-shoulder collar, horizontally articulated arms, circular pleated skirt, and stepping toes.',
    framingConvention: 'Camera looks straight down (-Y). Character faces screen-down (+Y in SVG / -Y in Three.js) so viewer-left matches front view. Vertical lift (jump/crouch) maps to radial depth scale.',
  },
  bottom: {
    id: 'bottom',
    label: 'Bottom',
    shortLabel: 'Bottom',
    direction: 'bottom',
    facing: 'up-from-below',
    projection: 'low-angle-underside',
    showGround: false,
    faceVisible: false,
    description: 'Worm\'s-eye low-angle layered artwork looking upward from beneath the character: prominent shoe soles & treads in foreground, foreshortened legs entering dark skirt underside, midriff, crop top underside, arms, and underside of jaw/chin framed by hanging hair.',
    framingConvention: 'Camera looks upward from below (+Y). Foreground shoe soles scale and lift toward camera during walk/run; body shrinks away on jump and expands closer on crouch.',
  },
};

export const VIEW_FACIAL_VISIBILITY = {
  front: {
    faceVisible: true,
    eyes: true,
    brows: true,
    mouth: true,
    blush: true,
    gaze: true,
    talking: true,
    note: 'Full facial expression, gaze, blink, and viseme channels active.',
  },
  back: {
    faceVisible: false,
    eyes: false,
    brows: false,
    mouth: false,
    blush: false,
    gaze: false,
    talking: false,
    note: 'Face occluded by head/hair from behind. Expression, blink, gaze, and talking state remain synchronized internally.',
  },
  top: {
    faceVisible: false,
    eyes: false,
    brows: false,
    mouth: false,
    blush: false,
    gaze: false,
    talking: false,
    note: 'Only crown of head and top of hair are visible from above. Expression and talking state remain synchronized internally.',
  },
  bottom: {
    faceVisible: false,
    eyes: false,
    brows: false,
    mouth: false,
    blush: false,
    gaze: false,
    talking: false,
    note: 'Underside of chin and jawline visible only; front eyes/brows/mouth hidden to avoid bleed while expression state stays preserved internally.',
  },
};

/**
 * Per-motion × per-view support classification:
 * - `native`: Authored directly for this view's plane and anatomy.
 * - `adapted`: Retargeted cleanly by ViewAdapter into this view's projection (e.g. overhead stride/scale or underside sole-lift).
 * - `limited`: Partial visual readability due to perspective/occlusion (e.g. gaze direction when eyes are hidden, or vertical nod from straight above).
 * - `hidden`: Action evaluates internally and stays synced, but primary visual cue is occluded in this view.
 * - `unsupported`: Not supported across the cutout rig (e.g. thumbsUp lacking finger swap art).
 */
const FRONT_OVERRIDES = {
  headTurnLeft: { status: 'limited', reason: '2D front cutout uses subtle parallax/scale rather than a true profile head.' },
  headTurnRight: { status: 'limited', reason: '2D front cutout uses subtle parallax/scale rather than a true profile head.' },
};

const BACK_OVERRIDES = {
  lookLeft: { status: 'limited', reason: 'Head follows gaze direction cleanly, while eyes remain hidden from behind.' },
  lookRight: { status: 'limited', reason: 'Head follows gaze direction cleanly, while eyes remain hidden from behind.' },
  lookUp: { status: 'limited', reason: 'Head tilts upward subtly, while eyes remain hidden from behind.' },
  lookDown: { status: 'limited', reason: 'Head dips downward subtly, while eyes remain hidden from behind.' },
  glance: { status: 'limited', reason: 'Subtle rear head turn plays, while eye saccade is hidden from behind.' },
  lookAround: { status: 'limited', reason: 'Rear head scan plays clearly, while eye movement is occluded.' },
  headTurnLeft: { status: 'limited', reason: '2D rear cutout uses subtle parallax/scale rather than a true profile turn.' },
  headTurnRight: { status: 'limited', reason: '2D rear cutout uses subtle parallax/scale rather than a true profile turn.' },
};

const TOP_OVERRIDES = {
  nod: { status: 'limited', reason: 'Pitch nod projects to subtle forward/back crown shift from overhead.' },
  nodLoop: { status: 'limited', reason: 'Pitch nod projects to subtle forward/back crown shift from overhead.' },
  tiltLeft: { status: 'limited', reason: 'Lateral head tilt is foreshortened overhead; expressed as gentle crown shift/roll.' },
  tiltRight: { status: 'limited', reason: 'Lateral head tilt is foreshortened overhead; expressed as gentle crown shift/roll.' },
  lookLeft: { status: 'limited', reason: 'Expressed via overhead head yaw while eyes are occluded from above.' },
  lookRight: { status: 'limited', reason: 'Expressed via overhead head yaw while eyes are occluded from above.' },
  lookUp: { status: 'limited', reason: 'Expressed via subtle overhead chin/crown tilt while eyes are occluded.' },
  lookDown: { status: 'limited', reason: 'Expressed via subtle overhead crown tuck while eyes are occluded.' },
  glance: { status: 'limited', reason: 'Expressed via quick overhead head yaw while eye shift is hidden.' },
  lookAround: { status: 'limited', reason: 'Expressed via overhead head yaw sweep while eye movement is hidden.' },
  bow: { status: 'adapted', reason: 'Overhead bow leans crown and hair forward over shoulders.' },
};

const BOTTOM_OVERRIDES = {
  lookLeft: { status: 'limited', reason: 'Jaw/head turns toward direction while eyes are occluded from below.' },
  lookRight: { status: 'limited', reason: 'Jaw/head turns toward direction while eyes are occluded from below.' },
  lookUp: { status: 'limited', reason: 'Chin tilts slightly away from underside camera while eyes remain hidden.' },
  lookDown: { status: 'limited', reason: 'Chin dips closer toward underside camera while eyes remain hidden.' },
  glance: { status: 'limited', reason: 'Subtle underside jaw turn plays while eyes are hidden.' },
  lookAround: { status: 'limited', reason: 'Underside head turn sweeps left and right while eyes are hidden.' },
  headTurnLeft: { status: 'limited', reason: '2D low-angle cutout uses jaw parallax shift rather than full 3D yaw.' },
  headTurnRight: { status: 'limited', reason: '2D low-angle cutout uses jaw parallax shift rather than full 3D yaw.' },
};

const ALL_KNOWN_MOTION_IDS = [
  'idle', 'breathing', 'bodySway', 'weightShift',
  'nod', 'nodLoop', 'shake', 'tiltLeft', 'tiltRight',
  'headTurnLeft', 'headTurnRight',
  'lookLeft', 'lookRight', 'lookUp', 'lookDown', 'glance', 'lookAround',
  'wave', 'waveOnce', 'point', 'pointLeft', 'pointRight',
  'raiseLeftHand', 'raiseRightHand', 'raiseBothHands', 'handsUp', 'lowerHands',
  'shrug', 'clap', 'explain', 'talkingGesture', 'emphasisGesture',
  'recoil', 'surprisedReaction', 'laugh', 'bow',
  'walk', 'walkStart', 'walkStop', 'run', 'runStart', 'runStop',
  'jump', 'land', 'crouch',
];

function buildViewMatrix(viewId, defaultStatus, overrides) {
  const out = {};
  for (const id of ALL_KNOWN_MOTION_IDS) {
    out[id] = overrides[id] || { status: defaultStatus };
  }
  out.thumbsUp = {
    status: 'unsupported',
    reason: 'Requires dedicated thumb-extended hand swap SVG artwork; current rig uses open hand cutouts.',
  };
  return out;
}

export const MOTION_VIEW_SUPPORT = {
  front: buildViewMatrix('front', 'native', FRONT_OVERRIDES),
  back: buildViewMatrix('back', 'native', BACK_OVERRIDES),
  top: buildViewMatrix('top', 'adapted', TOP_OVERRIDES),
  bottom: buildViewMatrix('bottom', 'adapted', BOTTOM_OVERRIDES),
};

export function getMotionSupportForView(motionId, viewId = 'front') {
  const table = MOTION_VIEW_SUPPORT[viewId] || MOTION_VIEW_SUPPORT.front;
  if (table[motionId]) return { motionId, viewId, ...table[motionId] };
  return {
    motionId,
    viewId,
    status: viewId === 'front' ? 'native' : 'adapted',
  };
}
