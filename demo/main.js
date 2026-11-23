import { PuppetEngine, PuppetCharacter } from '../src/index.js';
import { characterManifest } from './manifest.example.js';

const stage = document.querySelector('#stage');
const engine = new PuppetEngine({ container: stage, background: 0xf2e9df });
const fileInput = document.querySelector('#imageFile');
const status = document.querySelector('#status');
let character;

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    if (character) { engine.remove(character); character.dispose(); }
    character = await PuppetCharacter.create({ image: file, manifest: characterManifest, worldHeight: 2.0 });
    engine.add(character); status.textContent = `Loaded ${file.name}. Edit manifest.example.js polygons to match this image.`;
  } catch (error) { status.textContent = error.message; }
});

document.querySelectorAll('[data-animation]').forEach(button => button.addEventListener('click', () => character?.play(button.dataset.animation, { loop: button.dataset.animation === 'idle' || button.dataset.animation === 'talking' })));
document.querySelectorAll('[data-expression]').forEach(button => button.addEventListener('click', () => character?.expression(button.dataset.expression)));
engine.start();
window.addEventListener('beforeunload', () => engine.dispose());

