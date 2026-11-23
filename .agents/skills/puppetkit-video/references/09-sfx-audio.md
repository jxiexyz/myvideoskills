# 09 — SFX Preset System, Audio Director & WAV Export

PuppetKit features a complete procedural sound design engine, 6-bus audio mixer, and deterministic 16-bit PCM WAV exporter.

---

## 77 Categorized SFX Presets

Managed in `src/audio/sfx-presets.js`:

| Category | Count | Typical Presets |
|---|---|---|
| **Character & Acting** | 12 | `footstep_soft`, `footstep_boot`, `jump_takeoff`, `land_impact`, `cloth_rustle`, `hand_clap` |
| **UI & Popups** | 12 | `card_pop`, `notification_chime`, `digital_confirm`, `metric_counter_tick`, `pill_snap` |
| **Camera & Transitions**| 10 | `whoosh_fast`, `whip_pan_air`, `cinematic_boom`, `tape_stop`, `shutter_click` |
| **Objects & Interaction**| 11 | `door_open`, `keys_jingle`, `switch_click`, `paper_turn`, `car_door_close` |
| **Finance & Business** | 10 | `cash_register_ding`, `coin_drop`, `counter_stream`, `vault_unlock`, `credit_card_swipe` |
| **Story & Emotion** | 10 | `heartbeat_subtle`, `tension_riser`, `dramatic_hit`, `revelation_bell`, `sad_pad_tone` |
| **Ambience Beds** | 7 | `room_tone_quiet`, `city_hum_distant`, `office_buzz`, `rain_outside`, `night_crickets` |
| **Comedy & Exaggeration**| 5 | `spring_boing`, `slide_whistle`, `record_scratch`, `squish_pop`, `anvil_drop` *(excluded from serious stories)* |

---

## 6 Audio Mixer Buses

Configured in `SFXBusManager` (`src/audio/sfx-engine.js`):
1. **`voice`**: Spoken narration (with auto-ducking for sound effects).
2. **`music`**: Background music track.
3. **`sfx_primary`**: Critical narrative hits, character jumps, milestone stamps.
4. **`sfx_secondary`**: UI clicks, card pops, footsteps, soft Foley.
5. **`ambience`**: Continuous looping background room tones and outdoor beds.
6. **`transitions`**: Whooshes, whip pans, and scene transition stingers.

---

## Procedural Synthesis vs External WAV Files

- **73 Presets (`assetStatus: 'ready_procedural'`)**:
  Synthesized directly via Web Audio math in `synthesizePresetSamples()`. They require no external files and sound 100% identical between live browser preview and offline WAV export.
- **4 Presets (`assetStatus: 'missing_file'`)**:
  Flagged in `assets/audio/sfx-manifest.json` as requiring real foley audio:
  - `assets/audio/character/paper_rustle.wav`
  - `assets/audio/objects/car_door_close.wav`
  - `assets/audio/objects/engine_idle_rev.wav`
  - `assets/audio/environment/crowd_soft_loop.wav`

---

## Programmatic Sound Design & WAV Export

```javascript
import {
  SFXPresetRegistry,
  SFXDirector,
  SFXBusManager,
  renderSFXTimelineToWav
} from './src/index.js';

// 1. Initialize registry and intelligent director:
const registry = new SFXPresetRegistry();
const sfxDirector = new SFXDirector(registry);

// 2. Direct sound events automatically from a storyboard:
const sfxPlan = sfxDirector.directFromStoryboard(storyboard, {
  storyStyle: 'cinematic', // Excludes comedy presets automatically
  importanceThreshold: 54   // Lower (46-50) for more sounds, higher (62-68) for minimalist silence
});

// 3. Render complete audio mixdown to 16-bit Stereo PCM WAV (Uint8Array):
const wavBytes = renderSFXTimelineToWav({
  events: sfxPlan.events,
  ambienceTracks: sfxPlan.ambienceTracks,
  silenceCues: sfxPlan.silenceCues,
  totalDuration: sfxPlan.totalDuration,
  registry,
  busManager: new SFXBusManager(),
  sampleRate: 44100 // or 22050 for lightweight clips
});

// Save wavBytes to disk:
// fs.writeFileSync('out/audio.wav', Buffer.from(wavBytes));
```

---

## Key Files
- Presets & Combinations: `src/audio/sfx-presets.js`
- Director & Validator: `src/audio/sfx-director.js`
- Synthesis, Mixer & WAV Renderer: `src/audio/sfx-engine.js`
- UI Studio: `src/components/SFXStudioLab.tsx`
- Doc: `docs/NARRATIVE_ENGINE_AND_SFX_SYSTEM.md`
