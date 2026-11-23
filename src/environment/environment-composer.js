import * as THREE from 'three';
import { ENVIRONMENT_PALETTES, OutlineStyleSystem, StylizedLightingController } from './style-system.js';
import { ENVIRONMENT_TEMPLATES, buildEnvironmentTemplate } from './templates.js';
import { buildCameraShowcaseScene } from './camera-showcase.js';

/**
 * 8 reusable storytelling scene composition presets.
 * Grounded character sits at y = 0 (character rig floor aligns cleanly with environment floorY = -0.88).
 */
export const COMPOSITION_PRESETS = {
  center: {
    id: 'center',
    label: 'Center Hero',
    description: 'Balanced subject centered with generous upper graphic margin.',
    characterPos: { x: 0, y: 0, z: 0 },
    characterScale: 1.0,
    camera: { x: 0, y: 0.04, viewHeight: 2.35, tiltX: 0, tiltY: 0.04 },
  },
  left_anchored: {
    id: 'left_anchored',
    label: 'Left Anchored',
    description: 'Character positioned left, opening right half for hero props or callouts.',
    characterPos: { x: -0.95, y: 0, z: 0 },
    characterScale: 0.92,
    camera: { x: 0.14, y: 0.22, viewHeight: 2.75, tiltX: 0.07, tiltY: 0.04 },
  },
  right_anchored: {
    id: 'right_anchored',
    label: 'Right Anchored',
    description: 'Character positioned right, highlighting left hero object or financial graphic.',
    characterPos: { x: 0.92, y: 0, z: 0 },
    characterScale: 0.92,
    camera: { x: -0.14, y: 0.2, viewHeight: 2.72, tiltX: -0.07, tiltY: 0.04 },
  },
  wide_establishing: {
    id: 'wide_establishing',
    label: 'Wide Establishing',
    description: 'Pulls camera back to showcase architecture, sky depth, and hero scale.',
    characterPos: { x: -0.92, y: 0, z: 0 },
    characterScale: 0.88,
    camera: { x: 0.22, y: 0.24, viewHeight: 3.15, tiltX: 0.06, tiltY: 0.08 },
  },
  medium_shot: {
    id: 'medium_shot',
    label: 'Medium Shot',
    description: 'Waist-up editorial framing ideal for narration & kinetic titles.',
    characterPos: { x: -0.45, y: 0, z: 0 },
    characterScale: 1.0,
    camera: { x: -0.05, y: 0.24, viewHeight: 1.72, tiltX: 0.05, tiltY: 0.02 },
  },
  close_up: {
    id: 'close_up',
    label: 'Face Close-Up',
    description: 'Expressive portrait framing with soft 2.5D background depth.',
    characterPos: { x: 0, y: 0, z: 0 },
    characterScale: 1.0,
    camera: { x: 0, y: 0.44, viewHeight: 1.12, tiltX: 0.03, tiltY: 0.01 },
  },
  object_focus: {
    id: 'object_focus',
    label: 'Object Focus',
    description: 'Frames both the Heroine and the scene hero prop (car, jet, desk, or phone).',
    characterPos: { x: -0.98, y: 0, z: 0 },
    characterScale: 0.9,
    camera: { x: 0.24, y: 0.16, viewHeight: 2.65, tiltX: 0.1, tiltY: 0.04 },
  },
  over_the_shoulder: {
    id: 'over_the_shoulder',
    label: 'Over-the-Shoulder',
    description: 'Foreground smartphone / workspace focus with character framed beside.',
    characterPos: { x: -0.68, y: 0, z: -0.15 },
    characterScale: 1.04,
    camera: { x: 0.28, y: 0.14, viewHeight: 1.75, tiltX: 0.18, tiltY: 0.03 },
  },
};

export const COMPOSITION_PRESET_LIST = Object.values(COMPOSITION_PRESETS);

/**
 * Deterministic environmental motion controller.
 * Always evaluates purely from absolute `timeSec` — zero accumulated drift or randomness.
 */
export class EnvironmentAnimationController {
  constructor() {
    this.animables = [];
    this.enabled = true;
    this.time = 0;
  }

  setAnimables(list = []) {
    this.animables = Array.isArray(list) ? list : [];
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }

