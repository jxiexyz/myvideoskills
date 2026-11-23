# Walk preset — 540p reference rig

## Preview and reusable loop

- `bash make.sh heroine-walk full 150 30` makes a five-second idle → walk → idle example.
- `bash make.sh heroine-walk-loop full 126 30` makes exactly three 42-frame cycles (4.2 seconds),
  suitable for seamless playback. Do not repeat the last pose: frames 0..41 form one cycle.
- `presets/walk.js` exports `createWalkPreset(options)`. The gait is a pure function of seconds.

```js
import {createWalkPreset} from '../../presets/walk.js';
export const poseAt = createWalkPreset({
  start: .4, duration: 4.2, cycleSeconds: 1.4,
  stridePx: 50, liftPx: 78, direction: 1,
  travel: true, startXPx: -75,
});
```

`cycleSeconds` controls speed; `stridePx` controls per-cycle displacement at 540p; `liftPx` controls
swing-foot clearance. `direction` accepts 1 or -1 for movement/knee-bend direction, not a new
profile-face drawing. `travel:false` gives a treadmill/in-place gait. `loop:true` disables finite
start/stop ramps; use it with `travel:false` for a repeating stationary cycle. The five-second demo
itself is intentionally NOT a seamless loop: it starts and stops and moves across the room.
For finite clips, duration/cycleSeconds must be an integer so both feet return to standing.

## Contact and knee construction

The two feet have half-cycle phase separation and 60% stance duration. During stance the world
ankle position is fixed while the body advances. During swing the ankle moves to the next contact
with smooth interpolation and sinusoidal lift. A two-link solve with 277/393 artwork-unit thigh/shin
lengths gives connected knees; the shoes counter-rotate to remain level. The pelvis lowers enough
to keep the legs reachable and bobs subtly. Arms counter-swing and braids lag the gait.

This is an adapter for the supplied heroine rig, NOT a promise that arbitrary character skeletons
work without retargeting. Other rigs must map names/pivots/segment lengths and artwork scale.
The camera and artwork contract remains 1024x2000 artwork with worldHeight 2.7 for this character.
No chair is loaded in either walking manifest.

## Verification

`qc-walk.mjs` reads actual projected hip/knee/ankle positions for every frame, tests parameter
variants and random-access determinism. `verify-walk-preset.py` checks decoded duration/frame count,
visible-lift magnitude, fixed support-foot positions, travel and reachability. `qc-loop.mjs` checks
two pairs of corresponding phase frames for byte-identical pixels with `cmp`.
Verification output: `docs/walk-verification.json` in the packaged toolkit.

## Reproduce QC

After rendering the five-second walking demo, run:

```bash
QC_URL=http://127.0.0.1:5173 node qc-walk.mjs
QC_URL=http://127.0.0.1:5173 node qc-loop.mjs
cmp qc-loop/f7.png qc-loop/f49.png
cmp qc-loop/f28.png qc-loop/f70.png
python3 verify-walk-preset.py
```

Use the same Vite URL/port that served the render. QC must point to THIS project, not another copy.

