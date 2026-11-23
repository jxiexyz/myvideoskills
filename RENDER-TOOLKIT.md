# PuppetKit 2D — render toolkit

Kit upstream (Three.js cutout puppet) + a deterministic frame pipeline, so any rigged character
becomes a fixed-size MP4.

```bash
npm install
bash make.sh heroine stills            # 8 stills + determinism check (540x960, 300 frames)
bash make.sh heroine full 300 30        # frames/ + out/clip.mp4, prints ffprobe
bash make.sh heroine full 300 30 720x1280
bash make.sh heroine preview            # open http://127.0.0.1:5173/demo/heroine.html
```

`make.sh` starts Vite if port 5173 is not answering, captures with headless chromium
(`/usr/bin/chromium`, SwiftShader), and encodes with ffmpeg.

## Character contract

A character is one directory `assets/<char>/`:

- `<part>.svg` — one transparent SVG per layer, all drawn in the same coordinate box.
- `manifest.js` — `export default { name, parts: [{ name, parent, z, pivot, polygon, image }], expressions }`.
  `image` is `new URL('./<part>.svg', import.meta.url).href`. Parents before children.
  Keep `body`, `head`, `eyes`, `brows`, `mouth` for the built-in animations.
- `story.js` — must export:
  - `poseAt(t)` → `{ turns: { <part>: degrees }, x, y, expression, blink, show }`
    `show` is `{ partName: boolean }`, applied after the base reset — use it to swap alternate
    layers by time (skirt ↔ skirt_seated, standing legs ↔ legs_seated).
    `x`/`y` are stage pixels (divided by 400 internally).
  - `scene` (optional) → `{ bg: 0xRRGGBB, room: 'room.svg', worldHeight: 3.2 }`.
    `room.svg` is a flat backdrop stretched over the camera frustum.

Two working examples ship in `assets/`:

- `heroine/` — standing clip (braids, detached bell sleeves, expression layers, wood-plank room).
- `heroine-sit/` — 5 s stand → sit → look-around template: `chair`, `legs_seated`, `skirt_seated`,
  `seatFront` and a `pose.show` swap. Contract: `docs/SEATED_TEMPLATE.md`.

`make.sh <char> stills` reads the clip length from `window.__meta` (the story owns `frames`), so a
150-frame character does not need extra args.

## Determinism rules (do not break)

- `window.__frame(f)` is random access: it resets every part to its base transform, then applies
  `poseAt(f / fps)`. No accumulation, no `Math.random()`, no `Date.now()`, no rAF.
- Frame `f` twice, or out of order, must give identical pixels — `stills/determinism/` holds the
  A/B pair plus the mid-frame captured after the last frame; compare with `cmp`.
- `poseAt` must be a pure function of `t`; every animation is a function of time only.

## Gates before you ship

1. `node --check` on `manifest.js`, `story.js`, `render/frame.js`, `render/capture.mjs`.
2. `bash make.sh <char> stills` → look at `stills/*.png`: cropping, joint gaps, z-order, empty bg.
3. `cmp` the determinism PNGs.
4. `bash make.sh <char> full` → ffprobe must show the size you asked for, `fps`, `nb_read_frames`,
   and the expected duration.
5. Frame-diff (108x192 greyscale, mean abs diff): median > 0.5, no run of 3+ frames below 0.2.

The upstream kit docs (`README.md`, `docs/`) still apply for rigging and animation presets.

## Eye glance preset

`bash make.sh heroine-gaze full 150 30` renders the five-second glance preview.
`presets/gaze.js` is composable with other poses; see `docs/GAZE_PRESET.md`.
This release includes all previous character assets and presets, not just the new eye module.