  evaluateAt(timeSec = 0) {
    this.time = Math.max(0, Number(timeSec) || 0);
    const t = this.enabled ? this.time : 0;

    for (const item of this.animables) {
      if (!item || !item.object) continue;
      const phase = item.phase || 0;
      if (item.type === 'cloud') {
        const range = item.xRange || 8;
        const speed = item.speed || 0.08;
        const raw = ((item.startX + t * speed + range) % (range * 2) + range * 2) % (range * 2) - range;
        item.object.position.x = raw;
      } else if (item.type === 'tree') {
        item.object.rotation.z = Math.sin(t * 1.15 + phase) * 0.032;
      } else if (item.type === 'plant') {
        item.object.rotation.z = Math.sin(t * 1.35 + phase) * 0.028;
      } else if (item.type === 'curtain') {
        item.object.rotation.z = Math.sin(t * 1.1 + phase) * 0.025 * (item.side || 1);
      } else if (item.type === 'screenBar') {
        const scaleY = 0.78 + 0.32 * (0.5 + 0.5 * Math.sin(t * 2.2 + phase));
        item.object.scale.y = scaleY;
        if (Number.isFinite(item.baseY)) {
          item.object.position.y = item.baseY - (1 - scaleY) * 0.06;
        }
      } else if (item.type === 'ticker') {
        const span = item.span || 1.6;
        const speed = item.speed || 0.45;
        const offset = ((t * speed + phase) % span) - span * 0.5;
        item.object.position.x = (item.baseX || 0) + offset;
      } else if (item.type === 'lampGlow') {
        const pulse = 0.94 + Math.sin(t * 2.4 + phase) * 0.06;
        item.object.scale.setScalar(pulse);
      } else if (item.type === 'water') {
        item.object.position.y = (item.baseY || 0) + Math.sin(t * 1.6 + phase) * 0.015;
      } else if (item.type === 'carPass') {
        const span = item.span || 9;
        const speed = item.speed || 1.25;
        const dir = item.dir || 1;
        const x = ((((t * speed + phase) % span) + span) % span) - span * 0.5;
        item.object.position.x = x * dir;
      } else if (item.type === 'float') {
        item.object.position.y = (item.baseY || 0) + Math.sin(t * 1.4 + phase) * (item.amp || 0.035);
      } else if (item.type === 'smartphone' && typeof item.smartphone?.update === 'function') {
        item.smartphone.update(t);
        if (item.floatAmp) {
          item.object.position.y = (item.baseY || 0) + Math.sin(t * 1.5 + phase) * item.floatAmp;
        }
      }
    }
  }
}

/**
 * Helper that computes deterministic character + camera placement from a named preset
 * or template-specific hero anchor.
 */
export class SceneCompositionDirector {
  static getPreset(presetId = 'center') {
    return COMPOSITION_PRESETS[presetId] || COMPOSITION_PRESETS.center;
  }

  static applyToCharacter(character, presetId = 'center', overrides = null) {
    if (!character || !character.root) return;
    const preset = SceneCompositionDirector.getPreset(presetId);
    const pos = overrides?.characterPos || preset.characterPos;
    const scale = overrides?.characterScale ?? preset.characterScale ?? 1;
    character.root.position.set(pos.x ?? 0, pos.y ?? 0, pos.z ?? 0);
    character.root.scale.setScalar(scale);
  }
}

/**
 * Composes, manages, and cleanly disposes layered 2.5D cartoon environments inside a PuppetEngine scene.
 */
export class EnvironmentComposer {
  constructor(scene, { floorY = -0.88 } = {}) {
    this.scene = scene;
    this.floorY = floorY;
    this.root = new THREE.Group();
    this.root.name = 'PuppetEnvironmentRoot';
    this.root.position.y = floorY;
    this.scene.add(this.root);

    this.lighting = new StylizedLightingController(scene);
    this.lighting.setVisible(false);

    this.animator = new EnvironmentAnimationController();
    this._currentStyle = null;
    this._currentBuilt = null;
    this._activeId = null;
    this._paletteId = 'warmEditorial';
    this._detailLevel = 'high';
    this._lightingMood = 'day';
    this._layerVisibility = {
      background: true,
      midground: true,
      interaction: true,
      foreground: true,
    };
    this._smartphone = null;
  }

  get activeTemplateId() {
    return this._activeId;
  }

  get smartphone() {
    return this._smartphone;
  }

  get anchors() {
    return this._currentBuilt?.anchors || {};
  }

  /** Get world-space coordinates for a named environment anchor (accounting for floorY). */
  getAnchorWorldPosition(anchorName) {
    const local = this.anchors?.[anchorName];
    if (!local) return null;
    return new THREE.Vector3(local.x, local.y + this.floorY, local.z);
  }

  setVisible(visible) {
    this.root.visible = Boolean(visible);
    this.lighting.setVisible(Boolean(visible));
  }

  setLayerVisibility(layers = {}) {
    Object.assign(this._layerVisibility, layers);
    if (!this._currentBuilt) return;
    for (const key of ['background', 'midground', 'interaction', 'foreground']) {
      const grp = this._currentBuilt.layers[key];
      if (grp) grp.visible = Boolean(this._layerVisibility[key]);
    }
  }

  setLightingMood(mood = 'day') {
    this._lightingMood = mood;
    const palette = ENVIRONMENT_PALETTES[this._paletteId] || ENVIRONMENT_PALETTES.warmEditorial;
    this.lighting.applyPalette(palette, mood);
  }

  setAnimationEnabled(enabled) {
    this.animator.setEnabled(enabled);
  }

  setSmartphoneState(patch) {
    if (this._smartphone) {
      this._smartphone.setState(patch);
      this._smartphone.update(this.animator.time);
    }
  }

