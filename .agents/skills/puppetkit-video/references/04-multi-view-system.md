# 04 — Multi-View Directional Puppet System

PuppetKit features a synchronized multi-view system enabling characters to face 4 different camera angles without interrupting running animations or resetting time phase.

---

## The 4 Directional Views

| View ID | Camera Perspective | Parts Count | Face Rendered | Key Characteristics |
|---|---|---|---|---|
| `front` | Front-facing (`+Z`) | 56 | Yes | Full front anatomy, braids, 16 facial expressions, mole, blush |
| `back` | Rear-facing (`-Z`) | 22 | No (state synced) | Hair curtain, rear braids, back crop top, skirt back, calves, boot heels |
| `top` | Bird's-eye downward (`-Y`) | 17 | No (state synced) | Center-part hair crown, forward braids, circular skirt, stepping shoes |
| `bottom` | Worm's-eye upward (`+Y`) | 21 | No (state synced) | Sculpted boot soles, foreshortened legs, skirt underside, chin line |

---

## View Conventions & Retargeting

1. **Front (`front`)**:
   - Standard 2D coordinate system. Left arm on viewer-left, right arm on viewer-right.
2. **Back (`back`)**:
   - Anatomical side continuity: When character turns back, her physical right arm (waving arm) appears on viewer-left.
   - `ViewAdapter._adaptBack()` automatically mirrors horizontal translations (`dx -> -dx`) and Z-rotations (`rot -> -rot`).
3. **Top (`top`)**:
   - `ViewAdapter._adaptTop()` projects 2D poses onto the horizontal plane.
   - Vertical displacements (`jump`, `crouch`) map to radial depth scaling (`scaleX/scaleY`).
   - Walk/run stride cycles map to forward/back stepping toe offsets beneath the circular skirt.
4. **Bottom (`bottom`)**:
   - `ViewAdapter._adaptBottom()` renders foreground shoe soles with inverse depth scaling.
   - As character crouches closer to camera, soles scale larger; as she jumps, soles lift away.

---

## Runtime Multi-View API

```javascript
// 1. List available views on loaded character:
const views = character.listViews();
// Returns: [{ id: 'front', label: 'Front', partCount: 56, faceVisible: true, ... }, ...]

// 2. Preload all directional assets for instant switching:
await character.preloadViews();

// 3. Switch view mid-animation (preserves channel phase, speed, loops, pause):
await character.setView('back', {
  transition: 0.25,             // Blend duration in seconds (0 = instant)
  preserveAnimationState: true  // Default true
});

// 4. Query view support for specific motions:
const support = character.getViewMotionSupport('walk', 'top');
// Returns: { status: 'adapted', reason: 'Top-down stride projects alternating feet...' }

// 5. Register additional custom view packs dynamically:
character.registerView('leftProfile', myProfileManifest);
```

---

## Extensible Directional View Slots

PuppetKit reserves these standardized future view slots in `src/animation/view-adapter.js`:
- `leftProfile`
- `rightProfile`
- `threeQuarterFrontLeft`
- `threeQuarterFrontRight`
- `threeQuarterBackLeft`
- `threeQuarterBackRight`

---

## Key Files
- View Adapter: `src/animation/view-adapter.js`
- Multi-View React Sheet: `src/components/MultiViewSheet.tsx`
- Multi-View Controls: `src/components/MultiViewControls.tsx`
- Asset manifests: `assets/characters/main-character/views/`
- Doc: `docs/MULTI_VIEW_SYSTEM.md`
