# 11 — PuppetKit Public API Cheatsheet

Quick reference for all programmatic symbols exported by `src/index.js`.

---

## 1. Engine & Character (`src/core/`)

```javascript
import { PuppetEngine, PuppetCharacter } from './src/index.js';

// Initialize Stage
const engine = new PuppetEngine({
  container: document.querySelector('#stage'),
  background: 0xf4eee7,
  antialias: true
});
engine.start();
engine.stop();
engine.resize();
engine.dispose();
engine.setCameraState({ x, y, viewHeight, fov, roll, orbitYaw });

// Spawn Character
const character = await PuppetCharacter.create({
  image: document.querySelector('#charImg'), // File, Image element, or URL
  manifest,                                  // Character manifest object
  worldHeight: 2.0,
  position: [0, 0, 0]
});
engine.add(character);

// Animation Controls
character.play('walk', { loop: true, speed: 1.0 });
character.stop('walk');
character.preset('greeting');               // Trigger 5-channel coordinated action
character.expression('happy', { transition: 0.2 });
character.lookAt({ x: 0.5, y: -0.3 });      // Eye gaze direction
character.blink();
character.talk(true / false);               // Non-destructive mouth oscillation
character.setViseme('A');                   // Viseme phonetic cue
character.setView('back', { transition: 0.25 }); // 4-view switch mid-animation
character.setDebugVisible(true, engine.scene);   // Show joints and skeleton
character.dispose();
```

---

## 2. Rig & Skeleton (`src/rig/`, `src/animation/`)

```javascript
import { PuppetSkeleton, PuppetPart, Timeline } from './src/index.js';

// Direct Skeleton Inspection
const part = character.skeleton.get('rightUpperArm');
character.skeleton.setRotation('rightUpperArm', -25); // degrees
character.skeleton.setPosition('body', 10, -5);       // pixels
character.skeleton.setVisible('mole', false);

// Keyframe Timeline
const timeline = new Timeline();
timeline.addTrack(part.group, 'rotation', [
  { time: 0, value: 0 },
  { time: 0.5, value: -0.45 }, // radians
  { time: 1.0, value: 0 }
], { easing: 'smooth' });
timeline.play({ loop: true });
```

---

## 3. Environments & Parallax (`src/environment/`)

```javascript
import {
  EnvironmentComposer,
  ENVIRONMENT_TEMPLATES,
  ENVIRONMENT_PALETTES
} from './src/index.js';

const composer = new EnvironmentComposer(engine.scene);
composer.loadTemplate('penthouse_interior', {
  palette: 'twilightLuxury',
  mood: 'evening'
});
composer.applyCameraParallax(cameraState, strength);
composer.dispose();
```

---

## 4. Motion Graphics (`src/motion-graphics/`)

```javascript
import {
  MotionGraphicsRenderer,
  createMotionGraphicConfig,
  evaluateMotionGraphicFrame
} from './src/index.js';

const config = createMotionGraphicConfig('million_dollar_badge', {
  content: '$1,000,000',
  theme: 'emeraldWealth',
  entrance: 'popScale',
  duration: 3.5
});
const frame = evaluateMotionGraphicFrame(config, localTime, { screenWidth, screenHeight });
const mgRenderer = new MotionGraphicsRenderer(canvas2D);
mgRenderer.render(frame);
```

---

## 5. Camera Choreography (`src/camera/`)

```javascript
import {
  CameraTimeline,
  SubjectTargetRegistry,
  CAMERA_PRESETS,
  CAMERA_TRANSITIONS
} from './src/index.js';

const registry = new SubjectTargetRegistry();
const camTimeline = new CameraTimeline([
  {
    preset: 'zoom_into_smartphone',
    target: 'smartphone',
    start: 0,
    duration: 3.0,
    transition: 'whip_pan_transition'
  }
]);
const camFrame = camTimeline.evaluateAt(1.5, registry);
engine.setCameraState(camFrame.camera);
```

---

## 6. Narrative Engine & Storyboard (`src/narrative/`)

```javascript
import {
  NarrativeToVisualDirector,
  NarrativeTimelineEvaluator
} from './src/index.js';

// Generate Storyboard from Plain Text:
const storyboard = NarrativeToVisualDirector.generateStoryboard(narrationScript);

// Manual Override on Beat:
const updated = NarrativeToVisualDirector.applyStoryboardOverride(
  storyboard,
  beatId,
  { expression: 'excited', cameraPreset: 'crash_zoom_cut' }
);

// Pure Deterministic Evaluation at timestamp t:
const state = NarrativeTimelineEvaluator.evaluateAt(updated, 2.5);
// state contains: { acting, popup, camera, backdrop, sfx }
```

---

## 7. SFX Audio Engine (`src/audio/`)

```javascript
import {
  SFXPresetRegistry,
  SFXDirector,
  SFXBusManager,
  renderSFXTimelineToWav
} from './src/index.js';

const registry = new SFXPresetRegistry();
const sfxDirector = new SFXDirector(registry);

// Create Plan from Storyboard
const plan = sfxDirector.directFromStoryboard(storyboard, { storyStyle: 'cinematic' });

// Render Master Audio to WAV (Uint8Array PCM bytes)
const wavData = renderSFXTimelineToWav({
  events: plan.events,
  ambienceTracks: plan.ambienceTracks,
  silenceCues: plan.silenceCues,
  totalDuration: plan.totalDuration,
  registry,
  busManager: new SFXBusManager(),
  sampleRate: 44100
});
```
