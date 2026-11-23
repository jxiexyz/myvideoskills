# PuppetKit Multi-View 2D Puppet System

PuppetKit's Multi-View System lets a single 2D cutout character be viewed from **four distinct directional angles** (`front`, `back`, `top`, and `bottom`) while sharing **one synchronized 5-channel animation & expression runtime**.

Switching views mid-animation preserves active channels (`base`, `locomotion`, `head`, `gesture`), exact normalized timeline phase, playback speed, loop override, pause state, active expression, talking state, viseme, auto-blink, and eye gaze.

---

## 1. Non-Negotiable Architecture: Genuine Layered View Packs

Rotating a Three.js orthographic camera around a flat 2D image cannot reveal a character's back, hair crown, or shoe soles. PuppetKit solves this with **distinct layered SVG artwork per directional view** mounted under a single persistent `PuppetCharacter.root` container and driven by a shared semantic rig contract:

| View ID | Direction / Camera | Parts | Face Visible | Ground Shadow | Artwork Folder |
| --- | --- | --- | --- | --- | --- |
| `front` | Facing viewer (`+Z`) | 56 | Yes | Yes | `assets/characters/main-character/parts/` + `views/front/manifest.js` |
| `back` | Facing away (`-Z`) | 22 | No (state synced) | Yes | `assets/characters/main-character/views/back/` |
| `top` | Bird's-eye looking straight down (`-Y`) | 17 | No (state synced) | No | `assets/characters/main-character/views/top/` |
| `bottom` | Worm's-eye looking straight up (`+Y`) | 21 | No (state synced) | No | `assets/characters/main-character/views/bottom/` |

- **Zero shared front SVGs**: `back`, `top`, and `bottom` packs each contain their own dedicated layered SVGs (verified automatically in `tests/multi-view.test.mjs`).
- **Extensible directional slots**: `EXTENSIBLE_VIEW_SLOTS` in `shared/semantic-rig-map.js` reserves clean future slots for `leftProfile`, `rightProfile`, `threeQuarterFrontLeft`, `threeQuarterFrontRight`, `threeQuarterBackLeft`, and `threeQuarterBackRight`, and `character.registerView(viewId, viewManifest)` allows registering additional directional views at runtime.

---

## 2. Folder Structure

```text
assets/characters/main-character/
├── manifest.js                    # Root multi-view manifest (default front + views map)
├── parts/                         # Existing front-facing layered SVGs (56 parts)
├── shared/
│   ├── semantic-rig-map.js        # Canonical part names, view conventions & 45x4 support matrix
│   └── view-catalog.js            # Aggregates front / back / top / bottom view manifests
└── views/
    ├── front/
    │   └── manifest.js            # Front view wrapper with view metadata & framing presets
    ├── back/
    │   ├── manifest.js            # Rear-facing 22-part rig (anatomically mirrored sides)
    │   └── parts/*.svg            # Rear hair curtain, twin braids, rear shoulders, crop top back, skirt, calves, heels
    ├── top/
    │   ├── manifest.js            # Overhead 17-part rig (character faces screen-down +Y in SVG)
    │   └── parts/*.svg            # Center-part hair crown, forward braids, shoulders, circular pleated skirt, stepping toes
    └── bottom/
        ├── manifest.js            # Underside 21-part rig (worm's-eye view looking upward)
        └── parts/*.svg            # Sculpted anatomical shoe soles, foreshortened legs entering dark skirt underside, open bell sleeves, underside jaw/chin & hair
```

Reproducible vector asset generator: `scripts/generate-multiview-assets.mjs` (uses the exact Heroine palette: hair `#382218`/`#28160c`, skin `#f6cfb3`/`#e3a989`, top `#64101d`/`#450e1b`, skirt/tights `#383947`/`#282933`/`#4b4c60`, boots `#211f29`/`#45434c`, ink `#140e10`).

---

## 3. Coordinate & Framing Conventions per View

### Front (`front`)
- Character faces viewer (`+Z`). Viewer-left is anatomical right (`leftUpperArm` in legacy manifest naming is viewer-left, `rightUpperArm` is viewer-right — preserved 100% for backward compatibility).
- Ground contact shadow visible at floor Y.

