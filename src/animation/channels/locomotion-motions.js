import { clamp, sampleKeyframes, smoothstep } from '../../utils/math.js';

const TAU = Math.PI * 2;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Solve a two-link IK leg (hip -> knee -> ankle) in artwork pixel space,
 * matching the exact planted-foot geometry from `presets/walk.js` so feet stay
 * crisp on the floor line with clean knee bend and zero ankle crossing.
 */
function solveTwoLinkLeg(rig, { hx, footX, footY, rootX, dropBody, bodyTurnDeg, direction = 1, kneeSign = 1 }) {
  const angle = (bodyTurnDeg * Math.PI) / 180;
  const hipOffsetY = rig.hipY - rig.bodyPivotY;
  const H = [
    rig.bodyPivotX + (hx - rig.bodyPivotX) * Math.cos(angle) + hipOffsetY * Math.sin(angle) + rootX,
    rig.bodyPivotY - (hx - rig.bodyPivotX) * Math.sin(angle) + hipOffsetY * Math.cos(angle) + dropBody,
  ];
  const dx = footX - H[0];
  const dy = footY - H[1];
  const raw = Math.hypot(dx, dy);
  const d = Math.min(rig.thighLength + rig.shinLength - 1e-5, Math.max(1, raw));
  const cosVal = clamp(
    (rig.thighLength * rig.thighLength + d * d - rig.shinLength * rig.shinLength) /
      (2 * rig.thighLength * d),
    -1,
    1
  );
  const bend = Math.acos(cosVal);
  const th = Math.atan2(dx, dy) + direction * kneeSign * bend;
  const K = [H[0] + rig.thighLength * Math.sin(th), H[1] + rig.thighLength * Math.cos(th)];
  const sh = Math.atan2(footX - K[0], footY - K[1]);

  return {
    thigh: th * RAD_TO_DEG - bodyTurnDeg,
    shin: (sh - th) * RAD_TO_DEG,
    foot: -sh * RAD_TO_DEG,
  };
}

function solveArticulatedLegIK(rig, {
  hx,
  offset,
  g,
  stride,
  lift,
  duty,
  direction,
  rootX,
  dropBody,
  bodyTurnDeg,
  liftPower = 1.25,
}) {
  const z = g + offset;
  const n = Math.floor(z + 1e-10);
  const phase = z - n;
  const swing = phase >= duty;
  const swingNorm = swing ? clamp((phase - duty) / (1 - duty), 0, 1) : 0;
  const sw = smoothstep(swingNorm);
  const advance = n + (swing ? sw : 0);
  const footLift = swing ? lift * Math.pow(Math.sin(Math.PI * swingNorm), liftPower) : 0;

  const solved = solveTwoLinkLeg(rig, {
    hx,
    footX: hx + direction * stride * advance,
    footY: rig.floorY - footLift,
    rootX,
    dropBody,
    bodyTurnDeg,
    direction,
    kneeSign: 1,
  });

  return {
    thigh: solved.thigh,
    shin: solved.shin,
    foot: solved.foot + (swing ? -8 * Math.sin(Math.PI * swingNorm) : 0),
  };
}

/**
 * Solve planted-foot crouch/land legs using the rig's exact hip/thigh/shin/floor IK
 * so feet remain solidly planted on the floor line with natural parallel knee bend.
 */
function solvePlantedCrouch(rig, dropArt, bodyTurnDeg = -3) {
  const angle = (bodyTurnDeg * Math.PI) / 180;
  const hipOffsetY = rig.hipY - rig.bodyPivotY;
  const dropBody = dropArt + hipOffsetY * (1 - Math.cos(angle));
  // Slight natural stance widening as knees bend, both knees pointing consistently forward-right (3/4 view)
  const L = solveTwoLinkLeg(rig, {
    hx: rig.hipXLeft,
    footX: rig.hipXLeft - 14,
    footY: rig.floorY,
    rootX: 0,
    dropBody,
    bodyTurnDeg,
    direction: 1,
    kneeSign: 1,
  });
  const R = solveTwoLinkLeg(rig, {
    hx: rig.hipXRight,
    footX: rig.hipXRight + 14,
    footY: rig.floorY,
    rootX: 0,
    dropBody,
    bodyTurnDeg,
    direction: 1,
    kneeSign: 1,
  });
  return {
    bodyYNorm: (-dropBody / rig.artHeight) * 2,
    L,
    R,
  };
}

/**
 * Shared articulated/generic gait evaluator used by walk, walkStart, walkStop, run, runStart, runStop.
 */
