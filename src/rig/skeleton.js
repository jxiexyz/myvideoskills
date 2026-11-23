import * as THREE from 'three';
import { PuppetPart } from './part.js';

export class PuppetSkeleton {
  constructor(image, manifest, options = {}) {
    this.image = image;
    this.manifest = manifest;
    this.root = new THREE.Group();
    this.root.name = manifest.name || 'PuppetCharacter';
    this.parts = new Map();
    this.partAliases = manifest.partAliases ? { ...manifest.partAliases } : {};

    const naturalH = image.naturalHeight || image.height || 1000;
    const naturalW = image.naturalWidth || image.width || 1000;
    const scale = options.worldHeight ? options.worldHeight / naturalH : 1 / naturalH;
    this.worldScale = scale;

    const ordered = manifest.absoluteDrawOrder
      ? manifest.parts
      : [...manifest.parts].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

    for (const def of ordered) {
      const parent = def.parent ? this.parts.get(def.parent) : null;
      if (def.parent && !parent) {
        throw new Error(`Parent part '${def.parent}' must appear before '${def.name}' in manifest.parts.`);
      }
      const source = options.partImages?.get(def.name) ?? image;
      const part = new PuppetPart(source, def, scale, parent ? parent.definition.pivot : null);
      if (manifest.absoluteDrawOrder) {
        part.group.position.z = 0;
        part.mesh.renderOrder = def.z ?? 0;
        part.captureRestTransform();
      }
      this.parts.set(def.name, part);
      (parent?.group || this.root).add(part.group);
    }

    // Apply optional manifest standing restPose rotations and bake into restTransform
    if (manifest.restPose) {
      for (const [partName, deg] of Object.entries(manifest.restPose)) {
        const part = this.get(partName);
        if (part && Number.isFinite(deg)) {
          part.group.rotation.z = THREE.MathUtils.degToRad(deg);
          part.captureRestTransform();
        }
      }
    }

    this.imageAspect = naturalW / naturalH;
    this.worldHeight = naturalH * scale;
    this.root.scale.setScalar(options.scale ?? 1);
    this.root.position.set(...(options.position || [0, 0, 0]));
    this.restRoot = {
      x: this.root.position.x,
      y: this.root.position.y,
      z: this.root.position.z,
      scale: options.scale ?? 1,
    };

    this._debugGroup = null;
    this._debugBones = [];
    this._debugMarkers = [];
    this._tmpA = new THREE.Vector3();
    this._tmpB = new THREE.Vector3();
  }

  /** Resolve a canonical part name or alias to the actual manifest part name. */
  resolveName(name) {
    if (this.parts.has(name)) return name;
    const aliased = this.partAliases[name];
    if (aliased && this.parts.has(aliased)) return aliased;
    return name;
  }

  get(name) {
    return this.parts.get(this.resolveName(name));
  }

  has(name) {
    return this.parts.has(this.resolveName(name));
  }

  setVisible(name, visible) {
    const p = this.get(name);
    if (p) p.group.visible = visible;
  }

  setRotation(name, degrees) {
    const p = this.get(name);
    if (p) p.group.rotation.z = THREE.MathUtils.degToRad(degrees);
  }

  setPosition(name, x, y) {
    const p = this.get(name);
    if (p) p.group.position.set(x, y, p.group.position.z);
  }

  /** Restore every part transform (and root transform) back to immutable rest state. */
  resetToRestPose(includeVisibility = false) {
    this.root.position.set(this.restRoot.x, this.restRoot.y, this.restRoot.z);
    this.root.rotation.z = 0;
    this.root.scale.setScalar(this.restRoot.scale);
    for (const part of this.parts.values()) {
      part.resetToRest(includeVisibility);
    }
  }

  /** Return world-space Y coordinate of the character's ground/feet contact plane. */
  getFloorWorldY() {
    if (Number.isFinite(this.manifest.floorNormalizedY)) {
      return (0.5 - this.manifest.floorNormalizedY) * this.worldHeight * this.restRoot.scale + this.restRoot.y;
    }
    // Fallback for generic manifests: estimate bottom of feet
    return -this.worldHeight * 0.44 * this.restRoot.scale + this.restRoot.y;
  }

