# 10 — Render Pipeline & Video Export (make.sh)

PuppetKit converts 2D cutout character rigs into fixed-size MP4 videos using a headless Chromium capture harness and ffmpeg encoding.

---

## CLI Usage

```bash
# 1. Capture 8 stills + perform determinism bit-check (540x960, 300 frames default):
bash make.sh heroine stills

# 2. Render full animation to out/clip.mp4 (300 frames @ 30 fps):
bash make.sh heroine full 300 30

# 3. Render at custom resolution (e.g. 720x1280 or 1080x1920):
bash make.sh heroine full 300 30 720x1280

# 4. Open in-browser visual frame preview:
bash make.sh heroine preview
```

`make.sh` automatically launches Vite on port 5173 if not running, captures frame PNGs using headless Chromium (`/usr/bin/chromium` with SwiftShader), and encodes `out/clip.mp4` using `ffmpeg -c:v libx264 -crf 18 -pix_fmt yuv420p`.

---

## Character Story Contract

Every renderable character in `assets/<char>/` must provide two files:

### 1. `manifest.js`
Defines parts, SVG images, hierarchy, pivots, and expressions (see [01-rigging-and-character.md](./01-rigging-and-character.md)).

### 2. `story.js`
Must export a pure, stateless pose generator `poseAt(t)`:

```javascript
export function poseAt(t) {
  // t is time in seconds (float)
  return {
    turns: {
      head: Math.sin(t * 3) * 6,       // joint rotation in degrees
      rightUpperArm: Math.sin(t * 2) * 20,
      rightForearm: -30
    },
    x: 0,                              // stage displacement in pixels
    y: 0,
    expression: t > 2.0 ? 'happy' : 'neutral',
    blink: (t % 2.5) < 0.12,           // eyelid closure
    show: {
      // Optional layer swaps by time:
      skirt: t < 3.0,
      skirt_seated: t >= 3.0
    }
  };
}

export const scene = {
  bg: 0xf4eee7,
  worldHeight: 3.2,
  room: 'room.svg' // Optional flat backdrop
};
```

---

## Determinism Rules (Do Not Break)

1. **Random Access Frame Evaluation**: `window.__frame(f)` resets all parts to base transforms, then calls `poseAt(f / fps)`. No state accumulation allowed across frames.
2. **Zero Non-Deterministic APIs**: Never use `Math.random()`, `Date.now()`, or `requestAnimationFrame` inside `poseAt` or evaluator pipelines.
3. **Bit-Identical Consistency**: Evaluating frame `f` twice or out-of-order must produce bit-identical PNG pixels.

---

## Quality Gates Checklist

Before committing video pipelines:
1. **Syntax Check**: `node --check manifest.js story.js render/frame.js render/capture.mjs`.
2. **Stills Verification**: `bash make.sh <char> stills` -> Check `stills/*.png` for joint gaps, z-order errors, or clipping.
3. **Determinism Verification**: Compare `stills/determinism/` A/B pair using `cmp`.
4. **Encoding Verification**: `bash make.sh <char> full` -> Verify `ffprobe` output matches requested width, height, and frame count.

---

## Key Files
- Runner Script: `make.sh`
- Capture Script: `render/capture.mjs`
- Frame Harness: `render/frame.js`
- Doc: `RENDER-TOOLKIT.md`
