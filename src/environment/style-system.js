import * as THREE from 'three';

/**
 * Curated cartoon color palettes coordinated with the main Heroine character's
 * warm dark ink (#140e10), chestnut hair (#382218), warm skin (#f6cfb3),
 * ruby top (#64101d), and slate pleated skirt (#383947).
 */
export const ENVIRONMENT_PALETTES = {
  warmEditorial: {
    id: 'warmEditorial',
    label: 'Warm Editorial',
    ink: '#140e10',
    skyTop: '#7cc4e8',
    skyBottom: '#fce7c8',
    wall: '#f7ead7',
    wallShade: '#e8d2b8',
    floor: '#c98a5b',
    floorAlt: '#b47448',
    trim: '#fff6ea',
    primary: '#e0644c',
    secondary: '#2f8f8d',
    accent: '#f2b84b',
    foliage: '#4b9b68',
    foliageDark: '#316e49',
    metal: '#536278',
    glass: '#9fdcf0',
    dark: '#2b3040',
    fogColor: '#f3e4d0',
    keyLight: '#fff4e0',
    fillSky: '#c7e5ff',
    fillGround: '#c48f6c',
    keyIntensity: 1.45,
    fillIntensity: 0.95,
  },
  sunlitDay: {
    id: 'sunlitDay',
    label: 'Sunlit Cartoon Day',
    ink: '#140e10',
    skyTop: '#4aa3e8',
    skyBottom: '#d8f1ff',
    wall: '#f5f2e8',
    wallShade: '#dde5e8',
    floor: '#d4a36a',
    floorAlt: '#bf8b52',
    trim: '#ffffff',
    primary: '#3578d4',
    secondary: '#f29e38',
    accent: '#e85d56',
    foliage: '#4caf60',
    foliageDark: '#2f7a44',
    metal: '#64768c',
    glass: '#8ed8f8',
    dark: '#263245',
    fogColor: '#d9effc',
    keyLight: '#fff8e8',
    fillSky: '#b7e2ff',
    fillGround: '#b59d7e',
    keyIntensity: 1.55,
    fillIntensity: 1.0,
  },
  mintStudio: {
    id: 'mintStudio',
    label: 'Teal & Marigold',
    ink: '#140e10',
    skyTop: '#6ec4c7',
    skyBottom: '#e5f6ec',
    wall: '#e8f5ef',
    wallShade: '#cbe4da',
    floor: '#b9936c',
    floorAlt: '#9e7854',
    trim: '#f8fffc',
    primary: '#23828a',
    secondary: '#f2a83b',
    accent: '#e25b58',
    foliage: '#3d9970',
    foliageDark: '#266c4f',
    metal: '#4a5c6a',
    glass: '#99e2e8',
    dark: '#20323a',
    fogColor: '#dcf2ea',
    keyLight: '#fff6e4',
    fillSky: '#bdeef0',
    fillGround: '#988877',
    keyIntensity: 1.4,
    fillIntensity: 0.95,
  },
  sunsetGold: {
    id: 'sunsetGold',
    label: 'Coral Sunset',
    ink: '#180d14',
    skyTop: '#4e558c',
    skyBottom: '#f7a474',
    wall: '#f7dec9',
    wallShade: '#e3b89d',
    floor: '#9e624d',
    floorAlt: '#824c3c',
    trim: '#ffefe2',
    primary: '#e0584c',
    secondary: '#f5b942',
    accent: '#3e8e9e',
    foliage: '#4a8559',
    foliageDark: '#2d593c',
    metal: '#4c4f6b',
    glass: '#f7c99e',
    dark: '#2c253d',
    fogColor: '#f2b894',
    keyLight: '#ffd1a3',
    fillSky: '#b49ee0',
    fillGround: '#874c3e',
    keyIntensity: 1.5,
    fillIntensity: 0.88,
  },
  emeraldFinance: {
    id: 'emeraldFinance',
    label: 'Emerald & Gold',
    ink: '#121418',
    skyTop: '#2a5a68',
    skyBottom: '#a7d6cc',
    wall: '#e6efe9',
    wallShade: '#c6dacd',
    floor: '#52606d',
    floorAlt: '#3e4a56',
    trim: '#f4f9f6',
    primary: '#1b8a5a',
    secondary: '#e8b339',
    accent: '#2a6fd6',
    foliage: '#349464',
    foliageDark: '#1f6443',
    metal: '#465866',
    glass: '#8fd5cf',
    dark: '#1c2a33',
    fogColor: '#cfe5dc',
    keyLight: '#fff8e6',
    fillSky: '#a8d9d4',
    fillGround: '#54665c',
    keyIntensity: 1.45,
    fillIntensity: 0.92,
  },
  twilightLuxury: {
    id: 'twilightLuxury',
    label: 'Champagne Luxury',
    ink: '#120f18',
    skyTop: '#1f2848',
    skyBottom: '#59638f',
    wall: '#efe8dc',
    wallShade: '#d4c9b8',
    floor: '#3f3b4a',
    floorAlt: '#2f2c38',
    trim: '#f7ecd5',
    primary: '#d49d3b',
    secondary: '#9c2d42',
    accent: '#4aa3c8',
    foliage: '#357a5b',
    foliageDark: '#20523d',
    metal: '#c7a45b',
    glass: '#7fa8d4',
    dark: '#1c1d2b',
    fogColor: '#3a4263',
    keyLight: '#ffe8bd',
    fillSky: '#7d8ec2',
    fillGround: '#4a3d3b',
    keyIntensity: 1.55,
    fillIntensity: 0.85,
  },
};