function evaluateGait(g, env, skeleton, {
  strideArt = 92,
  liftArt = 132,
  duty = 0.6,
  dropBase = 26,
  dropAmp = 9,
  bodyLean = -2.5,
  bodySwayDeg = 0.9,
  armSwing = 18,
  forearmBend = 10,
  braidSwing = 7,
  direction = 1,
}) {
  const walkRig = skeleton?.manifest?.walkRig;
  const sway = env * Math.sin(TAU * g);

  if (walkRig) {
    const rootX = direction * strideArt * g;
    const drop = env * (dropBase + dropAmp * Math.cos(4 * Math.PI * g));
    const bodyTurn = direction * (bodyLean * env) + bodySwayDeg * env * Math.sin(TAU * g);
    const angle = (bodyTurn * Math.PI) / 180;
    const hipOffsetY = walkRig.hipY - walkRig.bodyPivotY;
    const dropBody = drop + hipOffsetY * (1 - Math.cos(angle));

    const L = solveArticulatedLegIK(walkRig, {
      hx: walkRig.hipXLeft,
      offset: 0,
      g,
      stride: strideArt,
      lift: liftArt,
      duty,
      direction,
      rootX,
      dropBody,
      bodyTurnDeg: bodyTurn,
    });
    const R = solveArticulatedLegIK(walkRig, {
      hx: walkRig.hipXRight,
      offset: 0.5,
      g,
      stride: strideArt,
      lift: liftArt,
      duty,
      direction,
      rootX,
      dropBody,
      bodyTurnDeg: bodyTurn,
    });

    const yNorm = (-dropBody / walkRig.artHeight) * 2;
    return {
      parts: {
        body: { y: yNorm, rot: bodyTurn },
        skirt: { rot: -bodyTurn * 0.35 + sway * 1.6 },
        thighL: { rot: L.thigh * env },
        shinL: { rot: L.shin * env },
        footL: { rot: L.foot * env },
        thighR: { rot: R.thigh * env },
        shinR: { rot: R.shin * env },
        footR: { rot: R.foot * env },
        leftUpperArm: { rot: -8 * env - armSwing * sway },
        leftForearm: { rot: forearmBend * env - 3 * sway },
        leftHand: { rot: -3 * sway },
        rightUpperArm: { rot: 8 * env + armSwing * sway },
        rightForearm: { rot: -forearmBend * env - 3 * sway },
        rightHand: { rot: -3 * sway },
        head: { rot: -bodyTurn * 0.75 + 1.1 * env * Math.sin(TAU * g) },
        braidL: { rot: env * braidSwing * Math.sin(TAU * g - 0.65) },
        braidR: { rot: env * braidSwing * Math.sin(TAU * g - 0.9) },
      },
    };
  }

  // Fallback for 2-segment leg rigs (e.g. Minimal Starter)
  const legAngle = 22 * env * Math.sin(TAU * g);
  const bob = env * (0.018 * Math.abs(Math.sin(TAU * g)));
  return {
    parts: {
      body: { y: bob, rot: -bodyLean * 0.4 * env + sway * 1.4 },
      leftLeg: { rot: legAngle },
      rightLeg: { rot: -legAngle },
      leftFoot: { rot: -legAngle * 0.4 },
      rightFoot: { rot: legAngle * 0.4 },
      leftUpperArm: { rot: -armSwing * sway },
      rightUpperArm: { rot: armSwing * sway },
      head: { rot: sway * 1.5 },
    },
  };
}

/**
 * Full-body & lower-body locomotion motions (channel: 'locomotion').
 */
