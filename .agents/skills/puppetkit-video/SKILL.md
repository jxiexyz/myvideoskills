---
name: puppetkit-video
description: >-
  Use this skill when the user wants to create animated 2D cutout puppet videos,
  render character animations to MP4, design storyboards from narration scripts,
  or modify PuppetKit characters, motions, expressions, environments, camera presets, or SFX.
---

# PuppetKit 2D — Video Production Skill

PuppetKit is a deterministic 2D cutout puppet animation toolkit built on Three.js.
It rigs separated image/SVG layers around pivot joints, plays 45 reusable motions
across 5 independent channels, renders 16 facial expressions with dynamic gaze,
composes 2.5D environments, and exports frame-perfect MP4 video via headless Chromium + ffmpeg.

---

## Quick Start

```bash
npm install          # install dependencies (Three.js, React, Vite, etc.)
npm run dev          # start Vite dev server on port 3000
# Open http://localhost:3000 for the interactive Character Lab

# Render video:
bash make.sh heroine stills              # 8 stills + determinism check
bash make.sh heroine full 300 30         # 300 frames @ 30fps → out/clip.mp4 (540×960)
bash make.sh heroine full 300 30 720x1280  # custom resolution
```

**Requirements:** Node.js 20+, npm. For video render: Chromium (`/usr/bin/chromium`), ffmpeg.

---

## Subsystem Reference Map (Foundations & Extension Recipes)

> **Read ONLY the reference you need.** Each file is self-contained (~80–190 lines) and includes both the **built-in catalog** and the **step-by-step recipe to add/improve your own assets**:

| Goal / Subsystem | Reference File | What You Learn & Can Extend |
|---|---|---|
| **Character Rigging** | [01-rigging-and-character.md](./references/01-rigging-and-character.md) | Standard part hierarchy, manifest schema, adding custom character rigs |
| **Body Motions** | [02-animation-catalog.md](./references/02-animation-catalog.md) | 45 motions, 5 channels, mathematical wave functions to code new motions |
| **Facial Expressions & Gaze** | [03-expression-and-gaze.md](./references/03-expression-and-gaze.md) | 16 expressions, iris gaze tracking, adding custom expressions & phonemes |
| **Multi-View Directions** | [04-multi-view-system.md](./references/04-multi-view-system.md) | 4 directional rigs, ViewAdapter, adding 3/4 profile or custom angles |
| **Custom Backgrounds & Props** | [05-environment-and-props.md](./references/05-environment-and-props.md) | **Create custom backgrounds** (2.5D Three.js cel-shading OR 2D flat SVG/PNG) |
| **Motion Graphics Popups** | [06-motion-graphics.md](./references/06-motion-graphics.md) | 52 popup templates, themes, coding custom canvas overlays & badges |
| **Cinematic Camera** | [07-camera-system.md](./references/07-camera-system.md) | 66 presets, transitions, writing custom camera moves & target trackers |
| **Narrative Storyboard** | [08-narrative-engine.md](./references/08-narrative-engine.md) | Script parsing, conflict resolution, adding custom story intents |
| **SFX Audio & WAV Export** | [09-sfx-audio.md](./references/09-sfx-audio.md) | 77 sound presets, 6 buses, synthesizer recipes for new procedural SFX |
| **Render to MP4** | [10-render-pipeline.md](./references/10-render-pipeline.md) | Headless Chromium capture, ffmpeg encoding, determinism quality gates |
| **Public API Cheatsheet** | [11-api-cheatsheet.md](./references/11-api-cheatsheet.md) | All public module exports & copy-paste runtime code snippets |

---

## End-to-End Video Workflow

The fastest path from a narration script to a rendered MP4:

```js
import {
  NarrativeToVisualDirector,
  NarrativeTimelineEvaluator,
  SFXPresetRegistry,
  SFXDirector,
  SFXBusManager,
  renderSFXTimelineToWav,
} from './src/index.js';

// 1. Generate storyboard from narration text
const storyboard = NarrativeToVisualDirector.generateStoryboard(
  'Imagine making just $2,000 a month, but dreaming of becoming a millionaire.'
);

// 2. (Optional) Override a specific beat manually
const edited = NarrativeToVisualDirector.applyStoryboardOverride(
  storyboard, storyboard.events[0].id,
  { expression: 'determined', cameraTarget: 'financial_popup' }
);

// 3. Evaluate deterministic frame at timestamp t (seconds)
const frame = NarrativeTimelineEvaluator.evaluateAt(edited, 2.4);

// 4. Generate SFX plan & render WAV
const registry = new SFXPresetRegistry();
const sfxDirector = new SFXDirector(registry);
const sfxPlan = sfxDirector.directFromStoryboard(edited, { storyStyle: 'cinematic' });

const wav = renderSFXTimelineToWav({
  events: sfxPlan.events,
  ambienceTracks: sfxPlan.ambienceTracks,
  silenceCues: sfxPlan.silenceCues,
  totalDuration: sfxPlan.totalDuration,
  registry,
  busManager: new SFXBusManager(),
  sampleRate: 22050,
});

// 5. Render to MP4 via CLI:
// bash make.sh <character> full <frames> <fps> [WxH]
```

For the render pipeline's character contract (`manifest.js` + `story.js`), see [10-render-pipeline.md](./references/10-render-pipeline.md).

---

## Golden Rules

1. **Determinism is sacred.** Never use `Math.random()`, `Date.now()`, or `requestAnimationFrame` in evaluators. Frame at time `t` must always produce identical pixels when replayed or scrubbed.
2. **Keep standard part IDs.** Preserve canonical rig part names (`body`, `head`, `leftUpperArm`, `rightForearm`, `eyes`, `mouth`, etc.) so all 45 motions and 16 expressions work without code changes.
3. **5-channel architecture.** Channels (`base`, `locomotion`, `head`, `gesture`, `face`) compose independently. Don't merge them.
4. **Parents before children** in manifest `parts[]` array.
5. **Loop motions must return to start.** Values at `u=0` and `u=1` must be identical for seamless loops.

---

## Test & Verify

```bash
# Run all 37 unit tests (pure logic, no browser needed for narrative/sfx tests)
npx --yes tsx --test \
  tests/puppetkit.test.mjs \
  tests/multi-view.test.mjs \
  tests/production-toolkit.test.mjs \
  tests/camera-system.test.mjs \
  tests/narrative-and-sfx.test.mjs

# Type-check & production build
npm run lint
npm run build
```

---

## Key Source Locations

| Module | Path | Lines |
|---|---|---|
| Engine core | `src/core/puppet-engine.js`, `puppet-character.js` | ~1070 |
| Rig (skeleton + parts) | `src/rig/skeleton.js`, `part.js` | ~367 |
| Animation system | `src/animation/` (7 files + `channels/` + `expression/`) | ~1700+ |
| Camera system | `src/camera/` (4 files) | ~2920 |
| Environment system | `src/environment/` (4 files + `props/`) | ~2300+ |
| Motion graphics | `src/motion-graphics/` (3 files) | ~2356 |
| Narrative engine | `src/narrative/` (3 files) | ~2076 |
| Audio/SFX | `src/audio/` (4 files) | ~3181 |
| Story director | `src/director/story-director.js` | ~389 |
| React UI (Character Lab) | `src/App.tsx` + `src/components/` | ~6500+ |
| Character assets | `assets/characters/`, `assets/heroine*` | manifests + SVGs |
| Render pipeline | `render/`, `make.sh` | ~200 |
| Tests | `tests/` (5 test files) | ~54 tests |
| Documentation | `docs/` (15 markdown files) | detailed guides |
