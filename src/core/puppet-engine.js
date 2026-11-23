import * as THREE from 'three';

function detectSoftwareGl(renderer) {
  try {
    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : '';
    return /swiftshader|llvmpipe|mesa|software/i.test(name);
  } catch {
    return false;
  }
}

export class PuppetEngine {
  /**
   * @param {{ container?: HTMLElement, background?: number, antialias?: boolean, viewHeight?: number, cameraY?: number, showGround?: boolean, groundY?: number, preserveDrawingBuffer?: boolean }} [options]
   */
  constructor({
    container = undefined,
    background = 0xf4f1ec,
    antialias = true,
    viewHeight = 2.05,
    cameraY = -0.02,
    showGround = false,
    groundY = -0.88,
    preserveDrawingBuffer = false,
  } = {}) {
    if (!container) throw new Error('PuppetKit: pass a DOM container.');
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(background);

    this.viewHeight = viewHeight;
    this.cameraY = cameraY;
    this.cameraX = 0;
    this.cameraMode = 'orthographic';
    this.perspectiveFov = 24;
    this._defaultFov = 24;
    this._cameraTiltX = 0;
    this._cameraTiltY = 0;
    this._cameraRoll = 0;
    this._cameraShakeX = 0;
    this._cameraShakeY = 0;
    this._cameraOrbitYaw = 0;
    this._cameraOrbitPitch = 0;
    this._cameraDollyZ = 0;
    this._cameraLookAtZ = 0;

    this.orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    this.orthoCamera.position.set(this.cameraX, this.cameraY, 10);

    this.perspectiveCamera = new THREE.PerspectiveCamera(this.perspectiveFov, 16 / 9, 0.1, 120);
    this.camera = this.orthoCamera;

    this.renderer = new THREE.WebGLRenderer({
      antialias,
      alpha: false,
      preserveDrawingBuffer,
      powerPreference: 'high-performance',
    });
    this.isSoftwareGl = detectSoftwareGl(this.renderer);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    container.appendChild(this.renderer.domElement);

    this.characters = new Set();
    this._lastTimeMs = 0;
    this.running = false;
    this._rafId = 0;
    this._timerId = 0;
    this._afterDrawRaf = 0;
    this._onUpdateListeners = new Set();
    this._groundGroup = null;
    this._groundY = groundY;
    this._projVec = new THREE.Vector3();

    if (showGround) {
      this.setGroundVisible(true, groundY);
    }

    this._resize = () => this.resize();
    this._onContextLost = (e) => {
      e.preventDefault();
      this.stop();
    };
    this._onContextRestored = () => {
      this.start();
    };
    window.addEventListener('resize', this._resize);
    this.renderer.domElement.addEventListener('webglcontextlost', this._onContextLost, false);
    this.renderer.domElement.addEventListener('webglcontextrestored', this._onContextRestored, false);
    this.resize();
  }

  /** Toggle a crisp neutral studio ground line and subtle elevation guides behind the character. */
  setGroundVisible(visible, groundY = this._groundY) {
    this._groundY = groundY;
    if (!visible) {
      if (this._groundGroup) this._groundGroup.visible = false;
      return;
    }
    if (!this._groundGroup) {
      this._groundGroup = new THREE.Group();
      this._groundGroup.name = 'PuppetStudioGround';

      // Soft radial contact shadow beneath feet
      const shadowGeo = new THREE.CircleGeometry(0.32, 32);
      shadowGeo.scale(1, 0.14, 1);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.11,
        depthWrite: false,
      });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.position.set(0, 0, -2);
      shadow.renderOrder = -10;
      this._groundGroup.add(shadow);