  /** Return structured parent-child hierarchy tree for rig inspection & debug panels. */
  getHierarchy() {
    const nodes = new Map();
    for (const part of this.parts.values()) {
      nodes.set(part.name, {
        name: part.name,
        parent: part.definition.parent || null,
        z: part.definition.z ?? 0,
        pivot: part.definition.pivot,
        visible: part.group.visible,
        children: [],
      });
    }
    const roots = [];
    for (const node of nodes.values()) {
      if (node.parent && nodes.has(node.parent)) {
        nodes.get(node.parent).children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  /** Validate rig structure, parents, pivots, and canonical part coverage. */
  validateRig() {
    const issues = [];
    const seen = new Set();
    for (const def of this.manifest.parts) {
      if (seen.has(def.name)) issues.push(`Duplicate part name: ${def.name}`);
      seen.add(def.name);
      if (def.parent && !this.parts.has(def.parent)) {
        issues.push(`Missing parent '${def.parent}' for '${def.name}'`);
      }
      if (!def.pivot || !Number.isFinite(def.pivot.x) || !Number.isFinite(def.pivot.y)) {
        issues.push(`Invalid pivot for '${def.name}'`);
      }
    }
    const recommended = [
      'body', 'head', 'leftUpperArm', 'leftForearm', 'leftHand',
      'rightUpperArm', 'rightForearm', 'rightHand',
      'leftLeg', 'rightLeg', 'leftFoot', 'rightFoot',
      'eyes', 'brows', 'mouth',
    ];
    const missingCanonical = recommended.filter((n) => !this.has(n));
    return {
      valid: issues.length === 0,
      partCount: this.parts.size,
      issues,
      missingCanonical,
    };
  }

  /**
   * Build or toggle a Three.js visual rig debug overlay (pivot dots + bone lines).
   * Rendered above the character (renderOrder 200+) with depthTest disabled.
   */
  setDebugVisible(visible, scene) {
    if (!visible) {
      if (this._debugGroup) this._debugGroup.visible = false;
      return;
    }
    if (!this._debugGroup) {
      this._debugGroup = new THREE.Group();
      this._debugGroup.name = 'PuppetRigDebug';
      const dotGeo = new THREE.CircleGeometry(0.013, 12);
      const ringGeo = new THREE.RingGeometry(0.013, 0.019, 16);
      const dotMatPrimary = new THREE.MeshBasicMaterial({ color: 0xe11d48, depthTest: false, depthWrite: false });
      const dotMatSecondary = new THREE.MeshBasicMaterial({ color: 0x0284c7, depthTest: false, depthWrite: false });
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, depthWrite: false });
      const lineMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.78, depthTest: false });

      const majorParts = new Set([
        'body', 'neck', 'head', 'leftUpperArm', 'leftForearm', 'leftHand',
        'rightUpperArm', 'rightForearm', 'rightHand',
        'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR',
        'leftLeg', 'rightLeg', 'leftFoot', 'rightFoot', 'braidL', 'braidR',
      ]);

      for (const part of this.parts.values()) {
        if (!majorParts.has(part.name)) continue;
        const marker = new THREE.Group();
        const isRootOrHead = part.name === 'body' || part.name === 'head';
        const dot = new THREE.Mesh(dotGeo, isRootOrHead ? dotMatPrimary : dotMatSecondary);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        dot.renderOrder = 220;
        ring.renderOrder = 219;
        marker.add(ring, dot);
        this._debugGroup.add(marker);
        this._debugMarkers.push({ part, marker });

        if (part.definition.parent && majorParts.has(part.definition.parent)) {
          const parentPart = this.parts.get(part.definition.parent);
          const geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(),
            new THREE.Vector3(),
          ]);
          const line = new THREE.Line(geo, lineMat);
          line.renderOrder = 210;
          this._debugGroup.add(line);
          this._debugBones.push({ parentPart, part, line });
        }
      }
      if (scene) scene.add(this._debugGroup);
    } else if (scene && !this._debugGroup.parent) {
      scene.add(this._debugGroup);
    }
    this._debugGroup.visible = true;
    this.updateDebugOverlay();
  }

  /** Sync rig debug pivot markers and bone lines with current world transforms. */
  updateDebugOverlay() {
    if (!this._debugGroup || !this._debugGroup.visible) return;
    this.root.updateWorldMatrix(true, true);
    for (const { part, marker } of this._debugMarkers) {
      part.group.getWorldPosition(this._tmpA);
      marker.position.set(this._tmpA.x, this._tmpA.y, 1.5);
    }
    for (const { parentPart, part, line } of this._debugBones) {
      parentPart.group.getWorldPosition(this._tmpA);
      part.group.getWorldPosition(this._tmpB);
      const pos = line.geometry.attributes.position;
      pos.setXYZ(0, this._tmpA.x, this._tmpA.y, 1.4);
      pos.setXYZ(1, this._tmpB.x, this._tmpB.y, 1.4);
      pos.needsUpdate = true;
    }
  }

  /** Project major rig joint pivots into viewport pixel coordinates for clean DOM labels. */
  getDebugScreenLabels(camera, width, height) {
    if (!this._debugGroup || !this._debugGroup.visible) return [];
    this.root.updateWorldMatrix(true, true);
    const out = [];
    for (const { part } of this._debugMarkers) {
      part.group.getWorldPosition(this._tmpA);
      this._tmpA.project(camera);
      out.push({
        name: part.name,
        x: (this._tmpA.x * 0.5 + 0.5) * width,
        y: (-this._tmpA.y * 0.5 + 0.5) * height,
        rotationDeg: Math.round(THREE.MathUtils.radToDeg(part.group.rotation.z)),
      });
    }
    return out;
  }

  dispose() {
    if (this._debugGroup) {
      this._debugGroup.parent?.remove(this._debugGroup);
      this._debugGroup.traverse((obj) => {
        obj.geometry?.dispose?.();
        obj.material?.dispose?.();
      });
      this._debugGroup = null;
      this._debugBones = [];
      this._debugMarkers = [];
    }
    for (const p of this.parts.values()) p.dispose();
    this.parts.clear();
  }
}
