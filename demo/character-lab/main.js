import {
  PuppetEngine,
  PuppetCharacter,
  listMotions,
  listExpressions,
  listPresets,
} from '../../src/index.js';
import { mainCharacterManifest } from '../../assets/characters/main-character/manifest.js';
import { minimalStarterManifest } from '../../assets/characters/minimal-starter/manifest.js';

const MANIFESTS = {
  'main-character': mainCharacterManifest,
  'minimal-starter': minimalStarterManifest,
};

const stage = document.getElementById('stage');
const inspector = document.getElementById('inspector');
const statusBar = document.getElementById('statusBar');
const characterSelect = document.getElementById('characterSelect');
const speedSlider = document.getElementById('speedSlider');
const speedVal = document.getElementById('speedVal');
const btnZoom = document.getElementById('btnZoom');
const btnDebug = document.getElementById('btnDebug');
const btnLoop = document.getElementById('btnLoop');
const btnTalk = document.getElementById('btnTalk');
const btnBlink = document.getElementById('btnBlink');
const btnStop = document.getElementById('btnStop');
const btnReset = document.getElementById('btnReset');

const engine = new PuppetEngine({
  container: stage,
  background: 0xf4f1ec,
  showGround: true,
  preserveDrawingBuffer: true,
});

let character = null;
let faceZoom = false;
let rigDebug = false;
let loopForce = false;
let talking = false;

async function loadCharacter(id) {
  if (character) {
    engine.remove(character);
    character.dispose();
  }
  const manifest = MANIFESTS[id];
  character = await PuppetCharacter.create({ manifest, worldHeight: 2.0 });
  engine.add(character);
  engine.setGroundVisible(true, character.skeleton.getFloorWorldY());
  applyFraming(manifest);
  character.skeleton.setDebugVisible(rigDebug, engine.scene);
  character.setSpeed(parseFloat(speedSlider.value));
  updateStatus();
}

function applyFraming(manifest) {
  const mode = faceZoom ? 'faceCloseup' : 'fullBody';
  engine.setFraming(manifest.framing?.[mode] || { viewHeight: 2.05, cameraY: -0.02 });
}

function updateStatus() {
  if (!character) return;
  const st = character.getState();
  statusBar.textContent =
    `View: ${(st.view?.activeView ?? 'front').toUpperCase()} | ` +
    `Base: ${st.channels.base?.label ?? 'None'} | ` +
    `Body/Loco: ${st.channels.locomotion?.label ?? '—'} | ` +
    `Head: ${st.channels.head?.label ?? '—'} | ` +
    `Gesture: ${st.channels.gesture?.label ?? '—'} | ` +
    `Expr: ${st.face.expression}`;
}

function addSection(title, items, gridClass, onClick) {
  const sec = document.createElement('section');
  sec.className = 'section';
  const h = document.createElement('h2');
  h.textContent = title;
  const grid = document.createElement('div');
  grid.className = `grid ${gridClass}`;
  for (const item of items) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = item.label;
    btn.title = item.description || '';
    btn.addEventListener('click', () => {
      onClick(item);
      updateStatus();
    });
    grid.appendChild(btn);
  }
  sec.append(h, grid);
  inspector.appendChild(sec);
}

addSection(
  'View Presets (4-Direction)',
  [
    { id: 'front', label: 'Front', description: 'Front view with full face rig' },
    { id: 'back', label: 'Back', description: 'Rear layered view' },
    { id: 'top', label: 'Top', description: 'Bird\'s-eye overhead view' },
    { id: 'bottom', label: 'Bottom', description: 'Worm\'s-eye underside view' },
  ],
  'grid-4',
  async (v) => {
    if (!character) return;
    try {
      const vs = await character.setView(v.id, { transition: 0.25, preserveAnimationState: true });
      engine.setGroundVisible(vs.showGround, character.skeleton.getFloorWorldY());
      applyFraming(character.manifest);
      character.setDebugVisible(rigDebug, engine.scene);
      updateStatus();
    } catch {
      // Single-view packs only support front
    }
  }
);
addSection('Basic', listMotions('basic'), '', (m) => character?.play(m.id, { channel: 'base' }));
addSection('Head & Gaze', listMotions('head'), '', (m) => character?.play(m.id, { channel: 'head', ...(loopForce ? { loop: true } : {}) }));
addSection('Gestures & Reactions', [...listMotions('gesture'), ...listMotions('reaction')], '', (m) =>
  character?.play(m.id, { ...(loopForce ? { loop: true } : {}) })
);
addSection('Locomotion', listMotions('locomotion'), '', (m) =>
  character?.play(m.id, { channel: 'locomotion', ...(loopForce ? { loop: true } : {}) })
);
addSection('Facial Expressions (16)', listExpressions(), 'grid-4', (e) => character?.expression(e.id, { transition: 0.2 }));
addSection('Combined Presets (7)', listPresets(), 'grid-1', (p) => character?.preset(p.id, { transition: 0.2 }));

characterSelect.addEventListener('change', () => loadCharacter(characterSelect.value));
speedSlider.addEventListener('input', () => {
  const v = parseFloat(speedSlider.value);
  speedVal.textContent = `${v.toFixed(2)}x`;
  character?.setSpeed(v);
});
btnZoom.addEventListener('click', () => {
  faceZoom = !faceZoom;
  btnZoom.textContent = faceZoom ? 'Full Body' : 'Face Zoom';
  if (character) applyFraming(character.manifest);
});
btnDebug.addEventListener('click', () => {
  rigDebug = !rigDebug;
  btnDebug.classList.toggle('active', rigDebug);
  character?.skeleton.setDebugVisible(rigDebug, engine.scene);
});
btnLoop.addEventListener('click', () => {
  loopForce = !loopForce;
  btnLoop.textContent = `Loop: ${loopForce ? 'On' : 'Auto'}`;
  btnLoop.classList.toggle('active', loopForce);
  character?.setLoop(loopForce ? true : null);
});
btnTalk.addEventListener('click', () => {
  talking = !talking;
  btnTalk.classList.toggle('active', talking);
  character?.talk(talking);
});
btnBlink.addEventListener('click', () => character?.blink());
btnStop.addEventListener('click', () => {
  talking = false;
  btnTalk.classList.remove('active');
  character?.stop();
  updateStatus();
});
btnReset.addEventListener('click', () => {
  talking = false;
  btnTalk.classList.remove('active');
  character?.setBasePose('standing', { keepIdle: true });
  character?.resetExpression({ transition: 0.15 });
  updateStatus();
});

let tick = 0;
engine.onUpdate((dt) => {
  tick += dt;
  if (tick > 0.15) {
    tick = 0;
    updateStatus();
  }
});

loadCharacter('main-character').then(() => engine.start());
window.addEventListener('beforeunload', () => engine.dispose());
