const tau = 2 * Math.PI;
const sine = (t, hz, phase = 0) => Math.sin(tau * hz * t + phase);

function ease(t, from, to) {
  const x = Math.min(1, Math.max(0, (t - from) / (to - from)));
  return x * x * (3 - 2 * x);
}

function beat(t, start, arrive, leave, end) {
  return ease(t, start, arrive) * (1 - ease(t, leave, end));
}

export function poseAt(t) {
  const notice = beat(t, 0.65, 1.55, 2.55, 3.6);
  const wave = beat(t, 2.35, 3.22, 4.85, 5.92);
  const laugh = beat(t, 5.15, 5.95, 7.35, 8.9);
  const bow = beat(t, 8.18, 8.92, 9.14, 9.95);
  const sway = sine(t, 0.8);
  const breath = sine(t, 1.05, 0.55);
  const laughBounce = laugh * sine(t, 2.65);
  return {
    // Angles are in degrees and displacements in stage pixels.
    turns: {
      body: 1.7 * sway - 2 * notice + 2.3 * laugh,
      skirt: -0.85 * sine(t - 0.13, 0.8),
      head: 2.8 * sine(t, 0.89, 1.1) - 5 * notice + 4 * wave + 5 * bow + 2.5 * laughBounce,
      braidL: 4.2 * sine(t - 0.1, 1.13) + 2.5 * laughBounce,
      braidR: -3.5 * sine(t - 0.17, 1.04) - 2.5 * laughBounce,
      leftUpperArm: 2.5 * breath - 10 * laugh + 3 * bow,
      leftForearm: 5 + 3.2 * sway + 67 * laugh + 16 * bow,
      leftHand: -4 * breath - 12 * laugh,
      rightUpperArm: -2.5 * breath - 15 * wave + 7 * laugh,
      rightForearm: 3.6 * sway + 156 * wave - 40 * laugh,
      rightHand: 4 * breath + wave * (14 + 23 * sine(t, 2.5)),
      mouth_open: 1.5 * laughBounce,
    },
    x: 8.8 * sway + 5 * notice - 10 * wave + 4 * sine(t, 1.41, 1.2),
    y: 11 * breath + 5 * notice + 11 * laughBounce - 9 * bow,
    expression: laugh > 0.30 ? 'laugh' : notice + wave > 0.36 || t > 8.55 ? 'greeting' : 'neutral',
    blink: [0.57, 2.08, 4.56, 7.99, 9.43].some(center => Math.abs(t - center) < 0.062),
  };
}

export const scene = { bg: 0xaf7a43, room: 'room.svg', worldHeight: 3.2 };

