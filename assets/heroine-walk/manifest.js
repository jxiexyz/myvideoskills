import baseGazeRig from '../../presets/heroine-eye-rig.js';
const gazeRig={...baseGazeRig,offset:{x:242,y:224.074074074}};
const point = (x, y) => ({ x: (x + 242) / 1024, y: (y + 224.074074074) / 2000 });

function layer(name, parent, z, x, y, [l, t, r, b]) {
  return {
    name, parent, z, pivot: point(x, y),
    polygon: [point(l, t), point(r, t), point(r, b), point(l, b)],
    image: new URL(`./${name}.svg`, import.meta.url).href,
  };
}

const parts = [
  layer('body', null, 12, 255, 717, [115, 375, 405, 620]),
  layer('skirt', 'body', 15, 253, 744, [95, 711, 430, 1080]),
  layer('thighL', 'body', 7, 190, 850, [130, 810, 255, 1160]),
  layer('shinL', 'thighL', 8, 190, 1127, [130, 1090, 255, 1550]),
  layer('footL', 'shinL', 9, 190, 1520, [130, 1480, 255, 1560]),
  layer('thighR', 'body', 7, 320, 850, [260, 810, 385, 1160]),
  layer('shinR', 'thighR', 8, 320, 1127, [260, 1090, 385, 1550]),
  layer('footR', 'shinR', 9, 320, 1520, [260, 1480, 385, 1560]),
  layer('midriff', 'body', 11, 250, 624, [143, 578, 371, 788]),
  layer('top', 'body', 18, 254, 532, [144, 471, 377, 655]),
  layer('neck', 'body', 17, 260, 405, [193, 307, 329, 462]),
  layer('head', 'neck', 30, 260, 395, [114, 100, 398, 374]),
  layer('hairBack', 'head', 3, 260, 395, [71, 51, 441, 442]),
  layer('hairFront', 'head', 35, 260, 114, [86, 54, 437, 412]),
  layer('eyes', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_happy', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_closed', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('brows', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('brows_raised', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('mouth', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('mouth_smile', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('smileTeeth', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('smileTongue', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('mouth_open', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('openTeeth', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('openTongue', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('mole', 'head', 32, 337, 266, [329, 258, 345, 274]),
  layer('braidL', 'head', 27, 149, 347, [102, 286, 222, 580]),
  layer('braidR', 'head', 27, 373, 346, [285, 285, 421, 581]),
  layer('leftUpperArm', 'body', 10, 137, 450, [84, 415, 180, 632]),
  layer('leftForearm', 'leftUpperArm', 22, 123, 593, [62, 567, 158, 735]),
  layer('leftHand', 'leftForearm', 21, 108, 718, [66, 700, 145, 807]),
  layer('rightUpperArm', 'body', 9, 373, 431, [330, 396, 426, 613]),
  layer('rightForearm', 'rightUpperArm', 25, 387, 574, [352, 548, 448, 716]),
  layer('rightHand', 'rightForearm', 24, 402, 699, [365, 681, 444, 788]),
];

function face(eye, brow, lip) {
  return Object.fromEntries([
    'eyes', 'eyes_happy', 'eyes_closed', 'brows', 'brows_raised',
    'mouth', 'mouth_smile', 'mouth_open',
  ].map(name => [name, [eye, brow, lip].includes(name)]));
}

export default {
  name: 'Walking heroine — planted-foot walk preset',
  gazeRig,
  absoluteDrawOrder: true,
  parts,
  expressions: {
    neutral: face('eyes', 'brows', 'mouth'),
    greeting: face('eyes', 'brows_raised', 'mouth_smile'),
    laugh: face('eyes_happy', 'brows_raised', 'mouth_open'),
  },
};

