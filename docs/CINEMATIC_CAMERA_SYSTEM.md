# PuppetKit Cinematic Camera Preset & Movement System

## Architecture Overview
The Cinematic Camera Preset & Movement System upgrades PuppetKit's existing `PuppetEngine` Three.js camera with a 100% deterministic, timeline-driven cinematography architecture engineered specifically for **2D cutout characters inside layered 2.5D cartoon environments**.

- **Unified Camera (No Duplicate Cameras)**: All movement evaluates into `PuppetEngine.setCameraState({ x, y, viewHeight, fov, orbitYaw, orbitPitch, dollyZ, lookAtZ, tiltX, tiltY, roll, shakeX, shakeY })`.
- **2.5D-Safe Geometry Bounds**: Orbit yaw (`±0.42 rad`), pitch (`±0.22 rad`), FOV (`14°–46°`), and vertical height (`0.42–6.5`) are clamped cleanly so 2D cutout rigs never expose flat edges or clip through background layers.
- **Deterministic 4-Layer Parallax**: `EnvironmentComposer.applyCameraParallax(cameraState, strength)` shifts `background`, `midground`, `interaction`, and `foreground` layers purely from current camera state—zero accumulated drift.
- **Stylized Cartoon Optical FX**: `renderCameraVisualEffects(...)` renders whip-pan speed lines, radial zoom-blur lines, subtle vignette, focus reticle, impact flash, depth-of-field edge haze, letterbox framing, and **9:16 vertical storytelling safe-frame guides** directly onto the high-DPI 2D overlay canvas.

---

## Libraries & Counts

| Module | File | Count |
| --- | --- | --- |
| **Cinematic Camera Presets** | `src/camera/presets.js` | **66** (16 Zoom · 12 Pan & Tilt · 12 Tracking · 10 Orbit · 16 Dynamic) |
| **Camera Transitions** | `src/camera/transitions-and-combos.js` | **14** |
| **Multi-Layer Combinations** | `src/camera/transitions-and-combos.js` | **5** |
| **Camera Composition Library** | `src/camera/compositions-and-effects.js` | **22** (8 Character · 6 Object · 8 Storytelling) |
| **Stylized Camera Effects** | `src/camera/compositions-and-effects.js` | **16** (9 Movement · 7 Visual) |
| **Subject Tracking & Director** | `src/camera/subject-tracker.js` | `SubjectTargetRegistry`, `CameraTimeline`, `CameraChoreographyDirector` |
| **Showcase Demo Environment** | `src/environment/camera-showcase.js` | 4-Layer multi-subject set (Heroine, Smartphone, Sports Car, Private Jet, Mansion) |

---

## Reusable Camera Timeline Format

```js
import { CameraTimeline, SubjectTargetRegistry } from './src/index.js';

const registry = new SubjectTargetRegistry();
const timeline = new CameraTimeline([
  {
    id: 'car_reveal',
    combination: 'combo_sports_car_reveal',
    target: 'sports_car',
    start: 0.0,
    duration: 4.8,
    intensity: 1.0,
    transition: 'whip_pan_transition',
    priority: 1,
  },
  {
    id: 'phone_alert',
    preset: 'zoom_into_smartphone',
    target: 'smartphone',
    composition: 'object_detail',
    start: 4.8,
    duration: 2.6,
    easing: 'easeInOutQuart',
    transition: 'zoom_through_transition',
    effects: { focusEmphasis: 0.8, depthOfField: 0.5 },
    priority: 2,
  },
]);

// Identical timestamps always yield bit-identical camera states for preview and export
const frame = timeline.evaluateAt(5.4, registry);
engine.setCameraState(frame.camera);
composer.applyCameraParallax(frame.camera, 1.0);
```

---

## Narration-Driven Choreography Director

```js
import { CameraChoreographyDirector } from './src/index.js';

const director = new CameraChoreographyDirector();
const timeline = director.buildTimelineFromNarration([
  'Imagine this: starting from zero.',
  'You buy a sports car.',
  'A private jet waits on the tarmac.',
  'Look at your bank account on your smartphone.',
  "But here's the problem.",
  'Everything changes.',
]);
```

The director tracks previously selected presets to prevent monotonous consecutive camera moves while matching framing and combinations to the spoken subject.

---

## Camera Preview Lab Workspace
Select **Camera Lab** in the PuppetKit Studio header to inspect the multi-subject 2.5D showcase set with:
- Interactive **66-Preset Gallery** with search and 5 category filters
- Live **5 Multi-Layer Combination** previews (`combo_sports_car_reveal`, `combo_million_dollar_reveal`, `combo_private_jet_reveal`, `combo_dramatic_realization`, `combo_smartphone_reveal`)
- **Before / After Comparison** toggle (`Cinematic: ON` vs `Static: ON`)
- **9:16 Safe Frame** vertical storytelling guide toggle & **$1M Popup** toggle
- Adjustable Duration, Intensity, Easing, Target Subject, 22 Compositions, 14 Transitions, 16 Effects, Parallax Depth, and instant PNG Snapshot Export
