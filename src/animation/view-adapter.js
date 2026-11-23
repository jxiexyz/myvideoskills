import { clamp } from '../utils/math.js';
import {
  VIEW_CONVENTIONS,
  VIEW_FACIAL_VISIBILITY,
  getMotionSupportForView,
} from '../../assets/characters/main-character/shared/semantic-rig-map.js';

/**
 * ViewAdapter maps canonical semantic puppet pose deltas produced by the
 * shared AnimationController (in front-facing space) into view-specific
 * bone transforms for `front`, `back`, `top`, and `bottom` rigs.
 *
 * Guarantees:
 * - Zero drift: pure stateless transform from canonical pose deltas to target skeleton deltas.
 * - Identical normalized motion phase across all views at any frame time t.
 * - Anatomically faithful mirroring in `back` view (waving arm stays same physical arm).
 * - Clear overhead stride/depth projection in `top` view and worm's-eye sole-lift/depth in `bottom` view.
 */
export class ViewAdapter {
  constructor(viewId = 'front', viewMeta = null) {
    this.viewId = viewId || 'front';
    this.viewMeta = viewMeta || VIEW_CONVENTIONS[this.viewId] || VIEW_CONVENTIONS.front;
    this.facialVisibility =
      this.viewMeta?.facialVisibility ||
      VIEW_FACIAL_VISIBILITY[this.viewId] ||
      VIEW_FACIAL_VISIBILITY.front;
  }

  get faceVisible() {
    return this.facialVisibility?.faceVisible !== false;
  }

  getMotionSupport(motionId) {
    return getMotionSupportForView(motionId, this.viewId);
  }

  /**
   * Transform a canonical part-delta map (`Map<partName, { x, y, rot, scaleX, scaleY }>`)
   * into an adapted pose map matching the active view's coordinate conventions.
   *
   * @param {Map<string, { x: number, y: number, rot: number, scaleX: number, scaleY: number }>} canonicalPose
   * @param {import('../rig/skeleton.js').PuppetSkeleton} targetSkeleton
   * @returns {Map<string, { x: number, y: number, rot: number, scaleX: number, scaleY: number }>}
   */
  adaptPose(canonicalPose, targetSkeleton) {
    const out = new Map();
    for (const partName of targetSkeleton.parts.keys()) {
      out.set(partName, { x: 0, y: 0, rot: 0, scaleX: 1, scaleY: 1 });
    }

    if (this.viewId === 'front') {
      for (const [name, delta] of canonicalPose.entries()) {
        const resolved = targetSkeleton.resolveName(name);
        if (resolved !== name && canonicalPose.has(resolved)) continue;
        const dst = out.get(resolved);
        if (!dst) continue;
        dst.x = delta.x;
        dst.y = delta.y;
        dst.rot = delta.rot;
        dst.scaleX = delta.scaleX;
        dst.scaleY = delta.scaleY;
      }
      return out;
    }

    if (this.viewId === 'back') {
      return this._adaptBack(canonicalPose, targetSkeleton, out);
    }

    if (this.viewId === 'top') {
      return this._adaptTop(canonicalPose, targetSkeleton, out);
    }

    if (this.viewId === 'bottom') {
      return this._adaptBottom(canonicalPose, targetSkeleton, out);
    }

    // Fallback for any custom/future view: direct semantic pass-through
    for (const [name, delta] of canonicalPose.entries()) {
      const resolved = targetSkeleton.resolveName(name);
      if (resolved !== name && canonicalPose.has(resolved)) continue;
      const dst = out.get(resolved);
      if (!dst) continue;
      dst.x = delta.x;
      dst.y = delta.y;
      dst.rot = delta.rot;
      dst.scaleX = delta.scaleX;
      dst.scaleY = delta.scaleY;
    }
    return out;
  }

