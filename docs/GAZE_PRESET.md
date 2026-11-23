# Eyes glance left/right — heroine preset

## Render the five-second preview

```bash
bash make.sh heroine-gaze full 150 30
```

The character stays in the original upper-body framing so the pupil movement reads clearly.
The head, eyelids and body do not move. Both irises look screen-left, then screen-right, then return
center. Left/right refer to the VIEWER'S screen, not anatomical left/right. Natural blinks use the
existing closed-eye SVG. No enlarged round eyes or changed face design is introduced.

## Reusable normalized gaze

`presets/gaze.js` exports `createGazePreset(options)`. It returns only `{gaze:{x,y},blink}` so it can
be combined with another pose. x/y are normalized to -1..1; y is positive downward. `amount` (0..1)
sets excursion strength, `keyframes` sets the timing/targets, `blinkTimes` and `blinkSeconds` control
blinks, and `loop` repeats the timeline. Keyframe times are absolute seconds; if changing duration,
provide matching keyframes. For a clean loop, make first and final gaze targets identical.

```js
import {createGazePreset} from '../../presets/gaze.js';
const glance = createGazePreset({
 duration:5,amount:1,
 keyframes:[{t:0,x:0},{t:1,x:-1},{t:3,x:1},{t:4.5,x:0},{t:5,x:0}],
 blinkTimes:[.3,2.15,4.4],
});
export function poseAt(t) {
 const base = existingPoseAt(t);
 const eyes = glance(t);
 return {...base,gaze:eyes.gaze,blink:Boolean(base.blink || eyes.blink)};
}
```

The existing heroine, seated heroine and walking heroine manifests carry opt-in `gazeRig` metadata.
When a pose does NOT specify `gaze`, their original eye texture is retained byte-for-byte; the
previous presets' default artwork and motion stay unchanged. When combining presets, ensure the
base expression uses open eyes if you want the glance to be visible; a happy/closed eye layer can
intentionally hide the iris texture.

## Rig and renderer

`presets/heroine-eye-rig.js` stores the ORIGINAL almond-shaped eye masks, fixed lid path, pupil/iris
sizes, palette, centers and maximum movement (14 artwork units horizontal, 3 vertical). Existing
SVG source assets remain included. `assets/heroine-gaze/eye-rig.js` re-exports this editable config.

`src/animation/gaze-controller.js` changes only the cropped eyes texture. Each iris, pupil and glint
is drawn through a fixed per-eye mask, then the original upper lid is drawn on top. This prevents
pupils leaving the eyes and prevents the whole white/eyelid layer from sliding. Per-character
metadata accounts for the 1280-height portrait and 2000-height full-body coordinate offsets.

## Reproduce QC

With Vite serving THIS toolkit, use its URL:

```bash
QC_URL=http://127.0.0.1:5173 node qc-gaze.mjs
python3 verify-gaze-preset.py
```

The Node test checks state variants, random access, center/end equality, and exact pixel regressions
against included sit/walk fixture PNGs. The Python test checks actual decoded MP4 iris displacement
in both eyes, five-second 540x960/150-frame output, and absence of changes outside the eye region in
source captures. It requires Pillow and ffmpeg/ffprobe. Holds between glances are intentional.
Verification output in this archive: `docs/gaze-verification.json`.

