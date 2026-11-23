# 03 — Facial Expressions, Gaze Tracking & Talking Overlay

The facial system is handled by `ExpressionController`, `BlinkController`, and `GazeController` on an independent channel. It never destroys ongoing body postures.

---

## 16 Facial Expressions Matrix

| Expression | Eyes Shape | Brows | Mouth | Blush | Default Gaze `(x, y)` |
|---|---|---|---|---|---|
| `neutral` | `eyes` | `brows` | `mouth` | 0% | `(0, 0)` Center |
| `happy` | `eyes` | `brows_raised` | `mouth_smile` | 45% | `(0, -0.05)` Slight up |
| `excited` | `eyes_wide` | `brows_raised` | `mouth_wide` | 72% | `(0, -0.1)` Up |
| `laughing` | `eyes_happy` (closed arc) | `brows_raised` | `mouth_laugh` | 78% | Closed |
| `sad` | `eyes_sad` | `brows_sad` | `mouth_frown` | 0% | `(0, 0.45)` Downcast |
| `angry` | `eyes_angry` | `brows_angry` | `mouth_teeth` | 15% | `(0, 0.05)` Intense |
| `surprised` | `eyes_wide` | `brows_raised` | `mouth_small_o` | 0% | `(0, 0)` Wide |
| `confused` | `eyes` | `brows_confused` | `mouth_thinking` | 0% | `(0.35, -0.1)` Side |
| `worried` | `eyes_sad` | `brows_worried` | `mouth_worried` | 0% | `(-0.22, 0.2)` Down-left |
| `scared` | `eyes_scared` | `brows_worried` | `mouth_open` | 0% | `(0, 0.05)` Pinned |
| `shy` | `eyes_shy` | `brows_sad` | `mouth_shy` | 95% | `(0.55, 0.25)` Side-down |
| `sleepy` | `eyes_sleepy` | `brows_sleepy` | `mouth_small_o` | 0% | `(0, 0.45)` Drooping |
| `bored` | `eyes_sleepy` | `brows_sleepy` | `mouth_bored` | 0% | `(-0.35, 0.25)` Side |
| `thinking` | `eyes` | `brows_confused` | `mouth_thinking` | 0% | `(0.58, -0.65)` Up-right |
| `disgusted` | `eyes_disgusted` | `brows_angry` | `mouth_disgusted` | 0% | `(-0.2, 0.1)` Narrow |
| `determined` | `eyes_angry` | `brows_determined` | `mouth_determined` | 0% | `(0, -0.05)` Firm |

---

## Public Facial & Gaze API

```javascript
// 1. Set expression with smooth crossfade:
character.expression('happy', { transition: 0.2 });

// 2. Direct eye gaze (normalized -1..1 coordinates):
character.lookAt({ x: 0.5, y: -0.3 }); // Look up-right

// 3. Trigger manual or automatic blink:
character.blink(); // Closes eyelids smoothly and restores active expression

// 4. Talking overlay (oscillates mouth without overriding expression permanently):
character.talk(true);  // Starts mouth movement
character.talk(false); // Restores 'happy' smile automatically

// 5. Viseme cue hooks (for phoneme-driven speech):
character.setViseme('A'); // 'A', 'E', 'I', 'O', 'U', 'M', 'F', 'rest'

// 6. Reset back to neutral:
character.resetExpression();
```

---

## How Dynamic Gaze Works

- The iris mesh translates dynamically within eye bounding limits specified in the character manifest (`gazeRig`).
- **Eyelid Mask Clipping**: Eye outlines automatically clip iris movement so the pupil never leaks outside the eyelid geometry during squinting, anger, or sleepy expressions.

---

## Multi-View Facial Synchronization

- **`front` View**: Full facial art renders live (eyes, eyebrows, mouth, blush, gaze, talking).
- **`back`, `top`, `bottom` Views**: Face layers are hidden so graphics don't leak onto the back of the head or crown.
- **State Preservation**: While non-front views are shown, the `ExpressionController` keeps tracking gaze, talking intervals, and transitions internally. Switching back to `front` instantly displays the updated face.

---

## How to Add a New Expression

1. In `src/animation/expression/expression-presets.js`:
   - Add your definition to `EXPRESSION_PRESETS`:
     ```javascript
     smirk: {
       id: 'smirk',
       label: 'Smirk',
       layers: { eyes: 'eyes', brows: 'brows_determined', mouth: 'mouth_smile', blush: 0.2 },
       gaze: { x: 0.3, y: 0.0 },
       procedural: { browAsymmetry: 0.15 }
     }
     ```
2. In `src/animation/expression/expression-controller.js`:
   - If the expression is serious/negative, register its ID in `seriousExprs` inside `_resolveActiveMouth` so talking does not flash a happy smile.
3. In `src/narrative/acting-popup-camera-directors.js`:
   - Map narrative tone keywords to your new expression in `NARRATIVE_EXPRESSION_MAP`.

---

## Key Files
- Expression Presets: `src/animation/expression/expression-presets.js`
- Controller: `src/animation/expression/expression-controller.js`
- Gaze Logic: `src/animation/gaze-controller.js`
- Blink Logic: `src/animation/expression/blink-controller.js`
- Doc: `docs/EXPRESSION_CATALOG.md` & `docs/GAZE_PRESET.md`
