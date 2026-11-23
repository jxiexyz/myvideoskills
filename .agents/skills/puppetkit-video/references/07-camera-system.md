# 07 — Cinematic Camera System & Transitions

PuppetKit features a 100% deterministic camera engine engineered for 2D cutout characters inside 2.5D layered cartoon scenes.

---

## 66 Camera Presets across 5 Categories

Presets live in `src/camera/presets.js`:

| Category | Count | Example Presets |
|---|---|---|
| **Zoom & Push** | 16 | `slow_push_in`, `dramatic_snap_zoom`, `macro_face_close_up`, `zoom_into_smartphone`, `pull_out_reveal`, `slow_drift_zoom` |
| **Pan & Tilt** | 12 | `whip_pan_left`, `slow_pan_right`, `vertical_tilt_down`, `reveal_pan_up`, `cinematic_scan_horizontal` |
| **Tracking** | 12 | `track_character_walk`, `hero_chase_dolly`, `smooth_subject_follow`, `recoil_camera_kick`, `lock_target_smartphone` |
| **Orbit & Angle** | 10 | `orbit_around_hero`, `low_angle_hero_view`, `high_angle_overview`, `dynamic_corner_orbit`, `dutch_angle_tilt` |
| **Dynamic & Action** | 16 | `earthquake_shake`, `heartbeat_pulse`, `impact_jolt_zoom`, `handheld_documentary_float`, `speed_ramp_whip` |

---

## 14 Camera Transitions & 5 Multi-Layer Combos

Managed in `src/camera/transitions-and-combos.js`:
- **14 Transitions**: `instant_cut`, `smooth_dolly_blend`, `whip_pan_transition`, `zoom_through_transition`, `parallax_slide_transition`, `blur_snap_transition`, `crash_zoom_cut`, `orbit_sweep_blend`, `vertical_wipe_pan`, `glitch_jump_cut`, etc.
- **5 Multi-Layer Combinations**:
  1. `combo_sports_car_reveal` (wide establishing -> low angle track -> high-speed whip pan)
  2. `combo_million_dollar_reveal` (character reaction -> crash zoom to $1M popup -> wide celebration)
  3. `combo_private_jet_reveal` (hangar crane up -> pan across fuselage -> hero lock-on)
  4. `combo_dramatic_realization` (slow push-in -> heartbeat micro shake -> extreme face crop)
  5. `combo_smartphone_reveal` (wide room -> rapid dolly zoom -> screen-aligned macro lock)

---

## Subject Target Registry

Camera movements lock smoothly onto registered targets using `SubjectTargetRegistry` (`src/camera/subject-tracker.js`):
- `character` (center full body)
- `character_face` (head / expressions)
- `smartphone` (handheld or tabletop phone)
- `sports_car` (hero vehicle)
- `private_jet` (hangar aircraft)
- `mansion` (exterior background hero)
- `financial_popup` (motion graphics callout)

---

## Stylized Cartoon Camera FX

`src/camera/compositions-and-effects.js`:
- **Movement FX**: Handheld micro-drift, organic breathing sway, footsteps camera bob, impact jolt, horizontal whip speed lines.
- **Visual FX**: Radial speed blur, cartoon vignette, focus emphasis reticle, letterbox cinematic bars, **9:16 vertical storytelling safe-frame guides**.

---

## Programmatic Camera Timeline API

```javascript
import { CameraTimeline, SubjectTargetRegistry } from './src/index.js';

const registry = new SubjectTargetRegistry();
const timeline = new CameraTimeline([
  {
    id: 'intro_shot',
    preset: 'slow_push_in',
    target: 'character',
    start: 0.0,
    duration: 3.0,
    intensity: 1.0,
    transition: 'instant_cut',
  },
  {
    id: 'milestone_shot',
    combination: 'combo_million_dollar_reveal',
    target: 'financial_popup',
    start: 3.0,
    duration: 4.5,
    transition: 'whip_pan_transition',
  }
]);

// Evaluate at timestamp t (deterministic):
const frame = timeline.evaluateAt(3.5, registry);

// Apply to Three.js engine and background parallax:
engine.setCameraState(frame.camera);
composer.applyCameraParallax(frame.camera, 1.0);
```

---

## Key Files
- 66 Presets: `src/camera/presets.js`
- Transitions & Combos: `src/camera/transitions-and-combos.js`
- FX & Compositions: `src/camera/compositions-and-effects.js`
- Tracker & Timeline: `src/camera/subject-tracker.js`
- Doc: `docs/CINEMATIC_CAMERA_SYSTEM.md`
