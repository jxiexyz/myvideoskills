# PuppetKit Facial Expression Catalog

The facial system operates on an independent channel (`ExpressionController`) and coordinates four sub-systems cleanly:
1. **16 Distinct Facial Expressions** with style-matched eye, brow, mouth, and cheek blush SVG variants plus smooth transition blending (`character.expression(name, { transition: 0.2 })`).
2. **Dynamic Gaze Tracking** (`createGazeController`) using expression-specific eyelid masks so moving irises stay cleanly clipped inside `neutral`, `wide`, `scared`, `sad`, `angry`, `sleepy`, `shy`, and `disgusted` eye shapes.
3. **Controlled & Auto Blinking** (`BlinkController`) that closes lids smoothly across open-eye expressions, respects already-closed expressions (`laughing`), and always restores the active expression's exact eye state.
4. **Non-Destructive Talking & Viseme Overlay** (`character.talk(true/false)` and `character.setViseme('A'|'E'|'I'|'O'|'U'|'M'|'F'|'rest')`) that animates mouth shapes without permanently overwriting the active expression's mouth.

## Complete 16-Expression Matrix

| Expression | Eyes / Gaze Profile | Brows | Mouth | Blush | Default Gaze Bias |
| --- | --- | --- | --- | --- | --- |
| `neutral` | `eyes` (`neutral`) | `brows` | `mouth` | 0% | Center `(0, 0)` |
| `happy` | `eyes` (`neutral`) | `brows_raised` | `mouth_smile` | 45% | Slight up `(0, -0.05)` |
| `excited` | `eyes_wide` (`wide`) | `brows_raised` | `mouth_wide` | 72% | Up `(0, -0.1)` |
| `laughing` | `eyes_happy` (closed arc) | `brows_raised` | `mouth_laugh` | 78% | N/A (closed arc) |
| `sad` | `eyes_sad` (`sad` + tear glint) | `brows_sad` | `mouth_frown` | 0% | Downcast `(0, 0.45)` |
| `angry` | `eyes_angry` (`angry`) | `brows_angry` | `mouth_teeth` | 15% | Focused `(0, 0.05)` |
| `surprised` | `eyes_wide` (`wide`) | `brows_raised` | `mouth_small_o` | 0% | Center `(0, 0)` |
| `confused` | `eyes` (`neutral`) | `brows_confused` | `mouth_thinking` | 0% | Sideways `(0.35, -0.1)` |
| `worried` | `eyes_sad` (`sad`) | `brows_worried` | `mouth_worried` | 0% | Down-left `(-0.22, 0.2)` |
| `scared` | `eyes_scared` (`scared` small pupils) | `brows_worried` | `mouth_open` | 0% | Center `(0, 0.05)` |
| `shy` | `eyes_shy` (`shy`) | `brows_sad` | `mouth_shy` | 95% | Side-down `(0.55, 0.25)` |
| `sleepy` | `eyes_sleepy` (`sleepy` heavy lids) | `brows_sleepy` | `mouth_small_o` | 0% | Down `(0, 0.45)` |
| `bored` | `eyes_sleepy` (`sleepy`) | `brows_sleepy` | `mouth_bored` | 0% | Side-down `(-0.35, 0.25)` |
| `thinking` | `eyes` (`neutral`) | `brows_confused` | `mouth_thinking` | 0% | Up-right `(0.58, -0.65)` |
| `disgusted` | `eyes_disgusted` (`disgusted` squint) | `brows_angry` | `mouth_disgusted` | 0% | Side `(-0.2, 0.1)` |
| `determined` | `eyes_angry` (`angry`) | `brows_determined` | `mouth_determined` | 0% | Steady `(0, -0.05)` |

## Quick Usage
```js
character.expression('happy', { transition: 0.2 });
character.lookAt({ x: 0.6, y: -0.3 });
character.blink();
character.talk(true);
// Later:
character.talk(false); // restores 'happy' smile automatically
character.resetExpression(); // smoothly returns to 'neutral'
```

## Multi-View Behavior (Front / Back / Top / Bottom)
- **`front` view (`faceVisible: true`)**: All 16 expressions, dynamic clipped iris gaze, auto-blink, talking mouth oscillation, and viseme cues render live on the face rig.
- **`back`, `top`, and `bottom` views (`faceVisible: false`)**: Front facial feature layers are intentionally omitted from the directional rigs so no facial art leaks onto the back of the head, crown, or underside jaw.
- **Zero-Loss State Preservation**: `ExpressionController` continues updating expression transitions, talking state, viseme cues, auto-blink timers, and gaze targets internally while viewing `back`, `top`, or `bottom`. Switching back to `front` immediately displays the exact synchronized expression, talking mouth, blink phase, and gaze direction without resetting.