  /**
   * Back view: character turned 180° around vertical axis.
   * Semantic limb names (`rightUpperArm`, `leftUpperArm`, `thighR`, `thighL`, etc.)
   * are already placed on their anatomically correct rear screen sides in back/manifest.js,
   * so horizontal X translation and in-plane Z rotation invert sign cleanly!
   */
  _adaptBack(canonicalPose, targetSkeleton, out) {
    for (const [name, delta] of canonicalPose.entries()) {
      const resolved = targetSkeleton.resolveName(name);
      if (resolved !== name && canonicalPose.has(resolved)) continue;
      const dst = out.get(resolved);
      if (!dst) continue;
      dst.x = -delta.x;
      dst.y = delta.y;
      dst.rot = -delta.rot;
      dst.scaleX = delta.scaleX;
      dst.scaleY = delta.scaleY;
    }

    // Copy head rotation/sway gently into rear hair upper layer if present
    const head = canonicalPose.get('head');
    const hairUpper = out.get('hairUpper');
    if (head && hairUpper) {
      hairUpper.rot = -head.rot * 0.15;
    }
    return out;
  }

  /**
   * Top (bird's-eye) view: camera looks straight down onto crown; character faces screen-down.
   * - Vertical `body.y` (jump up / crouch down) projects to radial scale closer/farther from camera.
   * - Leg gait (`thighL`/`thighR` rotations) projects to alternating forward/back stepping toes (`footL`/`footR` Y offset).
   * - Arm gestures sweep clearly in the horizontal overhead plane (clap meets in front, wave oscillates clearly).
   * - Head shake/turn maps to clear overhead yaw; nod projects to subtle forward/back crown bob.
   */
  _adaptTop(canonicalPose, targetSkeleton, out) {
    const get = (n) => canonicalPose.get(n) || { x: 0, y: 0, rot: 0, scaleX: 1, scaleY: 1 };

    const body = get('body');
    const skirt = get('skirt');
    const head = get('head');
    const thighL = get('thighL');
    const thighR = get('thighR');
    const shinL = get('shinL');
    const shinR = get('shinR');
    const lArm = get('leftUpperArm');
    const lFore = get('leftForearm');
    const lHand = get('leftHand');
    const rArm = get('rightUpperArm');
    const rFore = get('rightForearm');
    const rHand = get('rightHand');
    const braidL = get('braidL');
    const braidR = get('braidR');

    // Vertical body motion (jump positive -> closer/larger; crouch negative -> farther/smaller)
    const depthScale = clamp(1 + body.y * 0.85, 0.82, 1.24);
    const bodyDst = out.get('body');
    if (bodyDst) {
      bodyDst.x = body.x * 0.8;
      bodyDst.y = clamp(body.y * 0.15, -0.05, 0.05);
      // Subtle torso twist synchronized with walk/sway
      const gaitTwist = (thighL.rot - thighR.rot) * 0.16;
      bodyDst.rot = clamp(body.rot * 1.25 + gaitTwist, -22, 22);
      bodyDst.scaleX = depthScale * body.scaleX;
      bodyDst.scaleY = depthScale * body.scaleY;
    }

    const skirtDst = out.get('skirt');
    if (skirtDst) {
      const flare = clamp(1 + Math.max(0, body.y) * 0.35 + Math.abs(thighL.rot - thighR.rot) * 0.0012, 0.96, 1.12);
      skirtDst.rot = clamp(skirt.rot * 1.4 - (thighL.rot - thighR.rot) * 0.1, -18, 18);
      skirtDst.scaleX = flare;
      skirtDst.scaleY = flare;
    }

    // Overhead stepping legs: front thigh rotation swings foot forward/backward out from under skirt!
    const mapTopLeg = (thigh, shin, thighName, footName) => {
      // Positive thigh swing moves foot forward (screen-down = negative Y in Three.js)
      const strideY = clamp(-thigh.rot * 0.0052 + shin.rot * 0.0014, -0.15, 0.15);
      const liftScale = clamp(1 + Math.max(0, Math.abs(shin.rot) - 8) * 0.004, 1, 1.18);
      const tDst = out.get(thighName);
      if (tDst) {
        tDst.y = strideY * 0.55;
        tDst.scaleX = liftScale;
        tDst.scaleY = liftScale;
      }
      const fDst = out.get(footName);
      if (fDst) {
        fDst.y = strideY * 0.95;
        fDst.rot = clamp(thigh.rot * 0.2, -14, 14);
        fDst.scaleX = liftScale;
        fDst.scaleY = liftScale;
      }
    };
    mapTopLeg(thighL, shinL, 'thighL', 'footL');
    mapTopLeg(thighR, shinR, 'thighR', 'footR');

    // Overhead arms:
    // Left arm points (-X); +rot swings forward (screen-down), -rot sweeps outward/back.
    // Right arm points (+X); -rot swings forward (screen-down), +rot sweeps outward/back.
    const setArm = (srcU, srcF, srcH, uName, fName, hName, isRight) => {
      const uDst = out.get(uName);
      const fDst = out.get(fName);
      const hDst = out.get(hName);
      const sign = isRight ? 1 : -1;
      // If arm is raised high (e.g. wave/raiseHands: sign*rot > 60), sweep slightly forward & scale up toward overhead camera!
      const raiseAmt = clamp((sign * srcU.rot - 40) / 100, 0, 1);
      const overheadScale = 1 + raiseAmt * 0.16;

      if (uDst) {
        // Clap has leftUpperArm > 0, rightUpperArm < 0 -> sweeps BOTH forward toward center!
        // Wave has rightUpperArm ~ +112 -> sweeps out cleanly to side/front so forearm wave is clearly visible.
        uDst.rot = clamp(srcU.rot * 0.58, -74, 74);
        uDst.y = -raiseAmt * 0.04 + srcU.y * 0.5;
        uDst.scaleX = overheadScale;
        uDst.scaleY = overheadScale;
      }
      if (fDst) {
        fDst.rot = clamp(srcF.rot * 0.72, -78, 78);
      }
      if (hDst) {
        hDst.rot = clamp(srcH.rot * 0.85, -50, 50);
      }
    };
    setArm(lArm, lFore, lHand, 'leftUpperArm', 'leftForearm', 'leftHand', false);
    setArm(rArm, rFore, rHand, 'rightUpperArm', 'rightForearm', 'rightHand', true);

    // Overhead head & braids
    const headDst = out.get('head');
    if (headDst) {
      headDst.x = head.x * 0.8;
      // Pitch nod projects to subtle forward/back shift from overhead
      headDst.y = clamp(head.y * 1.4, -0.055, 0.055);
      // Head shake/turn translates directly into crisp overhead yaw!
      const yawFromScale = (1 - head.scaleX) * 140 * Math.sign(head.x || 1);
      headDst.rot = clamp(head.rot * 1.25 + yawFromScale * 0.35, -34, 34);
    }

    const crownDst = out.get('hairCrown');
    if (crownDst) {
      crownDst.rot = clamp(-head.rot * 0.12, -8, 8);
    }

    const bLDst = out.get('braidL');
    if (bLDst) {
      bLDst.rot = clamp(braidL.rot * 0.9 - head.rot * 0.25, -26, 26);
      bLDst.y = clamp(head.y * 0.6, -0.03, 0.03);
    }
    const bRDst = out.get('braidR');
    if (bRDst) {
      bRDst.rot = clamp(braidR.rot * 0.9 - head.rot * 0.25, -26, 26);
      bRDst.y = clamp(head.y * 0.6, -0.03, 0.03);
    }

    return out;
  }

