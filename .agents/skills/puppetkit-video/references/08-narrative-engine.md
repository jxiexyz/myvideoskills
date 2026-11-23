# 08 — Narrative Engine & Script-to-Storyboard Director

The Narrative Engine transforms plain spoken narration text or timestamped cues into a fully coordinated visual storyboard across acting, gaze, popups, camera moves, and environment backdrops.

---

## Architecture Flow

```text
Narration Script / Timestamped Words
        │
        ▼
Semantic Story Beat Analyzer (`src/narrative/beat-analyzer.js`)
        │  • Context & polarity classification (financial_gain vs loss vs debt vs ambition)
        │  • Clause splitting & syllable cadence timing
        ▼
Coordinated Directors (`src/narrative/acting-popup-camera-directors.js`)
        │  • CharacterActingDirector: 20 narrative tones -> 16 expressions, gestures, anti-repetition, gaze
        │  • SemanticPopupDirector: Selects from 52 popup templates with entrance/exit timings
        │  • SmartCameraHighlightDirector: Selects from 66 camera presets matching spoken targets
        │  • BackgroundResponseDirector: Chooses contextual 2.5D environment scenes
        ▼
Unified Storyboard & Conflict Resolution (`src/narrative/narrative-director.js`)
        │  • Resolves attention clashes (e.g., protects active counters from sudden cuts)
        │  • Allows manual override per beat
        ▼
Deterministic Evaluator (`NarrativeTimelineEvaluator.evaluateAt(storyboard, t)`)
```

---

## Context & Polarity Disambiguation

The engine differentiates meaning beyond simple keywords:

| Spoken Phrase | Classified Intent | Character Reaction | Popup Template | Camera Preset |
|---|---|---|---|---|
| *"You just made $1M"* | `financial_gain` | Excited, celebrate gesture, look at popup | `million_dollar_badge` (emerald) | `combo_million_dollar_reveal` |
| *"You lost $1M"* | `financial_loss` | Shocked recoil, sad look down | `debt_deficit_banner` (coral) | `impact_jolt_zoom` |
| *"You owe $1M"* | `financial_debt` | Worried, shrug gesture | `warning_caution_box` (coral) | `dramatic_snap_zoom` |
| *"You wish for $1M"* | `financial_ambition`| Determined, thinking pose | `wealth_target_progress` (gold) | `slow_push_in` |

---

## Programmatic Storyboard Generation

```javascript
import {
  NarrativeToVisualDirector,
  NarrativeTimelineEvaluator
} from './src/index.js';

// 1. Generate full storyboard from script text:
const script = `
  Imagine making just $2,000 a month in a tiny bedroom.
  Then suddenly, you discover compound growth.
  Boom, your bank account hits one million dollars!
`;

const storyboard = NarrativeToVisualDirector.generateStoryboard(script);

// 2. Override specific beats if needed (immutable, auto conflict-checked):
const modified = NarrativeToVisualDirector.applyStoryboardOverride(
  storyboard,
  storyboard.events[1].id,
  {
    expression: 'surprised',
    cameraPreset: 'crash_zoom_cut',
    popupTheme: 'cyberNeon'
  }
);

// 3. Evaluate state at time t (seconds) — 100% deterministic:
const stateAt2Sec = NarrativeTimelineEvaluator.evaluateAt(modified, 2.0);

console.log(stateAt2Sec.acting);   // { expression: 'excited', motion: 'wave', gaze: { x, y } }
console.log(stateAt2Sec.popup);    // { active: true, templateId: 'million_dollar_badge', progress }
console.log(stateAt2Sec.camera);   // { presetId: 'combo_million_dollar_reveal', fov, viewHeight, ... }
console.log(stateAt2Sec.backdrop); // { templateId: 'penthouse_interior', palette: 'twilightLuxury' }
```

---

## Conflict Resolution Rules

`src/narrative/narrative-director.js` enforces editorial safety:
- **Counter Protection**: Prevents camera transitions from cutting during active number counting.
- **Attention Hierarchy**: When a hero popup appears, character gaze directs toward the popup position.
- **Anti-Repetition**: Prevents consecutive identical gestures (e.g. alternating between `explain`, `point`, and `nod`).

---

## How to Add New Intent Rules

1. In `src/narrative/beat-analyzer.js`:
   - Add new intent key to `SEMANTIC_INTENTS`.
   - Add regex pattern (with word boundaries `\b`) to `classifyNarrativeSemantics()`.
2. In `src/narrative/acting-popup-camera-directors.js`:
   - Add intent handler cases in `CharacterActingDirector`, `SemanticPopupDirector`, and `SmartCameraHighlightDirector`.
3. In `tests/narrative-and-sfx.test.mjs`:
   - Add a unit test verifying intent classification.

---

## Key Files
- Beat Analyzer: `src/narrative/beat-analyzer.js`
- Coordinated Directors: `src/narrative/acting-popup-camera-directors.js`
- Director & Evaluator: `src/narrative/narrative-director.js`
- Storyboard Panel UI: `src/components/NarrativeLogicLab.tsx`
- Doc: `docs/NARRATIVE_ENGINE_AND_SFX_SYSTEM.md`