### Back (`back`)
- Character faces away from viewer (`-Z`), preserving identical height, proportions, silhouette scale, and floor line.
- **Anatomical side continuity**: `rightUpperArm` (her waving arm) sits on **viewer-left** in the back view, and `leftUpperArm` sits on **viewer-right**, while `ViewAdapter._adaptBack()` mirrors horizontal translation (`dx -> -dx`) and Z-rotation (`rot -> -rot`). Switching from `front` to `back` mid-wave keeps the exact same physical arm waving.
- Zero front face layers (`eyes`, `brows`, `mouth`, `blush`, `mole`) exist or render in the back rig.

### Top (`top`)
- Camera looks straight down (`-Y`). The character faces **screen-down (`+Y` in SVG / `-Y` in Three.js)** so viewer-left matches the front view.
- `ViewAdapter._adaptTop()` projects canonical 2D poses onto the horizontal ground plane:
  - Vertical locomotion lift (`jump`, `crouch`, `land`) maps to radial depth scale (`scaleX/scaleY` expands when jumping closer to the overhead camera, shrinks slightly on crouch).
  - Leg pitch cycles (`walk`, `run`) project into forward/back stepping toe offsets (`dy`) beneath the circular pleated skirt.
  - Raised/waving arm rotations adapt into legible overhead horizontal arm sweeps and reach extensions.
  - Horizontal `shake` / `headTurn*` rotate the hair crown cleanly around the vertical spine axis.

### Bottom (`bottom`)
- Camera looks straight upward from below (`+Y`). Foreground sculpted shoe soles sit nearest the camera, foreshortened legs enter the dark pleated skirt underside, followed by the midriff, crop top underside, open bell sleeves, and shaded underside chin/jawline framed by rear hair.
- `ViewAdapter._adaptBottom()` applies inverse depth scaling:
  - `jump` shrinks the body slightly as the character rises away from the underside camera while lifting the foreground soles.
  - `crouch` expands slightly as the character lowers closer to the camera.
  - `walk` / `run` lift and scale alternating foreground soles (`footL` / `footR`) to convey weight shift and stride from below.
  - Zero front facial features render (expressions remain tracked internally).

---

## 4. Synchronized Runtime Pipeline

1. **Immutable Canonical Reference Skeleton**: `AnimationController` always evaluates keyframes and two-bone walk/run IK against the canonical front reference skeleton (`_referenceSkeleton`) into a view-independent pose map (`composeCanonicalPose()`). This eliminates cumulative drift regardless of which view is currently visible.
2. **Directional Retargeting (`src/animation/view-adapter.js`)**: `ViewAdapter.adaptPose(canonicalPose, activeSkeleton)` maps each canonical part delta cleanly onto the active view's skeleton (`front`, `back`, `top`, or `bottom`).
3. **Zero-Reset Controller Rebinding**: Calling `character.setView(viewId)` invokes `controller.rebindSkeleton(nextSkeleton, nextAdapter)` and `expressions.rebindSkeleton(nextSkeleton, nextGaze, facialVisibility)` **without** resetting channel timers, playback phase, speed, loop state, pause state, active expression, talking state, viseme, or gaze target.
4. **Non-Ghosting View Crossfade**: When `transition > 0`, `PuppetCharacter` blends out the outgoing view skeleton's material opacity while blending in the incoming skeleton, advancing the transition even while animation playback is paused (`paused === true`). Rapid sequential `setView()` calls use a monotonic request sequence counter (`_viewRequestSeq`) to cancel superseded async loads cleanly.
5. **Active-View Rig Debug & GPU Disposal**: `character.setDebugVisible(visible, scene)` automatically migrates Three.js pivot markers and bone connectors to the newly active view skeleton on every switch, and `character.dispose()` disposes all cached view skeletons, textures, geometries, and materials.

---

## 5. Multi-View Public API (`PuppetCharacter`)

