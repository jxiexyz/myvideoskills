import * as THREE from 'three';
import { createPartTexture } from '../assets/image-loader.js';

export class PuppetPart {
  constructor(image, definition, worldScale, parentPivot = null) {
    this.name = definition.name;
    this.definition = definition;
    this.worldScale = worldScale;
    this.group = new THREE.Group();
    this.group.name = `${definition.name}-pivot`;

    const { canvas, bounds, imageSize } = createPartTexture(image, definition);
    this.bounds = bounds;
    this.imageSize = imageSize;
    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    const width = bounds.width * worldScale;
    const height = bounds.height * worldScale;
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = `${definition.name}-image`;
    this.group.add(this.mesh);

    const pivotX = definition.pivot.x * imageSize.width;
    const pivotY = definition.pivot.y * imageSize.height;
    // Image coordinates: x right, y down. Three.js world: x right, y up.
    const originX = parentPivot ? parentPivot.x * imageSize.width : imageSize.width / 2;
    const originY = parentPivot ? parentPivot.y * imageSize.height : imageSize.height / 2;
    this.group.position.set(
      (pivotX - originX) * worldScale,
      (originY - pivotY) * worldScale,
      definition.z ?? 0
    );

    const centerX = bounds.minX + bounds.width / 2;
    const centerY = bounds.minY + bounds.height / 2;
    this.mesh.position.set((centerX - pivotX) * worldScale, (pivotY - centerY) * worldScale, 0);
    this.group.rotation.z = THREE.MathUtils.degToRad(definition.rotation ?? 0);
    this.group.visible = definition.visible !== false;

    // Immutable rest transform snapshot so animations compose relative to rest without drift
    this.restTransform = {
      x: this.group.position.x,
      y: this.group.position.y,
      z: this.group.position.z,
      rotation: this.group.rotation.z,
      scaleX: this.group.scale.x,
      scaleY: this.group.scale.y,
      visible: this.group.visible,
    };
  }

  /** Capture current group transform as the part's rest transform (e.g. after manifest restPose). */
  captureRestTransform() {
    this.restTransform = {
      x: this.group.position.x,
      y: this.group.position.y,
      z: this.group.position.z,
      rotation: this.group.rotation.z,
      scaleX: this.group.scale.x,
      scaleY: this.group.scale.y,
      visible: this.group.visible,
    };
  }

  /** Restore position, rotation, and scale back to restTransform (preserving visibility unless requested). */
  resetToRest(includeVisibility = false) {
    const r = this.restTransform;
    this.group.position.set(r.x, r.y, r.z);
    this.group.rotation.z = r.rotation;
    this.group.scale.set(r.scaleX, r.scaleY, 1);
    if (includeVisibility) this.group.visible = r.visible;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.texture.dispose();
  }
}
