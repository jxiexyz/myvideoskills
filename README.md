# PuppetKit 2D

An image-based 2D cutout puppet runtime built on Three.js. It is designed for deliberately simple, slightly stiff cartoon motion: separate image layers rotate around pivots, with reusable idle/talking/nod/wave animations.

> **Important image limitation:** a flattened PNG/JPG does not contain hidden pixels behind the head, arms, hair, or torso. PuppetKit can load one image and create masked cutout layers from editable polygon definitions, but it cannot infer or reconstruct hidden anatomy. For clean movement, prepare a source image with separated transparent layers, or manually paint/clone the missing overlap areas and trace each part in `manifest.parts`.

## Requirements
- Node.js 20+ recommended
- npm
- A modern browser with WebGL

## Quick start

```bash
npm install
npm run dev
```

Open the Vite URL and navigate to `/demo/`. Import a character image. The demo manifest is only a placeholder; edit `demo/manifest.example.js` so its polygons follow the actual image parts before expecting a clean rig.

## Runtime usage

```js
import { PuppetEngine, PuppetCharacter } from 'puppetkit-2d';
import manifest from './my-character-manifest.js';

const engine = new PuppetEngine({
  container: document.querySelector('#stage'),
  background: 0xf4eee7
});

const character = await PuppetCharacter.create({
  image: document.querySelector('#characterImage'), // or File / URL
  manifest,
  worldHeight: 2.0,
  position: [0, 0, 0]
});

engine.add(character);
engine.start();

character.play('idle', { loop: true, speed: 1 });
character.play('talking', { loop: true });
character.play('nod');
character.play('wave');
character.expression('happy');
character.headRotate(-8);
character.armRotate('right', 25);
```

Call `engine.dispose()` when the stage is permanently removed. Call `character.dispose()` if managing character lifetime outside the engine.

## Image + manifest workflow

1. Export the character as a transparent PNG at a reasonably high resolution.
2. Identify cutout parts: `body`, `head`, `leftArm`, `rightArm`, `leftLeg`, `rightLeg`, hair/eyes/mouth variants as needed.
3. Trace a polygon around each part. Coordinates are normalized: `(0,0)` is the image's top-left and `(1,1)` is bottom-right.
4. Set each pivot at the joint where that part should rotate. Example: shoulder for an arm, neck for head, hip for leg.
5. Put parent parts before their children in the array. Child pivot coordinates are interpreted relative to the parent's pivot; the part polygon itself remains in original image coordinates.
6. Ensure the art has overlap/hidden areas. For example, the upper arm should extend beneath the torso edge so a rotation does not reveal a gap.
7. Add alternate face artwork as separately named parts (for example `mouthNeutral`, `mouthSmile`, `mouthOpen`) and switch visibility using expression definitions.

### Manifest schema

```js
export default {
  name: 'MyCharacter',
  parts: [
    {
      name: 'body',
      polygon: [{ x: .30, y: .40 }, { x: .70, y: .40 }, { x: .75, y: .95 }, { x: .25, y: .95 }],
      pivot: { x: .50, y: .48 },
      z: 1
    },
    {
      name: 'rightArm',
      polygon: [{ x: .62, y: .45 }, { x: .80, y: .48 }, { x: .82, y: .90 }, { x: .66, y: .88 }],
      pivot: { x: .67, y: .50 },
      parent: 'body',
      z: 2
    }
  ],
  expressions: {
    neutral: { mouthNeutral: true, mouthSmile: false, mouthOpen: false },
    happy: { mouthNeutral: false, mouthSmile: true, mouthOpen: false },
    talking: { mouthNeutral: false, mouthSmile: false, mouthOpen: true }
  }
};
```

`z` controls draw order for root-level parts. Parent/child grouping is useful for articulated movement. Keep a child polygon within the same source image coordinate space. Parts are rasterized to transparent canvas textures at load time.

## Built-in animation library

| Name | Behavior | Loop recommendation |
|---|---|---|
| `idle` | subtle torso bob + tiny head tilt | yes |
| `talking` | small mouth-layer bob (starter placeholder) | yes |
| `nod` | one head nod | no |
| `wave` | right arm swings in a few stiff beats | no |

The built-ins are intentionally restrained. They are starting points, not a full motion-capture system. Extend `src/animation/library.js` with project-specific actions.

## API reference

### `new PuppetEngine({ container, background?, antialias? })`
Creates a Three.js scene, orthographic camera, renderer, resize handling, and animation loop.

- `add(character)` / `remove(character)`
- `start()` / `stop()`
- `resize()`
- `dispose()`

### `PuppetCharacter.create({ image, manifest, worldHeight?, scale?, position? })`
Asynchronously loads an image and creates the skeleton.

- `play(name, { loop?, speed?, restart? })`
- `stop()` / `pause()` / `update(delta)`
- `blink()`
- `expression(name)`
- `headRotate(degrees)`
- `armRotate('left' | 'right', degrees)`
- `dispose()`