```js
// Inspect available views on the loaded character pack
const views = character.listViews();
// -> [{ id: 'front', label: 'Front', partCount: 56, faceVisible: true, loaded: true, ... }, ...]

// Preload all views ahead of time for zero-latency switching
await character.preloadViews();

// Switch view mid-animation while keeping exact phase, channels, speed, pause & expression
const viewState = await character.setView('back', {
  transition: 0.25,             // seconds (0 for instant switch)
  preserveAnimationState: true, // default true
});

// Read active view metadata & transition progress
const vs = character.getViewState();
// -> { activeView: 'back', availableViews: ['front','back','top','bottom'],
//      isTransitioning: false, transitionProgress: 1, faceVisible: false, showGround: true, ... }

// Query honest per-view support classification for any of the 45 motions
const support = character.getViewMotionSupport('walk', 'top');
// -> { status: 'adapted', reason: 'Top-down stride projects alternating feet forward/back beneath the skirt...' }

// Synchronize Rig Debug overlay cleanly across view switches
character.setDebugVisible(true, engine.scene);

// Register an additional directional view pack dynamically
character.registerView('leftProfile', leftProfileManifest);
```

---

## 6. Motion Support Matrix (45 Motions × 4 Views)

Every motion in `src/animation/catalog.js` is explicitly classified per view in `assets/characters/main-character/shared/semantic-rig-map.js`:

- **`native`**: Full silhouette and primary joint articulation read directly as authored.
- **`adapted`**: Retargeted cleanly by `ViewAdapter` to preserve timing and intent in a top-down or underside projection (e.g., radial depth scale for `jump`/`crouch`, stepping foot offsets in `top`, foreground sole lift in `bottom`, horizontal overhead arm sweeps).
- **`limited`**: Secondary or head/gaze/facial cues are occluded or compressed from this viewing angle (for example `lookLeft/Right/Up/Down` and `glance` in non-front views where eyes are hidden, or `nod` in `top` view where vertical pitch compresses into slight crown bob). State still runs synchronously so switching back to `front` resumes the exact phase.

| Category | Front | Back | Top | Bottom |
| --- | --- | --- | --- | --- |
| **Base (`idle`, `breathing`, `bodySway`, `weightShift`)** | `native` | `native` | `adapted` | `adapted` |
| **Locomotion (`walk*`, `run*`, `jump`, `land`, `crouch`)** | `native` | `native` | `adapted` | `adapted` |
| **Gestures (`wave*`, `point*`, `raise*`, `handsUp`, `lowerHands`, `shrug`, `clap`, `explain`, `talkingGesture`, `emphasisGesture`)** | `native` | `native` | `adapted` | `adapted` |
| **Reactions (`recoil`, `surprisedReaction`, `laugh`, `bow`)** | `native` | `native` | `adapted` | `adapted` |
| **Head Pitch/Tilt (`nod`, `nodLoop`, `tiltLeft`, `tiltRight`)** | `native` | `native` | `limited` | `adapted` |
| **Head Yaw (`shake`, `headTurnLeft`, `headTurnRight`)** | `native` | `native` / `limited` | `adapted` | `adapted` / `limited` |
| **Eye Gaze (`lookLeft`, `lookRight`, `lookUp`, `lookDown`, `glance`, `lookAround`)** | `native` | `limited` | `limited` | `limited` |

*Single-view packs (such as `assets/characters/minimal-starter/`) remain 100% compatible: `listViews()` reports only `front`, and Character Lab cleanly disables unavailable directional buttons.*

---

## 7. Authoring New Directional Views (Profile / 3/4)

To add `leftProfile`, `rightProfile`, or `threeQuarterFront*` to any character pack:
1. Create `assets/characters/<pack>/views/<viewId>/parts/*.svg` with genuine directional anatomy (do not mirror/skew front SVGs).
2. Create `views/<viewId>/manifest.js` mapping those SVGs onto the canonical semantic part names (`body`, `skirt`, `thighL/R`, `shinL/R`, `footL/R`, `midriff`, `top`, `leftUpperArm/Forearm/Hand`, `rightUpperArm/Forearm/Hand`, `neck`, `head`, `braidL/R`, plus face variants if visible).
3. Include `view: { id, label, shortLabel, facing, showGround, faceVisible, framingConvention }` and `framing: { fullBody, faceCloseup }`.
4. Register it in `shared/view-catalog.js` (or dynamically via `character.registerView(viewId, manifest)`) and add a retargeting rule in `src/animation/view-adapter.js` if the view requires custom axis projection.
