# Generic Asset Pack & Rig Manifest

## Included assets
- 16 transparent SVG part files in `assets/generic/`
- `generic-atlas.svg`, 1024x1024, four columns by four rows
- `demo/generic-manifest.js`, normalized crop polygons, pivots, parent hierarchy, z-order

## Load in Three.js
```js
import { PuppetEngine, PuppetCharacter } from '../src/index.js';
import { genericManifest } from './generic-manifest.js';
const engine = new PuppetEngine({ container: document.querySelector('#stage') });
const puppet = await PuppetCharacter.create({
  image: '/assets/generic/generic-atlas.svg',
  manifest: genericManifest,
  worldHeight: 2.4
});
engine.add(puppet);
puppet.play('idle', { loop: true });
```

## Important rigging note
This first generic pack is a starter cutout rig. Parts are separate visual layers, with pivots and parent relationships in the manifest. Because the source is a simple atlas, refine pivot coordinates and masks for your target proportions. Paint hidden pixels behind joints (shoulder, elbow, hip, knee) to prevent gaps during rotation.

## Expression & gesture extension
The current runtime expression method toggles visibility only. To support true alternate facial drawings, add named variants (for example `mouth_happy.svg`, `mouth_o.svg`) and swap textures/material maps in an expression controller. Gesture animations can be added as timeline tracks on `leftUpperArm`, `rightUpperArm`, forearms and hands.