  /** Build and mount one of the 37 environment templates. */
  load(templateId, {
    paletteId = null,
    detailLevel = this._detailLevel,
    lightingMood = this._lightingMood,
    includeSmartphone = false,
    smartphoneState = null,
    timeSec = 0,
  } = {}) {
    const meta = ENVIRONMENT_TEMPLATES[templateId];
    if (!meta) {
      throw new Error(`Unknown PuppetKit environment template: "${templateId}"`);
    }

    this.clear();

    const resolvedPalette = paletteId || meta.defaultPalette || 'warmEditorial';
    const palette = ENVIRONMENT_PALETTES[resolvedPalette] || ENVIRONMENT_PALETTES.warmEditorial;
    this._activeId = templateId;
    this._paletteId = palette.id;
    this._detailLevel = detailLevel;
    this._lightingMood = lightingMood;

    const style = new OutlineStyleSystem(palette);
    this._currentStyle = style;

    const built = buildEnvironmentTemplate(templateId, style, {
      detailLevel,
      includeSmartphone,
      smartphoneState,
    });

    this._currentBuilt = built;
    this._smartphone = built.smartphone || null;

    this.root.add(built.group);
    this.root.visible = true;
    this.lighting.setVisible(true);
    this.lighting.applyPalette(palette, lightingMood);

    this.setLayerVisibility(this._layerVisibility);
    this.animator.setAnimables(built.animables || []);
    this.animator.evaluateAt(timeSec);

    return {
      meta,
      palette,
      anchors: built.anchors,
      hasSmartphone: Boolean(this._smartphone),
      backgroundHex: palette.fogColor,
    };
  }

  /** Build and mount the dedicated multi-subject 2.5D Camera Showcase Set (Heroine + Smartphone + Sports Car + Jet + Mansion). */
  loadShowcase({
    paletteId = 'sunlitDay',
    lightingMood = 'day',
    smartphoneState = null,
    timeSec = 0,
  } = {}) {
    this.clear();

    const palette = ENVIRONMENT_PALETTES[paletteId] || ENVIRONMENT_PALETTES.sunlitDay;
    this._activeId = 'camera_showcase_set';
    this._paletteId = palette.id;
    this._lightingMood = lightingMood;

    const style = new OutlineStyleSystem(palette);
    this._currentStyle = style;

    const built = buildCameraShowcaseScene(style, { smartphoneState });
    this._currentBuilt = built;
    this._smartphone = built.smartphone || null;

    this.root.add(built.group);
    this.root.visible = true;
    this.lighting.setVisible(true);
    this.lighting.applyPalette(palette, lightingMood);

    this.setLayerVisibility(this._layerVisibility);
    this.animator.setAnimables(built.animables || []);
    this.animator.evaluateAt(timeSec);

    return {
      meta: {
        id: 'camera_showcase_set',
        name: 'Cinematic Camera Showcase Set',
        category: 'showcase',
        description: 'Multi-subject 4-layer 2.5D showcase environment featuring Main Character, Smartphone, Sports Car, Private Jet, and Hillside Mansion.',
      },
      palette,
      anchors: built.anchors,
      hasSmartphone: Boolean(this._smartphone),
      backgroundHex: palette.fogColor,
    };
  }

  /**
   * Apply pure deterministic 4-layer depth parallax driven by current camera state.
   * Zero accumulated drift: identical camera state always yields identical layer offsets.
   */
  applyCameraParallax(cameraState = null, parallaxStrength = 1.0) {
    if (!this._currentBuilt?.layers) return;
    const { background, midground, interaction, foreground } = this._currentBuilt.layers;
    const s = Math.max(0, Math.min(2, Number(parallaxStrength) || 0));
    const cx = Number(cameraState?.x) || 0;
    const cy = Number(cameraState?.y) || 0;
    const tx = Number(cameraState?.tiltX) || 0;
    const yaw = Number(cameraState?.orbitYaw) || 0;
    const panDriver = cx * 0.55 + tx * 0.8 + yaw * 1.4;

    if (background) {
      background.position.set(panDriver * 0.24 * s, cy * 0.08 * s, 0);
    }
    if (midground) {
      midground.position.set(panDriver * 0.08 * s, cy * 0.03 * s, 0);
    }
    if (interaction) {
      interaction.position.set(0, 0, 0);
    }
    if (foreground) {
      foreground.position.set(-panDriver * 0.22 * s, -cy * 0.06 * s, 0);
    }
  }

  evaluateAt(timeSec = 0) {
    this.animator.evaluateAt(timeSec);
  }

  clear() {
    if (this._smartphone) {
      this._smartphone.dispose();
      this._smartphone = null;
    }
    if (this._currentBuilt?.group) {
      this.root.remove(this._currentBuilt.group);
    }
    if (this._currentStyle) {
      this._currentStyle.dispose();
      this._currentStyle = null;
    }
    this._currentBuilt = null;
    this._activeId = null;
    this.animator.setAnimables([]);
    this.root.visible = false;
    this.lighting.setVisible(false);
  }

  dispose() {
    this.clear();
    this.lighting.dispose();
    this.scene.remove(this.root);
  }
}
