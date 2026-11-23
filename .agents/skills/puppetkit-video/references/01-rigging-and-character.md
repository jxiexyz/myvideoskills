# 01 — Character Rigging & Manifest Specification

## Rig Overview & Coordinate System
- **Artwork Space**: Normalized coordinates `0..1` (`(0,0)` is top-left, `(1,1)` is bottom-right).
- **Three.js World Space**: Right-handed 2D orthographic plane (`+X` right, `+Y` up, `+Z` toward camera).
- **Rotation Angles**: Manifest defaults, `restPose`, and public APIs use **degrees** (counter-clockwise positive). Low-level `Timeline` / Three.js properties use **radians**.
- **Left / Right Convention**: Viewer perspective — `left*` is viewer-left (screen-left, anatomical right), `right*` is viewer-right (screen-right, anatomical left).

---

## Canonical Hierarchy & Part IDs

Keep these exact part IDs so all 45 motions and 16 expressions work out of the box:

```text
root
└── body (pelvis/torso anchor)
    ├── skirt
    ├── thighL -> shinL -> footL
    ├── thighR -> shinR -> footR
    ├── midriff
    ├── top
    ├── leftUpperArm -> leftForearm -> leftHand
    ├── rightUpperArm -> rightForearm -> rightHand
    └── neck
        └── head
            ├── hairBack
            ├── braidL, braidR
            ├── blush
            ├── eyes (and expression variants: eyes_wide, eyes_happy, eyes_sad, etc.)
            ├── brows (and expression variants: brows_raised, brows_sad, brows_angry, etc.)
            ├── mouth (and expression variants: mouth_smile, mouth_open, mouth_frown, etc.)
            └── hairFront
```

---

## Manifest Schema

Manifest files (`manifest.js` or `manifest.json`) define parts, layering, pivots, and expression states.

```javascript
export default {
  name: 'MyCharacter',
  absoluteDrawOrder: true, // Uses mesh.renderOrder = def.z
  parts: [
    {
      name: 'body',
      parent: null,
      z: 12,
      pivot: { x: 0.50, y: 0.48 }, // Relative to image coordinates
      polygon: [{ x: 0.30, y: 0.40 }, { x: 0.70, y: 0.40 }, { x: 0.75, y: 0.95 }, { x: 0.25, y: 0.95 }],
      image: new URL('./parts/body.svg', import.meta.url).href,
      visible: true,
    },
    {
      name: 'rightUpperArm',
      parent: 'body',
      z: 9,
      pivot: { x: 0.67, y: 0.50 }, // Child pivot relative to parent pivot
      polygon: [...],
      image: new URL('./parts/rightUpperArm.svg', import.meta.url).href,
    }
  ],
  partAliases: {
    // Optional aliases if your mesh uses alternate naming:
    leftLeg: 'thighL',
    rightLeg: 'thighR'
  },
  walkRig: {
    // Optional 2-bone IK setup for planted foot walking/running:
    hipY: 820,
    thighLen: 280,
    shinLen: 290,
    floorY: 1390
  },
  gazeRig: {
    // Optional eye bounding and travel limits:
    irisLimitX: 12,
    irisLimitY: 8
  },
  restPose: {
    // Standing rest-pose angles in degrees:
    leftUpperArm: { rot: 0 },
    rightUpperArm: { rot: 0 }
  },
  expressions: {
    neutral: { eyes: true, brows: true, mouth: true },
    happy: { eyes: true, brows_raised: true, mouth_smile: true, blush: true }
  }
};
```

---

## Step-by-Step: Adding a New Character

1. **Prepare Artworks**:
   - Save transparent SVG (or PNG) files for each part in `assets/characters/<character-id>/parts/`.
   - Maintain overlap behind joints (e.g., upper arm extends under torso) to prevent gaps during rotation.
2. **Create `manifest.js`**:
   - Copy `assets/characters/minimal-starter/manifest.js` (for a light single-view rig) or `assets/characters/main-character/manifest.js` (for full 4-view + 16-expression rig).
   - Set `pivot` at joints: shoulder for arm, elbow for forearm, neck for head, hip for thigh, knee for shin.
   - List parents before children in `parts[]`.
3. **Register in Character Lab UI** (if using web lab):
   - In `src/App.tsx`, add an entry to `CHARACTER_PACKS`:
     ```typescript
     'my-char': {
       id: 'my-char',
       label: 'My Custom Character',
       manifest: '/assets/characters/my-char/manifest.js'
     }
     ```
4. **Verify Rig**:
   - Run `npm run dev`, open `http://localhost:3000`, toggle **Rig Debug** to inspect bone connectors and pivot markers.

---

## File References
- Main character manifest: `assets/characters/main-character/manifest.js`
- Minimal starter manifest: `assets/characters/minimal-starter/manifest.js`
- Skeleton & Part classes: `src/rig/skeleton.js`, `src/rig/part.js`
- Image & Texture loader: `src/assets/image-loader.js`
- Rigging specification doc: `docs/RIGGING.md`