### `PuppetSkeleton`
- `get(partName)` returns a `PuppetPart` or `undefined`.
- `setVisible(partName, boolean)`
- `setRotation(partName, degrees)`
- `setPosition(partName, x, y)`

### `Timeline`
Create custom keyframe motion:

```js
import { Timeline } from 'puppetkit-2d';
const arm = character.skeleton.get('rightArm').group;
const motion = new Timeline();
motion.addTrack(arm, 'rotation', [
  { time: 0, value: 0 },
  { time: .25, value: -0.5 },
  { time: .5, value: 0 }
], { easing: 'smooth' });
motion.play({ loop: true });
```

Timeline values for `rotation` are **radians**. The convenience methods `headRotate` and `armRotate` accept **degrees**.

## Current scope and known limitations
- This is a runtime toolkit, not a fully automatic AI character segmentation service or visual rig editor.
- The demo's example polygons are generic placeholders and must be redrawn for each character.
- `expression()` only switches visibility. Supply alternate eyes/mouth layers in the source art to make expressions visibly different.
- The starter `talking` animation moves the `mouth` pivot slightly. For real lip-sync, create mouth-shape layers and drive visibility from audio phonemes or timed cues.
- No inverse kinematics, mesh deformation, automatic inpainting, audio analysis, or export-to-video pipeline is included in this starter release.
- Keep part names `head`, `body`, `leftArm`, `rightArm`, `eyes`, and `mouth` if you want the built-in animation names to work without customization.

## Suggested production pipeline

**Artwork preparation → masks/pivots → rig validation → reusable actions → scene integration.** First make one clean character manifest and validate idle, head turn, and arm movement. Then reuse the same runtime and animation library for the male/female variants by swapping image + manifest data.


## Generic Asset Pack (v0.2)
See `assets/generic/` for 16 editable transparent SVG layers and a 1024px atlas. Use `demo/generic-manifest.js` with `PuppetCharacter.create()`. Full asset and rigging notes: `docs/GENERIC_ASSET_PACK.md`. Added `shrug`, `clap`, and `recoil` animation presets.

## Motion & expression library (v0.2.1 update)

Built-in motions: `idle`, `breathing`, `talking`, `nod`, `shake`, `tilt`, `wave`, `point`, `shrug`, `clap`, `recoil`, `laugh`, `walk`, and `surprised`.

```js
character.play('idle', { loop: true });
character.play('talking', { loop: true, speed: 1.15 });
character.gesture('wave');
character.expression('happy'); // neutral, happy, sad, angry, surprised, excited, confused
character.blink();
```

Expressions use simple procedural facial posing on the generic `eyes`, `brows`, and `mouth` layers. For richer artwork, add optional swap layers named `eyes_happy`, `mouth_sad`, `brows_angry`, etc. Automatic blink is updated by the engine tick and does not create unmanaged timers.

The animation library is intentionally cutout/puppet-like with restrained, slightly stiff movement. For articulated motion, each limb must be a separately segmented transparent layer with correctly placed pivots in the rig manifest. A single flattened image cannot produce hidden body artwork automatically.

## Multi-View Character System (Front / Back / Top / Bottom)

The main character pack (`assets/characters/main-character/`) includes four genuine directional layered SVG rigs (`front`, `back`, `top`, and `bottom`) driven by one synchronized 5-channel animation & 16-expression runtime:

```js
import { PuppetEngine, PuppetCharacter } from './src/index.js';
import mainCharacterManifest from './assets/characters/main-character/manifest.js';

const character = await PuppetCharacter.create({
  manifest: mainCharacterManifest,
  worldHeight: 2.0,
  autoIdle: true,
  autoBlink: true,
});

// Start combined motions + expression
character.play('walk', { loop: true });
character.play('wave', { loop: true });
character.expression('happy');

// Switch views live while preserving exact motion phase, speed, loop, pause & expression
await character.setView('back', { transition: 0.25 });
await character.setView('top', { transition: 0.25 });
await character.setView('bottom', { transition: 0.25 });
await character.setView('front', { transition: 0.25 });
```

### Documentation Index
- `docs/MULTI_VIEW_SYSTEM.md` — 4-direction multi-view architecture, `ViewAdapter` retargeting, API reference, and 45 × 4 motion support matrix.
- `docs/CHARACTER_LAB.md` — Interactive Character Lab guide (`Front`/`Back`/`Top`/`Bottom` presets, `4-View Sync` contact sheet, `16-Expr Sheet`, and active-view Rig Debug).
- `docs/RIGGING.md` — Semantic rig hierarchy, coordinate conventions, and manifest schema.
- `docs/ANIMATION_CATALOG.md` — 5-channel architecture, 45 motions, and 7 combined presets.
- `docs/EXPRESSION_CATALOG.md` — 16 facial expressions, gaze masks, blinking, and talking/viseme hooks.
- `docs/ROADMAP.md` — Completed milestones and upcoming directional packs (`leftProfile`, `rightProfile`, `3/4`).


