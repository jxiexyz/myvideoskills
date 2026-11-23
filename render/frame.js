import * as THREE from 'three';
import { PuppetEngine, PuppetCharacter } from '../src/index.js';
import {createGazeController} from '../src/animation/gaze-controller.js';

// Query params let one page serve any character at any resolution.
const q = new URLSearchParams(location.search);
const char = q.get('char') || 'heroine';
const frames = Number(q.get('frames') || 300);
const fps = Number(q.get('fps') || 30);
const W = Number(q.get('w') || 540);
const H = Number(q.get('h') || 960);

const manifest = (await import(`../assets/${char}/manifest.js`)).default;
const story = await import(`../assets/${char}/story.js`);
const { poseAt } = story;
const scene = story.scene || {};

const interactive = document.body.dataset.mode === 'preview';

window.__meta = { char, frames, fps, width: W, height: H };
window.__ready = (async () => {
  Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
  const stage = document.querySelector('#stage');
  stage.style.width = `${W}px`;
  stage.style.height = `${H}px`;

  const engine = new PuppetEngine({ container: stage, background: scene.bg ?? 0xf2e9df });
  engine.stop();

  // Flat backdrop layer: one SVG stretched over the exact camera frustum.
  if (scene.room) {
    const image = new Image(W, H);
    image.src = new URL(`../assets/${char}/${scene.room}`, import.meta.url).href;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.getContext('2d').drawImage(image, 0, 0, W, H);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    engine.scene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2.4 * (W / H), 2.4),
      new THREE.MeshBasicMaterial({ map: texture, depthWrite: false }),
    ));
  }

  const puppet = await PuppetCharacter.create({
    image: manifest.parts[0].image, manifest, worldHeight: scene.worldHeight ?? 3.2,
  });
  engine.add(puppet);
  const gazeController=createGazeController(puppet,manifest.gazeRig);
  window.__gazeQC=()=>gazeController?.snapshot() ?? null;
  const base = Array.from(puppet.skeleton.parts.values(), ({ group }) => ({
    group, mesh: Array.from(puppet.skeleton.parts.values()).find(p => p.group === group).mesh, position: group.position.clone(), rotation: group.rotation.clone(),
    scale: group.scale.clone(), visible: group.visible,
    meshY: Array.from(puppet.skeleton.parts.values()).find(p => p.group === group).mesh.position.y,
  }));

  window.__frame = f => {
    if (!Number.isInteger(f) || f < 0 || f >= frames) throw new RangeError(`Expected frame 0–${frames - 1}`);
    for (const { group, mesh, meshY, position, rotation, scale, visible } of base) {
      mesh.scale.y = 1;
      mesh.position.y = meshY;
      group.position.copy(position);
      group.rotation.copy(rotation);
      group.scale.copy(scale);
      group.visible = visible;
    }
    const pose = poseAt(f / fps);
    for (const [name, angle] of Object.entries(pose.turns || {})) {
      const part = puppet.skeleton.get(name);
      if (part) part.group.rotation.z += THREE.MathUtils.degToRad(angle);
    }
    // Articulated, foreshortened limbs: scale the mesh, never the parent joint.
    // Child joint offsets follow the shortened segment; distal widths remain unchanged.
    const artScale = (scene.worldHeight ?? 3.2) / 2000;
    for (const [side, lengths] of Object.entries(pose.legLengths || {})) {
      const thigh = puppet.skeleton.get(`thigh${side}`);
      const shin = puppet.skeleton.get(`shin${side}`);
      const foot = puppet.skeleton.get(`foot${side}`);
      for (const [part, length, original] of [[thigh, lengths.thigh, 277], [shin, lengths.shin, 393]]) {
        const reference = base.find(b => b.group === part.group);
        part.mesh.scale.y = length / original;
        part.mesh.position.y = reference.meshY * length / original;
      }
      shin.group.position.y = -lengths.thigh * artScale;
      foot.group.position.y = -lengths.shin * artScale;
    }
    if (pose.skirtForeshorten !== undefined) {
      const part=puppet.skeleton.get('skirt');
      const reference=base.find(b=>b.group===part.group);
      part.mesh.scale.y=pose.skirtForeshorten;
      part.mesh.position.y=reference.meshY*pose.skirtForeshorten;
    }
    const body = puppet.skeleton.get('body')?.group;
    if (body) {
      body.position.x += (pose.x || 0) / 400;
      body.position.y += (pose.y || 0) / 400;
    }
    if (gazeController) gazeController.apply(pose.gaze);
    if (pose.expression) puppet.expression(pose.expression);
    if (pose.blink) {
      for (const eye of ['eyes', 'eyes_happy', 'eyes_closed']) {
        puppet.skeleton.setVisible(eye, eye === 'eyes_closed');
      }
    }
    for (const [name, visible] of Object.entries(pose.show || {})) {
      puppet.skeleton.setVisible(name, visible);
    }
    engine.renderer.render(engine.scene, engine.camera);
  };

  window.__rigQC = () => {
    puppet.root.updateMatrixWorld(true);
    const project = name => {
      const v=puppet.skeleton.get(name).group.getWorldPosition(new THREE.Vector3()).project(engine.camera);
      return [(v.x+1)*W/2,(1-v.y)*H/2];
    };
    return Object.fromEntries(['L','R'].map(side=>[side,{hip:project('thigh'+side),knee:project('shin'+side),ankle:project('foot'+side)}]));
  };
  window.__frame(0);
  if (interactive) {
    const slider = document.querySelector('input');
    const playback = document.querySelector('button');
    slider.max = String(frames - 1);
    let playing = false;
    let start = 0;
    let initial = 0;
    let request;
    const tick = now => {
      const frame = (initial + Math.floor((now - start) * fps / 1000)) % frames;
      slider.value = frame;
      window.__frame(frame);
      if (playing) request = requestAnimationFrame(tick);
    };
    const pause = () => {
      cancelAnimationFrame(request);
      playing = false;
      playback.textContent = 'Play';
    };
    playback.addEventListener('click', () => {
      if (playing) return pause();
      playing = true;
      playback.textContent = 'Pause';
      initial = Number(slider.value);
      start = performance.now();
      request = requestAnimationFrame(tick);
    });
    slider.addEventListener('input', () => {
      pause();
      window.__frame(Number(slider.value));
    });
  }
  return true;
})();

