import { mainCharacterManifest } from '../../manifest.js';
import { VIEW_CONVENTIONS, VIEW_FACIAL_VISIBILITY } from '../../shared/semantic-rig-map.js';

/**
 * Canonical Front View Manifest — re-exports the existing intact front artwork & rig
 * enriched with explicit multi-view metadata so front view remains 100% backward-compatible.
 */
export const frontViewManifest = {
  ...mainCharacterManifest,
  characterId: 'main-character',
  viewId: 'front',
  view: {
    ...VIEW_CONVENTIONS.front,
    facialVisibility: VIEW_FACIAL_VISIBILITY.front,
  },
};

export default frontViewManifest;