export const PALETTE_LIST = Object.values(ENVIRONMENT_PALETTES);

let _sharedToonGradient = null;
export function getSharedToonGradient() {
  if (_sharedToonGradient) return _sharedToonGradient;
  const data = new Uint8Array([
    145, 145, 145, 255,
    210, 210, 210, 255,
    255, 255, 255, 255,
  ]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  _sharedToonGradient = tex;
  return tex;
}

export class OutlineStyleSystem {
  constructor(palette = ENVIRONMENT_PALETTES.warmEditorial, { outlineScale = 1.0 } = {}) {
    this.palette = typeof palette === 'string'
      ? (ENVIRONMENT_PALETTES[palette] || ENVIRONMENT_PALETTES.warmEditorial)
      : (palette || ENVIRONMENT_PALETTES.warmEditorial);
    this.outlineScale = outlineScale;
    this._materials = new Map();
    this._lineMaterials = new Map();
    this._geometries = new Set();
    this._textures = new Set();
    this.toonGradient = getSharedToonGradient();
  }

  trackGeometry(geo) {
    this._geometries.add(geo);
    return geo;
  }

  trackTexture(tex) {
    this._textures.add(tex);
    return tex;
  }

  toon(colorHex, { emissive = null, emissiveIntensity = 0, opacity = 1, side = THREE.FrontSide } = {}) {
    const key = `toon:${colorHex}:${emissive || ''}:${emissiveIntensity}:${opacity}:${side}`;
    if (this._materials.has(key)) return this._materials.get(key);
    const mat = new THREE.MeshToonMaterial({
      color: new THREE.Color(colorHex),
      gradientMap: this.toonGradient,
      emissive: emissive ? new THREE.Color(emissive) : new THREE.Color(0x000000),
      emissiveIntensity,
      transparent: opacity < 1,
      opacity,
      side,
    });
    this._materials.set(key, mat);
    return mat;
  }

  flat(colorHex, { opacity = 1, depthWrite = true, side = THREE.FrontSide, polygonOffset = false } = {}) {
    const key = `flat:${colorHex}:${opacity}:${depthWrite}:${side}:${polygonOffset}`;
    if (this._materials.has(key)) return this._materials.get(key);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: opacity < 1,
      opacity,
      depthWrite,
      side,
      polygonOffset,
      polygonOffsetFactor: polygonOffset ? -1 : 0,
      polygonOffsetUnits: polygonOffset ? -1 : 0,
    });
    this._materials.set(key, mat);
    return mat;
  }

  edgeMaterial(colorHex = this.palette.ink, opacity = 0.92) {
    const key = `edge:${colorHex}:${opacity}`;
    if (this._lineMaterials.has(key)) return this._lineMaterials.get(key);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: opacity < 1,
      opacity,
    });
    this._lineMaterials.set(key, mat);
    return mat;
  }

  hullMaterial(colorHex = this.palette.ink) {
    const key = `hull:${colorHex}`;
    if (this._materials.has(key)) return this._materials.get(key);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      side: THREE.BackSide,
    });
    this._materials.set(key, mat);
    return mat;
  }

  createOutlinedMesh(
    geometry,
    colorHex,
    {
      unlit = false,
      emissive = null,
      emissiveIntensity = 0,
      opacity = 1,
      outline = 'edges',
      edgeThreshold = 22,
      hullScale = 1.035,
      outlineColor = this.palette.ink,
      outlineOpacity = 0.9,
      side = THREE.FrontSide,
      polygonOffset = false,
      name = '',
    } = {}
  ) {
    this.trackGeometry(geometry);
    const mat = unlit
      ? this.flat(colorHex, { opacity, side, polygonOffset })
      : this.toon(colorHex, { emissive, emissiveIntensity, opacity, side });
    const mesh = new THREE.Mesh(geometry, mat);
    if (name) mesh.name = name;

    if (outline === 'edges' || outline === 'both') {
      const edgesGeo = this.trackGeometry(new THREE.EdgesGeometry(geometry, edgeThreshold));
      const lines = new THREE.LineSegments(edgesGeo, this.edgeMaterial(outlineColor, outlineOpacity));
      lines.scale.setScalar(1.001);
      mesh.add(lines);
    }
    if ((outline === 'hull' || outline === 'both') && this.outlineScale > 0) {
      const s = 1 + (hullScale - 1) * this.outlineScale;
      const hull = new THREE.Mesh(geometry, this.hullMaterial(outlineColor));
      hull.scale.setScalar(s);
      mesh.add(hull);
    }
    return mesh;
  }

  box(w, h, d, colorHex, opts = {}) {
    const geo = new THREE.BoxGeometry(w, h, d);
    if (opts.bottomPivot) geo.translate(0, h / 2, 0);
    return this.createOutlinedMesh(geo, colorHex, opts);
  }

  cylinder(rTop, rBot, h, radialSegments, colorHex, opts = {}) {
    const geo = new THREE.CylinderGeometry(rTop, rBot, h, radialSegments);
    if (opts.bottomPivot) geo.translate(0, h / 2, 0);
    return this.createOutlinedMesh(geo, colorHex, { outline: 'hull', hullScale: 1.04, ...opts });
  }

  sphere(r, wSeg, hSeg, colorHex, opts = {}) {
    const geo = new THREE.SphereGeometry(r, wSeg, hSeg);
    return this.createOutlinedMesh(geo, colorHex, { outline: 'hull', hullScale: 1.045, ...opts });
  }

  contactShadow(radiusX = 0.45, radiusZ = 0.25, opacity = 0.22) {
    const geo = this.trackGeometry(new THREE.CircleGeometry(1, 28));
    geo.rotateX(-Math.PI / 2);
    geo.scale(radiusX, 1, radiusZ);
    const mat = this.flat(this.palette.ink, { opacity, depthWrite: false, polygonOffset: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.012;
    mesh.renderOrder = -5;
    return mesh;
  }

  skyBackdrop(width = 24, height = 12, topColor = this.palette.skyTop, bottomColor = this.palette.skyBottom, z = -12) {
    const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    if (canvas) {
      canvas.width = 4;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 128);
        grad.addColorStop(0, topColor);
        grad.addColorStop(0.68, bottomColor);
        grad.addColorStop(1, bottomColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 4, 128);
      }
      const tex = this.trackTexture(new THREE.CanvasTexture(canvas));
      tex.colorSpace = THREE.SRGBColorSpace;
      const geo = this.trackGeometry(new THREE.PlaneGeometry(width, height));
      const mat = new THREE.MeshBasicMaterial({ map: tex, depthWrite: false });
      this._materials.set(`sky:${topColor}:${bottomColor}:${width}:${height}`, mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, height * 0.25, z);
      mesh.renderOrder = -50;
      return mesh;
    }
    const geo = this.trackGeometry(new THREE.PlaneGeometry(width, height));
    const mesh = new THREE.Mesh(geo, this.flat(topColor, { depthWrite: false }));
    mesh.position.set(0, height * 0.25, z);
    mesh.renderOrder = -50;
    return mesh;
  }

  dispose() {
    for (const g of this._geometries) g.dispose?.();
    for (const m of this._materials.values()) m.dispose?.();
    for (const l of this._lineMaterials.values()) l.dispose?.();
    for (const t of this._textures) t.dispose?.();
    this._geometries.clear();
    this._materials.clear();
    this._lineMaterials.clear();
    this._textures.clear();
  }
}

