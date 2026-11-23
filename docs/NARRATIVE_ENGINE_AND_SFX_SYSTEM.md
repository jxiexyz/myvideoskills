# PuppetKit Narrative-Driven Video Logic Engine & SFX Preset System

## 1. Architecture Overview

Both upgrades integrate directly into PuppetKit's existing Three.js rendering pipeline (`PuppetEngine`, `PuppetCharacter`, `EnvironmentComposer`, `MotionGraphicsRenderer`, and the 66-preset `Cinematic Camera System`) without introducing duplicate renderers, cameras, or animation loops.

```
Narration Script / Timestamped Cues
        │
        ▼
Semantic Story Beat Analyzer (src/narrative/beat-analyzer.js)
        │  • Context & polarity disambiguation (made vs lost vs owe vs wish)
        │  • Clause splitting & phrase/emphasis timing
        ▼
Coordinated Directors (src/narrative/acting-popup-camera-directors.js)
        │  • CharacterActingDirector (20 narrative tones -> 16 rig expressions, 17 gesture groups, anti-repetition, eye gaze)
        │  • SemanticPopupDirector (4 popup categories -> 52 templates, 6-phase lifecycle, restraint)
        │  • SmartCameraHighlightDirector (registered target tracking + 66 presets + 14 transitions)
        │  • BackgroundResponseDirector (contextual 2.5D backdrops, continuity preservation)
        ▼
Unified Storyboard & Conflict Resolution (src/narrative/narrative-director.js)
        │  • Priority rules (counter hold protection, popup de-overlap, decorative suppression)
        │  • Inline manual storyboard overrides
        │  • Stateless deterministic NarrativeTimelineEvaluator
        ▼
Intelligent SFX Director & 6-Bus Mixer (src/audio/sfx-*.js)
        │  • 77 categorized SFX presets across 8 categories + 7 editable combinations
        │  • Importance scoring, cooldowns, footstep/contact alignment, ambience crossfades, intentional silence
        │  • Seek-safe Web Audio preview + deterministic 16-bit Stereo PCM WAV mixdown
```

---

## 2. Narrative Engine Capabilities

- **Semantic Context Disambiguation**: Distinguishes `"You just made $1M"` (`financial_gain`, excited, emerald wealth reveal), `"You lost $1M"` (`financial_loss`, shocked, coral loss alert), `"You owe $1M"` (`financial_debt`, worried, debt bar), and `"You wish you had $1M"` (`financial_ambition`, determined, gold goal target).
- **Synchronized Phrase & Speech-Driven Mouth Timing**: Supports both raw narration scripts (syllable-weighted cadence with emphasis detection) and exact external word/phrase timestamps (`{ text, startTime, endTime, words }`). Mouth animation uses PuppetKit's speech-driven talking intervals; phoneme-accurate viseme alignment is not claimed unless phoneme timing data is supplied.
- **Editable Storyboard & Conflict Resolution**: Inspect and override any beat's expression, gesture, gaze target, camera preset/target, environment, or popup directly in the **Narrative Lab** workspace.

---

## 3. SFX Preset System & Honest Asset Status

### Categories (77 Presets Total)
1. **Character & Acting** (12 presets)
2. **UI, Popup & Information Graphics** (12 presets)
3. **Camera & Transition** (10 presets)
4. **Object & Interaction** (11 presets)
5. **Finance, Business & Numbers** (10 presets)
6. **Emotional & Storytelling** (10 presets)
7. **Environment & Ambience** (7 loopable beds)
8. **Comedy & Exaggeration** (5 presets — isolated and automatically excluded from serious/cinematic stories)

### Asset Provenance & Missing Audio Files
- **73 Presets (`assetStatus: 'ready_procedural'`)**: Synthesized deterministically via PuppetKit's built-in Web Audio engine (`src/audio/sfx-engine.js`) using seeded noise and harmonic envelopes. Live browser preview and offline `.wav` mixdowns use the exact same synthesis math for bit-consistent output.
- **4 Presets (`assetStatus: 'missing_file'`)**: Intentionally reference external recorded `.wav` paths under `assets/audio/sfx/` and are explicitly flagged in `assets/audio/sfx-manifest.json`, `SFXValidator`, and the **SFX Studio** UI until royalty-free recordings are supplied:
  - `char_sigh_foley` -> `assets/audio/sfx/character/char_sigh_foley.wav`
  - `obj_door_open_foley` -> `assets/audio/sfx/objects/obj_door_open_foley.wav`
  - `env_outdoor_birds_foley` -> `assets/audio/sfx/environment/env_outdoor_birds_foley.wav`
  - `com_record_scratch_foley` -> `assets/audio/sfx/comedy/com_record_scratch_foley.wav`

### Adding or Editing Presets
- **In UI**: Open **SFX Studio -> Library**, audition presets, save custom presets, toggle layers inside the **7 Reusable Combinations**, edit any event on the multi-lane timeline, or export a mixed `.wav` track.
- **In Code**: Register presets via `SFXPresetRegistry.saveCustomPreset(...)` or add entries to `BUILTIN_SFX_PRESETS` in `src/audio/sfx-presets.js`.