  /**
   * Bottom (worm's-eye low-angle) view: camera looks sharply UP from below.
   * - Jump UP moves character farther from the low camera (slight scale down); crouch drops closer (scale up).
   * - Walk/run drives unmistakable alternating foreground shoe sole lift, perspective scale, and stride shift!
   * - Arms & bell sleeves stay viewer-left / viewer-right consistent with Front view.
   * - Chin/jaw & hanging hair tilt cleanly with head motions; eyes never appear.
   */
  _adaptBottom(canonicalPose, targetSkeleton, out) {
    const get = (n) => canonicalPose.get(n) || { x: 0, y: 0, rot: 0, scaleX: 1, scaleY: 1 };

    const body = get('body');
    const skirt = get('skirt');
    const head = get('head');
    const neck = get('neck');
    const thighL = get('thighL');
    const shinL = get('shinL');
    const footL = get('footL');
    const thighR = get('thighR');
    const shinR = get('shinR');
    const footR = get('footR');
    const lArm = get('leftUpperArm');
    const lFore = get('leftForearm');
    const lHand = get('leftHand');
    const rArm = get('rightUpperArm');
    const rFore = get('rightForearm');
    const rHand = get('rightHand');
    const braidL = get('braidL');
    const braidR = get('braidR');

    // Looking up from below: jumping up moves away (smaller), crouching drops closer (larger)
    const depthScale = clamp(1 - body.y * 0.52, 0.84, 1.16);
    const bodyDst = out.get('body');
    if (bodyDst) {
      bodyDst.x = body.x * 0.9;
      bodyDst.y = clamp(body.y * 0.55, -0.14, 0.18);
      bodyDst.rot = clamp(body.rot * 0.9, -16, 16);
      bodyDst.scaleX = depthScale * body.scaleX;
      bodyDst.scaleY = depthScale * body.scaleY;
    }

    const skirtDst = out.get('skirt');
    if (skirtDst) {
      skirtDst.rot = clamp(skirt.rot * 1.1, -14, 14);
      const flare = clamp(1 + Math.abs(body.y) * 0.22, 0.96, 1.1);
      skirtDst.scaleX = flare;
      skirtDst.scaleY = flare;
    }

    // Foreground legs & prominent shoe soles: lift/step cleanly toward & away from low camera
    const mapBottomLeg = (thigh, shin, foot, tName, sName, fName) => {
      const liftRatio = clamp(Math.abs(shin.rot) / 68, 0, 1);
      const stridePush = clamp(thigh.rot * 0.0028, -0.09, 0.09);
      // Lifted foot pulls slightly upward toward skirt and shrinks slightly in perspective
      const soleScale = clamp(1 - liftRatio * 0.14 + stridePush * 1.2, 0.82, 1.14);

      const tDst = out.get(tName);
      if (tDst) {
        tDst.rot = clamp(thigh.rot * 0.45, -22, 22);
        tDst.y = liftRatio * 0.04;
      }
      const sDst = out.get(sName);
      if (sDst) {
        sDst.rot = clamp(shin.rot * 0.3, -24, 24);
        sDst.y = liftRatio * 0.06;
        sDst.scaleY = clamp(1 - liftRatio * 0.12, 0.82, 1.05);
      }
      const fDst = out.get(fName);
      if (fDst) {
        fDst.rot = clamp(foot.rot * 0.35 + thigh.rot * 0.25, -22, 22);
        fDst.y = liftRatio * 0.08 + stridePush * 0.4;
        fDst.scaleX = soleScale;
        fDst.scaleY = soleScale;
      }
    };
    mapBottomLeg(thighL, shinL, footL, 'thighL', 'shinL', 'footL');
    mapBottomLeg(thighR, shinR, footR, 'thighR', 'shinR', 'footR');

    // Arms & bell sleeves seen from below (same left/right polarity as front!)
    const mapBottomArm = (srcU, srcF, srcH, uName, fName, hName) => {
      const uDst = out.get(uName);
      const fDst = out.get(fName);
      const hDst = out.get(hName);
      if (uDst) {
        uDst.x = srcU.x * 0.85;
        uDst.y = srcU.y * 0.85;
        uDst.rot = clamp(srcU.rot * 0.82, -138, 138);
      }
      if (fDst) {
        fDst.rot = clamp(srcF.rot * 0.82, -85, 85);
      }
      if (hDst) {
        hDst.rot = clamp(srcH.rot * 0.85, -45, 45);
      }
    };
    mapBottomArm(lArm, lFore, lHand, 'leftUpperArm', 'leftForearm', 'leftHand');
    mapBottomArm(rArm, rFore, rHand, 'rightUpperArm', 'rightForearm', 'rightHand');

    // Neck, underside of chin/jaw, and hanging hair
    const neckDst = out.get('neck');
    if (neckDst) {
      neckDst.rot = clamp(neck.rot * 0.85, -15, 15);
    }
    const headDst = out.get('head');
    if (headDst) {
      headDst.x = head.x * 0.85;
      headDst.y = head.y * 0.85;
      headDst.rot = clamp(head.rot * 0.85, -24, 24);
      headDst.scaleX = head.scaleX;
      headDst.scaleY = head.scaleY;
    }
    const bLDst = out.get('braidL');
    if (bLDst) {
      bLDst.rot = clamp(braidL.rot * 0.9, -26, 26);
    }
    const bRDst = out.get('braidR');
    if (bRDst) {
      bRDst.rot = clamp(braidR.rot * 0.9, -26, 26);
    }

    return out;
  }
}

export function createViewAdapter(viewId, viewMeta = null) {
  return new ViewAdapter(viewId, viewMeta);
}