export class StylizedLightingController {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'PuppetStylizedLighting';

    this.hemi = new THREE.HemisphereLight(0xd8ecff, 0x9c7b62, 0.95);
    this.key = new THREE.DirectionalLight(0xfff4e0, 1.45);
    this.key.position.set(3.8, 6.2, 5.2);

    this.rim = new THREE.DirectionalLight(0xc2dfff, 0.45);
    this.rim.position.set(-4.2, 3.0, -3.5);

    this.group.add(this.hemi, this.key, this.rim);
    this.scene.add(this.group);
    this.mood = 'day';
  }

  applyPalette(palette, mood = 'day') {
    const p = typeof palette === 'string'
      ? (ENVIRONMENT_PALETTES[palette] || ENVIRONMENT_PALETTES.warmEditorial)
      : (palette || ENVIRONMENT_PALETTES.warmEditorial);
    this.mood = mood;

    let keyMult = 1.0;
    let fillMult = 1.0;
    let keyColor = p.keyLight;
    let skyColor = p.fillSky;

    if (mood === 'warm') {
      keyColor = '#ffd9a8';
      keyMult = 1.1;
    } else if (mood === 'cool') {
      keyColor = '#e2f1ff';
      skyColor = '#9ec9f5';
    } else if (mood === 'dramatic') {
      keyMult = 1.25;
      fillMult = 0.65;
    } else if (mood === 'night') {
      keyColor = '#b4c9ff';
      skyColor = '#4c5c8c';
      keyMult = 0.95;
      fillMult = 0.72;
    }

    this.key.color.set(keyColor);
    this.key.intensity = (p.keyIntensity ?? 1.45) * keyMult;
    this.hemi.color.set(skyColor);
    this.hemi.groundColor.set(p.fillGround || '#9a7a62');
    this.hemi.intensity = (p.fillIntensity ?? 0.95) * fillMult;
  }

  setVisible(visible) {
    this.group.visible = Boolean(visible);
  }

  dispose() {
    this.scene.remove(this.group);
  }
}