      // Main floor reference line
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-4, 0, -2.5),
        new THREE.Vector3(4, 0, -2.5),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.65,
      });
      const floorLine = new THREE.Line(lineGeo, lineMat);
      floorLine.renderOrder = -11;
      this._groundGroup.add(floorLine);

      // Subtle center vertical plumb line & ruler ticks
      const tickPoints = [
        new THREE.Vector3(0, 0, -2.6),
        new THREE.Vector3(0, -0.06, -2.6),
      ];
      for (let x = -1.5; x <= 1.5; x += 0.5) {
        if (Math.abs(x) < 1e-4) continue;
        tickPoints.push(
          new THREE.Vector3(x, 0, -2.6),
          new THREE.Vector3(x, -0.035, -2.6)
        );
      }
      const ticksGeo = new THREE.BufferGeometry().setFromPoints(tickPoints);
      const ticksMat = new THREE.LineBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.45,
      });
      const ticks = new THREE.LineSegments(ticksGeo, ticksMat);
      ticks.renderOrder = -12;
      this._groundGroup.add(ticks);

      this.scene.add(this._groundGroup);
    }
    this._groundGroup.position.y = groundY;
    this._groundGroup.visible = true;
  }

  /** Switch between flat orthographic character framing and mild telephoto 2.5D perspective. */
  setCameraMode(mode = 'orthographic') {
    const next = mode === 'perspective25d' ? 'perspective25d' : 'orthographic';
    this.cameraMode = next;
    this.camera = next === 'perspective25d' ? this.perspectiveCamera : this.orthoCamera;
    this._applyCameraTransform();
    this.resize();
  }

  /** Update camera framing (viewHeight & center) for both orthographic and 2.5D perspective modes. */
  setFraming({ viewHeight, cameraX, cameraY } = {}) {
    if (Number.isFinite(viewHeight) && viewHeight > 0.1) this.viewHeight = viewHeight;
    if (Number.isFinite(cameraX)) this.cameraX = cameraX;
    if (Number.isFinite(cameraY)) this.cameraY = cameraY;
    this._applyCameraTransform();
    this.resize();
  }

  /**
   * Apply deterministic cinematic camera state (pan, zoom, FOV for dolly zoom, 2.5D-safe orbit,
   * parallax tilt, roll, shake, and lookAt depth) directly on PuppetEngine's unified camera.
   */
  setCameraState({
    x,
    y,
    viewHeight,
    fov = this._defaultFov,
    orbitYaw = 0,
    orbitPitch = 0,
    dollyZ = 0,
    lookAtZ = 0,
    tiltX = 0,
    tiltY = 0,
    roll = 0,
    shakeX = 0,
    shakeY = 0,
  } = {}) {
    if (Number.isFinite(viewHeight)) {
      this.viewHeight = Math.max(0.42, Math.min(6.5, viewHeight));
    }
    if (Number.isFinite(x)) this.cameraX = x;
    if (Number.isFinite(y)) this.cameraY = y;
    this.perspectiveFov = Number.isFinite(fov) ? Math.max(14, Math.min(46, fov)) : this._defaultFov;
    // Clamp orbit angles so 2D cutout characters stay natural without thin-plane distortion
    this._cameraOrbitYaw = Number.isFinite(orbitYaw) ? Math.max(-0.42, Math.min(0.42, orbitYaw)) : 0;
    this._cameraOrbitPitch = Number.isFinite(orbitPitch) ? Math.max(-0.22, Math.min(0.22, orbitPitch)) : 0;
    this._cameraDollyZ = Number.isFinite(dollyZ) ? Math.max(-1.6, Math.min(2.2, dollyZ)) : 0;
    this._cameraLookAtZ = Number.isFinite(lookAtZ) ? Math.max(-4.5, Math.min(2.0, lookAtZ)) : 0;
    this._cameraTiltX = Number.isFinite(tiltX) ? tiltX : 0;
    this._cameraTiltY = Number.isFinite(tiltY) ? tiltY : 0;
    this._cameraRoll = Number.isFinite(roll) ? Math.max(-0.25, Math.min(0.25, roll)) : 0;
    this._cameraShakeX = Number.isFinite(shakeX) ? shakeX : 0;
    this._cameraShakeY = Number.isFinite(shakeY) ? shakeY : 0;
    this._applyCameraTransform();
    this._updateProjectionOnly();
  }

  _applyCameraTransform() {
    const cx = this.cameraX + this._cameraShakeX;
    const cy = this.cameraY + this._cameraShakeY;
    const cz = this._cameraLookAtZ;

    this.orthoCamera.position.set(cx, cy, 10);
    this.orthoCamera.rotation.set(0, 0, this._cameraRoll);
    this.orthoCamera.updateMatrixWorld();

    // Match exact vertical framing at z = cz so the 2D Heroine preserves crisp scale even during Dolly Zoom
    const halfRad = THREE.MathUtils.degToRad(this.perspectiveFov * 0.5);
    const baseDist = Math.max(1.85, (this.viewHeight * 0.5) / Math.tan(halfRad) + this._cameraDollyZ);
    const cosPitch = Math.cos(this._cameraOrbitPitch);
    const sinPitch = Math.sin(this._cameraOrbitPitch);
    const sinYaw = Math.sin(this._cameraOrbitYaw);
    const cosYaw = Math.cos(this._cameraOrbitYaw);

    const camX = cx + baseDist * sinYaw * cosPitch + this._cameraTiltX * 1.45;
    const camY = cy + baseDist * sinPitch + this._cameraTiltY * 0.85;
    const camZ = cz + Math.max(1.4, baseDist * cosYaw * cosPitch);

    this.perspectiveCamera.position.set(camX, camY, camZ);
    this.perspectiveCamera.lookAt(cx, cy, cz);
    if (this._cameraRoll !== 0) {
      this.perspectiveCamera.rotation.z += this._cameraRoll;
    }
    this.perspectiveCamera.updateMatrixWorld();
  }

  _updateProjectionOnly() {
    const w = this.container.clientWidth || 640;
    const h = this.container.clientHeight || 480;
    const aspect = w / h;
    this.orthoCamera.left = (-this.viewHeight * aspect) / 2;
    this.orthoCamera.right = (this.viewHeight * aspect) / 2;
    this.orthoCamera.top = this.viewHeight / 2;
    this.orthoCamera.bottom = -this.viewHeight / 2;
    this.orthoCamera.updateProjectionMatrix();

    this.perspectiveCamera.aspect = aspect;
    this.perspectiveCamera.fov = this.perspectiveFov;
    this.perspectiveCamera.updateProjectionMatrix();
  }

  /** Project a 3D world position onto 2D viewport pixel coordinates (for object-connected callouts). */
  worldToScreen(worldPos) {
    const w = this.container.clientWidth || 640;
    const h = this.container.clientHeight || 480;
    this._projVec.set(worldPos.x ?? 0, worldPos.y ?? 0, worldPos.z ?? 0);
    this._projVec.project(this.camera);
    return {
      x: (this._projVec.x * 0.5 + 0.5) * w,
      y: (-this._projVec.y * 0.5 + 0.5) * h,
      visible: this._projVec.z >= -1 && this._projVec.z <= 1,
      width: w,
      height: h,
    };
  }

  setBackground(color) {
    this.scene.background = new THREE.Color(color);
  }

  onUpdate(fn) {
    this._onUpdateListeners.add(fn);
    return () => this._onUpdateListeners.delete(fn);
  }

  add(character) {
    this.characters.add(character);
    this.scene.add(character.root);
    return character;
  }

  remove(character) {
    this.characters.delete(character);
    this.scene.remove(character.root);
  }

  resize() {
    const w = this.container.clientWidth || 640;
    const h = this.container.clientHeight || 480;
    this._applyCameraTransform();
    this._updateProjectionOnly();
    this.renderer.setSize(w, h, false);
  }

  /** Step simulation and render a single deterministic frame (useful for snapshots & tests). */
  step(dt = 0) {
    for (const c of this.characters) {
      c.update(dt);
      c.skeleton?.updateDebugOverlay?.();
    }
    for (const fn of this._onUpdateListeners) fn(dt);
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /** Wait until WebGL finishes drawing (prevents SwiftShader CPU starvation in headless browsers). */
  _afterDraw(fn) {
    const gl = this.renderer.getContext();
    if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (sync) {
        gl.flush();
        const poll = () => {
          if (!this.running) {
            gl.deleteSync(sync);
            return;
          }
          const status = gl.clientWaitSync(sync, 0, 0);
          if (status === gl.TIMEOUT_EXPIRED) {
            this._afterDrawRaf = requestAnimationFrame(poll);
          } else {
            gl.deleteSync(sync);
            this._timerId = setTimeout(fn, 60);
          }
        };
        this._afterDrawRaf = requestAnimationFrame(poll);
        return;
      }
    }
    this._timerId = setTimeout(fn, 60);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._lastTimeMs = performance.now();

    const frame = () => {
      if (!this.running) return;
      const now = performance.now();
      const dt = Math.min(Math.max((now - this._lastTimeMs) / 1000, 0), 0.05);
      this._lastTimeMs = now;
      this.step(dt);
      if (this.isSoftwareGl) {
        this._afterDraw(frame);
      } else {
        this._rafId = requestAnimationFrame(frame);
      }
    };
    frame();
  }

  stop() {
    this.running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
    if (this._afterDrawRaf) {
      cancelAnimationFrame(this._afterDrawRaf);
      this._afterDrawRaf = 0;
    }
    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = 0;
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this._resize);
    this.renderer.domElement.removeEventListener('webglcontextlost', this._onContextLost);
    this.renderer.domElement.removeEventListener('webglcontextrestored', this._onContextRestored);
    if (this._groundGroup) {
      this._groundGroup.traverse((obj) => {
        obj.geometry?.dispose?.();
        obj.material?.dispose?.();
      });
      this.scene.remove(this._groundGroup);
      this._groundGroup = null;
    }
    for (const c of this.characters) c.dispose();
    this.characters.clear();
    this._onUpdateListeners.clear();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
