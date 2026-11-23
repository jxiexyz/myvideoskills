# PuppetKit Main Character Rigging Guide

## Coordinate System & Conventions
- **Image / Artwork space**: Normalized `0..1` coordinates (`x` left-to-right, `y` top-to-bottom).
- **Three.js World space**: Right-handed orthographic 2D plane (`+X` right, `+Y` up, `+Z` toward camera).
- **Rotation angles**: Public APIs (`PuppetCharacter`, motion channel definitions, `restPose`) use **degrees** (`+deg` counter-clockwise, `-deg` clockwise). Low-level `Timeline` tracks and Three.js `Object3D.rotation.z` use **radians**.
- **Left / Right naming**: Matches the existing PuppetKit convention — `left*` refers to viewer's left (character's anatomical right side on screen), `right*` refers to viewer's right (character's anatomical left side on screen).

## Main Character Hierarchy (`assets/characters/main-character/`)
Built faithfully from the supplied full-body heroine artwork (`1024 x 2000`, `offset = (242, 224.074)`):

```text
root
└── body (z: 12, pelvis/torso anchor)
    ├── skirt (z: 15)
    ├── thighL (z: 7) -> shinL (z: 8) -> footL (z: 9)
    ├── thighR (z: 7) -> shinR (z: 8) -> footR (z: 9)
    ├── midriff (z: 11)
    ├── top (z: 18)
    ├── leftUpperArm (z: 10) -> leftForearm (z: 22) -> leftHand (z: 21)
    ├── rightUpperArm (z: 9) -> rightForearm (z: 25) -> rightHand (z: 24)
    └── neck (z: 17)
        └── head (z: 30)
            ├── hairBack (z: 3)
            ├── braidL (z: 27)
            ├── braidR (z: 27)
            ├── blush (z: 30.5)
            ├── eyes / eyes_* variants (z: 31)
            ├── brows / brows_* variants (z: 32)
            ├── mole (z: 32)
            ├── mouth / mouth_* variants (z: 33)
            └── hairFront (z: 35)
```

## Reusable Manifest Schema
Any new 2D cutout character can reuse the exact same `AnimationController`, motion catalog, and 16-expression engine by providing a manifest with:
- `parts`: Ordered array of `{ name, parent, z, pivot: {x, y}, polygon: [{x, y}, ...], image, visible? }`. Parents must appear before children.
- `absoluteDrawOrder: true`: Uses `mesh.renderOrder = def.z` so nested child parts (like `hairBack` behind `body`) composite in exact artistic layer order.
- `partAliases`: Optional mapping from canonical names (`leftLeg`, `rightLeg`, `leftLowerLeg`, `rightLowerLeg`, `leftFoot`, `rightFoot`, `leftArm`, `rightArm`) to rig-specific names (`thighL`, `shinL`, `footL`, etc.).
- `walkRig`: Optional hip/thigh/shin/floor geometry in artwork pixels enabling planted-foot two-bone IK during `walk` and `run`. Rigs without `walkRig` automatically fall back to clean 2-segment leg animation.
- `gazeRig`: Optional eye mask paths and travel limits enabling dynamic iris movement and eyelid blinking across open-eye expressions.
- `restPose`: Optional standing rest-pose angles (degrees) baked into each part's immutable `restTransform`.
- `expressions`: Visibility map for the 16 canonical expressions.
- `view` & `views`: Optional directional view metadata and map of view-specific manifests (`front`, `back`, `top`, `bottom`, etc.). See `docs/MULTI_VIEW_SYSTEM.md`.

## Multi-View Semantic Rig Contract
The main character (`assets/characters/main-character/`) includes four genuine layered SVG rigs bound to one shared semantic part vocabulary (`shared/semantic-rig-map.js`):

| View | Parts | Layer / Anatomy Highlights |
| --- | --- | --- |
| `front` | 56 | Full front torso, limbs, twin braids, hair front/back, and all 16-expression face layers (`eyes*`, `brows*`, `mouth*`, `blush`, `mole`). |
| `back` | 22 | Rear hair curtain (`hairBack`, `hairUpper`), twin rear braids, rear crop top & pleated skirt, calves & boot heels. Zero front face layers. Anatomical left/right sides are mirrored so `rightUpperArm` stays the same physical arm (viewer-left). |
| `top` | 17 | Bird's-eye center-part hair crown, twin forward braids, overhead shoulders & articulated arms, circular pleated skirt, and stepping shoes (`footL`/`footR`) facing screen-down (`+Y` in SVG). Zero face layers. |
| `bottom` | 21 | Worm's-eye sculpted anatomical shoe soles (`footL`/`footR`), foreshortened shins/thighs entering dark pleated skirt underside, midriff, crop top underside, open bell sleeves, shaded underside chin/jawline & hanging rear hair. Zero front face layers. |

## Adding Another Character
See `assets/characters/minimal-starter/manifest.js` for a second complete single-view character pack that plugs into the identical runtime without modifying a single motion or expression file (non-front views disable gracefully in the Character Lab).

