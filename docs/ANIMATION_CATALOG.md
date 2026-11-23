# PuppetKit Animation Catalog

PuppetKit uses a **5-channel cooperative animation architecture** (`base`, `locomotion`, `head`, `gesture`, and `face`). Every frame is composed cleanly relative to each part's immutable `restTransform`, preventing cumulative drift or stuck limbs when interrupting actions.

## Channel Architecture
1. **`base`**: Continuous subtle life (`idle`, `breathing`, `bodySway`, `weightShift`). Softly yields legs during locomotion and arms during gestures.
2. **`locomotion`**: Full-body and leg motions (`walk`, `run`, `jump`, `crouch`, `recoil`, `bow`, `laugh`). Yields arm parts cleanly whenever `gesture` claims those arms (so `walk + wave` works simultaneously).
3. **`head`**: Independent head motions (`nod`, `shake`, `tiltLeft/Right`, `look*`, `headTurn*`) that layer smoothly onto `head`/`neck`/`braids` and coordinate eye gaze without erasing expressions.
4. **`gesture`**: Independent arm/hand motions (`wave`, `point`, `shrug`, `clap`, `explain`, `raise*`) that claim only their animated arm(s).
5. **`face`**: Independent `ExpressionController`, `BlinkController`, `GazeController`, talking mouth overlay, and viseme cue hook.

## Basic / Base Motions
| Motion | Default Loop | Duration | Notes |
| --- | --- | --- | --- |
| `idle` | Loop | 3.2s | Gentle breathing, micro head float, subtle braid sway |
| `breathing` | Loop | 2.8s | Rhythmic chest/torso and shoulder rise |
| `bodySway` | Loop | 3.4s | Side-to-side torso sway with head counterbalance |
| `weightShift` | Loop | 3.6s | Standing hip weight shift with knee response |

## Head & Gaze Motions
| Motion | Default Loop | Duration | Notes |
| --- | --- | --- | --- |
| `nod` | One-shot | 0.72s | Affirmative downward head nod with rebound |
| `nodLoop` | Loop | 1.0s | Continuous rhythmic listening nods |
| `shake` | One-shot | 0.78s | Horizontal head shake ("no") with braid lag |
| `tiltLeft` / `tiltRight` | One-shot | 1.05s | Curious head tilt left/right with braid drape |
| `lookLeft` / `lookRight` / `lookUp` / `lookDown` | One-shot | 1.25s | Coordinated eye gaze + subtle head bias |
| `glance` | One-shot | 0.9s | Quick side glance and return |
| `lookAround` | Loop | 3.0s | Scans left, pauses, scans right, centers |
| `headTurnLeft` / `headTurnRight` | One-shot | 1.2s | **2D cutout limit**: subtle X-parallax, scaleX foreshortening & gaze (not a 3/4 profile swap) |

## Arm Gestures & Full-Body Reactions
| Motion | Channel | Default Loop | Duration | Notes |
| --- | --- | --- | --- | --- |
| `wave` / `waveOnce` | `gesture` | Loop / One-shot | 1.2s / 1.55s | Raised right arm with forearm & wrist wave |
| `point` / `pointRight` / `pointLeft` | `gesture` | One-shot | 1.35s | Horizontal arm extension with crisp settle |
| `raiseLeftHand` / `raiseRightHand` / `raiseBothHands` | `gesture` | One-shot | 1.4s–1.5s | Overhead arm raise with smooth return |
| `handsUp` | `gesture` | Loop | 1.6s | Sustained celebratory hands-up hold |
| `lowerHands` | `gesture` | One-shot | 0.55s | Smooth return of both arms to rest |
| `shrug` | `gesture` | One-shot | 1.15s | Shoulder lift + outward bent forearms |
| `clap` | `gesture` | Loop | 0.72s | Rhythmic two-hand applause cycle |
| `explain` / `talkingGesture` | `gesture` | Loop | 1.9s / 1.6s | Alternating conversational hand gestures |
| `emphasisGesture` | `gesture` | One-shot | 0.85s | Accented beat gesture |
| `recoil` | `locomotion` | One-shot | 0.72s | Startled backward lean + defensive arms |
| `surprisedReaction` | `locomotion` | One-shot | 0.68s | Quick upward jolt + wide arms |
| `laugh` | `locomotion` | Loop | 0.9s | Rhythmic shoulder chuckle + head tip |
| `bow` | `locomotion` | One-shot | 1.5s | Polite forward bow + upright return |

**Unsupported gesture:** `thumbsUp` is intentionally omitted because the supplied 2D cutout hand artwork has a single open hand silhouette per side without a dedicated thumb-extended swap asset.

## Locomotion Motions
| Motion | Default Loop | Duration | Notes |
| --- | --- | --- | --- |
| `walk` | Loop | 1.25s | Two-bone IK planted-foot walk (in-place by default), counter-swinging arms, braid sway |
| `walkStart` / `walkStop` | One-shot | 0.7s | Smooth acceleration from standing / deceleration to standing |
| `run` | Loop | 0.68s | Faster stride, deeper knee lift, forward lean, energetic arm pump |
| `runStart` / `runStop` | One-shot | 0.52s / 0.65s | Smooth launch and braking recovery |
| `jump` | One-shot | 1.05s | Anticipation crouch -> launch -> apex tuck -> landing absorption -> rest |
| `land` | One-shot | 0.58s | Knee impact absorption + recovery |
| `crouch` | Loop | 1.8s | Held low crouch with subtle breathing |

## Combined Action Presets
Each preset coordinates multiple independent channels via `character.preset(name)`:
- `greeting`: `happy` + `waveOnce` + `tiltRight` + `idle`
- `explaining`: `determined` + `explain` + `nodLoop` + `talking` + `breathing`
- `celebrating`: `excited` + `raiseBothHands` + `nod` + `bodySway`
- `confusedReaction`: `confused` + `shrug` + `tiltLeft` + `idle`
- `sadReaction`: `sad` + `lookDown` + `lowerHands` + `breathing`
- `surprisedReaction`: `surprised` + `recoil` + `idle`
- `thinkingPose`: `thinking` + `tiltRight` + upward-right gaze + `weightShift`

## Multi-View Synchronization & Per-View Support
All 45 motions and 7 combined presets run synchronously across `front`, `back`, `top`, and `bottom` views via `ViewAdapter` (`src/animation/view-adapter.js`):
- Switching views via `character.setView(viewId)` preserves exact channel activity, normalized timeline phase, playback speed, loop override, and pause state.
- **`front` & `back`**: Full `native` playback for base, locomotion, gestures, and body reactions (back view mirrors X-translation and Z-rotation so semantic limbs stay anatomically consistent). Eye gaze motions (`look*`, `glance`) are marked `limited` in `back` because the face is occluded.
- **`top` & `bottom`**: Motions are cleanly `adapted` for overhead and underside projections — vertical displacement (`jump`, `crouch`, `land`) maps to radial depth scale (expanding closer to camera, shrinking farther away), `walk`/`run` project into overhead stepping toes (`top`) or foreground alternating shoe soles (`bottom`), and gestures adapt into legible horizontal sweeps.
- Query per-motion support programmatically with `character.getViewMotionSupport(motionId, viewId)` or see the full 45 × 4 breakdown in `docs/MULTI_VIEW_SYSTEM.md`.