export const LOCOMOTION_MOTIONS = {
  walk: {
    id: 'walk',
    label: 'Walk',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: true,
    duration: 1.25,
    description: 'Seamless in-place two-bone IK walk cycle with planted foot contact, knee bend, and arm swing.',
    evaluate(t, duration, ctx) {
      const g = t / duration;
      return evaluateGait(g, 1, ctx?.skeleton, {
        strideArt: 94,
        liftArt: 130,
        duty: 0.6,
        dropBase: 26,
        dropAmp: 9,
        bodyLean: -2.4,
        armSwing: 17,
        forearmBend: 9,
        braidSwing: 6.5,
      });
    },
  },

  walkStart: {
    id: 'walkStart',
    label: 'Walk Start',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: false,
    duration: 0.7,
    description: 'Smooth acceleration from standing rest into the first walking stride.',
    evaluate(t, duration, ctx) {
      const u = clamp(t / duration, 0, 1);
      const env = smoothstep(u / 0.55);
      return evaluateGait(u * 0.6, env, ctx?.skeleton, {
        strideArt: 90,
        liftArt: 122,
        duty: 0.6,
        dropBase: 24,
        dropAmp: 8,
        bodyLean: -2.2,
        armSwing: 16,
        forearmBend: 8,
        braidSwing: 6,
      });
    },
  },

  walkStop: {
    id: 'walkStop',
    label: 'Walk Stop',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: false,
    duration: 0.7,
    description: 'Smooth deceleration from walking stride back to balanced standing rest.',
    evaluate(t, duration, ctx) {
      const u = clamp(t / duration, 0, 1);
      const env = 1 - smoothstep(u);
      return evaluateGait(0.4 + u * 0.6, env, ctx?.skeleton, {
        strideArt: 88,
        liftArt: 118,
        duty: 0.6,
        dropBase: 24,
        dropAmp: 8,
        bodyLean: -2.0,
        armSwing: 14,
        forearmBend: 8,
        braidSwing: 5,
      });
    },
  },

  run: {
    id: 'run',
    label: 'Run',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: true,
    duration: 0.68,
    description: 'Energetic running cycle with higher knee lift, forward lean, and active arm pump.',
    evaluate(t, duration, ctx) {
      const g = t / duration;
      const pose = evaluateGait(g, 1, ctx?.skeleton, {
        strideArt: 126,
        liftArt: 205,
        duty: 0.44,
        dropBase: 40,
        dropAmp: 24,
        bodyLean: -6.2,
        bodySwayDeg: 1.6,
        armSwing: 36,
        forearmBend: 38,
        braidSwing: 14,
      });
      const bounce = Math.max(0, Math.sin(4 * Math.PI * g - 0.3)) * 0.045;
      if (pose.parts.body) {
        pose.parts.body.y = (pose.parts.body.y ?? 0) + bounce;
      }
      return pose;
    },
  },

  runStart: {
    id: 'runStart',
    label: 'Run Start',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: false,
    duration: 0.52,
    description: 'Forward lean launch accelerating from standing into a run stride.',
    evaluate(t, duration, ctx) {
      const u = clamp(t / duration, 0, 1);
      const env = smoothstep(u / 0.5);
      return evaluateGait(u * 0.75, env, ctx?.skeleton, {
        strideArt: 120,
        liftArt: 190,
        duty: 0.46,
        dropBase: 38,
        dropAmp: 20,
        bodyLean: -6.0,
        armSwing: 34,
        forearmBend: 36,
        braidSwing: 12,
      });
    },
  },

  runStop: {
    id: 'runStop',
    label: 'Run Stop',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: false,
    duration: 0.65,
    description: 'Decelerating brake step settling cleanly back to standing rest.',
    evaluate(t, duration, ctx) {
      const u = clamp(t / duration, 0, 1);
      const env = 1 - smoothstep(u);
      return evaluateGait(0.25 + u * 0.75, env, ctx?.skeleton, {
        strideArt: 112,
        liftArt: 165,
        duty: 0.52,
        dropBase: 34,
        dropAmp: 14,
        bodyLean: -4.5,
        armSwing: 26,
        forearmBend: 24,
        braidSwing: 10,
      });
    },
  },

  jump: {
    id: 'jump',
    label: 'Jump',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: false,
    duration: 1.05,
    description: 'Full anticipation crouch, explosive launch, mid-air tuck, landing absorption, and recovery.',
    evaluate(t, duration, ctx) {
      const u = clamp(t / duration, 0, 1);
      const walkRig = ctx?.skeleton?.manifest?.walkRig;

      const squash = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.2, v: 1 },
        { t: 0.32, v: 0 },
        { t: 0.72, v: 0 },
        { t: 0.84, v: 0.85, ease: 'outCubic' },
        { t: 1, v: 0 },
      ], u);

      const air = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.3, v: 0 },
        { t: 0.52, v: 1, ease: 'outCubic' },
        { t: 0.74, v: 0, ease: 'inCubic' },
        { t: 1, v: 0 },
      ], u);

      const armLift = sampleKeyframes([
        { t: 0, v: 0 },
        { t: 0.2, v: -20 },
        { t: 0.48, v: 92, ease: 'outCubic' },
        { t: 0.74, v: 36 },
        { t: 0.86, v: -12 },
        { t: 1, v: 0 },
      ], u);

      if (walkRig) {
        const ik = solvePlantedCrouch(walkRig, 115 * squash, -3.5 * squash);
        const bodyY = air > 0.01 ? air * 0.24 : ik.bodyYNorm;
        return {
          parts: {
            body: { y: bodyY, rot: -3.5 * squash + 2.0 * air },
            thighL: { rot: ik.L.thigh * squash + 22 * air },
            shinL: { rot: ik.L.shin * squash - 36 * air },
            footL: { rot: ik.L.foot * squash + 14 * air },
            thighR: { rot: ik.R.thigh * squash + 18 * air },
            shinR: { rot: ik.R.shin * squash - 32 * air },
            footR: { rot: ik.R.foot * squash + 14 * air },
            leftUpperArm: { rot: -armLift },
            leftForearm: { rot: -18 * Math.max(0, armLift / 92) },
            rightUpperArm: { rot: armLift },
            rightForearm: { rot: 18 * Math.max(0, armLift / 92) },
            head: { rot: 3.5 * air - 3.5 * squash },
            braidL: { rot: 18 * air - 7 * squash },
            braidR: { rot: -18 * air + 7 * squash },
          },
        };
      }

      return {
        parts: {
          body: { y: air * 0.24 - squash * 0.08, rot: -2 * squash },
          leftLeg: { rot: -10 * squash + 12 * air },
          rightLeg: { rot: 10 * squash - 12 * air },
          leftUpperArm: { rot: -armLift },
          rightUpperArm: { rot: armLift },
          head: { rot: 3 * air },
        },
      };
    },
  },

  land: {
    id: 'land',
    label: 'Land',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: false,
    duration: 0.58,
    description: 'Impact landing knee absorption with planted feet and upright recovery.',
    evaluate(t, duration, ctx) {
      const u = clamp(t / duration, 0, 1);
      const squash = sampleKeyframes([
        { t: 0, v: 0.22 },
        { t: 0.24, v: 1, ease: 'outCubic' },
        { t: 0.62, v: 0.24 },
        { t: 1, v: 0 },
      ], u);
      const walkRig = ctx?.skeleton?.manifest?.walkRig;

      if (walkRig) {
        const ik = solvePlantedCrouch(walkRig, 125 * squash, -4.0 * squash);
        return {
          parts: {
            body: { y: ik.bodyYNorm, rot: -4.0 * squash },
            thighL: { rot: ik.L.thigh * squash },
            shinL: { rot: ik.L.shin * squash },
            footL: { rot: ik.L.foot * squash },
            thighR: { rot: ik.R.thigh * squash },
            shinR: { rot: ik.R.shin * squash },
            footR: { rot: ik.R.foot * squash },
            leftUpperArm: { rot: -24 * squash },
            leftForearm: { rot: -20 * squash },
            rightUpperArm: { rot: 24 * squash },
            rightForearm: { rot: 20 * squash },
            head: { y: -0.012 * squash, rot: 4 * squash },
            braidL: { rot: 10 * squash },
            braidR: { rot: -10 * squash },
          },
        };
      }

      return {
        parts: {
          body: { y: -0.09 * squash },
          leftLeg: { rot: -12 * squash },
          rightLeg: { rot: 12 * squash },
          leftUpperArm: { rot: -22 * squash },
          rightUpperArm: { rot: 22 * squash },
        },
      };
    },
  },

  crouch: {
    id: 'crouch',
    label: 'Crouch',
    channel: 'locomotion',
    category: 'locomotion',
    defaultLoop: true,
    duration: 1.8,
    description: 'Low crouched stance using planted-foot two-bone IK with subtle breathing.',
    evaluate(t, duration, ctx) {
      const p = (t / duration) * TAU;
      const breath = Math.sin(p) * 0.08;
      const walkRig = ctx?.skeleton?.manifest?.walkRig;

      if (walkRig) {
        const ik = solvePlantedCrouch(walkRig, 148 * (1 + breath), -4.5);
        return {
          parts: {
            body: { y: ik.bodyYNorm, rot: -4.5 },
            skirt: { rot: 3.0 },
            thighL: { rot: ik.L.thigh },
            shinL: { rot: ik.L.shin },
            footL: { rot: ik.L.foot },
            thighR: { rot: ik.R.thigh },
            shinR: { rot: ik.R.shin },
            footR: { rot: ik.R.foot },
            leftUpperArm: { rot: -14 - breath * 10 },
            leftForearm: { rot: -24 },
            rightUpperArm: { rot: 14 + breath * 10 },
            rightForearm: { rot: 24 },
            head: { rot: 4.5 },
            braidL: { rot: 7 + breath * 6 },
            braidR: { rot: -7 - breath * 6 },
          },
        };
      }

      return {
        parts: {
          body: { y: -0.11 * (1 + breath), rot: -3.5 },
          leftLeg: { rot: -16 * (1 + breath) },
          rightLeg: { rot: 16 * (1 + breath) },
          leftUpperArm: { rot: -16 },
          rightUpperArm: { rot: 16 },
          head: { rot: 3.5 },
        },
      };
    },
  },
};
