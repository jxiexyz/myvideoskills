# 02 — Animation Catalog & Multi-Channel Motion System

PuppetKit uses a **5-channel cooperative animation architecture** (`base`, `locomotion`, `head`, `gesture`, and `face`). Every frame evaluates relative to immutable `restTransform` poses, preventing cumulative drift and limb snapping.

---

## The 5 Channels

1. **`base`**: Subtle life loops (`idle`, `breathing`, `bodySway`, `weightShift`). Yields legs during locomotion, yields arms during gestures.
2. **`locomotion`**: Full-body movement (`walk`, `run`, `jump`, `crouch`, `recoil`, `bow`, `laugh`). Yields arms if a `gesture` claims them (allows `walk + wave`).
3. **`head`**: Head tilts, nods, turns, and gaze biases (`nod`, `shake`, `tiltLeft`, `look*`). Layers onto head/neck without clearing facial expressions.
4. **`gesture`**: Arm and hand actions (`wave`, `point`, `shrug`, `clap`, `explain`). Claims only active arm parts.
5. **`face`**: Expressions, blinking, gaze controller, talking mouth overlay, and viseme lip sync.

---

## 45 Reusable Motions Catalog

### Base Channel
| Motion | Type | Duration | Description |
|---|---|---|---|
| `idle` | Loop | 3.2s | Gentle breathing, micro head float, subtle braid sway |
| `breathing` | Loop | 2.8s | Rhythmic chest/torso and shoulder expansion |
| `bodySway` | Loop | 3.4s | Side-to-side torso sway with head counterbalance |
| `weightShift` | Loop | 3.6s | Hip weight shift with subtle knee flex |

### Head Channel
| Motion | Type | Duration | Description |
|---|---|---|---|
| `nod` / `nodLoop` | One-shot / Loop | 0.72s / 1.0s | Affirmative downward nod / continuous listening nods |
| `shake` | One-shot | 0.78s | Horizontal "no" head shake with braid lag |
| `tiltLeft` / `tiltRight` | One-shot | 1.05s | Inquisitive head tilt |
| `lookLeft` / `lookRight` | One-shot | 1.25s | Eye gaze shift with subtle head bias |
| `lookUp` / `lookDown` | One-shot | 1.25s | Upward / downward gaze coordination |
| `glance` | One-shot | 0.9s | Quick side glance and snap return |
| `lookAround` | Loop | 3.0s | Left-to-right scanning cycle |
| `headTurnLeft` / `headTurnRight` | One-shot | 1.2s | Subtle 2D foreshortening & gaze (cutout parallax) |

### Gesture Channel (Arms & Hands)
| Motion | Type | Duration | Description |
|---|---|---|---|
| `wave` / `waveOnce` | Loop / One-shot | 1.2s / 1.55s | Right arm wave with forearm oscillation |
| `point` / `pointRight` / `pointLeft` | One-shot | 1.35s | Extended arm pointing gesture with settle |
| `raiseLeftHand` / `raiseRightHand` | One-shot | 1.4s–1.5s | Single overhead arm raise |
| `raiseBothHands` | One-shot | 1.5s | Double arm victory/reaching raise |
| `handsUp` | Loop | 1.6s | Sustained celebratory hands raised |
| `lowerHands` | One-shot | 0.55s | Fast smooth return of arms to rest |
| `shrug` | One-shot | 1.15s | Shoulder lift + outward forearm turn |
| `clap` | Loop | 0.72s | Continuous two-handed applause cycle |
| `explain` / `talkingGesture` | Loop | 1.9s / 1.6s | Conversational alternating hand gestures |
| `emphasisGesture` | One-shot | 0.85s | Downward rhythmic beat accentuation |

### Locomotion & Full Body Reactions
| Motion | Type | Duration | Description |
|---|---|---|---|
| `walk` | Loop | 1.25s | Two-bone IK planted-foot walk stride |
| `walkStart` / `walkStop` | One-shot | 0.7s | Smooth acceleration / deceleration |
| `run` | Loop | 0.68s | Fast athletic running cycle |
| `runStart` / `runStop` | One-shot | 0.52s / 0.65s | Sprint launch and brake |
| `jump` | One-shot | 1.05s | Crouch anticipation -> launch -> apex -> absorption |
| `land` | One-shot | 0.58s | Knee absorption and recovery |
| `crouch` | Loop | 1.8s | Held crouch posture with breathing |
| `recoil` | One-shot | 0.72s | Defensive backward flinch |
| `surprisedReaction` | One-shot | 0.68s | Upward startle jolt with arms flaring |
| `laugh` | Loop | 0.9s | Rhythmic shoulder heave and head bob |
| `bow` | One-shot | 1.5s | Respectful forward bow |

*(Note: `thumbsUp` is omitted in base rig due to single-silhouette cutout hand art).*

---

## 7 Combined Action Presets

Trigger all coordinated channels together via `character.preset(presetId)`:

```javascript
character.preset('greeting');       // happy + waveOnce + tiltRight + idle
character.preset('explaining');    // determined + explain + nodLoop + talk + breathing
character.preset('celebrating');   // excited + raiseBothHands + nod + bodySway
character.preset('confusedReaction'); // confused + shrug + tiltLeft + idle
character.preset('sadReaction');   // sad + lookDown + lowerHands + breathing
character.preset('surprisedReaction'); // surprised + recoil + idle
character.preset('thinkingPose');  // thinking + tiltRight + lookUpRight + weightShift
```

---

## How to Add a New Motion

1. Open the matching channel file under `src/animation/channels/`:
   - `body-motions.js` (`base` / reactions)
   - `locomotion-motions.js` (`locomotion`)
   - `head-motions.js` (`head`)
   - `gesture-motions.js` (`gesture`)
2. Define the motion object:
   ```javascript
   myNewGesture: {
     id: 'myNewGesture',
     label: 'My New Gesture',
     channel: 'gesture',
     defaultLoop: false,
     duration: 1.0,
     description: 'A custom gesture.',
     evaluate(t, duration) {
       const u = Math.min(Math.max(t / duration, 0), 1);
       const wave = Math.sin(u * Math.PI); // returns 0 at start and 0 at end
       return {
         parts: {
           rightUpperArm: { rot: -30 * wave }, // degrees
           rightForearm: { rot: -50 * wave },
           rightHand: { rot: -15 * wave }
         }
       };
     }
   }
   ```
3. Register the ID in `src/animation/catalog.js`.
4. If adapting for other view angles (`back`, `top`, `bottom`), map rules in `src/animation/view-adapter.js`.

---

## Key Files
- Catalog and exports: `src/animation/catalog.js`
- Channels: `src/animation/channels/*.js`
- Controller: `src/animation/animation-controller.js`
- Multi-view adapter: `src/animation/view-adapter.js`
- Doc: `docs/ANIMATION_CATALOG.md`
