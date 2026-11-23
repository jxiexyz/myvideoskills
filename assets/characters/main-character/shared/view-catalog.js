import { frontViewManifest } from '../views/front/manifest.js';
import { backViewManifest } from '../views/back/manifest.js';
import { topViewManifest } from '../views/top/manifest.js';
import { bottomViewManifest } from '../views/bottom/manifest.js';
import {
  SUPPORTED_VIEW_IDS,
  EXTENSIBLE_VIEW_SLOTS,
  VIEW_CONVENTIONS,
  VIEW_FACIAL_VISIBILITY,
  MOTION_VIEW_SUPPORT,
  getMotionSupportForView,
} from './semantic-rig-map.js';

/**
 * Multi-View Registry for Main Character (Heroine).
 * Supports instant lookup of all 4 implemented views (`front`, `back`, `top`, `bottom`)
 * and runtime registration of future directional packs (`leftProfile`, `rightProfile`, etc.).
 */
export const MAIN_CHARACTER_VIEWS = {
  front: frontViewManifest,
  back: backViewManifest,
  top: topViewManifest,
  bottom: bottomViewManifest,
};

export function listMainCharacterViews() {
  return SUPPORTED_VIEW_IDS.map((id) => ({
    id,
    ...VIEW_CONVENTIONS[id],
    facialVisibility: VIEW_FACIAL_VISIBILITY[id],
    partCount: MAIN_CHARACTER_VIEWS[id].parts.length,
    implemented: true,
  }));
}

export {
  SUPPORTED_VIEW_IDS,
  EXTENSIBLE_VIEW_SLOTS,
  VIEW_CONVENTIONS,
  VIEW_FACIAL_VISIBILITY,
  MOTION_VIEW_SUPPORT,
  getMotionSupportForView,
};

export default MAIN_CHARACTER_VIEWS;
