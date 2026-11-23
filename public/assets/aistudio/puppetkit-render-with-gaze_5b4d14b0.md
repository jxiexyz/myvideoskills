# PuppetKit Render with Gaze

> Markdown source bundle generated from `puppetkit-render-with-gaze.tgz`. Each section preserves the original relative file path. Text files and SVG assets are included as source. PNG fixtures are included as Base64; decode them back to their original paths when rebuilding the project.

## Rebuild instructions

1. Create the project directory structure using the paths in each file heading.
2. Copy each fenced text block into the exact path shown.
3. For sections marked `BASE64 PNG`, Base64-decode the content and save it to the exact path shown.
4. Run `npm install` in the project root, then follow the original README instructions.

## File index

- `make.sh` (1,554 bytes)
- `verify-walk-preset.py` (2,486 bytes)
- `README.md` (8,030 bytes)
- `qc-gaze.mjs` (2,564 bytes)
- `qc-loop.mjs` (979 bytes)
- `verify-gaze-preset.py` (2,597 bytes)
- `index.html` (236 bytes)
- `package-lock.json` (35,532 bytes)
- `RENDER-TOOLKIT.md` (3,359 bytes)
- `package.json` (544 bytes)
- `qc-walk.mjs` (2,185 bytes)
- `render/capture.mjs` (3,066 bytes)
- `render/index.html` (353 bytes)
- `render/frame.js` (6,375 bytes)
- `docs/WALK_PRESET.md` (2,957 bytes)
- `docs/seated-verification.json` (959 bytes)
- `docs/RIGGING.md` (1,504 bytes)
- `docs/SEATED_TEMPLATE.md` (855 bytes)
- `docs/walk-verification.json` (605 bytes)
- `docs/gaze-verification.json` (839 bytes)
- `docs/GAZE_PRESET.md` (3,170 bytes)
- `docs/GENERIC_ASSET_PACK.md` (1,432 bytes)
- `docs/ROADMAP.md` (577 bytes)
- `demo/manifest.example.js` (1,165 bytes)
- `demo/heroine.html` (804 bytes)
- `demo/index.html` (2,251 bytes)
- `demo/main.js` (1,339 bytes)
- `demo/generic-manifest.js` (7,336 bytes)
- `presets/catalog.json` (782 bytes)
- `presets/walk.js` (3,550 bytes)
- `presets/heroine-eye-rig.js` (481 bytes)
- `presets/gaze.js` (1,273 bytes)
- `src/index.js` (407 bytes)
- `src/core/puppet-character.js` (3,946 bytes)
- `src/core/puppet-engine.js` (2,055 bytes)
- `src/assets/image-loader.js` (1,909 bytes)
- `src/animation/library.js` (3,910 bytes)
- `src/animation/timeline.js` (1,786 bytes)
- `src/animation/gaze-controller.js` (1,993 bytes)
- `src/rig/skeleton.js` (1,885 bytes)
- `src/rig/part.js` (2,054 bytes)
- `src/utils/math.js` (339 bytes)
- `tests/fixtures/walk-f75.png` (111,325 bytes)
- `tests/fixtures/sit-f149.png` (96,618 bytes)
- `assets/heroine-walk-loop/manifest.js` (53 bytes)
- `assets/heroine-walk-loop/room.svg` (1,513 bytes)
- `assets/heroine-walk-loop/story.js` (222 bytes)
- `assets/heroine-gaze/mouth_open.svg` (512 bytes)
- `assets/heroine-gaze/brows.svg` (358 bytes)
- `assets/heroine-gaze/hairBack.svg` (614 bytes)
- `assets/heroine-gaze/rightHand.svg` (756 bytes)
- `assets/heroine-gaze/draw.py` (8,709 bytes)
- `assets/heroine-gaze/leftUpperArm.svg` (786 bytes)
- `assets/heroine-gaze/leftForearm.svg` (624 bytes)
- `assets/heroine-gaze/smileTongue.svg` (296 bytes)
- `assets/heroine-gaze/eyes.svg` (852 bytes)
- `assets/heroine-gaze/rightUpperArm.svg` (816 bytes)
- `assets/heroine-gaze/manifest.js` (2,838 bytes)
- `assets/heroine-gaze/leftHand.svg` (726 bytes)
- `assets/heroine-gaze/mouth.svg` (421 bytes)
- `assets/heroine-gaze/mole.svg` (256 bytes)
- `assets/heroine-gaze/room.svg` (1,401 bytes)
- `assets/heroine-gaze/brows_raised.svg` (358 bytes)
- `assets/heroine-gaze/head.svg` (958 bytes)
- `assets/heroine-gaze/braidL.svg` (2,397 bytes)
- `assets/heroine-gaze/story.js` (373 bytes)
- `assets/heroine-gaze/top.svg` (667 bytes)
- `assets/heroine-gaze/mouth_smile.svg` (478 bytes)
- `assets/heroine-gaze/midriff.svg` (554 bytes)
- `assets/heroine-gaze/smileTeeth.svg` (330 bytes)
- `assets/heroine-gaze/neck.svg` (474 bytes)
- `assets/heroine-gaze/rightForearm.svg` (654 bytes)
- `assets/heroine-gaze/openTongue.svg` (330 bytes)
- `assets/heroine-gaze/eyes_happy.svg` (304 bytes)
- `assets/heroine-gaze/openTeeth.svg` (330 bytes)
- `assets/heroine-gaze/hairFront.svg` (982 bytes)
- `assets/heroine-gaze/eye-rig.js` (58 bytes)
- `assets/heroine-gaze/skirt.svg` (1,062 bytes)
- `assets/heroine-gaze/body.svg` (784 bytes)
- `assets/heroine-gaze/braidR.svg` (2,409 bytes)
- `assets/heroine-gaze/eyes_closed.svg` (304 bytes)
- `assets/heroine/mouth_open.svg` (512 bytes)
- `assets/heroine/brows.svg` (358 bytes)
- `assets/heroine/hairBack.svg` (614 bytes)
- `assets/heroine/rightHand.svg` (756 bytes)
- `assets/heroine/draw.py` (8,709 bytes)
- `assets/heroine/leftUpperArm.svg` (786 bytes)
- `assets/heroine/leftForearm.svg` (624 bytes)
- `assets/heroine/smileTongue.svg` (296 bytes)
- `assets/heroine/eyes.svg` (852 bytes)
- `assets/heroine/rightUpperArm.svg` (816 bytes)
- `assets/heroine/manifest.js` (2,899 bytes)
- `assets/heroine/leftHand.svg` (726 bytes)
- `assets/heroine/mouth.svg` (421 bytes)
- `assets/heroine/mole.svg` (256 bytes)
- `assets/heroine/room.svg` (1,401 bytes)
- `assets/heroine/brows_raised.svg` (358 bytes)
- `assets/heroine/head.svg` (958 bytes)
- `assets/heroine/braidL.svg` (2,397 bytes)
- `assets/heroine/story.js` (1,843 bytes)
- `assets/heroine/top.svg` (667 bytes)
- `assets/heroine/mouth_smile.svg` (478 bytes)
- `assets/heroine/midriff.svg` (554 bytes)
- `assets/heroine/smileTeeth.svg` (330 bytes)
- `assets/heroine/neck.svg` (474 bytes)
- `assets/heroine/rightForearm.svg` (654 bytes)
- `assets/heroine/openTongue.svg` (330 bytes)
- `assets/heroine/eyes_happy.svg` (304 bytes)
- `assets/heroine/openTeeth.svg` (330 bytes)
- `assets/heroine/hairFront.svg` (982 bytes)
- `assets/heroine/skirt.svg` (1,062 bytes)
- `assets/heroine/body.svg` (784 bytes)
- `assets/heroine/braidR.svg` (2,409 bytes)
- `assets/heroine/eyes_closed.svg` (304 bytes)
- `assets/generic/leftLeg.svg` (223 bytes)
- `assets/generic/rightLeg.svg` (227 bytes)
- `assets/generic/brows.svg` (225 bytes)
- `assets/generic/rightHand.svg` (279 bytes)
- `assets/generic/leftUpperArm.svg` (229 bytes)
- `assets/generic/leftForearm.svg` (222 bytes)
- `assets/generic/eyes.svg` (308 bytes)
- `assets/generic/rightUpperArm.svg` (236 bytes)
- `assets/generic/README.md` (478 bytes)
- `assets/generic/leftHand.svg` (268 bytes)
- `assets/generic/generic-atlas.svg` (2,970 bytes)
- `assets/generic/mouth.svg` (203 bytes)
- `assets/generic/head.svg` (320 bytes)
- `assets/generic/rightFoot.svg` (229 bytes)
- `assets/generic/leftFoot.svg` (224 bytes)
- `assets/generic/rightForearm.svg` (228 bytes)
- `assets/generic/hairFront.svg` (234 bytes)
- `assets/generic/body.svg` (209 bytes)
- `assets/heroine-sit/chair.svg` (970 bytes)
- `assets/heroine-sit/shinL.svg` (398 bytes)
- `assets/heroine-sit/mouth_open.svg` (522 bytes)
- `assets/heroine-sit/brows.svg` (368 bytes)
- `assets/heroine-sit/hairBack.svg` (624 bytes)
- `assets/heroine-sit/thighL.svg` (331 bytes)
- `assets/heroine-sit/skirt_seated.svg` (564 bytes)
- `assets/heroine-sit/rightHand.svg` (766 bytes)
- `assets/heroine-sit/leftUpperArm.svg` (796 bytes)
- `assets/heroine-sit/leftForearm.svg` (634 bytes)
- `assets/heroine-sit/smileTongue.svg` (306 bytes)
- `assets/heroine-sit/eyes.svg` (862 bytes)
- `assets/heroine-sit/footL.svg` (420 bytes)
- `assets/heroine-sit/rightUpperArm.svg` (826 bytes)
- `assets/heroine-sit/manifest.js` (3,586 bytes)
- `assets/heroine-sit/leftHand.svg` (736 bytes)
- `assets/heroine-sit/mouth.svg` (431 bytes)
- `assets/heroine-sit/mole.svg` (266 bytes)
- `assets/heroine-sit/room.svg` (1,513 bytes)
- `assets/heroine-sit/legs_seated.svg` (1,075 bytes)
- `assets/heroine-sit/brows_raised.svg` (368 bytes)
- `assets/heroine-sit/head.svg` (968 bytes)
- `assets/heroine-sit/braidL.svg` (2,407 bytes)
- `assets/heroine-sit/story.js` (1,837 bytes)
- `assets/heroine-sit/shinR.svg` (398 bytes)
- `assets/heroine-sit/top.svg` (677 bytes)
- `assets/heroine-sit/mouth_smile.svg` (488 bytes)
- `assets/heroine-sit/thighR.svg` (331 bytes)
- `assets/heroine-sit/footR.svg` (420 bytes)
- `assets/heroine-sit/midriff.svg` (564 bytes)
- `assets/heroine-sit/smileTeeth.svg` (340 bytes)
- `assets/heroine-sit/neck.svg` (484 bytes)
- `assets/heroine-sit/seatFront.svg` (457 bytes)
- `assets/heroine-sit/rightForearm.svg` (664 bytes)
- `assets/heroine-sit/openTongue.svg` (340 bytes)
- `assets/heroine-sit/eyes_happy.svg` (314 bytes)
- `assets/heroine-sit/openTeeth.svg` (340 bytes)
- `assets/heroine-sit/hairFront.svg` (992 bytes)
- `assets/heroine-sit/skirt.svg` (1,072 bytes)
- `assets/heroine-sit/body.svg` (794 bytes)
- `assets/heroine-sit/braidR.svg` (2,419 bytes)
- `assets/heroine-sit/eyes_closed.svg` (314 bytes)
- `assets/heroine-walk/chair.svg` (970 bytes)
- `assets/heroine-walk/shinL.svg` (398 bytes)
- `assets/heroine-walk/mouth_open.svg` (522 bytes)
- `assets/heroine-walk/brows.svg` (368 bytes)
- `assets/heroine-walk/hairBack.svg` (624 bytes)
- `assets/heroine-walk/thighL.svg` (331 bytes)
- `assets/heroine-walk/skirt_seated.svg` (564 bytes)
- `assets/heroine-walk/rightHand.svg` (766 bytes)
- `assets/heroine-walk/leftUpperArm.svg` (796 bytes)
- `assets/heroine-walk/leftForearm.svg` (634 bytes)
- `assets/heroine-walk/smileTongue.svg` (306 bytes)
- `assets/heroine-walk/eyes.svg` (862 bytes)
- `assets/heroine-walk/footL.svg` (420 bytes)
- `assets/heroine-walk/rightUpperArm.svg` (826 bytes)
- `assets/heroine-walk/manifest.js` (3,329 bytes)
- `assets/heroine-walk/leftHand.svg` (736 bytes)
- `assets/heroine-walk/mouth.svg` (431 bytes)
- `assets/heroine-walk/mole.svg` (266 bytes)
- `assets/heroine-walk/room.svg` (1,513 bytes)
- `assets/heroine-walk/legs_seated.svg` (1,075 bytes)
- `assets/heroine-walk/brows_raised.svg` (368 bytes)
- `assets/heroine-walk/head.svg` (968 bytes)
- `assets/heroine-walk/braidL.svg` (2,407 bytes)
- `assets/heroine-walk/story.js` (342 bytes)
- `assets/heroine-walk/shinR.svg` (398 bytes)
- `assets/heroine-walk/top.svg` (677 bytes)
- `assets/heroine-walk/mouth_smile.svg` (488 bytes)
- `assets/heroine-walk/thighR.svg` (331 bytes)
- `assets/heroine-walk/footR.svg` (420 bytes)
- `assets/heroine-walk/midriff.svg` (564 bytes)
- `assets/heroine-walk/smileTeeth.svg` (340 bytes)
- `assets/heroine-walk/neck.svg` (484 bytes)
- `assets/heroine-walk/seatFront.svg` (457 bytes)
- `assets/heroine-walk/rightForearm.svg` (664 bytes)
- `assets/heroine-walk/openTongue.svg` (340 bytes)
- `assets/heroine-walk/eyes_happy.svg` (314 bytes)
- `assets/heroine-walk/openTeeth.svg` (340 bytes)
- `assets/heroine-walk/hairFront.svg` (992 bytes)
- `assets/heroine-walk/skirt.svg` (1,072 bytes)
- `assets/heroine-walk/body.svg` (794 bytes)
- `assets/heroine-walk/braidR.svg` (2,419 bytes)
- `assets/heroine-walk/eyes_closed.svg` (314 bytes)

---

## Original files

### `make.sh`

```bash
#!/usr/bin/env bash
# make.sh <char> [stills|full|preview] [frames] [fps] [WxH]
#   bash make.sh heroine stills          -> stills/ + determinism check
#   bash make.sh heroine full 300 30     -> frames/ + out/clip.mp4 (540x960)
# Starts Vite if it is not already listening, then captures with headless chromium.
set -euo pipefail
cd "$(dirname "$0")"

CHAR=${1:-heroine}
MODE=${2:-stills}
FRAMES=${3:-300}
FPS=${4:-30}
SIZE=${5:-540x960}
W=${SIZE%x*}
H=${SIZE#*x}
PORT=${PORT:-5173}

if curl -sf -o /dev/null "http://127.0.0.1:$PORT/render/"; then
  # Something is serving this port: only reuse it if it is this toolkit, not a stale project.
  if ! curl -sf "http://127.0.0.1:$PORT/render/frame.js" | grep '__meta' > /dev/null; then
    echo "port $PORT is served by another project; stop it or run with PORT=<free port>" >&2
    exit 1
  fi
else
  nohup npx vite --host 127.0.0.1 --port "$PORT" --strictPort > vite.log 2>&1 &
  for _ in $(seq 1 40); do
    curl -sf -o /dev/null "http://127.0.0.1:$PORT/render/?char=$CHAR" && break
    sleep 0.5
  done
fi

node render/capture.mjs "$MODE" --char "$CHAR" --frames "$FRAMES" --fps "$FPS" --w "$W" --h "$H" \
  --url "http://127.0.0.1:$PORT"

if [ "$MODE" = "full" ]; then
  mkdir -p out
  ffmpeg -y -v error -framerate "$FPS" -i frames/f%04d.png \
    -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -movflags +faststart out/clip.mp4
  ffprobe -v error -select_streams v:0 -count_frames \
    -show_entries stream=width,height,r_frame_rate,nb_read_frames,duration -of default=nw=1 out/clip.mp4
fi

```

### `verify-walk-preset.py`

```python
from pathlib import Path
import json,subprocess,math,statistics,hashlib
p=Path(__file__).resolve().parent
v=p/'out/walk-preset-540p-5s.mp4'
if not v.exists(): v=p/'out/clip.mp4'
assert v.is_file(),'Render the walk clip before verification'
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=codec_name,width,height,pix_fmt,r_frame_rate,duration,nb_read_frames','-of','json',str(v)]))['streams'][0]
assert (info['width'],info['height'],info['duration'],info['nb_read_frames'])==(540,960,'5.000000','150')
q=json.loads((p/'qc-walk/measurements.json').read_text());rows=q['measurements'];assert not q['errors']
assert (p/'qc-walk/fa.png').read_bytes()==(p/'qc-walk/fb.png').read_bytes()
plant_errors=[];lift={};angles={};reach_errors=[]
for side in ['L','R']:
 maxlift=0;side_angles=[]
 for i,row in enumerate(rows):
  j=row['actual'][side];m=row['meta'][side]
  maxlift=max(maxlift,881.8-j['ankle'][1])
  assert abs(j['ankle'][1]-(881.8-m['lift']*.54))<.01
  h,k,a=[j[n] for n in ['hip','knee','ankle']]
  u=[h[d]-k[d] for d in [0,1]];w=[a[d]-k[d] for d in [0,1]]
  cosine=sum(u[d]*w[d] for d in [0,1])/(math.hypot(*u)*math.hypot(*w))
  side_angles.append(math.degrees(math.acos(max(-1,min(1,cosine)))))
  if i and m['contact'] and rows[i-1]['meta'][side]['contact']:
   prev=rows[i-1]['actual'][side]['ankle']
   plant_errors.append(math.hypot(j['ankle'][0]-prev[0],j['ankle'][1]-prev[1]))
  assert m['reach']<=670.01
 lift[side]=round(maxlift,3);angles[side]=round(min(side_angles),2)
 assert maxlift>65
assert max(plant_errors)<.01
travel=rows[-1]['meta']['travelPx']-rows[0]['meta']['travelPx'];assert abs(travel-150)<.01
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(v),'-vf','scale=108:192,format=gray','-f','rawvideo','-pix_fmt','gray','-'])
n=108*192;frames=[raw[i:i+n] for i in range(0,len(raw),n)];assert len(frames)==150
changes=[sum(abs(x-y) for x,y in zip(a,b))/n for a,b in zip(frames,frames[1:])]
report={'video':info,'travel_px':round(travel,2),'max_foot_lift_px':lift,'minimum_knee_interior_angle_degrees':angles,'max_planted_ankle_drift_px':round(max(plant_errors),8),'determinism':'PASS','preset_variants':q['variantTests'],'loop_pose_max_error':q['loopError'],'frame_diff_median':round(statistics.median(changes),3),'sha256':hashlib.sha256(v.read_bytes()).hexdigest()}
(p/'out/walk-verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))

```

### `README.md`

````markdown
# PuppetKit 2D

An image-based 2D cutout puppet runtime built on Three.js. It is designed for deliberately simple, slightly stiff cartoon motion: separate image layers rotate around pivots, with reusable idle/talking/nod/wave animations.

> **Important image limitation:** a flattened PNG/JPG does not contain hidden pixels behind the head, arms, hair, or torso. PuppetKit can load one image and create masked cutout layers from editable polygon definitions, but it cannot infer or reconstruct hidden anatomy. For clean movement, prepare a source image with separated transparent layers, or manually paint/clone the missing overlap areas and trace each part in `manifest.parts`.

## Requirements
- Node.js 20+ recommended
- npm
- A modern browser with WebGL

## Quick start

```bash
npm install
npm run dev
```

Open the Vite URL and navigate to `/demo/`. Import a character image. The demo manifest is only a placeholder; edit `demo/manifest.example.js` so its polygons follow the actual image parts before expecting a clean rig.

## Runtime usage

```js
import { PuppetEngine, PuppetCharacter } from 'puppetkit-2d';
import manifest from './my-character-manifest.js';

const engine = new PuppetEngine({
  container: document.querySelector('#stage'),
  background: 0xf4eee7
});

const character = await PuppetCharacter.create({
  image: document.querySelector('#characterImage'), // or File / URL
  manifest,
  worldHeight: 2.0,
  position: [0, 0, 0]
});

engine.add(character);
engine.start();

character.play('idle', { loop: true, speed: 1 });
character.play('talking', { loop: true });
character.play('nod');
character.play('wave');
character.expression('happy');
character.headRotate(-8);
character.armRotate('right', 25);
```

Call `engine.dispose()` when the stage is permanently removed. Call `character.dispose()` if managing character lifetime outside the engine.

## Image + manifest workflow

1. Export the character as a transparent PNG at a reasonably high resolution.
2. Identify cutout parts: `body`, `head`, `leftArm`, `rightArm`, `leftLeg`, `rightLeg`, hair/eyes/mouth variants as needed.
3. Trace a polygon around each part. Coordinates are normalized: `(0,0)` is the image's top-left and `(1,1)` is bottom-right.
4. Set each pivot at the joint where that part should rotate. Example: shoulder for an arm, neck for head, hip for leg.
5. Put parent parts before their children in the array. Child pivot coordinates are interpreted relative to the parent's pivot; the part polygon itself remains in original image coordinates.
6. Ensure the art has overlap/hidden areas. For example, the upper arm should extend beneath the torso edge so a rotation does not reveal a gap.
7. Add alternate face artwork as separately named parts (for example `mouthNeutral`, `mouthSmile`, `mouthOpen`) and switch visibility using expression definitions.

### Manifest schema

```js
export default {
  name: 'MyCharacter',
  parts: [
    {
      name: 'body',
      polygon: [{ x: .30, y: .40 }, { x: .70, y: .40 }, { x: .75, y: .95 }, { x: .25, y: .95 }],
      pivot: { x: .50, y: .48 },
      z: 1
    },
    {
      name: 'rightArm',
      polygon: [{ x: .62, y: .45 }, { x: .80, y: .48 }, { x: .82, y: .90 }, { x: .66, y: .88 }],
      pivot: { x: .67, y: .50 },
      parent: 'body',
      z: 2
    }
  ],
  expressions: {
    neutral: { mouthNeutral: true, mouthSmile: false, mouthOpen: false },
    happy: { mouthNeutral: false, mouthSmile: true, mouthOpen: false },
    talking: { mouthNeutral: false, mouthSmile: false, mouthOpen: true }
  }
};
```

`z` controls draw order for root-level parts. Parent/child grouping is useful for articulated movement. Keep a child polygon within the same source image coordinate space. Parts are rasterized to transparent canvas textures at load time.

## Built-in animation library

| Name | Behavior | Loop recommendation |
|---|---|---|
| `idle` | subtle torso bob + tiny head tilt | yes |
| `talking` | small mouth-layer bob (starter placeholder) | yes |
| `nod` | one head nod | no |
| `wave` | right arm swings in a few stiff beats | no |

The built-ins are intentionally restrained. They are starting points, not a full motion-capture system. Extend `src/animation/library.js` with project-specific actions.

## API reference

### `new PuppetEngine({ container, background?, antialias? })`
Creates a Three.js scene, orthographic camera, renderer, resize handling, and animation loop.

- `add(character)` / `remove(character)`
- `start()` / `stop()`
- `resize()`
- `dispose()`

### `PuppetCharacter.create({ image, manifest, worldHeight?, scale?, position? })`
Asynchronously loads an image and creates the skeleton.

- `play(name, { loop?, speed?, restart? })`
- `stop()` / `pause()` / `update(delta)`
- `blink()`
- `expression(name)`
- `headRotate(degrees)`
- `armRotate('left' | 'right', degrees)`
- `dispose()`

### `PuppetSkeleton`
- `get(partName)` returns a `PuppetPart` or `undefined`.
- `setVisible(partName, boolean)`
- `setRotation(partName, degrees)`
- `setPosition(partName, x, y)`

### `Timeline`
Create custom keyframe motion:

```js
import { Timeline } from 'puppetkit-2d';
const arm = character.skeleton.get('rightArm').group;
const motion = new Timeline();
motion.addTrack(arm, 'rotation', [
  { time: 0, value: 0 },
  { time: .25, value: -0.5 },
  { time: .5, value: 0 }
], { easing: 'smooth' });
motion.play({ loop: true });
```

Timeline values for `rotation` are **radians**. The convenience methods `headRotate` and `armRotate` accept **degrees**.

## Current scope and known limitations
- This is a runtime toolkit, not a fully automatic AI character segmentation service or visual rig editor.
- The demo's example polygons are generic placeholders and must be redrawn for each character.
- `expression()` only switches visibility. Supply alternate eyes/mouth layers in the source art to make expressions visibly different.
- The starter `talking` animation moves the `mouth` pivot slightly. For real lip-sync, create mouth-shape layers and drive visibility from audio phonemes or timed cues.
- No inverse kinematics, mesh deformation, automatic inpainting, audio analysis, or export-to-video pipeline is included in this starter release.
- Keep part names `head`, `body`, `leftArm`, `rightArm`, `eyes`, and `mouth` if you want the built-in animation names to work without customization.

## Suggested production pipeline

**Artwork preparation → masks/pivots → rig validation → reusable actions → scene integration.** First make one clean character manifest and validate idle, head turn, and arm movement. Then reuse the same runtime and animation library for the male/female variants by swapping image + manifest data.


## Generic Asset Pack (v0.2)
See `assets/generic/` for 16 editable transparent SVG layers and a 1024px atlas. Use `demo/generic-manifest.js` with `PuppetCharacter.create()`. Full asset and rigging notes: `docs/GENERIC_ASSET_PACK.md`. Added `shrug`, `clap`, and `recoil` animation presets.

## Motion & expression library (v0.2.1 update)

Built-in motions: `idle`, `breathing`, `talking`, `nod`, `shake`, `tilt`, `wave`, `point`, `shrug`, `clap`, `recoil`, `laugh`, `walk`, and `surprised`.

```js
character.play('idle', { loop: true });
character.play('talking', { loop: true, speed: 1.15 });
character.gesture('wave');
character.expression('happy'); // neutral, happy, sad, angry, surprised, excited, confused
character.blink();
```

Expressions use simple procedural facial posing on the generic `eyes`, `brows`, and `mouth` layers. For richer artwork, add optional swap layers named `eyes_happy`, `mouth_sad`, `brows_angry`, etc. Automatic blink is updated by the engine tick and does not create unmanaged timers.

The animation library is intentionally cutout/puppet-like with restrained, slightly stiff movement. For articulated motion, each limb must be a separately segmented transparent layer with correctly placed pivots in the rig manifest. A single flattened image cannot produce hidden body artwork automatically.

````

### `qc-gaze.mjs`

```javascript
import {chromium} from 'playwright-core';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createGazePreset} from './presets/gaze.js';
const base=process.env.QC_URL||'http://127.0.0.1:5194';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:540,height:960},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const open=async(char)=>{await page.goto(`${base}/render/?char=${char}&frames=150&fps=30&w=540&h=960`);await page.waitForFunction(()=>window.__ready!==undefined);await page.evaluate(()=>window.__ready);};
 await open('heroine-gaze');await mkdir('qc-gaze',{recursive:true});
 const rows=[];
 for(const [f,label] of [[0,'center'],[30,'left'],[90,'right'],[149,'end'],[9,'blink'],[75,'a'],[149,'last'],[75,'b']]){
  await page.evaluate(f=>window.__frame(f),f);await page.screenshot({path:`qc-gaze/${label}.png`});
  rows.push({frame:f,label,eye:await page.evaluate(()=>window.__gazeQC())});
 }
 const same=async(a,b)=>(await readFile(a)).equals(await readFile(b));
 if(!await same('qc-gaze/a.png','qc-gaze/b.png'))throw Error('Random access failure');
 if(!await same('qc-gaze/center.png','qc-gaze/end.png'))throw Error('Center/end head or face moved');
 const variants=[{amount:.5},{keyframes:[{t:0,x:1},{t:2.5,x:-1},{t:5,x:1}],loop:true}];
 for(const opts of variants){const fn=createGazePreset(opts);for(let f=0;f<150;f++){const pose=fn(f/30);if(!Number.isFinite(pose.gaze.x)||Math.abs(pose.gaze.x)>1)throw Error('Invalid gaze option');}}
 // Backward compatibility: these are exact pre-feature render PNGs from completed presets.
 const regressions=[];
 for(const [char,f,ref] of [['heroine-walk',75,'tests/fixtures/walk-f75.png'],['heroine-sit',149,'tests/fixtures/sit-f149.png']]){
  await open(char);await page.evaluate(f=>window.__frame(f),f);
  const out=`qc-gaze/regression-${char}.png`;await page.screenshot({path:out});
  const ok=await same(out,ref);regressions.push({char,frame:f,identical:ok});if(!ok)throw Error(`Regression ${char}`);
 }
 if(errors.length)throw Error(errors.join(' | '));
 await writeFile('qc-gaze/measurements.json',JSON.stringify({errors,rows,regressions,variants:'PASS',determinism:'PASS',fixedHead:'PASS'},null,2));
 console.log(JSON.stringify({rows,regressions,variants:'PASS',determinism:'PASS',fixedHead:'PASS'}));
}finally{await browser.close();}

```

### `qc-loop.mjs`

```javascript
import {chromium} from 'playwright-core';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:540,height:960},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.QC_URL || 'http://127.0.0.1:5192'}/render/?char=heroine-walk-loop&frames=150&fps=30`);
 await page.waitForFunction(()=>window.__ready!==undefined);await page.evaluate(()=>window.__ready);
 await mkdir('qc-loop',{recursive:true});
 for(const f of [7,49,28,70]){await page.evaluate(f=>window.__frame(f),f);await page.screenshot({path:`qc-loop/f${f}.png`});}
 if(errors.length)throw Error(errors.join(' | '));console.log('Loop wrapper renders without page errors');
}finally{await browser.close();}

```

### `verify-gaze-preset.py`

```python
from pathlib import Path
import json,subprocess,math,hashlib
from PIL import Image,ImageChops
p=Path(__file__).resolve().parent
v=p/'out/gaze-left-right-540p-5s.mp4'
if not v.exists():v=p/'out/clip.mp4'
assert v.is_file(),'Render the gaze clip first'
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=codec_name,width,height,pix_fmt,r_frame_rate,duration,nb_read_frames','-of','json',str(v)]))['streams'][0]
assert (info['width'],info['height'],info['nb_read_frames'],info['duration'])==(540,960,'150','5.000000')
q=json.loads((p/'qc-gaze/measurements.json').read_text());assert not q['errors']
assert all(r['identical'] for r in q['regressions'])
assert (p/'qc-gaze/a.png').read_bytes()==(p/'qc-gaze/b.png').read_bytes()
assert (p/'qc-gaze/center.png').read_bytes()==(p/'qc-gaze/end.png').read_bytes()
# Only pixels in the existing eye region may change between the open-eye poses.
base=Image.open(p/'qc-gaze/center.png').convert('RGB')
for name in ['left','right']:
 im=Image.open(p/f'qc-gaze/{name}.png').convert('RGB');d=ImageChops.difference(base,im)
 d.paste((0,0,0),(152,210,367,271));assert d.getbbox() is None,'Head/body/background moved'
# Independent pixel evidence from the actual encoded MP4, not just pose numbers.
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(v),'-vf','select=eq(n\\,0)+eq(n\\,30)+eq(n\\,90)+eq(n\\,149)','-fps_mode','vfr','-f','rawvideo','-pix_fmt','rgb24','-'])
size=540*960*3;assert len(raw)==4*size
centroids=[]
for idx in range(4):
 im=Image.frombytes('RGB',(540,960),raw[idx*size:(idx+1)*size]);eyes=[]
 for l,r in [(165,239),(282,356)]:
  found=[]
  for y in range(230,259):
   for x in range(l,r):
    color=im.getpixel((x,y))
    if sum((color[i]-[56,34,24][i])**2 for i in range(3))<400:found.append(x)
  assert len(found)>15,{'frame':idx,'eye':l,'iris_pixels':len(found)}
  eyes.append(round(sum(found)/len(found),3))
 centroids.append(eyes)
for eye in [0,1]:
 assert centroids[1][eye]<centroids[0][eye]-8,centroids
 assert centroids[2][eye]>centroids[0][eye]+8,centroids
 assert abs(centroids[3][eye]-centroids[0][eye])<1.5,centroids
report={'video':info,'iris_color_centroid_x_from_decoded_video':dict(zip(['center','left','right','return_center'],centroids)),
 'determinism':'PASS','fixed_head_and_body':'PASS','preset_variants':q['variants'],'existing_preset_pixel_regressions':q['regressions'],
 'sha256':hashlib.sha256(v.read_bytes()).hexdigest()}
(p/'out/gaze-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))

```

### `index.html`

```html
<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PuppetKit 2D</title></head><body><p>Run <code>npm run dev</code> and open <code>/demo/</code>.</p></body></html>

```

### `package-lock.json`

```json
{
  "name": "puppetkit-2d",
  "version": "0.2.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "puppetkit-2d",
      "version": "0.2.0",
      "dependencies": {
        "three": "^0.180.0"
      },
      "devDependencies": {
        "playwright-core": "^1.65.1",
        "vite": "^7.3.8"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.68.7.tgz",
      "integrity": "sha512-ZL7MgOeMUiBum1bjzzyBotE3DuHVz+UUxcDVlLL7gpdhDM4RpjG4bZOIly7ensIcXw9jhWl7HTIIQ9KsgjykGQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.68.7.tgz",
      "integrity": "sha512-cKZ2Hz/xt5DLY/vdUmMXEn3gnjLgwdeB/npHagbdTljLvBE6b/xKcPCcRWTiT0pHeVf8akl5Cb9K7ylRxbtHng==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-x64": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-x64/-/rollup-android-x64-4.68.7.tgz",
      "integrity": "sha512-P9vs1uCC2drepKKuiXrhY+r7ry/jtDCrBS8SUCYm2Rr7rVTR9eFH6XVAmD9TdfYFlDgRe5r1eH8tLQVuz+l/VA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.68.7.tgz",
      "integrity": "sha512-Lgu2AV7jbOTNNhkQ/OurNm7Snqu1Ux/3y7k8q47fbpPa3q63aIzKKp1xFzax5KH4pcdUzbnX/riuFsxKflsF+g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.68.7.tgz",
      "integrity": "sha512-wKo6rOzla+/3rN8QBqTgcrsQMfyqwa3y14TvCTotLLib/ACWTxX1zWDTYze90s2RWtYiSfTlavHLmZv0Jsafrw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.68.7.tgz",
      "integrity": "sha512-vAeCwbFyEu/vBt9O/uHCHJSvwtOpTSssnM/PoZgn8rmvAkS+9ixaUfJZ2IP3ltom+rvpuQQEIEqltPY7qhC9lQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.68.7.tgz",
      "integrity": "sha512-HvjSxOKI+6Si4ytmaoCEpjwDMrH/1s0uWeTAhdE5oXY8/RMI92hCePI/psZuJtY5EHWoT7MfyvTz0HBDZb1ZwQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.68.7.tgz",
      "integrity": "sha512-nz/Eu1sag3w5gPiKLJhAbKa4D9hUUJpDc9XzKXxGNHZqwgT2AbuVS2e4k9CIoLQp5dPhSN9ntiEVuz2jTzu1Gg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.68.7.tgz",
      "integrity": "sha512-05CEv2G/kI261A1WQBZL8gx6xXULjPfVnTKAkfnV/0uqHeLo+dNEOeUzMaiK/HDGR0Z1Nn7KJjm/34bNbNcfTA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.68.7.tgz",
      "integrity": "sha512-wrqk3EkxQt98lTdiYhjcaWmFHwvKiSgHFi7XmPTSF4X8+uGUTBOAc0CaynEvpUhBgkPRbwASrYoU/5uJPF+LFA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.68.7.tgz",
      "integrity": "sha512-DnuEUWvzeSxHxzu5lvrN+I/UzrcQkR/fQ4Bibetdp73Rf7aP0XgFpalSDuHmVWsCLETE+Lrl3GVOqIvFP7rcjw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.68.7.tgz",
      "integrity": "sha512-n0sr2s+rzVw8ntRucOxGhWeJ9lEl9KxCRzF3RmnZLE/tRnfKiloLuK8UqWrKFqVigEAh0IkRkPz5LVaV9/ZfvA==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.68.7.tgz",
      "integrity": "sha512-qDVJyMCbh7ekjt1kM9CZsyCFZvv5UW1QTIx3YfJ/gh8LkqpoPNpl9dCeYeOa+bsDOGTWZiMG2riXuoFSRISimQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.68.7.tgz",
      "integrity": "sha512-GiIOHHIzgpMoR5DT1pA1b9qMk5i0Ngg2FRj4D6XFSBC8e/axHuIdB7K/OBozO2RtCVAMnH1rXcuJrGScg+bvzA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.68.7.tgz",
      "integrity": "sha512-B132V2fwDl7UGLhvK6s3Ay7eNQ4dmDSDgsBm/Wwbz+Wgnunz0le4R2wzDp6TL5ExMu3MC1auJIrVtk2gOyxbyw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.68.7.tgz",
      "integrity": "sha512-3NueHQilbssjxgJMx9hXBV+U5keb3CBzmW5WhoBG3iSLFcmz9U2FVoG4MUYpZoZ+KSNMQPN2AA79dTxlEF0VxQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.68.7.tgz",
      "integrity": "sha512-8XRwbf76oAF1zZzg6OT8EY3swvCptZnLmiqMgO5+STyhTZ9s7rXa+tY8jESZW9IDyKACcVBGqa/RACDaLzRVjQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.68.7.tgz",
      "integrity": "sha512-pvqqfjNdxVLvmovH681K5cPIL9DXj5n1RROaa0vb9JrtHddiScLrkHPRKj5flTKHF1M7xvRy0SS2yTRIc2TO0Q==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.68.7.tgz",
      "integrity": "sha512-rsTjTf5HAm6F4sI6uUfJf2pc+7AWBKxgc2RveGvwB2OvVa1GezSSCDD1rtXPuFhcg3itPv7iHgcZsq/RwWvJ4Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.68.7.tgz",
      "integrity": "sha512-VNLvsYMD5+zLCi5SohwDdL8PpicC9PnArLwyMJXXUcAduzrM3k9aZT9XiHw+mn5dOWr3UEyfyqJbOvxwJ2fCWQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.68.7.tgz",
      "integrity": "sha512-7aOjdahkwiECWWOmjAemPd21yeQ18TW59DUiLWttzolMe5tDwHyBhlOfmxRUHOQnepTNkZ2Qwp1T6LxFZ5v7yQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.68.7.tgz",
      "integrity": "sha512-BnNkTwE4FMCAoz3UYiJ6D6Y3pGozYIYZ2W+onH64uhiTI2iwD3KOaNSlkuHYfupZVemls3YTlvbPnuKwHsraiQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.68.7.tgz",
      "integrity": "sha512-OH8tGWsJcRW6Vn0dmndyWJGdQa46bH2/2/PVfleBGUWuBd5/HVkIvw2UslgBwUZdtV78bJaoCNBmYI5+bcTJ4A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.68.7.tgz",
      "integrity": "sha512-SpYx5X9+2JOF3hXe1cRaiFn562h4AMJhfgxkyHyiuh9dJ7PanPm7FTp8GJReSbS9N+TfjRiBbKacVk1g35kKxg==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.68.7.tgz",
      "integrity": "sha512-0ncKtQ55fqElV9Sk4cZ/4tiXVGlWxaH5PvDOlx1Sx8GuHIpSWgYrTcyrO51JnVFfy7LvAJiffkEg63ZHKwTMag==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.68.7.tgz",
      "integrity": "sha512-XY9DYHO5UxxVR8G6AErXDlccQmDpvGTLgKHFpvkgsyjwG/PrQuInRjQQfpEzBRuT+bhBtwfS8yDe9sPhVcq/9A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@types/estree": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.10.tgz",
      "integrity": "sha512-lTyOMnOcmRBzdCv6/4zUZCrEhV0xrqQiUZBZtVcbmLHBXKLnN8q89v/wKRF/Q0HbwVsqbIG3o5HDoFl9sduM+g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.20",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.20.tgz",
      "integrity": "sha512-uKdg2G3GNCKQn9byYOpxbGqrT2fGO5KRt5J/8b3pok8rT6qxGWF6hxMyJiEYtAf+FVyYuD9hRaDqX5uPFYJ4ZQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.65.1",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.65.1.tgz",
      "integrity": "sha512-hqPpz7blSMPxWVdoeE1yiBSzXsKiVOd2k+kjCvmUywD2GPO2Dd9HfcWnq9NN0GHbNZDFgZ9JfBFr+X5/BLo0qw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.33",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.33.tgz",
      "integrity": "sha512-RVHEU9/Pp1Fnjr/MpAJsZoADukCKhfIi15OunEYiGktIkYLkPVvC1sioWolGDS7XByMTx9m/IGbro0Js13zhnQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.20",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/rollup": {
      "version": "4.68.7",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.68.7.tgz",
      "integrity": "sha512-CxhzUIc+ocxPAWxHuff+PAluoW1otD6dHqqPK2h2Q38WA1VYk+3gizX6NEg5t2a8yNGQaiHM1R7V+qdwWuvp5Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "^1.0.10"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@rollup/rollup-android-arm-eabi": "4.68.7",
        "@rollup/rollup-android-arm64": "4.68.7",
        "@rollup/rollup-android-x64": "4.68.7",
        "@rollup/rollup-darwin-arm64": "4.68.7",
        "@rollup/rollup-darwin-x64": "4.68.7",
        "@rollup/rollup-freebsd-arm64": "4.68.7",
        "@rollup/rollup-freebsd-x64": "4.68.7",
        "@rollup/rollup-linux-arm-gnueabihf": "4.68.7",
        "@rollup/rollup-linux-arm-musleabihf": "4.68.7",
        "@rollup/rollup-linux-arm64-gnu": "4.68.7",
        "@rollup/rollup-linux-arm64-musl": "4.68.7",
        "@rollup/rollup-linux-loong64-gnu": "4.68.7",
        "@rollup/rollup-linux-loong64-musl": "4.68.7",
        "@rollup/rollup-linux-ppc64-gnu": "4.68.7",
        "@rollup/rollup-linux-ppc64-musl": "4.68.7",
        "@rollup/rollup-linux-riscv64-gnu": "4.68.7",
        "@rollup/rollup-linux-riscv64-musl": "4.68.7",
        "@rollup/rollup-linux-s390x-gnu": "4.68.7",
        "@rollup/rollup-linux-x64-gnu": "4.68.7",
        "@rollup/rollup-linux-x64-musl": "4.68.7",
        "@rollup/rollup-openbsd-x64": "4.68.7",
        "@rollup/rollup-openharmony-arm64": "4.68.7",
        "@rollup/rollup-win32-arm64-msvc": "4.68.7",
        "@rollup/rollup-win32-ia32-msvc": "4.68.7",
        "@rollup/rollup-win32-x64-gnu": "4.68.7",
        "@rollup/rollup-win32-x64-msvc": "4.68.7",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.4.tgz",
      "integrity": "sha512-J7ZjMvHd9O1fcT/5V09QWaaSl2BbWx3F6O08spde82Namf9UB0GxRVIPiNbVsdKkoizHiSpTodo3vp2bAy91MA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/three": {
      "version": "0.180.0",
      "resolved": "https://registry.npmjs.org/three/-/three-0.180.0.tgz",
      "integrity": "sha512-o+qycAMZrh+TsE01GqWUxUIKR1AL0S8pq7zDkYOQw8GqfX8b8VoCKYUoHbhiX5j+7hr8XsuHDVU6+gkQJQKg9w==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/vite": {
      "version": "7.3.8",
      "resolved": "https://registry.npmjs.org/vite/-/vite-7.3.8.tgz",
      "integrity": "sha512-3tTi78MAKhVk9h+YZVXMQ8POmneJuE97QUPAWtJghHzhH7BAyiqQOC2KZh1DWOsu/USB2cRXhznPByaabvYXfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "^0.27.0 || ^0.28.0",
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3",
        "postcss": "^8.5.6",
        "rollup": "^4.43.0",
        "tinyglobby": "^0.2.15"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "lightningcss": "^1.21.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    }
  }
}

```

### `RENDER-TOOLKIT.md`

````markdown
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

````

### `package.json`

```json
{
  "name": "puppetkit-2d",
  "version": "0.2.0",
  "description": "Image-based 2D cutout puppet animation toolkit for Three.js",
  "type": "module",
  "main": "./src/index.js",
  "exports": {
    ".": "./src/index.js"
  },
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "capture": "node render/capture.mjs stills",
    "make": "bash make.sh"
  },
  "dependencies": {
    "three": "^0.180.0"
  },
  "devDependencies": {
    "playwright-core": "^1.65.1",
    "vite": "^7.3.8"
  }
}
```

### `qc-walk.mjs`

```javascript
import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
import {poseAt} from './assets/heroine-walk/story.js';
import {createWalkPreset} from './presets/walk.js';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:540,height:960},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.QC_URL || 'http://127.0.0.1:5192'}/render/?char=heroine-walk&frames=150&fps=30&w=540&h=960`);
 await page.waitForFunction(()=>window.__ready!==undefined);await page.evaluate(()=>window.__ready);
 await mkdir('qc-walk',{recursive:true});
 for(const [f,label] of [[0,'000'],[24,'024'],[32,'032'],[40,'040'],[48,'048'],[60,'060'],[70,'070'],[90,'090'],[110,'110'],[138,'138'],[149,'149'],[75,'a'],[149,'last'],[75,'b']]){
  await page.evaluate(f=>window.__frame(f),f);await page.screenshot({path:`qc-walk/f${label}.png`});
 }
 const measurements=[];
 for(let f=0;f<150;f++){
  await page.evaluate(f=>window.__frame(f),f);
  const pose=poseAt(f/30);
  measurements.push({frame:f,actual:await page.evaluate(()=>window.__rigQC()),meta:pose.meta});
 }
 const testVariants=[{direction:-1},{travel:false},{stridePx:35,cycleSeconds:1.05,duration:4.2}];
 for(const options of testVariants){const fn=createWalkPreset(options);for(let f=0;f<150;f++){
  const p=fn(f/30);if(!Number.isFinite(p.x)||Object.values(p.turns).some(v=>!Number.isFinite(v)))throw Error('Invalid preset variant');}}
 const loop=createWalkPreset({loop:true,travel:false,startXPx:0});
 const a=loop(.4),b=loop(1.8);const loopError=Math.max(...Object.keys(a.turns).map(k=>Math.abs(a.turns[k]-b.turns[k])));
 if(loopError>1e-5)throw Error(`Nonperiodic gait ${loopError}`);
 await writeFile('qc-walk/measurements.json',JSON.stringify({errors,measurements,variantTests:'PASS',loopError}));
 console.log(JSON.stringify({errors,variantTests:'PASS',loopError}));
 if(errors.length)process.exitCode=1;
}finally{await browser.close();}

```

### `render/capture.mjs`

```javascript
// Capture deterministic frames from the render stage.
//   node render/capture.mjs stills --char heroine --frames 300 --fps 30
//   node render/capture.mjs full   --char heroine --frames 300 --fps 30
//   node render/capture.mjs stills --w 540 --h 960 --url http://127.0.0.1:5173
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const argv = process.argv.slice(2);
const mode = argv[0] ?? 'stills';
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const char = arg('char', 'heroine');
const frames = Number(arg('frames', 300));
const fps = Number(arg('fps', 30));
const width = Number(arg('w', 540));
const height = Number(arg('h', 960));
const base = arg('url', 'http://127.0.0.1:5173');
const url = `${base}/render/?char=${char}&frames=${frames}&fps=${fps}&w=${width}&h=${height}`;
const sample = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map(p => Math.min(frames - 1, Math.round(p * (frames - 1))));

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--disable-gpu'],
});

try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', error => console.error('PAGEERROR', error.message));
  page.on('console', message => message.type() === 'error' && console.error('CONSOLE', message.text()));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => window.__ready);
  const size = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return [canvas.width, canvas.height];
  });
  if (size[0] !== width || size[1] !== height) throw new Error(`Framebuffer is ${size.join('x')}`);
  // The story module owns the clip length; clamp to it so `stills` works without args.
  const total = (await page.evaluate(() => window.__meta?.frames)) || frames;

  async function snap(f, folder, label = String(f).padStart(4, '0')) {
    await page.evaluate(frame => window.__frame(frame), f);
    await page.screenshot({ path: `${folder}/f${label}.png` });
  }

  if (mode === 'stills') {
    await mkdir('stills/determinism', { recursive: true });
    for (const f of sample.filter(f => f < total)) await snap(f, 'stills');
    const mid = Math.floor(total / 2);
    await snap(mid, 'stills/determinism', 'mida');
    await snap(mid, 'stills/determinism', 'midb');
    await snap(total - 1, 'stills/determinism', 'last');
    await snap(mid, 'stills/determinism', 'midafterlast');
    console.log(`stills: ${sample.join(',')}`);
  } else if (mode === 'full') {
    await mkdir('frames', { recursive: true });
    for (let f = 0; f < total; f++) {
      await snap(f, 'frames');
      if (f % 60 === 59) console.log(`captured ${f + 1}/${total}`);
    }
  } else {
    throw new Error('Expected stills or full');
  }
} finally {
  await browser.close();
}

```

### `render/index.html`

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Puppet render stage</title>
<style>
  html, body { margin: 0; background: #111; }
  #stage { width: 540px; height: 960px; overflow: hidden; }
  canvas { display: block; }
</style>
<main id="stage" aria-label="Character clip"></main>
<script type="module" src="./frame.js"></script>
</html>

```

### `render/frame.js`

```javascript
import * as THREE from 'three';
import { PuppetEngine, PuppetCharacter } from '../src/index.js';
import {createGazeController} from '../src/animation/gaze-controller.js';

// Query params let one page serve any character at any resolution.
const q = new URLSearchParams(location.search);
const char = q.get('char') || 'heroine';
const frames = Number(q.get('frames') || 300);
const fps = Number(q.get('fps') || 30);
const W = Number(q.get('w') || 540);
const H = Number(q.get('h') || 960);

const manifest = (await import(`../assets/${char}/manifest.js`)).default;
const story = await import(`../assets/${char}/story.js`);
const { poseAt } = story;
const scene = story.scene || {};

const interactive = document.body.dataset.mode === 'preview';

window.__meta = { char, frames, fps, width: W, height: H };
window.__ready = (async () => {
  Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
  const stage = document.querySelector('#stage');
  stage.style.width = `${W}px`;
  stage.style.height = `${H}px`;

  const engine = new PuppetEngine({ container: stage, background: scene.bg ?? 0xf2e9df });
  engine.stop();

  // Flat backdrop layer: one SVG stretched over the exact camera frustum.
  if (scene.room) {
    const image = new Image(W, H);
    image.src = new URL(`../assets/${char}/${scene.room}`, import.meta.url).href;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.getContext('2d').drawImage(image, 0, 0, W, H);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    engine.scene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2.4 * (W / H), 2.4),
      new THREE.MeshBasicMaterial({ map: texture, depthWrite: false }),
    ));
  }

  const puppet = await PuppetCharacter.create({
    image: manifest.parts[0].image, manifest, worldHeight: scene.worldHeight ?? 3.2,
  });
  engine.add(puppet);
  const gazeController=createGazeController(puppet,manifest.gazeRig);
  window.__gazeQC=()=>gazeController?.snapshot() ?? null;
  const base = Array.from(puppet.skeleton.parts.values(), ({ group }) => ({
    group, mesh: Array.from(puppet.skeleton.parts.values()).find(p => p.group === group).mesh, position: group.position.clone(), rotation: group.rotation.clone(),
    scale: group.scale.clone(), visible: group.visible,
    meshY: Array.from(puppet.skeleton.parts.values()).find(p => p.group === group).mesh.position.y,
  }));

  window.__frame = f => {
    if (!Number.isInteger(f) || f < 0 || f >= frames) throw new RangeError(`Expected frame 0–${frames - 1}`);
    for (const { group, mesh, meshY, position, rotation, scale, visible } of base) {
      mesh.scale.y = 1;
      mesh.position.y = meshY;
      group.position.copy(position);
      group.rotation.copy(rotation);
      group.scale.copy(scale);
      group.visible = visible;
    }
    const pose = poseAt(f / fps);
    for (const [name, angle] of Object.entries(pose.turns || {})) {
      const part = puppet.skeleton.get(name);
      if (part) part.group.rotation.z += THREE.MathUtils.degToRad(angle);
    }
    // Articulated, foreshortened limbs: scale the mesh, never the parent joint.
    // Child joint offsets follow the shortened segment; distal widths remain unchanged.
    const artScale = (scene.worldHeight ?? 3.2) / 2000;
    for (const [side, lengths] of Object.entries(pose.legLengths || {})) {
      const thigh = puppet.skeleton.get(`thigh${side}`);
      const shin = puppet.skeleton.get(`shin${side}`);
      const foot = puppet.skeleton.get(`foot${side}`);
      for (const [part, length, original] of [[thigh, lengths.thigh, 277], [shin, lengths.shin, 393]]) {
        const reference = base.find(b => b.group === part.group);
        part.mesh.scale.y = length / original;
        part.mesh.position.y = reference.meshY * length / original;
      }
      shin.group.position.y = -lengths.thigh * artScale;
      foot.group.position.y = -lengths.shin * artScale;
    }
    if (pose.skirtForeshorten !== undefined) {
      const part=puppet.skeleton.get('skirt');
      const reference=base.find(b=>b.group===part.group);
      part.mesh.scale.y=pose.skirtForeshorten;
      part.mesh.position.y=reference.meshY*pose.skirtForeshorten;
    }
    const body = puppet.skeleton.get('body')?.group;
    if (body) {
      body.position.x += (pose.x || 0) / 400;
      body.position.y += (pose.y || 0) / 400;
    }
    if (gazeController) gazeController.apply(pose.gaze);
    if (pose.expression) puppet.expression(pose.expression);
    if (pose.blink) {
      for (const eye of ['eyes', 'eyes_happy', 'eyes_closed']) {
        puppet.skeleton.setVisible(eye, eye === 'eyes_closed');
      }
    }
    for (const [name, visible] of Object.entries(pose.show || {})) {
      puppet.skeleton.setVisible(name, visible);
    }
    engine.renderer.render(engine.scene, engine.camera);
  };

  window.__rigQC = () => {
    puppet.root.updateMatrixWorld(true);
    const project = name => {
      const v=puppet.skeleton.get(name).group.getWorldPosition(new THREE.Vector3()).project(engine.camera);
      return [(v.x+1)*W/2,(1-v.y)*H/2];
    };
    return Object.fromEntries(['L','R'].map(side=>[side,{hip:project('thigh'+side),knee:project('shin'+side),ankle:project('foot'+side)}]));
  };
  window.__frame(0);
  if (interactive) {
    const slider = document.querySelector('input');
    const playback = document.querySelector('button');
    slider.max = String(frames - 1);
    let playing = false;
    let start = 0;
    let initial = 0;
    let request;
    const tick = now => {
      const frame = (initial + Math.floor((now - start) * fps / 1000)) % frames;
      slider.value = frame;
      window.__frame(frame);
      if (playing) request = requestAnimationFrame(tick);
    };
    const pause = () => {
      cancelAnimationFrame(request);
      playing = false;
      playback.textContent = 'Play';
    };
    playback.addEventListener('click', () => {
      if (playing) return pause();
      playing = true;
      playback.textContent = 'Pause';
      initial = Number(slider.value);
      start = performance.now();
      request = requestAnimationFrame(tick);
    });
    slider.addEventListener('input', () => {
      pause();
      window.__frame(Number(slider.value));
    });
  }
  return true;
})();

```

### `docs/WALK_PRESET.md`

````markdown
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

````

### `docs/seated-verification.json`

```json
{
  "video": {
    "codec_name": "h264",
    "width": 540,
    "height": 960,
    "pix_fmt": "yuv420p",
    "r_frame_rate": "30/1",
    "duration": "5.000000",
    "nb_read_frames": "150"
  },
  "knee_angles_degrees": {
    "L": 88.4,
    "R": 88.4
  },
  "actual_joints_final_pixels": {
    "L": {
      "hip": [
        172.79999999999998,
        687.9999999999001
      ],
      "knee": [
        291.6,
        687.9999999999002
      ],
      "ankle": [
        286.2,
        881.79999999996
      ]
    },
    "R": {
      "hip": [
        243,
        687.9999999999001
      ],
      "knee": [
        361.8,
        687.9999999999002
      ],
      "ankle": [
        356.4,
        881.79999999996
      ]
    }
  },
  "determinism": "PASS",
  "frame_diff_median": 0.74,
  "frame_diff_max": 3.838,
  "frame_diff_max_at_transition": 36,
  "longest_low_motion_run": 2,
  "sha256": "63be06c442193548800d07145d4e4af6f284c264f044b4bfa2d7ea9a4360c496"
}
```

### `docs/RIGGING.md`

```markdown
# Rigging guide

## Coordinate system

All polygon and pivot coordinates refer to the original source image, normalized from 0 to 1. The origin is top-left. Three.js world space is centered on the image with positive Y upward.

## Recommended layer order

For a front-facing character, start with rear hair, rear arms, torso, neck, head/face, front hair, and front arms. Use z values to establish root draw order. If a limb is parented to the torso, it inherits torso motion.

## Pivot placement

- Head: base of neck, not center of face.
- Upper arm: shoulder joint.
- Forearm: elbow joint if split into its own part.
- Hand: wrist joint if independently animated.
- Thigh: hip joint.
- Lower leg: knee joint.

A pivot is the local origin of the part group. The visible cutout mesh is offset from that pivot so the original artwork remains aligned.

## Avoiding gaps

Cutout animation reveals edges that were hidden in the flat illustration. Extend the arm under the torso, extend the neck under the head, and paint hidden hair/skin/clothing behind overlaps. Keep a small overlap margin rather than making parts meet edge-to-edge.

## Face variants

Use independent layers with the same approximate placement:

- `eyesOpen`, `eyesClosed`
- `mouthNeutral`, `mouthSmile`, `mouthOpen`, `mouthO`
- optional `browsAngry`, `browsRaised`

Then map expression names to visibility booleans. For blink, swap eye layers briefly instead of scaling the whole eye group if the art has a dedicated closed-eye drawing.

```

### `docs/SEATED_TEMPLATE.md`

```markdown
# Bent-knee seated template

Run: bash make.sh heroine-sit full 150 30

This template uses articulated thigh, shin and foot SVGs continuously; the obsolete legs_seated card is hidden. pose.legLengths supplies projected lengths; the harness scales meshes around their pivots and explicitly repositions child joints, never scaling the hierarchy. pose.skirtForeshorten shortens the standing skirt continuously to expose the thigh-to-knee bend.

At frame 64 onward the hips and knees have equal projected Y, thighs extend 118.8 px to screen right, ankles stay at Y=881.8 px, and interior knee angles are 88.4 degrees. Both shoes stay inside the 540x960 frame.

Actual world-transform projection, deterministic frame capture, and MP4 decode were checked. See seated-verification.json for measurements. Larger z means foreground when absoluteDrawOrder is true.

```

### `docs/walk-verification.json`

```json
{
  "video": {
    "codec_name": "h264",
    "width": 540,
    "height": 960,
    "pix_fmt": "yuv420p",
    "r_frame_rate": "30/1",
    "duration": "5.000000",
    "nb_read_frames": "150"
  },
  "travel_px": 150,
  "max_foot_lift_px": {
    "L": 77.995,
    "R": 77.727
  },
  "minimum_knee_interior_angle_degrees": {
    "L": 97.75,
    "R": 96.24
  },
  "max_planted_ankle_drift_px": 5e-08,
  "determinism": "PASS",
  "preset_variants": "PASS",
  "loop_pose_max_error": 8.881784197001252e-15,
  "frame_diff_median": 1.862,
  "sha256": "a52f47c01db5d0d5d8bd5073ec9f083b7ba6537469f861d27e4b896735b442f2"
}
```

### `docs/gaze-verification.json`

```json
{
  "video": {
    "codec_name": "h264",
    "width": 540,
    "height": 960,
    "pix_fmt": "yuv420p",
    "r_frame_rate": "30/1",
    "duration": "5.000000",
    "nb_read_frames": "150"
  },
  "iris_color_centroid_x_from_decoded_video": {
    "center": [
      203.045,
      317.061
    ],
    "left": [
      190.791,
      308.59
    ],
    "right": [
      212.061,
      327.792
    ],
    "return_center": [
      202.29,
      317.435
    ]
  },
  "determinism": "PASS",
  "fixed_head_and_body": "PASS",
  "preset_variants": "PASS",
  "existing_preset_pixel_regressions": [
    {
      "char": "heroine-walk",
      "frame": 75,
      "identical": true
    },
    {
      "char": "heroine-sit",
      "frame": 149,
      "identical": true
    }
  ],
  "sha256": "1ec311db96bf6d3c8dc2f5484a79e53148850840d680a5b2e4615634bc1a4fcd"
}
```

### `docs/GAZE_PRESET.md`

````markdown
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

````

### `docs/GENERIC_ASSET_PACK.md`

````markdown
# Generic Asset Pack & Rig Manifest

## Included assets
- 16 transparent SVG part files in `assets/generic/`
- `generic-atlas.svg`, 1024x1024, four columns by four rows
- `demo/generic-manifest.js`, normalized crop polygons, pivots, parent hierarchy, z-order

## Load in Three.js
```js
import { PuppetEngine, PuppetCharacter } from '../src/index.js';
import { genericManifest } from './generic-manifest.js';
const engine = new PuppetEngine({ container: document.querySelector('#stage') });
const puppet = await PuppetCharacter.create({
  image: '/assets/generic/generic-atlas.svg',
  manifest: genericManifest,
  worldHeight: 2.4
});
engine.add(puppet);
puppet.play('idle', { loop: true });
```

## Important rigging note
This first generic pack is a starter cutout rig. Parts are separate visual layers, with pivots and parent relationships in the manifest. Because the source is a simple atlas, refine pivot coordinates and masks for your target proportions. Paint hidden pixels behind joints (shoulder, elbow, hip, knee) to prevent gaps during rotation.

## Expression & gesture extension
The current runtime expression method toggles visibility only. To support true alternate facial drawings, add named variants (for example `mouth_happy.svg`, `mouth_o.svg`) and swap textures/material maps in an expression controller. Gesture animations can be added as timeline tracks on `leftUpperArm`, `rightUpperArm`, forearms and hands.

````

### `docs/ROADMAP.md`

```markdown
# Roadmap

1. **Current starter:** image loading, polygon cutout textures, pivot groups, nested parts, orthographic Three.js stage, basic keyframe timeline, idle/talking/nod/wave.
2. **Next:** visual polygon/pivot editor, undo/redo, manifest import/export, multi-angle pose helpers.
3. **Face system:** named mouth/eye states, blink controller, timed dialogue/lip-sync cues.
4. **Motion tools:** reusable action blending, arm/leg IK, secondary motion, parent constraints.
5. **Production tools:** sprite-sheet/video export, scene presets, asset validation and rig diagnostics.

```

### `demo/manifest.example.js`

```javascript
// Coordinates are normalized to the source image: top-left (0,0), bottom-right (1,1).
// Replace these example polygons with masks traced around your own character.
export const characterManifest = {
  name: 'SamplePuppet',
  parts: [
    { name: 'body', polygon: [{x:.32,y:.43},{x:.69,y:.43},{x:.75,y:.92},{x:.27,y:.92}], pivot: {x:.5,y:.48}, z: 1 },
    { name: 'leftArm', polygon: [{x:.25,y:.48},{x:.39,y:.48},{x:.36,y:.88},{x:.22,y:.88}], pivot: {x:.35,y:.52}, parent: 'body', z: 2 },
    { name: 'rightArm', polygon: [{x:.61,y:.48},{x:.76,y:.48},{x:.79,y:.88},{x:.64,y:.88}], pivot: {x:.66,y:.52}, parent: 'body', z: 2 },
    { name: 'head', polygon: [{x:.28,y:.03},{x:.72,y:.03},{x:.75,y:.48},{x:.25,y:.48}], pivot: {x:.5,y:.44}, z: 3 },
    { name: 'eyes', polygon: [{x:.34,y:.20},{x:.66,y:.20},{x:.66,y:.31},{x:.34,y:.31}], pivot: {x:.5,y:.25}, parent: 'head', z: 4 },
    { name: 'mouth', polygon: [{x:.43,y:.34},{x:.57,y:.34},{x:.57,y:.40},{x:.43,y:.40}], pivot: {x:.5,y:.37}, parent: 'head', z: 5 }
  ],
  expressions: {
    neutral: { eyes: true, mouth: true },
    happy: { eyes: true, mouth: true },
    surprised: { eyes: true, mouth: true }
  }
};

```

### `demo/heroine.html`

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The butterfly greeting</title>
<style>
  body { background: #262222; color: white; margin: 16px; font: 16px system-ui; }
  .controls { display: flex; gap: 12px; max-width: 540px; margin-bottom: 10px; }
  input { flex: 1; }
  #stage { width: 540px; height: 960px; }
  canvas { display: block; width: min(540px, calc(100vw - 32px), (100vh - 80px) * .5625); }
</style>
<body data-mode="preview">
  <div class="controls">
    <button type="button">Play</button>
    <input aria-label="Frame" type="range" min="0" max="299" value="0">
  </div>
  <main id="stage" aria-label="Character preview"></main>
  <script type="module" src="../render/frame.js"></script>
</body>
</html>

```

### `demo/index.html`

```html
<!doctype html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>PuppetKit 2D Demo</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#171717;color:#f4f4f4;font:14px system-ui;display:grid;grid-template-columns:1fr 280px;min-height:100vh}#stage{min-height:100vh;overflow:hidden}aside{padding:22px;background:#242424;display:flex;flex-direction:column;gap:12px}button,label{padding:10px 12px;border:1px solid #555;border-radius:8px;background:#333;color:#fff;cursor:pointer}button:hover,label:hover{background:#444}small{color:#bbb;line-height:1.5}#status{color:#b9d6c2;line-height:1.5}@media(max-width:700px){body{grid-template-columns:1fr}#stage{min-height:65vh}aside{min-height:35vh}}
</style></head>
<body><main id="stage"></main><aside><h2>PuppetKit 2D</h2><label>Import character image<input id="imageFile" type="file" accept="image/*" hidden></label><p><b>Animation</b></p><button data-animation="idle">Idle</button><button data-animation="talking">Talking</button><button data-animation="nod">Nod</button><button data-animation="wave">Wave</button><button data-animation="shake">Head shake</button><button data-animation="tilt">Head tilt</button><button data-animation="point">Point</button><button data-animation="shrug">Shrug</button><button data-animation="clap">Clap</button><button data-animation="laugh">Laugh</button><button data-animation="walk">Walk</button><button data-animation="surprised">Surprise motion</button><p><b>Expression</b></p><button data-expression="neutral">Neutral</button><button data-expression="happy">Happy</button><button data-expression="surprised">Surprised</button><button data-expression="sad">Sad</button><button data-expression="angry">Angry</button><button data-expression="excited">Excited</button><button data-expression="confused">Confused</button><small id="status">Import an image. The example manifest uses placeholder masks; trace polygons in manifest.example.js for your character.</small><small>Demo is a starter rig. A single flat image must be manually segmented into transparent layers/masks for convincing articulated motion.</small></aside><script type="module" src="./main.js"></script></body></html>

```

### `demo/main.js`

```javascript
import { PuppetEngine, PuppetCharacter } from '../src/index.js';
import { characterManifest } from './manifest.example.js';

const stage = document.querySelector('#stage');
const engine = new PuppetEngine({ container: stage, background: 0xf2e9df });
const fileInput = document.querySelector('#imageFile');
const status = document.querySelector('#status');
let character;

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    if (character) { engine.remove(character); character.dispose(); }
    character = await PuppetCharacter.create({ image: file, manifest: characterManifest, worldHeight: 2.0 });
    engine.add(character); status.textContent = `Loaded ${file.name}. Edit manifest.example.js polygons to match this image.`;
  } catch (error) { status.textContent = error.message; }
});

document.querySelectorAll('[data-animation]').forEach(button => button.addEventListener('click', () => character?.play(button.dataset.animation, { loop: button.dataset.animation === 'idle' || button.dataset.animation === 'talking' })));
document.querySelectorAll('[data-expression]').forEach(button => button.addEventListener('click', () => character?.expression(button.dataset.expression)));
engine.start();
window.addEventListener('beforeunload', () => engine.dispose());

```

### `demo/generic-manifest.js`

```javascript
// Generic atlas rig manifest. Coordinates normalized to atlas.
export const genericManifest = {
  "name": "PuppetKitGeneric",
  "parts": [
    {
      "name": "head",
      "polygon": [
        {
          "x": 0.0,
          "y": 0.0
        },
        {
          "x": 0.25,
          "y": 0.0
        },
        {
          "x": 0.25,
          "y": 0.25
        },
        {
          "x": 0.0,
          "y": 0.25
        }
      ],
      "pivot": {
        "x": 0.125,
        "y": 0.125
      },
      "parent": null,
      "z": 1
    },
    {
      "name": "body",
      "polygon": [
        {
          "x": 0.25,
          "y": 0.0
        },
        {
          "x": 0.5,
          "y": 0.0
        },
        {
          "x": 0.5,
          "y": 0.25
        },
        {
          "x": 0.25,
          "y": 0.25
        }
      ],
      "pivot": {
        "x": 0.375,
        "y": 0.125
      },
      "parent": null,
      "z": 2
    },
    {
      "name": "leftUpperArm",
      "polygon": [
        {
          "x": 0.5,
          "y": 0.0
        },
        {
          "x": 0.75,
          "y": 0.0
        },
        {
          "x": 0.75,
          "y": 0.25
        },
        {
          "x": 0.5,
          "y": 0.25
        }
      ],
      "pivot": {
        "x": 0.625,
        "y": 0.0325
      },
      "parent": null,
      "z": 3
    },
    {
      "name": "rightUpperArm",
      "polygon": [
        {
          "x": 0.75,
          "y": 0.0
        },
        {
          "x": 1.0,
          "y": 0.0
        },
        {
          "x": 1.0,
          "y": 0.25
        },
        {
          "x": 0.75,
          "y": 0.25
        }
      ],
      "pivot": {
        "x": 0.875,
        "y": 0.0325
      },
      "parent": null,
      "z": 4
    },
    {
      "name": "leftForearm",
      "polygon": [
        {
          "x": 0.0,
          "y": 0.25
        },
        {
          "x": 0.25,
          "y": 0.25
        },
        {
          "x": 0.25,
          "y": 0.5
        },
        {
          "x": 0.0,
          "y": 0.5
        }
      ],
      "pivot": {
        "x": 0.125,
        "y": 0.28
      },
      "parent": "leftUpperArm",
      "z": 5
    },
    {
      "name": "rightForearm",
      "polygon": [
        {
          "x": 0.25,
          "y": 0.25
        },
        {
          "x": 0.5,
          "y": 0.25
        },
        {
          "x": 0.5,
          "y": 0.5
        },
        {
          "x": 0.25,
          "y": 0.5
        }
      ],
      "pivot": {
        "x": 0.375,
        "y": 0.28
      },
      "parent": "rightUpperArm",
      "z": 6
    },
    {
      "name": "leftHand",
      "polygon": [
        {
          "x": 0.5,
          "y": 0.25
        },
        {
          "x": 0.75,
          "y": 0.25
        },
        {
          "x": 0.75,
          "y": 0.5
        },
        {
          "x": 0.5,
          "y": 0.5
        }
      ],
      "pivot": {
        "x": 0.625,
        "y": 0.3
      },
      "parent": "leftForearm",
      "z": 7
    },
    {
      "name": "rightHand",
      "polygon": [
        {
          "x": 0.75,
          "y": 0.25
        },
        {
          "x": 1.0,
          "y": 0.25
        },
        {
          "x": 1.0,
          "y": 0.5
        },
        {
          "x": 0.75,
          "y": 0.5
        }
      ],
      "pivot": {
        "x": 0.875,
        "y": 0.3
      },
      "parent": "rightForearm",
      "z": 8
    },
    {
      "name": "leftLeg",
      "polygon": [
        {
          "x": 0.0,
          "y": 0.5
        },
        {
          "x": 0.25,
          "y": 0.5
        },
        {
          "x": 0.25,
          "y": 0.75
        },
        {
          "x": 0.0,
          "y": 0.75
        }
      ],
      "pivot": {
        "x": 0.125,
        "y": 0.53
      },
      "parent": null,
      "z": 9
    },
    {
      "name": "rightLeg",
      "polygon": [
        {
          "x": 0.25,
          "y": 0.5
        },
        {
          "x": 0.5,
          "y": 0.5
        },
        {
          "x": 0.5,
          "y": 0.75
        },
        {
          "x": 0.25,
          "y": 0.75
        }
      ],
      "pivot": {
        "x": 0.375,
        "y": 0.53
      },
      "parent": null,
      "z": 10
    },
    {
      "name": "leftFoot",
      "polygon": [
        {
          "x": 0.5,
          "y": 0.5
        },
        {
          "x": 0.75,
          "y": 0.5
        },
        {
          "x": 0.75,
          "y": 0.75
        },
        {
          "x": 0.5,
          "y": 0.75
        }
      ],
      "pivot": {
        "x": 0.625,
        "y": 0.625
      },
      "parent": "leftLeg",
      "z": 11
    },
    {
      "name": "rightFoot",
      "polygon": [
        {
          "x": 0.75,
          "y": 0.5
        },
        {
          "x": 1.0,
          "y": 0.5
        },
        {
          "x": 1.0,
          "y": 0.75
        },
        {
          "x": 0.75,
          "y": 0.75
        }
      ],
      "pivot": {
        "x": 0.875,
        "y": 0.625
      },
      "parent": "rightLeg",
      "z": 12
    },
    {
      "name": "eyes",
      "polygon": [
        {
          "x": 0.0,
          "y": 0.75
        },
        {
          "x": 0.25,
          "y": 0.75
        },
        {
          "x": 0.25,
          "y": 1.0
        },
        {
          "x": 0.0,
          "y": 1.0
        }
      ],
      "pivot": {
        "x": 0.125,
        "y": 0.875
      },
      "parent": "head",
      "z": 13
    },
    {
      "name": "brows",
      "polygon": [
        {
          "x": 0.25,
          "y": 0.75
        },
        {
          "x": 0.5,
          "y": 0.75
        },
        {
          "x": 0.5,
          "y": 1.0
        },
        {
          "x": 0.25,
          "y": 1.0
        }
      ],
      "pivot": {
        "x": 0.375,
        "y": 0.875
      },
      "parent": "head",
      "z": 14
    },
    {
      "name": "mouth",
      "polygon": [
        {
          "x": 0.5,
          "y": 0.75
        },
        {
          "x": 0.75,
          "y": 0.75
        },
        {
          "x": 0.75,
          "y": 1.0
        },
        {
          "x": 0.5,
          "y": 1.0
        }
      ],
      "pivot": {
        "x": 0.625,
        "y": 0.875
      },
      "parent": "head",
      "z": 15
    },
    {
      "name": "hairFront",
      "polygon": [
        {
          "x": 0.75,
          "y": 0.75
        },
        {
          "x": 1.0,
          "y": 0.75
        },
        {
          "x": 1.0,
          "y": 1.0
        },
        {
          "x": 0.75,
          "y": 1.0
        }
      ],
      "pivot": {
        "x": 0.875,
        "y": 0.8625
      },
      "parent": "head",
      "z": 16
    }
  ],
  "expressions": {
    "neutral": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "happy": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "surprised": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "sad": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "angry": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "excited": { "eyes": true, "brows": true, "mouth": true },
    "confused": { "eyes": true, "brows": true, "mouth": true }
  }
};

```

### `presets/catalog.json`

```json
{
  "idle": {
    "character": "heroine",
    "note": "Existing slow standing animation"
  },
  "sit": {
    "character": "heroine-sit",
    "frames": 150,
    "fps": 30
  },
  "walk": {
    "character": "heroine-walk",
    "frames": 150,
    "fps": 30,
    "module": "presets/walk.js",
    "factory": "createWalkPreset"
  },
  "walk-loop": {
    "character": "heroine-walk-loop",
    "cycleFrames": 42,
    "fps": 30,
    "module": "presets/walk.js",
    "factory": "createWalkPreset",
    "options": {
      "loop": true,
      "travel": false,
      "start": 0,
      "startXPx": 0
    }
  },
  "gaze-left-right": {
    "character": "heroine-gaze",
    "frames": 150,
    "fps": 30,
    "module": "presets/gaze.js",
    "factory": "createGazePreset",
    "composable": true
  }
}
```

### `presets/walk.js`

```javascript
// Deterministic walk preset. All distances are preview pixels unless marked artwork.
// This adapter expects the heroine rig's hip/thigh/shin/foot joint naming convention.
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const integral=z=>z*z*z-.5*z*z*z*z;
function progress(u,a=.12){
 u=clamp(u);
 const I=u<a?a*integral(u/a):u>1-a?1-a-a*integral((1-u)/a):u-a/2;
 return I/(1-a);
}
export function createWalkPreset(options={}){
 const o={start:.4,duration:4.2,cycleSeconds:1.4,stridePx:50,liftPx:78,
  direction:1,travel:true,startXPx:-75,pixelsPerArt:.54,loop:false,
  thighLength:277,shinLength:393,hipY:850,floorY:1520,...options};
 for(const k of ['duration','cycleSeconds','stridePx','pixelsPerArt','thighLength','shinLength'])
  if(!(Number.isFinite(o[k])&&o[k]>0))throw new RangeError(`Invalid ${k}`);
 if(![1,-1].includes(o.direction))throw new RangeError('direction must be 1 or -1');
 const cycles=o.duration/o.cycleSeconds;
 if(!o.loop&&Math.abs(cycles-Math.round(cycles))>1e-6)
  throw new RangeError('Finite idle-to-idle preview requires duration/cycleSeconds to be an integer');
 const stride=o.stridePx/o.pixelsPerArt, lift=o.liftPx/o.pixelsPerArt;
 return function poseAt(t){
  const u=(t-o.start)/o.duration;
  const g=o.loop?(t-o.start)/o.cycleSeconds:cycles*progress(u);
  const env=o.loop?1:smooth(u/.12)*smooth((1-u)/.12);
  const rootX=o.direction*stride*g;
  const drop=env*(25+7*Math.cos(4*Math.PI*g));
  const bodyTurn=o.direction*(-2.5*env)+.8*env*Math.sin(2*Math.PI*g);
  const angle=bodyTurn*Math.PI/180,dropBody=drop+133*(1-Math.cos(angle));
  const solve=(hx,offset)=>{
   const z=g+offset,n=Math.floor(z+1e-10),phase=z-n,duty=.6;
   const swing=phase>=duty,sw=smooth((phase-duty)/(1-duty));
   const advance=n+(swing?sw:0);
   const footLift=swing?lift*Math.pow(Math.sin(Math.PI*clamp((phase-duty)/(1-duty))),1.25):0;
   const A=[hx+o.direction*stride*advance,o.floorY-footLift];
   const H=[255+(hx-255)*Math.cos(angle)+133*Math.sin(angle)+rootX,
      717-(hx-255)*Math.sin(angle)+133*Math.cos(angle)+dropBody];
   const dx=A[0]-H[0],dy=A[1]-H[1],raw=Math.hypot(dx,dy);
   const d=Math.min(o.thighLength+o.shinLength-1e-7,Math.max(1,raw));
   const bend=Math.acos(clamp((o.thighLength**2+d*d-o.shinLength**2)/(2*o.thighLength*d)));
   const th=Math.atan2(dx,dy)+o.direction*bend;
   const K=[H[0]+o.thighLength*Math.sin(th),H[1]+o.thighLength*Math.cos(th)];
   const sh=Math.atan2(A[0]-K[0],A[1]-K[1]);
   const deg=180/Math.PI;
   return {turns:[th*deg-bodyTurn,(sh-th)*deg,-sh*deg],H,K,A,
      contact:!swing,lift:footLift,reach:raw,phase};
  };
  const L=solve(190,0),R=solve(320,.5);
  const sway=env*Math.sin(2*Math.PI*g);
  const translation=o.travel?rootX:0;
  return {
   x:o.startXPx+translation*o.pixelsPerArt,y:-dropBody*o.pixelsPerArt,
   turns:{body:bodyTurn,thighL:L.turns[0],shinL:L.turns[1],footL:L.turns[2],
    thighR:R.turns[0],shinR:R.turns[1],footR:R.turns[2],
    leftUpperArm:-12-15*sway,rightUpperArm:12+15*sway,
    leftForearm:6+6*env-2*sway,rightForearm:-6-6*env-2*sway,
    leftHand:-2-3*sway,rightHand:2-3*sway,
    head:-bodyTurn+.9*Math.sin(o.loop?2*Math.PI*g:t*3.1),neck:0,
    braidL:env*6*Math.sin(2*Math.PI*g-.65),braidR:env*5*Math.sin(2*Math.PI*g-.9)},
   show:{skirt:true,thighL:true,shinL:true,footL:true,thighR:true,shinR:true,footR:true},
   expression:'neutral',blink:o.loop?(g-Math.floor(g))>.91:[.23,2.45,4.78].some(b=>Math.abs(t-b)<.045),
   meta:{phase:g,envelope:env,rootX,travelPx:translation*o.pixelsPerArt,L,R}
  };
 };
}

```

### `presets/heroine-eye-rig.js`

```javascript
// Original almond-eye silhouette and original palette; only irises move.
export default {
 offset:{x:242,y:160}, travel:{x:14,y:3},
 white:'#fff5e9',iris:'#382218',pupil:'#140e10',glint:'#ffffff',
 eyes:[
  {cx:203,cy:244,path:'M166 242 Q202 215 237 251 Q202 259 169 246Z'},
  {cx:318,cy:244,path:'M285 251 Q310 218 351 242 Q326 259 285 251Z'}
 ],
 lidPath:'M163 235 L169 242 Q202 215 237 251 M285 251 Q312 218 350 242 L357 235',
 irisRadius:{x:13,y:11},pupilRadius:{x:7,y:9},
};

```

### `presets/gaze.js`

```javascript
// Composable normalized eye motion; no body/head movement or character geometry here.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=x=>x*x*(3-2*x);
export function createGazePreset(options={}){
 const o={duration:5,amount:1,loop:false,blinkTimes:[.3,2.15,4.4],blinkSeconds:.13,
  keyframes:[{t:0,x:0},{t:.6,x:0},{t:.8,x:-1},{t:1.75,x:-1},
   {t:2.05,x:0},{t:2.4,x:1},{t:3.55,x:1},{t:3.85,x:0},{t:5,x:0}],...options};
 if(!(o.duration>0&&Number.isFinite(o.duration)))throw new RangeError('duration must be positive');
 const keys=o.keyframes.map(k=>({t:k.t,x:clamp(k.x??0,-1,1),y:clamp(k.y??0,-1,1)}));
 if(keys.length<2||keys.some((k,i)=>!Number.isFinite(k.t)||(i&&k.t<=keys[i-1].t)))throw new RangeError('Use at least two ascending keyframes');
 if(!Number.isFinite(o.amount)||o.amount<0||o.amount>1)throw new RangeError('amount must be 0..1');
 return t=>{
  const local=o.loop?((t%o.duration)+o.duration)%o.duration:clamp(t,0,o.duration);
  let j=keys.findIndex(k=>k.t>=local);if(j<0)j=keys.length-1;
  const b=keys[j],a=keys[Math.max(0,j-1)];
  const u=a===b?0:smooth(clamp((local-a.t)/(b.t-a.t),0,1));
  return {gaze:{x:(a.x+(b.x-a.x)*u)*o.amount,y:(a.y+(b.y-a.y)*u)*o.amount},
   blink:o.blinkTimes.some(c=>Math.abs(local-c)<o.blinkSeconds/2)};
 };
}

```

### `src/index.js`

```javascript
export { PuppetEngine } from './core/puppet-engine.js';
export { PuppetCharacter } from './core/puppet-character.js';
export { PuppetSkeleton } from './rig/skeleton.js';
export { PuppetPart } from './rig/part.js';
export { Timeline } from './animation/timeline.js';
export { AnimationLibrary } from './animation/library.js';
export { loadCharacterImage, createPartTexture } from './assets/image-loader.js';

```

### `src/core/puppet-character.js`

```javascript
import { loadCharacterImage } from '../assets/image-loader.js';
import { PuppetSkeleton } from '../rig/skeleton.js';
import { AnimationLibrary } from '../animation/library.js';
import { degToRad } from '../utils/math.js';

export class PuppetCharacter {
  static async create({ image, manifest, ...options }) {
    const decoded = await loadCharacterImage(image);
    const layers = await Promise.all(manifest.parts.filter(part => part.image).map(async part =>
      [part.name, await loadCharacterImage(part.image)]));
    options.partImages = new Map(layers);
    return new PuppetCharacter(decoded, manifest, options);
  }
  constructor(image, manifest, options = {}) {
    if (!manifest?.parts?.length) throw new Error('PuppetKit: manifest.parts is required.');
    this.skeleton = new PuppetSkeleton(image, manifest, options);
    this.root = this.skeleton.root;
    this.current = null;
    this.expressionState = 'neutral';
    this._blinkTimer = 0;
    this._blinkClosed = 0;
    this._faceBase = new Map();
    for (const name of ['eyes','brows','mouth']) { const g=this.skeleton.get(name)?.group; if(g) this._faceBase.set(name,{scaleY:g.scale.y, rotation:g.rotation.z, y:g.position.y}); }
  }
  play(name, options = {}) {
    const factory = AnimationLibrary[name];
    if (!factory) throw new Error(`Unknown animation "${name}". Available: ${Object.keys(AnimationLibrary).join(', ')}`);
    this.current?.stop();
    this.current = factory(this.skeleton).play(options);
    return this;
  }
  stop() { this.current?.stop(); this.current = null; return this; }
  pause() { this.current?.pause(); return this; }
  update(delta) {
    this.current?.update(delta);
    this._blinkTimer += delta;
    if (this._blinkClosed > 0) { this._blinkClosed -= delta; if (this._blinkClosed <= 0) { const eyes=this.skeleton.get('eyes')?.group; if(eyes) eyes.scale.y=this._faceBase.get('eyes')?.scaleY ?? 1; } }
    if (this._blinkTimer > 3.2) { this._blinkTimer = 0; this.blink(); }
  }
  blink() {
    const eyes = this.skeleton.get('eyes')?.group;
    if (!eyes) return this;
    eyes.scale.y = (this._faceBase.get('eyes')?.scaleY ?? 1) * 0.08;
    this._blinkClosed = 0.11;
    return this;
  }
  expression(name) {
    const map = this.skeleton.manifest.expressions?.[name];
    if (!map) throw new Error(`Unknown expression "${name}".`);
    // Optional swap layers: eyes_happy, mouth_sad, brows_angry, etc.
    for (const base of ['eyes','brows','mouth']) {
      const variants = [...this.skeleton.parts.keys()].filter(k => k.startsWith(`${base}_`));
      if (variants.length) {
        this.skeleton.setVisible(base, false);
        for (const variant of variants) this.skeleton.setVisible(variant, variant === `${base}_${name}`);
      }
    }
    for (const [partName, visible] of Object.entries(map)) this.skeleton.setVisible(partName, visible);
    const eyes=this.skeleton.get('eyes')?.group, brows=this.skeleton.get('brows')?.group, mouth=this.skeleton.get('mouth')?.group;
    const pose = { happy:{eye:1,brow:-.06,mouth:.08}, sad:{eye:.88,brow:.12,mouth:-.08}, angry:{eye:.78,brow:-.18,mouth:-.03}, surprised:{eye:1.18,brow:-.22,mouth:.13}, neutral:{eye:1,brow:0,mouth:0}, excited:{eye:1.12,brow:-.12,mouth:.12}, confused:{eye:1,brow:.1,mouth:.02} }[name] || {eye:1,brow:0,mouth:0};
    const eb=this._faceBase.get('eyes'), bb=this._faceBase.get('brows'), mb=this._faceBase.get('mouth');
    if(eyes && eb) eyes.scale.y=eb.scaleY*pose.eye;
    if(brows && bb) brows.rotation.z=bb.rotation+pose.brow;
    if(mouth && mb) mouth.position.y=mb.y+pose.mouth;
    this.expressionState = name;
    return this;
  }
  gesture(name, options={}) { return this.play(name, options); }
  headRotate(degrees) { this.skeleton.setRotation('head', degrees); return this; }
  armRotate(side, degrees) { this.skeleton.setRotation(side === 'left' ? 'leftArm' : 'rightArm', degrees); return this; }
  dispose() { this.stop(); this.skeleton.dispose(); }
}

```

### `src/core/puppet-engine.js`

```javascript
import * as THREE from 'three';

export class PuppetEngine {
  constructor({ container, background = 0xf4eee7, antialias = true } = {}) {
    if (!container) throw new Error('PuppetKit: pass a DOM container.');
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(background);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    this.camera.position.set(0, 0, 10);
    this.renderer = new THREE.WebGLRenderer({ antialias, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);
    this.container = container; this.characters = new Set(); this.clock = new THREE.Clock(); this.running = false;
    this._resize = () => this.resize();
    window.addEventListener('resize', this._resize); this.resize();
  }
  add(character) { this.characters.add(character); this.scene.add(character.root); return character; }
  remove(character) { this.characters.delete(character); this.scene.remove(character.root); }
  resize() {
    const w = this.container.clientWidth || 640, h = this.container.clientHeight || 480;
    const aspect = w / h; const viewHeight = 2.4;
    this.camera.left = -viewHeight * aspect / 2; this.camera.right = viewHeight * aspect / 2;
    this.camera.top = viewHeight / 2; this.camera.bottom = -viewHeight / 2;
    this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h, false);
  }
  start() { if (this.running) return; this.running = true; this.clock.start(); const frame = () => { if (!this.running) return; requestAnimationFrame(frame); const dt = Math.min(this.clock.getDelta(), 0.05); for (const c of this.characters) c.update(dt); this.renderer.render(this.scene, this.camera); }; frame(); }
  stop() { this.running = false; }
  dispose() { this.stop(); window.removeEventListener('resize', this._resize); for (const c of this.characters) c.dispose(); this.characters.clear(); this.renderer.dispose(); this.renderer.domElement.remove(); }
}

```

### `src/assets/image-loader.js`

```javascript
/** Load an image from a File, URL, or already decoded HTMLImageElement. */
export async function loadCharacterImage(input) {
  if (input instanceof HTMLImageElement) {
    if (!input.complete) await new Promise((resolve, reject) => { input.onload = resolve; input.onerror = reject; });
    return input;
  }
  let url = input;
  let revoke = false;
  if (input instanceof Blob) { url = URL.createObjectURL(input); revoke = true; }
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;
  try {
    await image.decode();
    return image;
  } finally {
    if (revoke) URL.revokeObjectURL(url);
  }
}

/**
 * Part definition coordinates are normalized to the original image (0..1).
 * polygon is an array of {x,y}; pivot is normalized image-space coordinates.
 */
export function createPartTexture(image, definition) {
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;
  const points = definition.polygon.map(p => ({ x: p.x * w, y: p.y * h }));
  const minX = Math.max(0, Math.floor(Math.min(...points.map(p => p.x))));
  const minY = Math.max(0, Math.floor(Math.min(...points.map(p => p.y))));
  const maxX = Math.min(w, Math.ceil(Math.max(...points.map(p => p.x))));
  const maxY = Math.min(h, Math.ceil(Math.max(...points.map(p => p.y))));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, maxX - minX);
  canvas.height = Math.max(1, maxY - minY);
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.beginPath();
  points.forEach((p, i) => i ? ctx.lineTo(p.x - minX, p.y - minY) : ctx.moveTo(p.x - minX, p.y - minY));
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, minX, minY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  ctx.restore();
  return { canvas, bounds: { minX, minY, width: canvas.width, height: canvas.height }, imageSize: { width: w, height: h } };
}

```

### `src/animation/library.js`

```javascript
import { Timeline } from './timeline.js';
import { degToRad } from '../utils/math.js';

const add = (t, skeleton, name, prop, frames, easing='smooth') => {
  const target = skeleton.get(name)?.group;
  if (target) t.addTrack(target, prop, frames, { easing });
};
const value = (s, n, prop) => {
  const g=s.get(n)?.group; return g ? (prop==='rotation' ? g.rotation.z : g.position[prop]) : 0;
};
const make = (duration, build) => s => { const t=new Timeline(); t.duration=duration; build(t,s); return t; };

export const AnimationLibrary = {
  idle: make(2,(t,s)=>{
    const by=value(s,'body','y'), hr=value(s,'head','rotation');
    add(t,s,'body','y',[{time:0,value:by},{time:1,value:by+.012},{time:2,value:by}]);
    add(t,s,'head','rotation',[{time:0,value:hr},{time:1,value:hr+degToRad(1.5)},{time:2,value:hr}]);
  }),
  breathing: make(3,(t,s)=>{const y=value(s,'body','y'); add(t,s,'body','y',[{time:0,value:y},{time:1.5,value:y+.018},{time:3,value:y}]);}),
  talking: make(.48,(t,s)=>{const y=value(s,'mouth','y'), sy=s.get('mouth')?.group?.scale.y??1; add(t,s,'mouth','y',[{time:0,value:y},{time:.12,value:y-.004},{time:.24,value:y},{time:.36,value:y-.006},{time:.48,value:y}]); const m=s.get('mouth')?.group; if(m) t.addTrack(m.scale,'y',[{time:0,value:sy},{time:.12,value:sy*1.7},{time:.24,value:sy},{time:.36,value:sy*1.45},{time:.48,value:sy}]);}),
  nod: make(.7,(t,s)=>{const r=value(s,'head','rotation'); add(t,s,'head','rotation',[{time:0,value:r},{time:.2,value:r-degToRad(8)},{time:.42,value:r+degToRad(2)},{time:.7,value:r}]);}),
  shake: make(.65,(t,s)=>{const r=value(s,'head','rotation'); add(t,s,'head','rotation',[{time:0,value:r},{time:.16,value:r-degToRad(9)},{time:.32,value:r+degToRad(9)},{time:.48,value:r-degToRad(6)},{time:.65,value:r}]);}),
  tilt: make(.5,(t,s)=>{const r=value(s,'head','rotation'); add(t,s,'head','rotation',[{time:0,value:r},{time:.25,value:r+degToRad(12)},{time:.5,value:r}]);}),
  wave: make(1.1,(t,s)=>{const r=value(s,'rightUpperArm','rotation'); add(t,s,'rightUpperArm','rotation',[{time:0,value:r},{time:.25,value:r-degToRad(32)},{time:.45,value:r+degToRad(12)},{time:.65,value:r-degToRad(32)},{time:.85,value:r+degToRad(12)},{time:1.1,value:r}]);}),
  point: make(.7,(t,s)=>{const r=value(s,'rightUpperArm','rotation'); add(t,s,'rightUpperArm','rotation',[{time:0,value:r},{time:.3,value:r-degToRad(48)},{time:.7,value:r}]);}),
  shrug: make(.9,(t,s)=>{for(const n of ['leftUpperArm','rightUpperArm']){const r=value(s,n,'rotation'),d=n.startsWith('left')?-.45:.45;add(t,s,n,'rotation',[{time:0,value:r},{time:.3,value:r+d},{time:.65,value:r+d},{time:.9,value:r}]);}}),
  clap: make(.65,(t,s)=>{for(const n of ['leftUpperArm','rightUpperArm']){const r=value(s,n,'rotation'),d=n.startsWith('left')?.65:-.65;add(t,s,n,'rotation',[{time:0,value:r},{time:.28,value:r+d},{time:.42,value:r+d*.7},{time:.65,value:r}]);}}),
  recoil: make(.55,(t,s)=>{const x=value(s,'body','x');add(t,s,'body','x',[{time:0,value:x},{time:.12,value:x-.08},{time:.3,value:x+.025},{time:.55,value:x}]);}),
  laugh: make(.8,(t,s)=>{const y=value(s,'body','y'),r=value(s,'head','rotation');add(t,s,'body','y',[{time:0,value:y},{time:.2,value:y+.025},{time:.4,value:y-.005},{time:.6,value:y+.025},{time:.8,value:y}]);add(t,s,'head','rotation',[{time:0,value:r},{time:.25,value:r+degToRad(5)},{time:.55,value:r-degToRad(3)},{time:.8,value:r}]);}),
  walk: make(1,(t,s)=>{for(const [n,d] of [['leftLeg',1],['rightLeg',-1]]){const r=value(s,n,'rotation');add(t,s,n,'rotation',[{time:0,value:r},{time:.25,value:r+degToRad(18*d)},{time:.5,value:r},{time:.75,value:r-degToRad(18*d)},{time:1,value:r}],'linear');}}),
  surprised: make(.45,(t,s)=>{const y=value(s,'body','y'),r=value(s,'head','rotation');add(t,s,'body','y',[{time:0,value:y},{time:.12,value:y-.035},{time:.45,value:y}]);add(t,s,'head','rotation',[{time:0,value:r},{time:.12,value:r-degToRad(5)},{time:.45,value:r}]);})
};

```

### `src/animation/timeline.js`

```javascript
import { clamp, lerp, easeInOut } from '../utils/math.js';

export class Timeline {
  constructor() { this.tracks = []; this.duration = 1; this.loop = false; this.elapsed = 0; this.playing = false; this.speed = 1; }
  addTrack(target, property, keyframes, options = {}) {
    const frames = [...keyframes].sort((a, b) => a.time - b.time);
    this.tracks.push({ target, property, frames, easing: options.easing || 'linear' });
    this.duration = Math.max(this.duration, frames.at(-1)?.time || 0);
    return this;
  }
  play({ loop = false, speed = 1, restart = true } = {}) { this.loop = loop; this.speed = speed; this.playing = true; if (restart) this.elapsed = 0; return this; }
  stop() { this.playing = false; this.elapsed = 0; }
  pause() { this.playing = false; }
  update(delta) {
    if (!this.playing) return;
    this.elapsed += delta * this.speed;
    if (this.elapsed >= this.duration) {
      if (this.loop) this.elapsed %= this.duration;
      else { this.elapsed = this.duration; this.playing = false; }
    }
    const t = this.elapsed;
    for (const track of this.tracks) {
      const { frames, target, property } = track;
      if (!frames.length || !target) continue;
      let a = frames[0], b = frames.at(-1);
      for (let i = 0; i < frames.length - 1; i++) if (t >= frames[i].time && t <= frames[i + 1].time) { a = frames[i]; b = frames[i + 1]; break; }
      const span = Math.max(0.00001, b.time - a.time);
      let p = clamp((t - a.time) / span, 0, 1);
      if (track.easing === 'smooth') p = easeInOut(p);
      const value = lerp(a.value, b.value, p);
      if (property === 'rotation') target.rotation.z = value;
      else if (property === 'x' || property === 'y') target.position[property] = value;
      else target[property] = value;
    }
  }
}

```

### `src/animation/gaze-controller.js`

```javascript
import * as THREE from 'three';
// Repaint only the existing cropped eyes texture. Fixed masks/lids; clipped moving irises.
export function createGazeController(puppet,rig){
 if(!rig)return null;
 const part=puppet.skeleton.get('eyes');if(!part)throw Error('gazeRig requires eyes part');
 const {bounds}=part,canvas=document.createElement('canvas');
 canvas.width=bounds.width;canvas.height=bounds.height;
 const ctx=canvas.getContext('2d');
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const originalMap=part.mesh.material.map;
 const masks=rig.eyes.map(e=>new Path2D(e.path)),lid=new Path2D(rig.lidPath);
 let last={x:0,y:0};
 const ellipse=(x,y,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,2*Math.PI);ctx.fill();};
 return {
  apply(gaze){
   if(!gaze){if(part.mesh.material.map!==originalMap){part.mesh.material.map=originalMap;part.mesh.material.needsUpdate=true;}return;}
   if(part.mesh.material.map!==texture){part.mesh.material.map=texture;part.mesh.material.needsUpdate=true;}
   const x=Math.max(-1,Math.min(1,gaze.x??0)),y=Math.max(-1,Math.min(1,gaze.y??0));
   last={x,y};ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
   ctx.translate(rig.offset.x-bounds.minX,rig.offset.y-bounds.minY);
   for(let i=0;i<rig.eyes.length;i++){
    const e=rig.eyes[i],cx=e.cx+x*rig.travel.x,cy=e.cy+y*rig.travel.y;
    ctx.fillStyle=rig.white;ctx.fill(masks[i]);ctx.save();ctx.clip(masks[i]);
    ellipse(cx,cy,rig.irisRadius.x,rig.irisRadius.y,rig.iris);
    ellipse(cx+1,cy+1,rig.pupilRadius.x,rig.pupilRadius.y,rig.pupil);
    ellipse(cx+4,cy-3,2.8,3.2,rig.glint);ctx.restore();
   }
   ctx.strokeStyle=rig.pupil;ctx.lineWidth=5;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke(lid);
   texture.needsUpdate=true;
  },
  snapshot(){return {gaze:last,irisCenters:rig.eyes.map(e=>({x:e.cx+last.x*rig.travel.x,y:e.cy+last.y*rig.travel.y})),width:canvas.width,height:canvas.height};}
 };
}

```

### `src/rig/skeleton.js`

```javascript
import * as THREE from 'three';
import { PuppetPart } from './part.js';

export class PuppetSkeleton {
  constructor(image, manifest, options = {}) {
    this.image = image;
    this.manifest = manifest;
    this.root = new THREE.Group();
    this.root.name = manifest.name || 'PuppetCharacter';
    this.parts = new Map();
    const scale = options.worldHeight ? options.worldHeight / image.naturalHeight : 1 / image.naturalHeight;
    const ordered = manifest.absoluteDrawOrder
      ? manifest.parts
      : [...manifest.parts].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
    for (const def of ordered) {
      const parent = def.parent ? this.parts.get(def.parent) : null;
      if (def.parent && !parent) throw new Error(`Parent part '${def.parent}' must appear before '${def.name}' in manifest.parts.`);
      const source = options.partImages?.get(def.name) ?? image;
      const part = new PuppetPart(source, def, scale, parent ? parent.definition.pivot : null);
      if (manifest.absoluteDrawOrder) {
        part.group.position.z = 0;
        part.mesh.renderOrder = def.z ?? 0;
      }
      this.parts.set(def.name, part);
      (parent?.group || this.root).add(part.group);
    }
    this.imageAspect = image.naturalWidth / image.naturalHeight;
    this.worldHeight = image.naturalHeight * scale;
    this.root.scale.setScalar(options.scale ?? 1);
    this.root.position.set(...(options.position || [0, 0, 0]));
  }
  get(name) { return this.parts.get(name); }
  setVisible(name, visible) { const p = this.get(name); if (p) p.group.visible = visible; }
  setRotation(name, degrees) { const p = this.get(name); if (p) p.group.rotation.z = THREE.MathUtils.degToRad(degrees); }
  setPosition(name, x, y) { const p = this.get(name); if (p) p.group.position.set(x, y, p.group.position.z); }
  dispose() { for (const p of this.parts.values()) p.dispose(); this.parts.clear(); }
}

```

### `src/rig/part.js`

```javascript
import * as THREE from 'three';
import { createPartTexture } from '../assets/image-loader.js';

export class PuppetPart {
  constructor(image, definition, worldScale, parentPivot = null) {
    this.name = definition.name;
    this.definition = definition;
    this.group = new THREE.Group();
    this.group.name = `${definition.name}-pivot`;
    const { canvas, bounds, imageSize } = createPartTexture(image, definition);
    this.bounds = bounds;
    this.imageSize = imageSize;
    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    const width = bounds.width * worldScale;
    const height = bounds.height * worldScale;
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = `${definition.name}-image`;
    this.group.add(this.mesh);
    const pivotX = definition.pivot.x * imageSize.width;
    const pivotY = definition.pivot.y * imageSize.height;
    // Image coordinates: x right, y down. Three.js world: x right, y up.
    const originX = parentPivot ? parentPivot.x * imageSize.width : imageSize.width / 2;
    const originY = parentPivot ? parentPivot.y * imageSize.height : imageSize.height / 2;
    this.group.position.set((pivotX - originX) * worldScale, (originY - pivotY) * worldScale, definition.z ?? 0);
    const centerX = bounds.minX + bounds.width / 2;
    const centerY = bounds.minY + bounds.height / 2;
    this.mesh.position.set((centerX - pivotX) * worldScale, (pivotY - centerY) * worldScale, 0);
    this.group.rotation.z = THREE.MathUtils.degToRad(definition.rotation ?? 0);
    this.group.visible = definition.visible !== false;
  }
  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.texture.dispose();
  }
}

```

### `src/utils/math.js`

```javascript
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const degToRad = (deg) => deg * Math.PI / 180;
export const easeInOut = (t) => t * t * (3 - 2 * t);
export function normalizePoint(point, width, height) {
  return { x: point.x * width, y: point.y * height };
}

```

### `tests/fixtures/walk-f75.png`

**BASE64 PNG**

```base64
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
```

### `tests/fixtures/sit-f149.png`

**BASE64 PNG**

```base64
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
```

### `assets/heroine-walk-loop/manifest.js`

```javascript
export {default} from '../heroine-walk/manifest.js';

```

### `assets/heroine-walk-loop/room.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960">
  <path fill="#af7a43" d="M0 0h540v960H0z"/>
  <path fill="#976337" d="M0 0h540v8H0zM0 155h540v8H0zM0 310h540v8H0zM0 465h540v8H0zM0 620h540v8H0zM0 775h540v8H0z"/>
  <path fill="none" stroke="#734b2e" stroke-width="3" d="M0 8h540M0 163h540M0 318h540M0 473h540M0 628h540M0 783h540"/>
  <path fill="none" stroke="#976337" stroke-width="2" d="M18 54q34-4 68 0t70 0m35 31q40 4 78 0m84 33q39-4 76 0t74 0M12 208q42 4 81 0m55 33q46-4 91 0t70 0m96-53q45 4 82 0M33 376q49-4 94 0t74 0m38-27q35 4 70 0t80 0m79 49q40-4 72 0M15 534q39 4 77 0m66 34q40-4 79 0t77 0m83-69q48 4 93 0M26 692q35-4 69 0t71 0m48 23q45 4 88 0t78 0m62-50q47-4 86 0"/>
  <path fill="#734b2e" d="M0 805h540v155H0z"/>
  <path fill="#926238" d="M0 836h540v124H0z"/>
  <path fill="#6f5531" d="M0 767h540v66H0z"/>
  <path fill="#a5804e" d="M0 767h540v18H0z"/>
  <rect x="422" y="144" width="109" height="183" rx="3" fill="#694729"/>
  <rect x="429" y="151" width="95" height="169" fill="#6b7665"/>
  <path fill="#86917b" d="M430 152h94v8h-86v160h-8z"/>
  <g transform="translate(484 224) rotate(15)">
    <path d="M0 0Q-21 0-22-19Q-13-22 1-5Q6-27 19-25Q23-11 5 0Q21-3 19 7Q13 16 2 6Q-5 17-14 12Q-20 6 0 0Z" fill="#c48b42" stroke="#8c5c28" stroke-width="2"/>
    <path d="M1-7 3 7M1-6l-6-6m6 6 5-9" fill="none" stroke="#564027" stroke-width="2.5" stroke-linecap="round"/>
  </g>
<path fill="#b28c60" d="M0 900H540V960H0Z"/><path d="M0 900H540" fill="none" stroke="#543c29" stroke-width="4"/></svg>

```

### `assets/heroine-walk-loop/story.js`

```javascript
import {createWalkPreset} from '../../presets/walk.js';
export const poseAt=createWalkPreset({loop:true,start:0,travel:false,startXPx:0,cycleSeconds:1.4});
export const scene={bg:0xaf7a43,room:'room.svg',worldHeight:2.7};

```

### `assets/heroine-gaze/mouth_open.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z" fill="#d25a5d" stroke="#140e10" stroke-width="5"/>
    <path d="M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z" fill="#33131d" stroke="#bb4652" stroke-width="2.6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/brows.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M167 215 Q192 193 233 211 L229 221 Q198 208 167 220Z M286 205 Q316 179 346 201 L347 207 Q316 194 288 216Z" fill="#140e10" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/hairBack.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M114 181 Q139 71 246 64 Q330 56 377 133 Q401 170 413 258 L433 384 Q404 422 342 431 L180 435 Q126 428 92 388 Q77 367 90 317Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M119 201 Q133 156 162 145 Q130 283 156 343 Q172 375 209 408 L181 431 Q130 422 104 389 Q88 364 102 317Z M351 176 Q400 223 403 292 L428 382 Q409 407 365 418 Q397 372 378 311Z" fill="#28160c" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/rightHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M84 764 L85 768 M98 765 L98 771 M109 760 L112 767" fill="none" stroke="#140e10" stroke-width="2.8"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-gaze/draw.py`

```python
"""Build editable, shared-coordinate SVG cutouts from the original vector paths."""
from pathlib import Path

HERE = Path(__file__).parent
INK = '#140e10'
SKIN, SHADE, BLUSH = '#f6cfb3', '#e3a989', '#efa991'
HAIR, DEEP, GLEAM = '#382218', '#28160c', '#4b3021'
WINE, DARK = '#64101d', '#450e1b'
SKIRT, FOLD = '#383947', '#282933'


def path(d, fill='none', stroke=INK, width=6):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'


def flat(d, fill):
    return path(d, fill, 'none')


def ellipse(x, y, rx, ry, fill):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}"/>'


def save(name, *art):
    shapes = '\n    '.join(art)
    (HERE / f'{name}.svg').write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">\n'
        '  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">\n'
        f'    {shapes}\n  </g>\n</svg>\n'
    )


save('body', path('M140 428 Q169 401 223 394 L305 388 Q351 391 376 411 Q401 430 391 464 L366 510 Q350 560 329 608 L201 607 Q181 559 158 508 L133 473 Q121 451 140 428Z', SKIN),
     flat('M132 450 Q155 471 183 479 L201 516 L178 546 L147 494 Q125 476 132 450Z', SHADE),
     flat('M325 397 Q363 402 376 414 Q398 431 388 457 L371 476 Q372 431 325 397Z', SHADE),
     path('M183 462 Q208 443 232 453 M273 447 Q301 428 329 436', width=3.5))
save('neck', path('M221 316 Q251 340 295 319 L298 366 Q300 387 321 401 Q292 418 267 422 Q232 420 202 409 Q222 395 224 369Z', SKIN),
     flat('M223 325 Q264 346 294 326 L296 361 Q268 375 224 359Z', SHADE))
save('midriff', path('M187 594 Q265 602 347 587 Q322 646 338 687 L362 737 Q269 796 151 735 Q157 703 182 676 Q198 652 187 594Z', SKIN),
     flat('M190 627 L342 613 L333 649 Q267 668 193 650Z', SHADE),
     path('M249 708 Q255 700 265 698', width=4))
save('top', path('M155 522 Q212 515 247 502 Q292 484 361 479 Q371 519 355 550 Q340 585 336 632 Q279 649 187 629 Q182 590 172 569 Q160 548 155 522Z', WINE),
     flat('M160 525 Q194 524 209 516 Q200 553 220 580 Q256 608 338 612 L334 630 Q269 645 189 627 Q185 594 174 566Z', DARK),
     path('M213 567 Q235 582 270 573 M314 609 Q322 605 333 605', DARK, INK, 3))
save('skirt', path('M156 722 Q248 780 353 731 Q393 797 420 1049 Q251 1105 103 1050 Q107 859 156 722Z', SKIRT),
     flat('M158 750 L182 771 L121 1013 L111 1049 Q119 869 158 750Z M214 784 L236 788 L212 1073 L184 1069Z M300 780 L323 774 L382 1061 L352 1070Z M355 748 L365 768 Q400 864 416 1047 L400 1052 Q378 868 355 748Z', FOLD),
     path('M188 771 Q153 866 128 1054 M235 786 L208 1075 M321 773 Q350 882 381 1060', width=5),
     path('M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z', SKIRT),
     flat('M149 749 Q256 796 362 757 L366 767 Q259 813 146 760Z', FOLD),
     path('M194 742 L181 775 M328 740 L345 778', width=4))
save('hairBack', path('M114 181 Q139 71 246 64 Q330 56 377 133 Q401 170 413 258 L433 384 Q404 422 342 431 L180 435 Q126 428 92 388 Q77 367 90 317Z', HAIR),
     flat('M119 201 Q133 156 162 145 Q130 283 156 343 Q172 375 209 408 L181 431 Q130 422 104 389 Q88 364 102 317Z M351 176 Q400 223 403 292 L428 382 Q409 407 365 418 Q397 372 378 311Z', DEEP))
save('head', path('M155 184 Q173 123 235 112 Q296 99 345 161 L372 239 Q387 224 389 244 Q388 269 361 280 Q350 314 321 332 Q291 353 263 365 Q236 363 206 344 Q170 325 153 292 Q131 285 126 260 Q120 239 141 239Z', SKIN),
     flat('M151 244 Q154 302 194 328 Q225 352 264 361 Q239 361 207 343 Q171 325 154 290 Q135 282 130 260 Q128 247 136 244Z', SHADE),
     path('M140 251 Q131 253 142 268 M373 246 Q383 239 376 256', 'none', '#9c5d4b', 3.5),
     ellipse(197, 286, 18, 6, BLUSH), ellipse(328, 287, 17, 6, BLUSH),
     path('M267 250 Q270 270 276 278 L269 290', width=3.8))
save('hairFront', path('M94 340 Q102 280 108 218 Q117 106 190 80 Q231 61 270 72 Q322 58 366 108 Q408 158 414 242 L429 365 Q405 392 368 402 Q385 348 381 315 Q376 280 359 246 Q349 206 316 175 Q289 145 268 116 Q240 153 200 180 Q165 208 149 256 Q134 299 158 338 Q135 329 122 297 Q113 313 94 340Z', HAIR),
     flat('M109 244 Q119 144 181 108 Q219 86 264 87 L265 108 Q214 108 177 148 Q143 182 130 220Z M288 91 Q336 91 368 135 Q388 164 398 217 Q365 147 317 132Z', GLEAM),
     flat('M143 225 Q132 293 151 324 Q135 311 128 289Z M356 217 Q404 272 423 363 Q404 383 375 395 Q397 352 380 308Z', DEEP),
     path('M270 74 Q266 88 268 116', width=4))
save('eyes', flat('M166 242 Q202 215 237 251 Q202 259 169 246Z M285 251 Q310 218 351 242 Q326 259 285 251Z', '#fff5e9'),
     ellipse(203, 244, 13, 11, HAIR), ellipse(318, 244, 13, 11, HAIR),
     ellipse(204, 245, 7, 9, INK), ellipse(319, 245, 7, 9, INK),
     ellipse(207, 241, 2.8, 3.2, 'white'), ellipse(322, 241, 2.8, 3.2, 'white'),
     path('M163 235 L169 242 Q202 215 237 251 M285 251 Q312 218 350 242 L357 235', width=5))
save('eyes_happy', path('M171 247 Q203 225 235 251 M288 250 Q320 226 350 246', width=5))
save('eyes_closed', path('M170 243 Q198 259 234 250 M288 251 Q326 257 350 243', width=5))
save('brows', flat('M167 215 Q192 193 233 211 L229 221 Q198 208 167 220Z M286 205 Q316 179 346 201 L347 207 Q316 194 288 216Z', INK))
save('brows_raised', flat('M167 214 Q192 192 233 207 L229 218 Q196 205 167 219Z M286 194 Q315 166 344 185 L346 191 Q316 181 290 206Z', INK))
save('mole', ellipse(337, 266, 3.6, 3.8, INK))
save('mouth', path('M228 307 Q245 295 259 298 Q276 296 298 300 Q278 316 258 317 Q241 316 228 307Z', '#b63e4b', width=4),
     path('M229 307 Q262 309 296 301', width=3))
for name, d, teeth, tongue in [
    ('smile', 'M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z',
     'M226 303 Q247 296 265 299 Q285 299 302 294 Q289 308 268 309 Q246 311 226 303Z',
     'M248 315 Q267 308 287 313 Q270 326 248 315Z'),
    ('open', 'M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z',
     'M228 302 Q245 293 264 296 Q282 295 301 297 Q295 307 279 309 Q249 310 228 302Z',
     'M241 323 Q256 311 271 319 Q283 312 290 320 Q278 335 262 333 Q248 331 241 323Z'),
]:
    save(f'mouth_{name}', path(d, '#d25a5d', width=5), path(d, '#33131d', '#bb4652', 2.6))
    save(f'{name}Teeth', flat(teeth, '#fff5e9'))
    save(f'{name}Tongue', flat(tongue, '#ee7781'))


def braid(name, shift, angle):
    art = []
    for x, y in [(0, 0), (5, 44), (9, 87), (11, 128)]:
        art.append(f'<g transform="translate({x} {y})">')
        art.append(path('M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z', HAIR))
        art.append(flat('M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z', DEEP))
        art.append(path('M-22 -15 Q-6 -10 3 4 Q15 1 28 -13', width=3.2))
        art.append('</g>')
    art.extend([
        # Root band is tucked into the scalp by hairFront's higher draw order.
        path('M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z', '#21171c', width=4),
        flat('M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z', DEEP),
        path('M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z', HAIR),
        flat('M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z', DEEP),
        path('M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z', '#21171c', width=4),
    ])
    save(name, f'<g transform="{shift} rotate({angle})">', *art, '</g>')


braid('braidL', 'translate(148 346)', -3)
braid('braidR', 'translate(373 345) scale(-1 1)', -7)


def arm(side, transform):
    def layer(name, *art):
        save(side + name, f'<g transform="{transform}">', *art, '</g>')

    layer('UpperArm', path('M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z', SKIN),
          flat('M107 462 Q118 450 122 457 L114 521 L101 530Z', SHADE),
          path('M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z', WINE),
          flat('M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z', DARK))
    layer('Forearm', path('M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z', WINE),
          flat('M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z', DARK),
          path('M77 702 Q114 718 147 701', width=3.2))
    layer('Hand', path('M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z', SKIN),
          flat('M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z', SHADE),
          path('M84 764 L85 768 M98 765 L98 771 M109 760 L112 767', width=2.8))


arm('left', '')
arm('right', 'translate(510 -19) scale(-1 1)')

```

### `assets/heroine-gaze/leftUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M107 462 Q118 450 122 457 L114 521 L101 530Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-gaze/leftForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-gaze/smileTongue.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M248 315 Q267 308 287 313 Q270 326 248 315Z" fill="#ee7781" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/eyes.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M166 242 Q202 215 237 251 Q202 259 169 246Z M285 251 Q310 218 351 242 Q326 259 285 251Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
    <ellipse cx="203" cy="244" rx="13" ry="11" fill="#382218"/>
    <ellipse cx="318" cy="244" rx="13" ry="11" fill="#382218"/>
    <ellipse cx="204" cy="245" rx="7" ry="9" fill="#140e10"/>
    <ellipse cx="319" cy="245" rx="7" ry="9" fill="#140e10"/>
    <ellipse cx="207" cy="241" rx="2.8" ry="3.2" fill="white"/>
    <ellipse cx="322" cy="241" rx="2.8" ry="3.2" fill="white"/>
    <path d="M163 235 L169 242 Q202 215 237 251 M285 251 Q312 218 350 242 L357 235" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine-gaze/rightUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M107 462 Q118 450 122 457 L114 521 L101 530Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-gaze/manifest.js`

```javascript
import gazeRig from './eye-rig.js';
const point = (x, y) => ({ x: (x + 242) / 1024, y: (y + 160) / 1280 });

function layer(name, parent, z, x, y, [l, t, r, b]) {
  return {
    name, parent, z, pivot: point(x, y),
    polygon: [point(l, t), point(r, t), point(r, b), point(l, b)],
    image: new URL(`./${name}.svg`, import.meta.url).href,
  };
}

const parts = [
  layer('body', null, 12, 255, 717, [115, 375, 405, 620]),
  layer('skirt', 'body', 15, 253, 744, [95, 711, 430, 1080]),
  layer('midriff', 'body', 11, 250, 624, [143, 578, 371, 788]),
  layer('top', 'body', 18, 254, 532, [144, 471, 377, 655]),
  layer('neck', 'body', 17, 260, 405, [193, 307, 329, 462]),
  layer('head', 'neck', 30, 260, 395, [114, 100, 398, 374]),
  layer('hairBack', 'head', 3, 260, 395, [71, 51, 441, 442]),
  layer('hairFront', 'head', 35, 260, 114, [86, 54, 437, 412]),
  layer('eyes', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_happy', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_closed', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('brows', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('brows_raised', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('mouth', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('mouth_smile', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('smileTeeth', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('smileTongue', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('mouth_open', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('openTeeth', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('openTongue', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('mole', 'head', 32, 337, 266, [329, 258, 345, 274]),
  layer('braidL', 'head', 27, 149, 347, [102, 286, 222, 580]),
  layer('braidR', 'head', 27, 373, 346, [285, 285, 421, 581]),
  layer('leftUpperArm', 'body', 10, 137, 450, [84, 415, 180, 632]),
  layer('leftForearm', 'leftUpperArm', 22, 123, 593, [62, 567, 158, 735]),
  layer('leftHand', 'leftForearm', 21, 108, 718, [66, 700, 145, 807]),
  layer('rightUpperArm', 'body', 9, 373, 431, [330, 396, 426, 613]),
  layer('rightForearm', 'rightUpperArm', 25, 387, 574, [352, 548, 448, 716]),
  layer('rightHand', 'rightForearm', 24, 402, 699, [365, 681, 444, 788]),
];

function face(eye, brow, lip) {
  return Object.fromEntries([
    'eyes', 'eyes_happy', 'eyes_closed', 'brows', 'brows_raised',
    'mouth', 'mouth_smile', 'mouth_open',
  ].map(name => [name, [eye, brow, lip].includes(name)]));
}

export default {
  name: 'Heroine — eyes glance left and right',
  gazeRig,
  absoluteDrawOrder: true,
  parts,
  expressions: {
    neutral: face('eyes', 'brows', 'mouth'),
    greeting: face('eyes', 'brows_raised', 'mouth_smile'),
    laugh: face('eyes_happy', 'brows_raised', 'mouth_open'),
  },
};

```

### `assets/heroine-gaze/leftHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M84 764 L85 768 M98 765 L98 771 M109 760 L112 767" fill="none" stroke="#140e10" stroke-width="2.8"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-gaze/mouth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M228 307 Q245 295 259 298 Q276 296 298 300 Q278 316 258 317 Q241 316 228 307Z" fill="#b63e4b" stroke="#140e10" stroke-width="4"/>
    <path d="M229 307 Q262 309 296 301" fill="none" stroke="#140e10" stroke-width="3"/>
  </g>
</svg>

```

### `assets/heroine-gaze/mole.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="337" cy="266" rx="3.6" ry="3.8" fill="#140e10"/>
  </g>
</svg>

```

### `assets/heroine-gaze/room.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960">
  <path fill="#af7a43" d="M0 0h540v960H0z"/>
  <path fill="#976337" d="M0 0h540v8H0zM0 155h540v8H0zM0 310h540v8H0zM0 465h540v8H0zM0 620h540v8H0zM0 775h540v8H0z"/>
  <path fill="none" stroke="#734b2e" stroke-width="3" d="M0 8h540M0 163h540M0 318h540M0 473h540M0 628h540M0 783h540"/>
  <path fill="none" stroke="#976337" stroke-width="2" d="M18 54q34-4 68 0t70 0m35 31q40 4 78 0m84 33q39-4 76 0t74 0M12 208q42 4 81 0m55 33q46-4 91 0t70 0m96-53q45 4 82 0M33 376q49-4 94 0t74 0m38-27q35 4 70 0t80 0m79 49q40-4 72 0M15 534q39 4 77 0m66 34q40-4 79 0t77 0m83-69q48 4 93 0M26 692q35-4 69 0t71 0m48 23q45 4 88 0t78 0m62-50q47-4 86 0"/>
  <path fill="#734b2e" d="M0 805h540v155H0z"/>
  <path fill="#926238" d="M0 836h540v124H0z"/>
  <path fill="#6f5531" d="M0 767h540v66H0z"/>
  <path fill="#a5804e" d="M0 767h540v18H0z"/>
  <rect x="422" y="144" width="109" height="183" rx="3" fill="#694729"/>
  <rect x="429" y="151" width="95" height="169" fill="#6b7665"/>
  <path fill="#86917b" d="M430 152h94v8h-86v160h-8z"/>
  <g transform="translate(484 224) rotate(15)">
    <path d="M0 0Q-21 0-22-19Q-13-22 1-5Q6-27 19-25Q23-11 5 0Q21-3 19 7Q13 16 2 6Q-5 17-14 12Q-20 6 0 0Z" fill="#c48b42" stroke="#8c5c28" stroke-width="2"/>
    <path d="M1-7 3 7M1-6l-6-6m6 6 5-9" fill="none" stroke="#564027" stroke-width="2.5" stroke-linecap="round"/>
  </g>
</svg>

```

### `assets/heroine-gaze/brows_raised.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M167 214 Q192 192 233 207 L229 218 Q196 205 167 219Z M286 194 Q315 166 344 185 L346 191 Q316 181 290 206Z" fill="#140e10" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/head.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M155 184 Q173 123 235 112 Q296 99 345 161 L372 239 Q387 224 389 244 Q388 269 361 280 Q350 314 321 332 Q291 353 263 365 Q236 363 206 344 Q170 325 153 292 Q131 285 126 260 Q120 239 141 239Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M151 244 Q154 302 194 328 Q225 352 264 361 Q239 361 207 343 Q171 325 154 290 Q135 282 130 260 Q128 247 136 244Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M140 251 Q131 253 142 268 M373 246 Q383 239 376 256" fill="none" stroke="#9c5d4b" stroke-width="3.5"/>
    <ellipse cx="197" cy="286" rx="18" ry="6" fill="#efa991"/>
    <ellipse cx="328" cy="287" rx="17" ry="6" fill="#efa991"/>
    <path d="M267 250 Q270 270 276 278 L269 290" fill="none" stroke="#140e10" stroke-width="3.8"/>
  </g>
</svg>

```

### `assets/heroine-gaze/braidL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(148 346) rotate(-3)">
    <g transform="translate(0 0)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(5 44)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(9 87)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(11 128)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <path d="M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    <path d="M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-gaze/story.js`

```javascript
import {createGazePreset} from '../../presets/gaze.js';
const glance=createGazePreset();
export function poseAt(t){
 return {...glance(t),x:0,y:0,turns:{body:0,head:0,neck:0,
  leftUpperArm:0,rightUpperArm:0,leftForearm:5,rightForearm:0,
  leftHand:0,rightHand:0,braidL:0,braidR:0},expression:'neutral'};
}
export const scene={bg:0xaf7a43,room:'room.svg',worldHeight:3.2};

```

### `assets/heroine-gaze/top.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M155 522 Q212 515 247 502 Q292 484 361 479 Q371 519 355 550 Q340 585 336 632 Q279 649 187 629 Q182 590 172 569 Q160 548 155 522Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M160 525 Q194 524 209 516 Q200 553 220 580 Q256 608 338 612 L334 630 Q269 645 189 627 Q185 594 174 566Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M213 567 Q235 582 270 573 M314 609 Q322 605 333 605" fill="#450e1b" stroke="#140e10" stroke-width="3"/>
  </g>
</svg>

```

### `assets/heroine-gaze/mouth_smile.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z" fill="#d25a5d" stroke="#140e10" stroke-width="5"/>
    <path d="M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z" fill="#33131d" stroke="#bb4652" stroke-width="2.6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/midriff.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M187 594 Q265 602 347 587 Q322 646 338 687 L362 737 Q269 796 151 735 Q157 703 182 676 Q198 652 187 594Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M190 627 L342 613 L333 649 Q267 668 193 650Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M249 708 Q255 700 265 698" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-gaze/smileTeeth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M226 303 Q247 296 265 299 Q285 299 302 294 Q289 308 268 309 Q246 311 226 303Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/neck.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M221 316 Q251 340 295 319 L298 366 Q300 387 321 401 Q292 418 267 422 Q232 420 202 409 Q222 395 224 369Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M223 325 Q264 346 294 326 L296 361 Q268 375 224 359Z" fill="#e3a989" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/rightForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-gaze/openTongue.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M241 323 Q256 311 271 319 Q283 312 290 320 Q278 335 262 333 Q248 331 241 323Z" fill="#ee7781" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/eyes_happy.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M171 247 Q203 225 235 251 M288 250 Q320 226 350 246" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine-gaze/openTeeth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M228 302 Q245 293 264 296 Q282 295 301 297 Q295 307 279 309 Q249 310 228 302Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-gaze/hairFront.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M94 340 Q102 280 108 218 Q117 106 190 80 Q231 61 270 72 Q322 58 366 108 Q408 158 414 242 L429 365 Q405 392 368 402 Q385 348 381 315 Q376 280 359 246 Q349 206 316 175 Q289 145 268 116 Q240 153 200 180 Q165 208 149 256 Q134 299 158 338 Q135 329 122 297 Q113 313 94 340Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M109 244 Q119 144 181 108 Q219 86 264 87 L265 108 Q214 108 177 148 Q143 182 130 220Z M288 91 Q336 91 368 135 Q388 164 398 217 Q365 147 317 132Z" fill="#4b3021" stroke="none" stroke-width="6"/>
    <path d="M143 225 Q132 293 151 324 Q135 311 128 289Z M356 217 Q404 272 423 363 Q404 383 375 395 Q397 352 380 308Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M270 74 Q266 88 268 116" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-gaze/eye-rig.js`

```javascript
export {default} from '../../presets/heroine-eye-rig.js';

```

### `assets/heroine-gaze/skirt.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M156 722 Q248 780 353 731 Q393 797 420 1049 Q251 1105 103 1050 Q107 859 156 722Z" fill="#383947" stroke="#140e10" stroke-width="6"/>
    <path d="M158 750 L182 771 L121 1013 L111 1049 Q119 869 158 750Z M214 784 L236 788 L212 1073 L184 1069Z M300 780 L323 774 L382 1061 L352 1070Z M355 748 L365 768 Q400 864 416 1047 L400 1052 Q378 868 355 748Z" fill="#282933" stroke="none" stroke-width="6"/>
    <path d="M188 771 Q153 866 128 1054 M235 786 L208 1075 M321 773 Q350 882 381 1060" fill="none" stroke="#140e10" stroke-width="5"/>
    <path d="M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z" fill="#383947" stroke="#140e10" stroke-width="6"/>
    <path d="M149 749 Q256 796 362 757 L366 767 Q259 813 146 760Z" fill="#282933" stroke="none" stroke-width="6"/>
    <path d="M194 742 L181 775 M328 740 L345 778" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-gaze/body.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M140 428 Q169 401 223 394 L305 388 Q351 391 376 411 Q401 430 391 464 L366 510 Q350 560 329 608 L201 607 Q181 559 158 508 L133 473 Q121 451 140 428Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M132 450 Q155 471 183 479 L201 516 L178 546 L147 494 Q125 476 132 450Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M325 397 Q363 402 376 414 Q398 431 388 457 L371 476 Q372 431 325 397Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M183 462 Q208 443 232 453 M273 447 Q301 428 329 436" fill="none" stroke="#140e10" stroke-width="3.5"/>
  </g>
</svg>

```

### `assets/heroine-gaze/braidR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(373 345) scale(-1 1) rotate(-7)">
    <g transform="translate(0 0)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(5 44)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(9 87)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(11 128)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <path d="M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    <path d="M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-gaze/eyes_closed.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M170 243 Q198 259 234 250 M288 251 Q326 257 350 243" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine/mouth_open.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z" fill="#d25a5d" stroke="#140e10" stroke-width="5"/>
    <path d="M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z" fill="#33131d" stroke="#bb4652" stroke-width="2.6"/>
  </g>
</svg>

```

### `assets/heroine/brows.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M167 215 Q192 193 233 211 L229 221 Q198 208 167 220Z M286 205 Q316 179 346 201 L347 207 Q316 194 288 216Z" fill="#140e10" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine/hairBack.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M114 181 Q139 71 246 64 Q330 56 377 133 Q401 170 413 258 L433 384 Q404 422 342 431 L180 435 Q126 428 92 388 Q77 367 90 317Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M119 201 Q133 156 162 145 Q130 283 156 343 Q172 375 209 408 L181 431 Q130 422 104 389 Q88 364 102 317Z M351 176 Q400 223 403 292 L428 382 Q409 407 365 418 Q397 372 378 311Z" fill="#28160c" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine/rightHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M84 764 L85 768 M98 765 L98 771 M109 760 L112 767" fill="none" stroke="#140e10" stroke-width="2.8"/>
    </g>
  </g>
</svg>

```

### `assets/heroine/draw.py`

```python
"""Build editable, shared-coordinate SVG cutouts from the original vector paths."""
from pathlib import Path

HERE = Path(__file__).parent
INK = '#140e10'
SKIN, SHADE, BLUSH = '#f6cfb3', '#e3a989', '#efa991'
HAIR, DEEP, GLEAM = '#382218', '#28160c', '#4b3021'
WINE, DARK = '#64101d', '#450e1b'
SKIRT, FOLD = '#383947', '#282933'


def path(d, fill='none', stroke=INK, width=6):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'


def flat(d, fill):
    return path(d, fill, 'none')


def ellipse(x, y, rx, ry, fill):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}"/>'


def save(name, *art):
    shapes = '\n    '.join(art)
    (HERE / f'{name}.svg').write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">\n'
        '  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">\n'
        f'    {shapes}\n  </g>\n</svg>\n'
    )


save('body', path('M140 428 Q169 401 223 394 L305 388 Q351 391 376 411 Q401 430 391 464 L366 510 Q350 560 329 608 L201 607 Q181 559 158 508 L133 473 Q121 451 140 428Z', SKIN),
     flat('M132 450 Q155 471 183 479 L201 516 L178 546 L147 494 Q125 476 132 450Z', SHADE),
     flat('M325 397 Q363 402 376 414 Q398 431 388 457 L371 476 Q372 431 325 397Z', SHADE),
     path('M183 462 Q208 443 232 453 M273 447 Q301 428 329 436', width=3.5))
save('neck', path('M221 316 Q251 340 295 319 L298 366 Q300 387 321 401 Q292 418 267 422 Q232 420 202 409 Q222 395 224 369Z', SKIN),
     flat('M223 325 Q264 346 294 326 L296 361 Q268 375 224 359Z', SHADE))
save('midriff', path('M187 594 Q265 602 347 587 Q322 646 338 687 L362 737 Q269 796 151 735 Q157 703 182 676 Q198 652 187 594Z', SKIN),
     flat('M190 627 L342 613 L333 649 Q267 668 193 650Z', SHADE),
     path('M249 708 Q255 700 265 698', width=4))
save('top', path('M155 522 Q212 515 247 502 Q292 484 361 479 Q371 519 355 550 Q340 585 336 632 Q279 649 187 629 Q182 590 172 569 Q160 548 155 522Z', WINE),
     flat('M160 525 Q194 524 209 516 Q200 553 220 580 Q256 608 338 612 L334 630 Q269 645 189 627 Q185 594 174 566Z', DARK),
     path('M213 567 Q235 582 270 573 M314 609 Q322 605 333 605', DARK, INK, 3))
save('skirt', path('M156 722 Q248 780 353 731 Q393 797 420 1049 Q251 1105 103 1050 Q107 859 156 722Z', SKIRT),
     flat('M158 750 L182 771 L121 1013 L111 1049 Q119 869 158 750Z M214 784 L236 788 L212 1073 L184 1069Z M300 780 L323 774 L382 1061 L352 1070Z M355 748 L365 768 Q400 864 416 1047 L400 1052 Q378 868 355 748Z', FOLD),
     path('M188 771 Q153 866 128 1054 M235 786 L208 1075 M321 773 Q350 882 381 1060', width=5),
     path('M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z', SKIRT),
     flat('M149 749 Q256 796 362 757 L366 767 Q259 813 146 760Z', FOLD),
     path('M194 742 L181 775 M328 740 L345 778', width=4))
save('hairBack', path('M114 181 Q139 71 246 64 Q330 56 377 133 Q401 170 413 258 L433 384 Q404 422 342 431 L180 435 Q126 428 92 388 Q77 367 90 317Z', HAIR),
     flat('M119 201 Q133 156 162 145 Q130 283 156 343 Q172 375 209 408 L181 431 Q130 422 104 389 Q88 364 102 317Z M351 176 Q400 223 403 292 L428 382 Q409 407 365 418 Q397 372 378 311Z', DEEP))
save('head', path('M155 184 Q173 123 235 112 Q296 99 345 161 L372 239 Q387 224 389 244 Q388 269 361 280 Q350 314 321 332 Q291 353 263 365 Q236 363 206 344 Q170 325 153 292 Q131 285 126 260 Q120 239 141 239Z', SKIN),
     flat('M151 244 Q154 302 194 328 Q225 352 264 361 Q239 361 207 343 Q171 325 154 290 Q135 282 130 260 Q128 247 136 244Z', SHADE),
     path('M140 251 Q131 253 142 268 M373 246 Q383 239 376 256', 'none', '#9c5d4b', 3.5),
     ellipse(197, 286, 18, 6, BLUSH), ellipse(328, 287, 17, 6, BLUSH),
     path('M267 250 Q270 270 276 278 L269 290', width=3.8))
save('hairFront', path('M94 340 Q102 280 108 218 Q117 106 190 80 Q231 61 270 72 Q322 58 366 108 Q408 158 414 242 L429 365 Q405 392 368 402 Q385 348 381 315 Q376 280 359 246 Q349 206 316 175 Q289 145 268 116 Q240 153 200 180 Q165 208 149 256 Q134 299 158 338 Q135 329 122 297 Q113 313 94 340Z', HAIR),
     flat('M109 244 Q119 144 181 108 Q219 86 264 87 L265 108 Q214 108 177 148 Q143 182 130 220Z M288 91 Q336 91 368 135 Q388 164 398 217 Q365 147 317 132Z', GLEAM),
     flat('M143 225 Q132 293 151 324 Q135 311 128 289Z M356 217 Q404 272 423 363 Q404 383 375 395 Q397 352 380 308Z', DEEP),
     path('M270 74 Q266 88 268 116', width=4))
save('eyes', flat('M166 242 Q202 215 237 251 Q202 259 169 246Z M285 251 Q310 218 351 242 Q326 259 285 251Z', '#fff5e9'),
     ellipse(203, 244, 13, 11, HAIR), ellipse(318, 244, 13, 11, HAIR),
     ellipse(204, 245, 7, 9, INK), ellipse(319, 245, 7, 9, INK),
     ellipse(207, 241, 2.8, 3.2, 'white'), ellipse(322, 241, 2.8, 3.2, 'white'),
     path('M163 235 L169 242 Q202 215 237 251 M285 251 Q312 218 350 242 L357 235', width=5))
save('eyes_happy', path('M171 247 Q203 225 235 251 M288 250 Q320 226 350 246', width=5))
save('eyes_closed', path('M170 243 Q198 259 234 250 M288 251 Q326 257 350 243', width=5))
save('brows', flat('M167 215 Q192 193 233 211 L229 221 Q198 208 167 220Z M286 205 Q316 179 346 201 L347 207 Q316 194 288 216Z', INK))
save('brows_raised', flat('M167 214 Q192 192 233 207 L229 218 Q196 205 167 219Z M286 194 Q315 166 344 185 L346 191 Q316 181 290 206Z', INK))
save('mole', ellipse(337, 266, 3.6, 3.8, INK))
save('mouth', path('M228 307 Q245 295 259 298 Q276 296 298 300 Q278 316 258 317 Q241 316 228 307Z', '#b63e4b', width=4),
     path('M229 307 Q262 309 296 301', width=3))
for name, d, teeth, tongue in [
    ('smile', 'M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z',
     'M226 303 Q247 296 265 299 Q285 299 302 294 Q289 308 268 309 Q246 311 226 303Z',
     'M248 315 Q267 308 287 313 Q270 326 248 315Z'),
    ('open', 'M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z',
     'M228 302 Q245 293 264 296 Q282 295 301 297 Q295 307 279 309 Q249 310 228 302Z',
     'M241 323 Q256 311 271 319 Q283 312 290 320 Q278 335 262 333 Q248 331 241 323Z'),
]:
    save(f'mouth_{name}', path(d, '#d25a5d', width=5), path(d, '#33131d', '#bb4652', 2.6))
    save(f'{name}Teeth', flat(teeth, '#fff5e9'))
    save(f'{name}Tongue', flat(tongue, '#ee7781'))


def braid(name, shift, angle):
    art = []
    for x, y in [(0, 0), (5, 44), (9, 87), (11, 128)]:
        art.append(f'<g transform="translate({x} {y})">')
        art.append(path('M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z', HAIR))
        art.append(flat('M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z', DEEP))
        art.append(path('M-22 -15 Q-6 -10 3 4 Q15 1 28 -13', width=3.2))
        art.append('</g>')
    art.extend([
        # Root band is tucked into the scalp by hairFront's higher draw order.
        path('M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z', '#21171c', width=4),
        flat('M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z', DEEP),
        path('M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z', HAIR),
        flat('M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z', DEEP),
        path('M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z', '#21171c', width=4),
    ])
    save(name, f'<g transform="{shift} rotate({angle})">', *art, '</g>')


braid('braidL', 'translate(148 346)', -3)
braid('braidR', 'translate(373 345) scale(-1 1)', -7)


def arm(side, transform):
    def layer(name, *art):
        save(side + name, f'<g transform="{transform}">', *art, '</g>')

    layer('UpperArm', path('M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z', SKIN),
          flat('M107 462 Q118 450 122 457 L114 521 L101 530Z', SHADE),
          path('M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z', WINE),
          flat('M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z', DARK))
    layer('Forearm', path('M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z', WINE),
          flat('M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z', DARK),
          path('M77 702 Q114 718 147 701', width=3.2))
    layer('Hand', path('M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z', SKIN),
          flat('M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z', SHADE),
          path('M84 764 L85 768 M98 765 L98 771 M109 760 L112 767', width=2.8))


arm('left', '')
arm('right', 'translate(510 -19) scale(-1 1)')

```

### `assets/heroine/leftUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M107 462 Q118 450 122 457 L114 521 L101 530Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    </g>
  </g>
</svg>

```

### `assets/heroine/leftForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
  </g>
</svg>

```

### `assets/heroine/smileTongue.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M248 315 Q267 308 287 313 Q270 326 248 315Z" fill="#ee7781" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine/eyes.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M166 242 Q202 215 237 251 Q202 259 169 246Z M285 251 Q310 218 351 242 Q326 259 285 251Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
    <ellipse cx="203" cy="244" rx="13" ry="11" fill="#382218"/>
    <ellipse cx="318" cy="244" rx="13" ry="11" fill="#382218"/>
    <ellipse cx="204" cy="245" rx="7" ry="9" fill="#140e10"/>
    <ellipse cx="319" cy="245" rx="7" ry="9" fill="#140e10"/>
    <ellipse cx="207" cy="241" rx="2.8" ry="3.2" fill="white"/>
    <ellipse cx="322" cy="241" rx="2.8" ry="3.2" fill="white"/>
    <path d="M163 235 L169 242 Q202 215 237 251 M285 251 Q312 218 350 242 L357 235" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine/rightUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M107 462 Q118 450 122 457 L114 521 L101 530Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    </g>
  </g>
</svg>

```

### `assets/heroine/manifest.js`

```javascript
import baseGazeRig from '../../presets/heroine-eye-rig.js';
const gazeRig={...baseGazeRig,offset:{x:242,y:160}};
const point = (x, y) => ({ x: (x + 242) / 1024, y: (y + 160) / 1280 });

function layer(name, parent, z, x, y, [l, t, r, b]) {
  return {
    name, parent, z, pivot: point(x, y),
    polygon: [point(l, t), point(r, t), point(r, b), point(l, b)],
    image: new URL(`./${name}.svg`, import.meta.url).href,
  };
}

const parts = [
  layer('body', null, 12, 255, 717, [115, 375, 405, 620]),
  layer('skirt', 'body', 15, 253, 744, [95, 711, 430, 1080]),
  layer('midriff', 'body', 11, 250, 624, [143, 578, 371, 788]),
  layer('top', 'body', 18, 254, 532, [144, 471, 377, 655]),
  layer('neck', 'body', 17, 260, 405, [193, 307, 329, 462]),
  layer('head', 'neck', 30, 260, 395, [114, 100, 398, 374]),
  layer('hairBack', 'head', 3, 260, 395, [71, 51, 441, 442]),
  layer('hairFront', 'head', 35, 260, 114, [86, 54, 437, 412]),
  layer('eyes', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_happy', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_closed', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('brows', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('brows_raised', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('mouth', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('mouth_smile', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('smileTeeth', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('smileTongue', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('mouth_open', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('openTeeth', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('openTongue', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('mole', 'head', 32, 337, 266, [329, 258, 345, 274]),
  layer('braidL', 'head', 27, 149, 347, [102, 286, 222, 580]),
  layer('braidR', 'head', 27, 373, 346, [285, 285, 421, 581]),
  layer('leftUpperArm', 'body', 10, 137, 450, [84, 415, 180, 632]),
  layer('leftForearm', 'leftUpperArm', 22, 123, 593, [62, 567, 158, 735]),
  layer('leftHand', 'leftForearm', 21, 108, 718, [66, 700, 145, 807]),
  layer('rightUpperArm', 'body', 9, 373, 431, [330, 396, 426, 613]),
  layer('rightForearm', 'rightUpperArm', 25, 387, 574, [352, 548, 448, 716]),
  layer('rightHand', 'rightForearm', 24, 402, 699, [365, 681, 444, 788]),
];

function face(eye, brow, lip) {
  return Object.fromEntries([
    'eyes', 'eyes_happy', 'eyes_closed', 'brows', 'brows_raised',
    'mouth', 'mouth_smile', 'mouth_open',
  ].map(name => [name, [eye, brow, lip].includes(name)]));
}

export default {
  name: 'The butterfly greeting',
  gazeRig,
  absoluteDrawOrder: true,
  parts,
  expressions: {
    neutral: face('eyes', 'brows', 'mouth'),
    greeting: face('eyes', 'brows_raised', 'mouth_smile'),
    laugh: face('eyes_happy', 'brows_raised', 'mouth_open'),
  },
};

```

### `assets/heroine/leftHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M84 764 L85 768 M98 765 L98 771 M109 760 L112 767" fill="none" stroke="#140e10" stroke-width="2.8"/>
    </g>
  </g>
</svg>

```

### `assets/heroine/mouth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M228 307 Q245 295 259 298 Q276 296 298 300 Q278 316 258 317 Q241 316 228 307Z" fill="#b63e4b" stroke="#140e10" stroke-width="4"/>
    <path d="M229 307 Q262 309 296 301" fill="none" stroke="#140e10" stroke-width="3"/>
  </g>
</svg>

```

### `assets/heroine/mole.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="337" cy="266" rx="3.6" ry="3.8" fill="#140e10"/>
  </g>
</svg>

```

### `assets/heroine/room.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960">
  <path fill="#af7a43" d="M0 0h540v960H0z"/>
  <path fill="#976337" d="M0 0h540v8H0zM0 155h540v8H0zM0 310h540v8H0zM0 465h540v8H0zM0 620h540v8H0zM0 775h540v8H0z"/>
  <path fill="none" stroke="#734b2e" stroke-width="3" d="M0 8h540M0 163h540M0 318h540M0 473h540M0 628h540M0 783h540"/>
  <path fill="none" stroke="#976337" stroke-width="2" d="M18 54q34-4 68 0t70 0m35 31q40 4 78 0m84 33q39-4 76 0t74 0M12 208q42 4 81 0m55 33q46-4 91 0t70 0m96-53q45 4 82 0M33 376q49-4 94 0t74 0m38-27q35 4 70 0t80 0m79 49q40-4 72 0M15 534q39 4 77 0m66 34q40-4 79 0t77 0m83-69q48 4 93 0M26 692q35-4 69 0t71 0m48 23q45 4 88 0t78 0m62-50q47-4 86 0"/>
  <path fill="#734b2e" d="M0 805h540v155H0z"/>
  <path fill="#926238" d="M0 836h540v124H0z"/>
  <path fill="#6f5531" d="M0 767h540v66H0z"/>
  <path fill="#a5804e" d="M0 767h540v18H0z"/>
  <rect x="422" y="144" width="109" height="183" rx="3" fill="#694729"/>
  <rect x="429" y="151" width="95" height="169" fill="#6b7665"/>
  <path fill="#86917b" d="M430 152h94v8h-86v160h-8z"/>
  <g transform="translate(484 224) rotate(15)">
    <path d="M0 0Q-21 0-22-19Q-13-22 1-5Q6-27 19-25Q23-11 5 0Q21-3 19 7Q13 16 2 6Q-5 17-14 12Q-20 6 0 0Z" fill="#c48b42" stroke="#8c5c28" stroke-width="2"/>
    <path d="M1-7 3 7M1-6l-6-6m6 6 5-9" fill="none" stroke="#564027" stroke-width="2.5" stroke-linecap="round"/>
  </g>
</svg>

```

### `assets/heroine/brows_raised.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M167 214 Q192 192 233 207 L229 218 Q196 205 167 219Z M286 194 Q315 166 344 185 L346 191 Q316 181 290 206Z" fill="#140e10" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine/head.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M155 184 Q173 123 235 112 Q296 99 345 161 L372 239 Q387 224 389 244 Q388 269 361 280 Q350 314 321 332 Q291 353 263 365 Q236 363 206 344 Q170 325 153 292 Q131 285 126 260 Q120 239 141 239Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M151 244 Q154 302 194 328 Q225 352 264 361 Q239 361 207 343 Q171 325 154 290 Q135 282 130 260 Q128 247 136 244Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M140 251 Q131 253 142 268 M373 246 Q383 239 376 256" fill="none" stroke="#9c5d4b" stroke-width="3.5"/>
    <ellipse cx="197" cy="286" rx="18" ry="6" fill="#efa991"/>
    <ellipse cx="328" cy="287" rx="17" ry="6" fill="#efa991"/>
    <path d="M267 250 Q270 270 276 278 L269 290" fill="none" stroke="#140e10" stroke-width="3.8"/>
  </g>
</svg>

```

### `assets/heroine/braidL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(148 346) rotate(-3)">
    <g transform="translate(0 0)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(5 44)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(9 87)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(11 128)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <path d="M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    <path d="M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    </g>
  </g>
</svg>

```

### `assets/heroine/story.js`

```javascript
const tau = 2 * Math.PI;
const sine = (t, hz, phase = 0) => Math.sin(tau * hz * t + phase);

function ease(t, from, to) {
  const x = Math.min(1, Math.max(0, (t - from) / (to - from)));
  return x * x * (3 - 2 * x);
}

function beat(t, start, arrive, leave, end) {
  return ease(t, start, arrive) * (1 - ease(t, leave, end));
}

export function poseAt(t) {
  const notice = beat(t, 0.65, 1.55, 2.55, 3.6);
  const wave = beat(t, 2.35, 3.22, 4.85, 5.92);
  const laugh = beat(t, 5.15, 5.95, 7.35, 8.9);
  const bow = beat(t, 8.18, 8.92, 9.14, 9.95);
  const sway = sine(t, 0.8);
  const breath = sine(t, 1.05, 0.55);
  const laughBounce = laugh * sine(t, 2.65);
  return {
    // Angles are in degrees and displacements in stage pixels.
    turns: {
      body: 1.7 * sway - 2 * notice + 2.3 * laugh,
      skirt: -0.85 * sine(t - 0.13, 0.8),
      head: 2.8 * sine(t, 0.89, 1.1) - 5 * notice + 4 * wave + 5 * bow + 2.5 * laughBounce,
      braidL: 4.2 * sine(t - 0.1, 1.13) + 2.5 * laughBounce,
      braidR: -3.5 * sine(t - 0.17, 1.04) - 2.5 * laughBounce,
      leftUpperArm: 2.5 * breath - 10 * laugh + 3 * bow,
      leftForearm: 5 + 3.2 * sway + 67 * laugh + 16 * bow,
      leftHand: -4 * breath - 12 * laugh,
      rightUpperArm: -2.5 * breath - 15 * wave + 7 * laugh,
      rightForearm: 3.6 * sway + 156 * wave - 40 * laugh,
      rightHand: 4 * breath + wave * (14 + 23 * sine(t, 2.5)),
      mouth_open: 1.5 * laughBounce,
    },
    x: 8.8 * sway + 5 * notice - 10 * wave + 4 * sine(t, 1.41, 1.2),
    y: 11 * breath + 5 * notice + 11 * laughBounce - 9 * bow,
    expression: laugh > 0.30 ? 'laugh' : notice + wave > 0.36 || t > 8.55 ? 'greeting' : 'neutral',
    blink: [0.57, 2.08, 4.56, 7.99, 9.43].some(center => Math.abs(t - center) < 0.062),
  };
}

export const scene = { bg: 0xaf7a43, room: 'room.svg', worldHeight: 3.2 };

```

### `assets/heroine/top.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M155 522 Q212 515 247 502 Q292 484 361 479 Q371 519 355 550 Q340 585 336 632 Q279 649 187 629 Q182 590 172 569 Q160 548 155 522Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M160 525 Q194 524 209 516 Q200 553 220 580 Q256 608 338 612 L334 630 Q269 645 189 627 Q185 594 174 566Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M213 567 Q235 582 270 573 M314 609 Q322 605 333 605" fill="#450e1b" stroke="#140e10" stroke-width="3"/>
  </g>
</svg>

```

### `assets/heroine/mouth_smile.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z" fill="#d25a5d" stroke="#140e10" stroke-width="5"/>
    <path d="M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z" fill="#33131d" stroke="#bb4652" stroke-width="2.6"/>
  </g>
</svg>

```

### `assets/heroine/midriff.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M187 594 Q265 602 347 587 Q322 646 338 687 L362 737 Q269 796 151 735 Q157 703 182 676 Q198 652 187 594Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M190 627 L342 613 L333 649 Q267 668 193 650Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M249 708 Q255 700 265 698" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine/smileTeeth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M226 303 Q247 296 265 299 Q285 299 302 294 Q289 308 268 309 Q246 311 226 303Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine/neck.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M221 316 Q251 340 295 319 L298 366 Q300 387 321 401 Q292 418 267 422 Q232 420 202 409 Q222 395 224 369Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M223 325 Q264 346 294 326 L296 361 Q268 375 224 359Z" fill="#e3a989" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine/rightForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
  </g>
</svg>

```

### `assets/heroine/openTongue.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M241 323 Q256 311 271 319 Q283 312 290 320 Q278 335 262 333 Q248 331 241 323Z" fill="#ee7781" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine/eyes_happy.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M171 247 Q203 225 235 251 M288 250 Q320 226 350 246" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine/openTeeth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M228 302 Q245 293 264 296 Q282 295 301 297 Q295 307 279 309 Q249 310 228 302Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine/hairFront.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M94 340 Q102 280 108 218 Q117 106 190 80 Q231 61 270 72 Q322 58 366 108 Q408 158 414 242 L429 365 Q405 392 368 402 Q385 348 381 315 Q376 280 359 246 Q349 206 316 175 Q289 145 268 116 Q240 153 200 180 Q165 208 149 256 Q134 299 158 338 Q135 329 122 297 Q113 313 94 340Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M109 244 Q119 144 181 108 Q219 86 264 87 L265 108 Q214 108 177 148 Q143 182 130 220Z M288 91 Q336 91 368 135 Q388 164 398 217 Q365 147 317 132Z" fill="#4b3021" stroke="none" stroke-width="6"/>
    <path d="M143 225 Q132 293 151 324 Q135 311 128 289Z M356 217 Q404 272 423 363 Q404 383 375 395 Q397 352 380 308Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M270 74 Q266 88 268 116" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine/skirt.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M156 722 Q248 780 353 731 Q393 797 420 1049 Q251 1105 103 1050 Q107 859 156 722Z" fill="#383947" stroke="#140e10" stroke-width="6"/>
    <path d="M158 750 L182 771 L121 1013 L111 1049 Q119 869 158 750Z M214 784 L236 788 L212 1073 L184 1069Z M300 780 L323 774 L382 1061 L352 1070Z M355 748 L365 768 Q400 864 416 1047 L400 1052 Q378 868 355 748Z" fill="#282933" stroke="none" stroke-width="6"/>
    <path d="M188 771 Q153 866 128 1054 M235 786 L208 1075 M321 773 Q350 882 381 1060" fill="none" stroke="#140e10" stroke-width="5"/>
    <path d="M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z" fill="#383947" stroke="#140e10" stroke-width="6"/>
    <path d="M149 749 Q256 796 362 757 L366 767 Q259 813 146 760Z" fill="#282933" stroke="none" stroke-width="6"/>
    <path d="M194 742 L181 775 M328 740 L345 778" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine/body.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M140 428 Q169 401 223 394 L305 388 Q351 391 376 411 Q401 430 391 464 L366 510 Q350 560 329 608 L201 607 Q181 559 158 508 L133 473 Q121 451 140 428Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M132 450 Q155 471 183 479 L201 516 L178 546 L147 494 Q125 476 132 450Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M325 397 Q363 402 376 414 Q398 431 388 457 L371 476 Q372 431 325 397Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M183 462 Q208 443 232 453 M273 447 Q301 428 329 436" fill="none" stroke="#140e10" stroke-width="3.5"/>
  </g>
</svg>

```

### `assets/heroine/braidR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(373 345) scale(-1 1) rotate(-7)">
    <g transform="translate(0 0)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(5 44)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(9 87)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(11 128)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <path d="M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    <path d="M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    </g>
  </g>
</svg>

```

### `assets/heroine/eyes_closed.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1280" viewBox="0 0 1024 1280">
  <g transform="translate(242 160)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M170 243 Q198 259 234 250 M288 251 Q326 257 350 243" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/generic/leftLeg.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M48 25 Q128 5 128 50 L111 221 Q101 244 71 237 Q49 232 52 207 Z" fill="#384b63" stroke="#29313d" stroke-width="9"/></g></svg>
```

### `assets/generic/rightLeg.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M208 25 Q128 5 128 50 L145 221 Q155 244 185 237 Q207 232 204 207 Z" fill="#384b63" stroke="#29313d" stroke-width="9"/></g></svg>
```

### `assets/generic/brows.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M65 91 Q91 75 112 91 M145 91 Q166 75 191 91" fill="none" stroke="#493c37" stroke-width="10" stroke-linecap="round"/></g></svg>
```

### `assets/generic/rightHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M181 50 Q157 32 137 53 L131 96 Q136 119 156 115 L203 105 Q228 94 214 73 Q204 60 181 75 Q217 51 202 34 Q187 22 169 51 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g></svg>
```

### `assets/generic/leftUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M115 28 Q73 18 58 60 L24 167 Q25 196 54 199 Q77 196 83 171 L132 72 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g></svg>
```

### `assets/generic/leftForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M82 25 Q119 18 127 48 L90 213 Q75 239 48 224 Q28 211 39 183 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g></svg>
```

### `assets/generic/eyes.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><ellipse cx="91" cy="128" rx="17" ry="23" fill="white"/><ellipse cx="165" cy="128" rx="17" ry="23" fill="white"/><circle cx="96" cy="132" r="8" fill="#292b36"/><circle cx="160" cy="132" r="8" fill="#292b36"/></g></svg>
```

### `assets/generic/rightUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M141 28 Q183 18 198 60 L232 167 Q231 196 202 199 Q179 196 173 171 L124 72 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g></svg>
```

### `assets/generic/README.md`

```markdown
# Generic Character Asset Pack

16 individually editable transparent SVG parts plus a combined atlas. The atlas is 1024x1024 (4x4 cells, 256px each). It is a clean starter puppet, not an auto-rigged arbitrary photo.

Parts: head, body, upper arms, forearms, hands, legs, feet, eyes, brows, mouth, front hair.

The atlas can be loaded with the demo manifest. For production, replace the simple rectangular atlas masks with tighter polygon masks and repaint hidden overlap areas.

```

### `assets/generic/leftHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M75 50 Q99 32 119 53 L125 96 Q120 119 100 115 L53 105 Q28 94 42 73 Q52 60 75 75 Q39 51 54 34 Q69 22 87 51 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g></svg>
```

### `assets/generic/generic-atlas.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<g transform="translate(0 0)"><ellipse cx="128" cy="128" rx="78" ry="91" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/><path d="M53 104 Q48 28 129 31 Q207 27 207 107 Q183 68 145 71 Q99 63 53 104" fill="#493c37" stroke="#453b3b" stroke-width="7"/></g>
<g transform="translate(256 0)"><path d="M68 45 Q128 22 188 45 L211 213 Q128 239 45 213 Z" fill="#6d91a5" stroke="#354957" stroke-width="9"/></g>
<g transform="translate(512 0)"><path d="M115 28 Q73 18 58 60 L24 167 Q25 196 54 199 Q77 196 83 171 L132 72 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g>
<g transform="translate(768 0)"><path d="M141 28 Q183 18 198 60 L232 167 Q231 196 202 199 Q179 196 173 171 L124 72 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g>
<g transform="translate(0 256)"><path d="M82 25 Q119 18 127 48 L90 213 Q75 239 48 224 Q28 211 39 183 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g>
<g transform="translate(256 256)"><path d="M174 25 Q137 18 129 48 L166 213 Q181 239 208 224 Q228 211 217 183 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g>
<g transform="translate(512 256)"><path d="M75 50 Q99 32 119 53 L125 96 Q120 119 100 115 L53 105 Q28 94 42 73 Q52 60 75 75 Q39 51 54 34 Q69 22 87 51 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g>
<g transform="translate(768 256)"><path d="M181 50 Q157 32 137 53 L131 96 Q136 119 156 115 L203 105 Q228 94 214 73 Q204 60 181 75 Q217 51 202 34 Q187 22 169 51 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g>
<g transform="translate(0 512)"><path d="M48 25 Q128 5 128 50 L111 221 Q101 244 71 237 Q49 232 52 207 Z" fill="#384b63" stroke="#29313d" stroke-width="9"/></g>
<g transform="translate(256 512)"><path d="M208 25 Q128 5 128 50 L145 221 Q155 244 185 237 Q207 232 204 207 Z" fill="#384b63" stroke="#29313d" stroke-width="9"/></g>
<g transform="translate(512 512)"><path d="M45 90 Q83 72 111 102 L120 150 Q113 174 40 170 Q15 162 24 130 Z" fill="#f4f0e9" stroke="#453b3b" stroke-width="9"/></g>
<g transform="translate(768 512)"><path d="M211 90 Q173 72 145 102 L136 150 Q143 174 216 170 Q241 162 232 130 Z" fill="#f4f0e9" stroke="#453b3b" stroke-width="9"/></g>
<g transform="translate(0 768)"><ellipse cx="91" cy="128" rx="17" ry="23" fill="white"/><ellipse cx="165" cy="128" rx="17" ry="23" fill="white"/><circle cx="96" cy="132" r="8" fill="#292b36"/><circle cx="160" cy="132" r="8" fill="#292b36"/></g>
<g transform="translate(256 768)"><path d="M65 91 Q91 75 112 91 M145 91 Q166 75 191 91" fill="none" stroke="#493c37" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(512 768)"><path d="M88 30 Q128 65 168 30" fill="none" stroke="#9e5555" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(768 768)"><path d="M43 119 Q26 27 112 23 Q174 3 210 74 L193 120 Q167 80 139 84 Q98 59 43 119" fill="#493c37" stroke="#302a2a" stroke-width="8"/></g>
</svg>
```

### `assets/generic/mouth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M88 30 Q128 65 168 30" fill="none" stroke="#9e5555" stroke-width="10" stroke-linecap="round"/></g></svg>
```

### `assets/generic/head.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><ellipse cx="128" cy="128" rx="78" ry="91" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/><path d="M53 104 Q48 28 129 31 Q207 27 207 107 Q183 68 145 71 Q99 63 53 104" fill="#493c37" stroke="#453b3b" stroke-width="7"/></g></svg>
```

### `assets/generic/rightFoot.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M211 90 Q173 72 145 102 L136 150 Q143 174 216 170 Q241 162 232 130 Z" fill="#f4f0e9" stroke="#453b3b" stroke-width="9"/></g></svg>
```

### `assets/generic/leftFoot.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M45 90 Q83 72 111 102 L120 150 Q113 174 40 170 Q15 162 24 130 Z" fill="#f4f0e9" stroke="#453b3b" stroke-width="9"/></g></svg>
```

### `assets/generic/rightForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M174 25 Q137 18 129 48 L166 213 Q181 239 208 224 Q228 211 217 183 Z" fill="#f2c9a5" stroke="#453b3b" stroke-width="8"/></g></svg>
```

### `assets/generic/hairFront.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M43 119 Q26 27 112 23 Q174 3 210 74 L193 120 Q167 80 139 84 Q98 59 43 119" fill="#493c37" stroke="#302a2a" stroke-width="8"/></g></svg>
```

### `assets/generic/body.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g><path d="M68 45 Q128 22 188 45 L211 213 Q128 239 45 213 Z" fill="#6d91a5" stroke="#354957" stroke-width="9"/></g></svg>
```

### `assets/heroine-sit/chair.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path fill="#a76b3c" d="M96 681 Q104 671 116 681 L135 1170 L108 1174 Z M394 681 Q406 671 414 681 L402 1174 L375 1170 Z"/>
    <path fill="#c48b52" d="M128 727 H382 V769 H128 Z M126 851 H384 V893 H126 Z"/>
    <path fill="#bf854c" d="M124 1200 H151 V1550 H124 Z M359 1200 H386 V1550 H359 Z"/>
    <path fill="#a76b3c" d="M66 1220 H94 V1550 H66 Z M416 1220 H444 V1550 H416 Z"/>
    <path fill="#8e532f" d="M82 1420 H428 V1459 H82 Z"/>
    <path fill="#c48b52" d="M79 1161 L429 1161 L455 1198 L54 1198 Z"/>
    <path fill="#a76b3c" d="M54 1198 L455 1198 L445 1240 L65 1240 Z"/>
    <path fill="none" stroke="#e1ac70" stroke-width="4" d="M83 1173 L423 1173"/>
    <path fill="none" stroke="#6c4029" stroke-width="4" d="M94 1420 H414"/>
  </g>
</svg>

```

### `assets/heroine-sit/shinL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M161 1114.75 Q190 1090.25 219 1114.75 L213 1526.35 Q190 1553.3 167 1526.35Z"/><path d="M202 1163.75 L201 1494.5" stroke="#282933" stroke-width="9"/></g></svg>
```

### `assets/heroine-sit/mouth_open.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z" fill="#d25a5d" stroke="#140e10" stroke-width="5"/>
    <path d="M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z" fill="#33131d" stroke="#bb4652" stroke-width="2.6"/>
  </g>
</svg>

```

### `assets/heroine-sit/brows.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M167 215 Q192 193 233 211 L229 221 Q198 208 167 220Z M286 205 Q316 179 346 201 L347 207 Q316 194 288 216Z" fill="#140e10" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-sit/hairBack.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M114 181 Q139 71 246 64 Q330 56 377 133 Q401 170 413 258 L433 384 Q404 422 342 431 L180 435 Q126 428 92 388 Q77 367 90 317Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M119 201 Q133 156 162 145 Q130 283 156 343 Q172 375 209 408 L181 431 Q130 422 104 389 Q88 364 102 317Z M351 176 Q400 223 403 292 L428 382 Q409 407 365 418 Q397 372 378 311Z" fill="#28160c" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-sit/thighL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M160 831.467 Q190 788.84 220 831.467 L219 1137.267 Q190 1198.427 161 1137.267Z"/></g></svg>
```

### `assets/heroine-sit/skirt_seated.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round"><path fill="#383947" d="M156 722 Q248 780 353 731 L383 805 L356 829 Q254 847 143 815 L123 798Z"/><path fill="#282933" d="M181 767 L207 782 L183 826 L154 817Z M300 780 L324 774 L365 822 L340 831Z"/><path fill="none" d="M205 787 L181 822 M321 783 L354 824 M143 804 Q260 831 376 807"/><path fill="#383947" d="M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z"/></g></svg>
```

### `assets/heroine-sit/rightHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M84 764 L85 768 M98 765 L98 771 M109 760 L112 767" fill="none" stroke="#140e10" stroke-width="2.8"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-sit/leftUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M107 462 Q118 450 122 457 L114 521 L101 530Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-sit/leftForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-sit/smileTongue.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M248 315 Q267 308 287 313 Q270 326 248 315Z" fill="#ee7781" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-sit/eyes.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M166 242 Q202 215 237 251 Q202 259 169 246Z M285 251 Q310 218 351 242 Q326 259 285 251Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
    <ellipse cx="203" cy="244" rx="13" ry="11" fill="#382218"/>
    <ellipse cx="318" cy="244" rx="13" ry="11" fill="#382218"/>
    <ellipse cx="204" cy="245" rx="7" ry="9" fill="#140e10"/>
    <ellipse cx="319" cy="245" rx="7" ry="9" fill="#140e10"/>
    <ellipse cx="207" cy="241" rx="2.8" ry="3.2" fill="white"/>
    <ellipse cx="322" cy="241" rx="2.8" ry="3.2" fill="white"/>
    <path d="M163 235 L169 242 Q202 215 237 251 M285 251 Q312 218 350 242 L357 235" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine-sit/footL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#211f29" d="M166 1504.0 Q190 1518.0 214 1504.0 L233 1524.0 Q247 1530.0 243 1550.0 L147 1550.0 Q141 1527.0 166 1504.0Z"/><path d="M151 1539.0 H238" stroke="#45434c" stroke-width="5"/></g></svg>
```

### `assets/heroine-sit/rightUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M107 462 Q118 450 122 457 L114 521 L101 530Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-sit/manifest.js`

```javascript
import baseGazeRig from '../../presets/heroine-eye-rig.js';
const gazeRig={...baseGazeRig,offset:{x:242,y:224.074074074}};
const point = (x, y) => ({ x: (x + 242) / 1024, y: (y + 224.074074074) / 2000 });

function layer(name, parent, z, x, y, [l, t, r, b]) {
  return {
    name, parent, z, pivot: point(x, y),
    polygon: [point(l, t), point(r, t), point(r, b), point(l, b)],
    image: new URL(`./${name}.svg`, import.meta.url).href,
  };
}

const parts = [
  layer('chair', null, 1, 255, 985, [45, 640, 465, 1565]),
  layer('body', null, 12, 255, 717, [115, 375, 405, 620]),
  layer('skirt', 'body', 15, 253, 744, [95, 711, 430, 1080]),
  layer('skirt_seated', 'body', 16, 253, 744, [40, 710, 475, 1080]),
  layer('seatFront', null, 5, 255, 1202, [45, 1187, 465, 1247]),
  layer('thighL', 'body', 7, 190, 850, [130, 810, 255, 1160]),
  layer('shinL', 'thighL', 8, 190, 1127, [130, 1090, 255, 1550]),
  layer('footL', 'shinL', 9, 190, 1520, [130, 1480, 255, 1560]),
  layer('thighR', 'body', 7, 320, 850, [260, 810, 385, 1160]),
  layer('shinR', 'thighR', 8, 320, 1127, [260, 1090, 385, 1550]),
  layer('footR', 'shinR', 9, 320, 1520, [260, 1480, 385, 1560]),
  layer('legs_seated', 'body', 9, 255, 717, [110, 800, 400, 1545]),
  layer('midriff', 'body', 11, 250, 624, [143, 578, 371, 788]),
  layer('top', 'body', 18, 254, 532, [144, 471, 377, 655]),
  layer('neck', 'body', 17, 260, 405, [193, 307, 329, 462]),
  layer('head', 'neck', 30, 260, 395, [114, 100, 398, 374]),
  layer('hairBack', 'head', 3, 260, 395, [71, 51, 441, 442]),
  layer('hairFront', 'head', 35, 260, 114, [86, 54, 437, 412]),
  layer('eyes', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_happy', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_closed', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('brows', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('brows_raised', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('mouth', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('mouth_smile', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('smileTeeth', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('smileTongue', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('mouth_open', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('openTeeth', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('openTongue', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('mole', 'head', 32, 337, 266, [329, 258, 345, 274]),
  layer('braidL', 'head', 27, 149, 347, [102, 286, 222, 580]),
  layer('braidR', 'head', 27, 373, 346, [285, 285, 421, 581]),
  layer('leftUpperArm', 'body', 10, 137, 450, [84, 415, 180, 632]),
  layer('leftForearm', 'leftUpperArm', 22, 123, 593, [62, 567, 158, 735]),
  layer('leftHand', 'leftForearm', 21, 108, 718, [66, 700, 145, 807]),
  layer('rightUpperArm', 'body', 9, 373, 431, [330, 396, 426, 613]),
  layer('rightForearm', 'rightUpperArm', 25, 387, 574, [352, 548, 448, 716]),
  layer('rightHand', 'rightForearm', 24, 402, 699, [365, 681, 444, 788]),
];

function face(eye, brow, lip) {
  return Object.fromEntries([
    'eyes', 'eyes_happy', 'eyes_closed', 'brows', 'brows_raised',
    'mouth', 'mouth_smile', 'mouth_open',
  ].map(name => [name, [eye, brow, lip].includes(name)]));
}

export default {
  name: 'Seated heroine — planted two-link legs',
  gazeRig,
  absoluteDrawOrder: true,
  parts,
  expressions: {
    neutral: face('eyes', 'brows', 'mouth'),
    greeting: face('eyes', 'brows_raised', 'mouth_smile'),
    laugh: face('eyes_happy', 'brows_raised', 'mouth_open'),
  },
};

```

### `assets/heroine-sit/leftHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M84 764 L85 768 M98 765 L98 771 M109 760 L112 767" fill="none" stroke="#140e10" stroke-width="2.8"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-sit/mouth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M228 307 Q245 295 259 298 Q276 296 298 300 Q278 316 258 317 Q241 316 228 307Z" fill="#b63e4b" stroke="#140e10" stroke-width="4"/>
    <path d="M229 307 Q262 309 296 301" fill="none" stroke="#140e10" stroke-width="3"/>
  </g>
</svg>

```

### `assets/heroine-sit/mole.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="337" cy="266" rx="3.6" ry="3.8" fill="#140e10"/>
  </g>
</svg>

```

### `assets/heroine-sit/room.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960">
  <path fill="#af7a43" d="M0 0h540v960H0z"/>
  <path fill="#976337" d="M0 0h540v8H0zM0 155h540v8H0zM0 310h540v8H0zM0 465h540v8H0zM0 620h540v8H0zM0 775h540v8H0z"/>
  <path fill="none" stroke="#734b2e" stroke-width="3" d="M0 8h540M0 163h540M0 318h540M0 473h540M0 628h540M0 783h540"/>
  <path fill="none" stroke="#976337" stroke-width="2" d="M18 54q34-4 68 0t70 0m35 31q40 4 78 0m84 33q39-4 76 0t74 0M12 208q42 4 81 0m55 33q46-4 91 0t70 0m96-53q45 4 82 0M33 376q49-4 94 0t74 0m38-27q35 4 70 0t80 0m79 49q40-4 72 0M15 534q39 4 77 0m66 34q40-4 79 0t77 0m83-69q48 4 93 0M26 692q35-4 69 0t71 0m48 23q45 4 88 0t78 0m62-50q47-4 86 0"/>
  <path fill="#734b2e" d="M0 805h540v155H0z"/>
  <path fill="#926238" d="M0 836h540v124H0z"/>
  <path fill="#6f5531" d="M0 767h540v66H0z"/>
  <path fill="#a5804e" d="M0 767h540v18H0z"/>
  <rect x="422" y="144" width="109" height="183" rx="3" fill="#694729"/>
  <rect x="429" y="151" width="95" height="169" fill="#6b7665"/>
  <path fill="#86917b" d="M430 152h94v8h-86v160h-8z"/>
  <g transform="translate(484 224) rotate(15)">
    <path d="M0 0Q-21 0-22-19Q-13-22 1-5Q6-27 19-25Q23-11 5 0Q21-3 19 7Q13 16 2 6Q-5 17-14 12Q-20 6 0 0Z" fill="#c48b42" stroke="#8c5c28" stroke-width="2"/>
    <path d="M1-7 3 7M1-6l-6-6m6 6 5-9" fill="none" stroke="#564027" stroke-width="2.5" stroke-linecap="round"/>
  </g>
<path fill="#b28c60" d="M0 900H540V960H0Z"/><path d="M0 900H540" fill="none" stroke="#543c29" stroke-width="4"/></svg>

```

### `assets/heroine-sit/legs_seated.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M148 906 Q142 866 170 846 Q190 826 210 846 Q238 866 232 906 L228 986 Q224 1020 190 1030 Q156 1020 152 986Z"/><path fill="#4b4c60" d="M278 906 Q272 866 300 846 Q320 826 340 846 Q368 866 362 906 L358 986 Q354 1020 320 1030 Q286 1020 282 986Z"/><path fill="#4b4c60" d="M164 1010 Q190 1030 216 1010 L214 1452 Q190 1478 166 1452Z"/><path fill="#4b4c60" d="M294 1010 Q320 1030 346 1010 L344 1452 Q320 1478 296 1452Z"/><path d="M186 1040 L185 1430 M316 1040 L315 1430" fill="none" stroke="#282933" stroke-width="9"/><path fill="#211f29" d="M166 1450 Q190 1466 214 1450 L233 1479 Q241 1488 239 1499 L143 1499 Q141 1480 166 1450Z"/><path fill="#211f29" d="M296 1450 Q320 1466 344 1450 L363 1479 Q371 1488 369 1499 L273 1499 Q271 1480 296 1450Z"/><path d="M148 1489 H236 M278 1489 H366" fill="none" stroke="#45434c" stroke-width="5"/></g></svg>

```

### `assets/heroine-sit/brows_raised.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M167 214 Q192 192 233 207 L229 218 Q196 205 167 219Z M286 194 Q315 166 344 185 L346 191 Q316 181 290 206Z" fill="#140e10" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-sit/head.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M155 184 Q173 123 235 112 Q296 99 345 161 L372 239 Q387 224 389 244 Q388 269 361 280 Q350 314 321 332 Q291 353 263 365 Q236 363 206 344 Q170 325 153 292 Q131 285 126 260 Q120 239 141 239Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M151 244 Q154 302 194 328 Q225 352 264 361 Q239 361 207 343 Q171 325 154 290 Q135 282 130 260 Q128 247 136 244Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M140 251 Q131 253 142 268 M373 246 Q383 239 376 256" fill="none" stroke="#9c5d4b" stroke-width="3.5"/>
    <ellipse cx="197" cy="286" rx="18" ry="6" fill="#efa991"/>
    <ellipse cx="328" cy="287" rx="17" ry="6" fill="#efa991"/>
    <path d="M267 250 Q270 270 276 278 L269 290" fill="none" stroke="#140e10" stroke-width="3.8"/>
  </g>
</svg>

```

### `assets/heroine-sit/braidL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(148 346) rotate(-3)">
    <g transform="translate(0 0)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(5 44)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(9 87)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(11 128)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <path d="M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    <path d="M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-sit/story.js`

```javascript
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=(f,a,b)=>{const q=clamp((f-a)/(b-a));return q*q*(3-2*q);};
const sin=(f,n,p=0)=>Math.sin(f*2*Math.PI/n+p);
const S=.54;
export function poseAt(t){
 const f=t*30,down=ease(f,20,64),x=-100*down;
 const bodyTurn=-10*ease(f,22,38)*(1-ease(f,42,62));
 const a=bodyTurn*Math.PI/180,drop=311.111111111*down+133*(1-Math.cos(a));
 const solve=hx=>{
  const H=[255+(hx-255)*Math.cos(a)+133*Math.sin(a)+x,717-(hx-255)*Math.sin(a)+133*Math.cos(a)+drop];
  const K=[hx+120*down,1127+34.111111111*down];
  const A=[hx+110*down,1520];
  const thigh=Math.atan2(K[0]-H[0],K[1]-H[1])*180/Math.PI;
  const shin=Math.atan2(A[0]-K[0],A[1]-K[1])*180/Math.PI;
  return {turns:[thigh-bodyTurn,shin-thigh,-shin],lengths:{thigh:Math.hypot(K[0]-H[0],K[1]-H[1]),shin:Math.hypot(A[0]-K[0],A[1]-K[1])},H,K,A};
 };
 const l=solve(190),r=solve(320),arms=ease(f,20,62);
 const look=-15*ease(f,64,90)+28*ease(f,100,128);
 return {x:x*S,y:-drop*S,
  legLengths:{L:l.lengths,R:r.lengths},skirtForeshorten:1-.77*down,
  joints:{L:l,R:r},
  turns:{body:bodyTurn,thighL:l.turns[0],shinL:l.turns[1],footL:l.turns[2],thighR:r.turns[0],shinR:r.turns[1],footR:r.turns[2],
   head:-bodyTurn+look*1.15+7*sin(f,31,1),neck:0,
   braidL:5.5*sin(f,27,.6)+look*.2,braidR:5*sin(f,29,1.4)+look*.2,
   leftUpperArm:-12+22*arms+3.2*sin(f,43),rightUpperArm:12-22*arms-3.2*sin(f,43),
   leftForearm:22*(1-arms)+1.2*sin(f,43),rightForearm:-22*(1-arms)-1.2*sin(f,43),
   leftHand:-8*(1-arms)+.8*sin(f,39),rightHand:8*(1-arms)-.8*sin(f,39)},
  show:{skirt:true,skirt_seated:false,seatFront:f>=64,
   thighL:true,shinL:true,footL:true,thighR:true,shinR:true,footR:true,legs_seated:false},
  expression:f>=120?'greeting':'neutral',blink:[18,91,116].some(c=>Math.abs(f-c)<=1)};
}
export const scene={bg:0xaf7a43,room:'room.svg',worldHeight:2.7};

```

### `assets/heroine-sit/shinR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M291 1114.75 Q320 1090.25 349 1114.75 L343 1526.35 Q320 1553.3 297 1526.35Z"/><path d="M332 1163.75 L331 1494.5" stroke="#282933" stroke-width="9"/></g></svg>
```

### `assets/heroine-sit/top.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M155 522 Q212 515 247 502 Q292 484 361 479 Q371 519 355 550 Q340 585 336 632 Q279 649 187 629 Q182 590 172 569 Q160 548 155 522Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M160 525 Q194 524 209 516 Q200 553 220 580 Q256 608 338 612 L334 630 Q269 645 189 627 Q185 594 174 566Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M213 567 Q235 582 270 573 M314 609 Q322 605 333 605" fill="#450e1b" stroke="#140e10" stroke-width="3"/>
  </g>
</svg>

```

### `assets/heroine-sit/mouth_smile.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z" fill="#d25a5d" stroke="#140e10" stroke-width="5"/>
    <path d="M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z" fill="#33131d" stroke="#bb4652" stroke-width="2.6"/>
  </g>
</svg>

```

### `assets/heroine-sit/thighR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M290 831.467 Q320 788.84 350 831.467 L349 1137.267 Q320 1198.427 291 1137.267Z"/></g></svg>
```

### `assets/heroine-sit/footR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#211f29" d="M296 1504.0 Q320 1518.0 344 1504.0 L363 1524.0 Q377 1530.0 373 1550.0 L277 1550.0 Q271 1527.0 296 1504.0Z"/><path d="M281 1539.0 H368" stroke="#45434c" stroke-width="5"/></g></svg>
```

### `assets/heroine-sit/midriff.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M187 594 Q265 602 347 587 Q322 646 338 687 L362 737 Q269 796 151 735 Q157 703 182 676 Q198 652 187 594Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M190 627 L342 613 L333 649 Q267 668 193 650Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M249 708 Q255 700 265 698" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-sit/smileTeeth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M226 303 Q247 296 265 299 Q285 299 302 294 Q289 308 268 309 Q246 311 226 303Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-sit/neck.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M221 316 Q251 340 295 319 L298 366 Q300 387 321 401 Q292 418 267 422 Q232 420 202 409 Q222 395 224 369Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M223 325 Q264 346 294 326 L296 361 Q268 375 224 359Z" fill="#e3a989" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-sit/seatFront.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path fill="#a76b3c" d="M54 1201 H455 L445 1240 L65 1240 Z"/>
    <path fill="none" stroke="#dfaa6d" stroke-width="4" d="M67 1207 L442 1207"/>
    <path fill="none" stroke="#70442b" stroke-width="3" d="M72 1232 H438"/>
  </g>
</svg>

```

### `assets/heroine-sit/rightForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-sit/openTongue.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M241 323 Q256 311 271 319 Q283 312 290 320 Q278 335 262 333 Q248 331 241 323Z" fill="#ee7781" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-sit/eyes_happy.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M171 247 Q203 225 235 251 M288 250 Q320 226 350 246" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine-sit/openTeeth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M228 302 Q245 293 264 296 Q282 295 301 297 Q295 307 279 309 Q249 310 228 302Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-sit/hairFront.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M94 340 Q102 280 108 218 Q117 106 190 80 Q231 61 270 72 Q322 58 366 108 Q408 158 414 242 L429 365 Q405 392 368 402 Q385 348 381 315 Q376 280 359 246 Q349 206 316 175 Q289 145 268 116 Q240 153 200 180 Q165 208 149 256 Q134 299 158 338 Q135 329 122 297 Q113 313 94 340Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M109 244 Q119 144 181 108 Q219 86 264 87 L265 108 Q214 108 177 148 Q143 182 130 220Z M288 91 Q336 91 368 135 Q388 164 398 217 Q365 147 317 132Z" fill="#4b3021" stroke="none" stroke-width="6"/>
    <path d="M143 225 Q132 293 151 324 Q135 311 128 289Z M356 217 Q404 272 423 363 Q404 383 375 395 Q397 352 380 308Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M270 74 Q266 88 268 116" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-sit/skirt.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M156 722 Q248 780 353 731 Q393 797 420 1049 Q251 1105 103 1050 Q107 859 156 722Z" fill="#383947" stroke="#140e10" stroke-width="6"/>
    <path d="M158 750 L182 771 L121 1013 L111 1049 Q119 869 158 750Z M214 784 L236 788 L212 1073 L184 1069Z M300 780 L323 774 L382 1061 L352 1070Z M355 748 L365 768 Q400 864 416 1047 L400 1052 Q378 868 355 748Z" fill="#282933" stroke="none" stroke-width="6"/>
    <path d="M188 771 Q153 866 128 1054 M235 786 L208 1075 M321 773 Q350 882 381 1060" fill="none" stroke="#140e10" stroke-width="5"/>
    <path d="M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z" fill="#383947" stroke="#140e10" stroke-width="6"/>
    <path d="M149 749 Q256 796 362 757 L366 767 Q259 813 146 760Z" fill="#282933" stroke="none" stroke-width="6"/>
    <path d="M194 742 L181 775 M328 740 L345 778" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-sit/body.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M140 428 Q169 401 223 394 L305 388 Q351 391 376 411 Q401 430 391 464 L366 510 Q350 560 329 608 L201 607 Q181 559 158 508 L133 473 Q121 451 140 428Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M132 450 Q155 471 183 479 L201 516 L178 546 L147 494 Q125 476 132 450Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M325 397 Q363 402 376 414 Q398 431 388 457 L371 476 Q372 431 325 397Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M183 462 Q208 443 232 453 M273 447 Q301 428 329 436" fill="none" stroke="#140e10" stroke-width="3.5"/>
  </g>
</svg>

```

### `assets/heroine-sit/braidR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(373 345) scale(-1 1) rotate(-7)">
    <g transform="translate(0 0)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(5 44)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(9 87)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(11 128)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <path d="M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    <path d="M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-sit/eyes_closed.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M170 243 Q198 259 234 250 M288 251 Q326 257 350 243" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine-walk/chair.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path fill="#a76b3c" d="M96 681 Q104 671 116 681 L135 1170 L108 1174 Z M394 681 Q406 671 414 681 L402 1174 L375 1170 Z"/>
    <path fill="#c48b52" d="M128 727 H382 V769 H128 Z M126 851 H384 V893 H126 Z"/>
    <path fill="#bf854c" d="M124 1200 H151 V1550 H124 Z M359 1200 H386 V1550 H359 Z"/>
    <path fill="#a76b3c" d="M66 1220 H94 V1550 H66 Z M416 1220 H444 V1550 H416 Z"/>
    <path fill="#8e532f" d="M82 1420 H428 V1459 H82 Z"/>
    <path fill="#c48b52" d="M79 1161 L429 1161 L455 1198 L54 1198 Z"/>
    <path fill="#a76b3c" d="M54 1198 L455 1198 L445 1240 L65 1240 Z"/>
    <path fill="none" stroke="#e1ac70" stroke-width="4" d="M83 1173 L423 1173"/>
    <path fill="none" stroke="#6c4029" stroke-width="4" d="M94 1420 H414"/>
  </g>
</svg>

```

### `assets/heroine-walk/shinL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M161 1114.75 Q190 1090.25 219 1114.75 L213 1526.35 Q190 1553.3 167 1526.35Z"/><path d="M202 1163.75 L201 1494.5" stroke="#282933" stroke-width="9"/></g></svg>
```

### `assets/heroine-walk/mouth_open.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z" fill="#d25a5d" stroke="#140e10" stroke-width="5"/>
    <path d="M224 301 Q241 290 263 293 Q284 292 305 294 Q298 321 281 332 Q255 343 237 325 Q226 316 224 301Z" fill="#33131d" stroke="#bb4652" stroke-width="2.6"/>
  </g>
</svg>

```

### `assets/heroine-walk/brows.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M167 215 Q192 193 233 211 L229 221 Q198 208 167 220Z M286 205 Q316 179 346 201 L347 207 Q316 194 288 216Z" fill="#140e10" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-walk/hairBack.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M114 181 Q139 71 246 64 Q330 56 377 133 Q401 170 413 258 L433 384 Q404 422 342 431 L180 435 Q126 428 92 388 Q77 367 90 317Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M119 201 Q133 156 162 145 Q130 283 156 343 Q172 375 209 408 L181 431 Q130 422 104 389 Q88 364 102 317Z M351 176 Q400 223 403 292 L428 382 Q409 407 365 418 Q397 372 378 311Z" fill="#28160c" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-walk/thighL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M160 831.467 Q190 788.84 220 831.467 L219 1137.267 Q190 1198.427 161 1137.267Z"/></g></svg>
```

### `assets/heroine-walk/skirt_seated.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round"><path fill="#383947" d="M156 722 Q248 780 353 731 L383 805 L356 829 Q254 847 143 815 L123 798Z"/><path fill="#282933" d="M181 767 L207 782 L183 826 L154 817Z M300 780 L324 774 L365 822 L340 831Z"/><path fill="none" d="M205 787 L181 822 M321 783 L354 824 M143 804 Q260 831 376 807"/><path fill="#383947" d="M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z"/></g></svg>
```

### `assets/heroine-walk/rightHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M84 764 L85 768 M98 765 L98 771 M109 760 L112 767" fill="none" stroke="#140e10" stroke-width="2.8"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-walk/leftUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M107 462 Q118 450 122 457 L114 521 L101 530Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-walk/leftForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-walk/smileTongue.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M248 315 Q267 308 287 313 Q270 326 248 315Z" fill="#ee7781" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-walk/eyes.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M166 242 Q202 215 237 251 Q202 259 169 246Z M285 251 Q310 218 351 242 Q326 259 285 251Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
    <ellipse cx="203" cy="244" rx="13" ry="11" fill="#382218"/>
    <ellipse cx="318" cy="244" rx="13" ry="11" fill="#382218"/>
    <ellipse cx="204" cy="245" rx="7" ry="9" fill="#140e10"/>
    <ellipse cx="319" cy="245" rx="7" ry="9" fill="#140e10"/>
    <ellipse cx="207" cy="241" rx="2.8" ry="3.2" fill="white"/>
    <ellipse cx="322" cy="241" rx="2.8" ry="3.2" fill="white"/>
    <path d="M163 235 L169 242 Q202 215 237 251 M285 251 Q312 218 350 242 L357 235" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine-walk/footL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#211f29" d="M166 1504.0 Q190 1518.0 214 1504.0 L233 1524.0 Q247 1530.0 243 1550.0 L147 1550.0 Q141 1527.0 166 1504.0Z"/><path d="M151 1539.0 H238" stroke="#45434c" stroke-width="5"/></g></svg>
```

### `assets/heroine-walk/rightUpperArm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M142 424 Q166 429 171 455 L155 519 L145 598 Q127 622 104 602 Q91 560 100 508 L106 460 Q111 431 142 424Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M107 462 Q118 450 122 457 L114 521 L101 530Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M100 510 Q130 520 159 499 Q154 548 148 579 Q149 605 133 617 Q114 625 100 607 Q88 565 100 510Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M101 516 L115 519 Q104 569 121 615 Q110 616 102 605 Q93 566 101 516Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-walk/manifest.js`

```javascript
import baseGazeRig from '../../presets/heroine-eye-rig.js';
const gazeRig={...baseGazeRig,offset:{x:242,y:224.074074074}};
const point = (x, y) => ({ x: (x + 242) / 1024, y: (y + 224.074074074) / 2000 });

function layer(name, parent, z, x, y, [l, t, r, b]) {
  return {
    name, parent, z, pivot: point(x, y),
    polygon: [point(l, t), point(r, t), point(r, b), point(l, b)],
    image: new URL(`./${name}.svg`, import.meta.url).href,
  };
}

const parts = [
  layer('body', null, 12, 255, 717, [115, 375, 405, 620]),
  layer('skirt', 'body', 15, 253, 744, [95, 711, 430, 1080]),
  layer('thighL', 'body', 7, 190, 850, [130, 810, 255, 1160]),
  layer('shinL', 'thighL', 8, 190, 1127, [130, 1090, 255, 1550]),
  layer('footL', 'shinL', 9, 190, 1520, [130, 1480, 255, 1560]),
  layer('thighR', 'body', 7, 320, 850, [260, 810, 385, 1160]),
  layer('shinR', 'thighR', 8, 320, 1127, [260, 1090, 385, 1550]),
  layer('footR', 'shinR', 9, 320, 1520, [260, 1480, 385, 1560]),
  layer('midriff', 'body', 11, 250, 624, [143, 578, 371, 788]),
  layer('top', 'body', 18, 254, 532, [144, 471, 377, 655]),
  layer('neck', 'body', 17, 260, 405, [193, 307, 329, 462]),
  layer('head', 'neck', 30, 260, 395, [114, 100, 398, 374]),
  layer('hairBack', 'head', 3, 260, 395, [71, 51, 441, 442]),
  layer('hairFront', 'head', 35, 260, 114, [86, 54, 437, 412]),
  layer('eyes', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_happy', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('eyes_closed', 'head', 31, 259, 244, [154, 215, 364, 264]),
  layer('brows', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('brows_raised', 'head', 32, 259, 208, [155, 162, 355, 228]),
  layer('mouth', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('mouth_smile', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('smileTeeth', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('smileTongue', 'mouth_smile', 34, 261, 303, [215, 281, 316, 346]),
  layer('mouth_open', 'head', 33, 261, 303, [215, 281, 316, 346]),
  layer('openTeeth', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('openTongue', 'mouth_open', 34, 261, 303, [215, 281, 316, 346]),
  layer('mole', 'head', 32, 337, 266, [329, 258, 345, 274]),
  layer('braidL', 'head', 27, 149, 347, [102, 286, 222, 580]),
  layer('braidR', 'head', 27, 373, 346, [285, 285, 421, 581]),
  layer('leftUpperArm', 'body', 10, 137, 450, [84, 415, 180, 632]),
  layer('leftForearm', 'leftUpperArm', 22, 123, 593, [62, 567, 158, 735]),
  layer('leftHand', 'leftForearm', 21, 108, 718, [66, 700, 145, 807]),
  layer('rightUpperArm', 'body', 9, 373, 431, [330, 396, 426, 613]),
  layer('rightForearm', 'rightUpperArm', 25, 387, 574, [352, 548, 448, 716]),
  layer('rightHand', 'rightForearm', 24, 402, 699, [365, 681, 444, 788]),
];

function face(eye, brow, lip) {
  return Object.fromEntries([
    'eyes', 'eyes_happy', 'eyes_closed', 'brows', 'brows_raised',
    'mouth', 'mouth_smile', 'mouth_open',
  ].map(name => [name, [eye, brow, lip].includes(name)]));
}

export default {
  name: 'Walking heroine — planted-foot walk preset',
  gazeRig,
  absoluteDrawOrder: true,
  parts,
  expressions: {
    neutral: face('eyes', 'brows', 'mouth'),
    greeting: face('eyes', 'brows_raised', 'mouth_smile'),
    laugh: face('eyes_happy', 'brows_raised', 'mouth_open'),
  },
};

```

### `assets/heroine-walk/leftHand.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="">
    <path d="M92 713 Q112 706 125 719 L125 733 Q141 748 136 756 Q132 761 122 751 L125 780 Q124 788 118 788 L112 767 L112 792 Q109 800 103 795 L98 771 L98 789 Q93 795 89 788 L85 768 Q81 783 76 779 Q71 770 76 751 Q81 732 92 713Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M91 716 Q103 709 122 718 L124 730 Q103 737 84 731Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M84 764 L85 768 M98 765 L98 771 M109 760 L112 767" fill="none" stroke="#140e10" stroke-width="2.8"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-walk/mouth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M228 307 Q245 295 259 298 Q276 296 298 300 Q278 316 258 317 Q241 316 228 307Z" fill="#b63e4b" stroke="#140e10" stroke-width="4"/>
    <path d="M229 307 Q262 309 296 301" fill="none" stroke="#140e10" stroke-width="3"/>
  </g>
</svg>

```

### `assets/heroine-walk/mole.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="337" cy="266" rx="3.6" ry="3.8" fill="#140e10"/>
  </g>
</svg>

```

### `assets/heroine-walk/room.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960">
  <path fill="#af7a43" d="M0 0h540v960H0z"/>
  <path fill="#976337" d="M0 0h540v8H0zM0 155h540v8H0zM0 310h540v8H0zM0 465h540v8H0zM0 620h540v8H0zM0 775h540v8H0z"/>
  <path fill="none" stroke="#734b2e" stroke-width="3" d="M0 8h540M0 163h540M0 318h540M0 473h540M0 628h540M0 783h540"/>
  <path fill="none" stroke="#976337" stroke-width="2" d="M18 54q34-4 68 0t70 0m35 31q40 4 78 0m84 33q39-4 76 0t74 0M12 208q42 4 81 0m55 33q46-4 91 0t70 0m96-53q45 4 82 0M33 376q49-4 94 0t74 0m38-27q35 4 70 0t80 0m79 49q40-4 72 0M15 534q39 4 77 0m66 34q40-4 79 0t77 0m83-69q48 4 93 0M26 692q35-4 69 0t71 0m48 23q45 4 88 0t78 0m62-50q47-4 86 0"/>
  <path fill="#734b2e" d="M0 805h540v155H0z"/>
  <path fill="#926238" d="M0 836h540v124H0z"/>
  <path fill="#6f5531" d="M0 767h540v66H0z"/>
  <path fill="#a5804e" d="M0 767h540v18H0z"/>
  <rect x="422" y="144" width="109" height="183" rx="3" fill="#694729"/>
  <rect x="429" y="151" width="95" height="169" fill="#6b7665"/>
  <path fill="#86917b" d="M430 152h94v8h-86v160h-8z"/>
  <g transform="translate(484 224) rotate(15)">
    <path d="M0 0Q-21 0-22-19Q-13-22 1-5Q6-27 19-25Q23-11 5 0Q21-3 19 7Q13 16 2 6Q-5 17-14 12Q-20 6 0 0Z" fill="#c48b42" stroke="#8c5c28" stroke-width="2"/>
    <path d="M1-7 3 7M1-6l-6-6m6 6 5-9" fill="none" stroke="#564027" stroke-width="2.5" stroke-linecap="round"/>
  </g>
<path fill="#b28c60" d="M0 900H540V960H0Z"/><path d="M0 900H540" fill="none" stroke="#543c29" stroke-width="4"/></svg>

```

### `assets/heroine-walk/legs_seated.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M148 906 Q142 866 170 846 Q190 826 210 846 Q238 866 232 906 L228 986 Q224 1020 190 1030 Q156 1020 152 986Z"/><path fill="#4b4c60" d="M278 906 Q272 866 300 846 Q320 826 340 846 Q368 866 362 906 L358 986 Q354 1020 320 1030 Q286 1020 282 986Z"/><path fill="#4b4c60" d="M164 1010 Q190 1030 216 1010 L214 1452 Q190 1478 166 1452Z"/><path fill="#4b4c60" d="M294 1010 Q320 1030 346 1010 L344 1452 Q320 1478 296 1452Z"/><path d="M186 1040 L185 1430 M316 1040 L315 1430" fill="none" stroke="#282933" stroke-width="9"/><path fill="#211f29" d="M166 1450 Q190 1466 214 1450 L233 1479 Q241 1488 239 1499 L143 1499 Q141 1480 166 1450Z"/><path fill="#211f29" d="M296 1450 Q320 1466 344 1450 L363 1479 Q371 1488 369 1499 L273 1499 Q271 1480 296 1450Z"/><path d="M148 1489 H236 M278 1489 H366" fill="none" stroke="#45434c" stroke-width="5"/></g></svg>

```

### `assets/heroine-walk/brows_raised.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M167 214 Q192 192 233 207 L229 218 Q196 205 167 219Z M286 194 Q315 166 344 185 L346 191 Q316 181 290 206Z" fill="#140e10" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-walk/head.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M155 184 Q173 123 235 112 Q296 99 345 161 L372 239 Q387 224 389 244 Q388 269 361 280 Q350 314 321 332 Q291 353 263 365 Q236 363 206 344 Q170 325 153 292 Q131 285 126 260 Q120 239 141 239Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M151 244 Q154 302 194 328 Q225 352 264 361 Q239 361 207 343 Q171 325 154 290 Q135 282 130 260 Q128 247 136 244Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M140 251 Q131 253 142 268 M373 246 Q383 239 376 256" fill="none" stroke="#9c5d4b" stroke-width="3.5"/>
    <ellipse cx="197" cy="286" rx="18" ry="6" fill="#efa991"/>
    <ellipse cx="328" cy="287" rx="17" ry="6" fill="#efa991"/>
    <path d="M267 250 Q270 270 276 278 L269 290" fill="none" stroke="#140e10" stroke-width="3.8"/>
  </g>
</svg>

```

### `assets/heroine-walk/braidL.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(148 346) rotate(-3)">
    <g transform="translate(0 0)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(5 44)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(9 87)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(11 128)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <path d="M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    <path d="M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-walk/story.js`

```javascript
import {createWalkPreset} from '../../presets/walk.js';
// A complete idle -> walk -> idle preview. The reusable gait lives in presets/walk.js.
export const poseAt=createWalkPreset({duration:4.2,cycleSeconds:1.4,stridePx:50,liftPx:78,
 direction:1,travel:true,startXPx:-75});
export const scene={bg:0xaf7a43,room:'room.svg',worldHeight:2.7};

```

### `assets/heroine-walk/shinR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M291 1114.75 Q320 1090.25 349 1114.75 L343 1526.35 Q320 1553.3 297 1526.35Z"/><path d="M332 1163.75 L331 1494.5" stroke="#282933" stroke-width="9"/></g></svg>
```

### `assets/heroine-walk/top.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M155 522 Q212 515 247 502 Q292 484 361 479 Q371 519 355 550 Q340 585 336 632 Q279 649 187 629 Q182 590 172 569 Q160 548 155 522Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M160 525 Q194 524 209 516 Q200 553 220 580 Q256 608 338 612 L334 630 Q269 645 189 627 Q185 594 174 566Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M213 567 Q235 582 270 573 M314 609 Q322 605 333 605" fill="#450e1b" stroke="#140e10" stroke-width="3"/>
  </g>
</svg>

```

### `assets/heroine-walk/mouth_smile.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z" fill="#d25a5d" stroke="#140e10" stroke-width="5"/>
    <path d="M221 303 Q245 293 265 296 Q285 296 308 290 Q292 313 276 321 Q250 327 221 303Z" fill="#33131d" stroke="#bb4652" stroke-width="2.6"/>
  </g>
</svg>

```

### `assets/heroine-walk/thighR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#4b4c60" d="M290 831.467 Q320 788.84 350 831.467 L349 1137.267 Q320 1198.427 291 1137.267Z"/></g></svg>
```

### `assets/heroine-walk/footR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000"><g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path fill="#211f29" d="M296 1504.0 Q320 1518.0 344 1504.0 L363 1524.0 Q377 1530.0 373 1550.0 L277 1550.0 Q271 1527.0 296 1504.0Z"/><path d="M281 1539.0 H368" stroke="#45434c" stroke-width="5"/></g></svg>
```

### `assets/heroine-walk/midriff.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M187 594 Q265 602 347 587 Q322 646 338 687 L362 737 Q269 796 151 735 Q157 703 182 676 Q198 652 187 594Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M190 627 L342 613 L333 649 Q267 668 193 650Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M249 708 Q255 700 265 698" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-walk/smileTeeth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M226 303 Q247 296 265 299 Q285 299 302 294 Q289 308 268 309 Q246 311 226 303Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-walk/neck.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M221 316 Q251 340 295 319 L298 366 Q300 387 321 401 Q292 418 267 422 Q232 420 202 409 Q222 395 224 369Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M223 325 Q264 346 294 326 L296 361 Q268 375 224 359Z" fill="#e3a989" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-walk/seatFront.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke="#140e10" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path fill="#a76b3c" d="M54 1201 H455 L445 1240 L65 1240 Z"/>
    <path fill="none" stroke="#dfaa6d" stroke-width="4" d="M67 1207 L442 1207"/>
    <path fill="none" stroke="#70442b" stroke-width="3" d="M72 1232 H438"/>
  </g>
</svg>

```

### `assets/heroine-walk/rightForearm.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(510 -19) scale(-1 1)">
    <path d="M99 594 Q105 575 126 575 Q144 577 146 599 Q137 654 150 715 Q118 735 70 718 Q87 654 91 616 Q93 601 99 594Z" fill="#64101d" stroke="#140e10" stroke-width="6"/>
    <path d="M99 596 Q102 586 112 583 Q101 637 103 671 Q106 698 94 722 L74 716 Q89 664 92 623Z" fill="#450e1b" stroke="none" stroke-width="6"/>
    <path d="M77 702 Q114 718 147 701" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-walk/openTongue.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M241 323 Q256 311 271 319 Q283 312 290 320 Q278 335 262 333 Q248 331 241 323Z" fill="#ee7781" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-walk/eyes_happy.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M171 247 Q203 225 235 251 M288 250 Q320 226 350 246" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```

### `assets/heroine-walk/openTeeth.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M228 302 Q245 293 264 296 Q282 295 301 297 Q295 307 279 309 Q249 310 228 302Z" fill="#fff5e9" stroke="none" stroke-width="6"/>
  </g>
</svg>

```

### `assets/heroine-walk/hairFront.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M94 340 Q102 280 108 218 Q117 106 190 80 Q231 61 270 72 Q322 58 366 108 Q408 158 414 242 L429 365 Q405 392 368 402 Q385 348 381 315 Q376 280 359 246 Q349 206 316 175 Q289 145 268 116 Q240 153 200 180 Q165 208 149 256 Q134 299 158 338 Q135 329 122 297 Q113 313 94 340Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M109 244 Q119 144 181 108 Q219 86 264 87 L265 108 Q214 108 177 148 Q143 182 130 220Z M288 91 Q336 91 368 135 Q388 164 398 217 Q365 147 317 132Z" fill="#4b3021" stroke="none" stroke-width="6"/>
    <path d="M143 225 Q132 293 151 324 Q135 311 128 289Z M356 217 Q404 272 423 363 Q404 383 375 395 Q397 352 380 308Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M270 74 Q266 88 268 116" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-walk/skirt.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M156 722 Q248 780 353 731 Q393 797 420 1049 Q251 1105 103 1050 Q107 859 156 722Z" fill="#383947" stroke="#140e10" stroke-width="6"/>
    <path d="M158 750 L182 771 L121 1013 L111 1049 Q119 869 158 750Z M214 784 L236 788 L212 1073 L184 1069Z M300 780 L323 774 L382 1061 L352 1070Z M355 748 L365 768 Q400 864 416 1047 L400 1052 Q378 868 355 748Z" fill="#282933" stroke="none" stroke-width="6"/>
    <path d="M188 771 Q153 866 128 1054 M235 786 L208 1075 M321 773 Q350 882 381 1060" fill="none" stroke="#140e10" stroke-width="5"/>
    <path d="M156 722 Q250 776 353 731 L368 769 Q260 817 144 761Z" fill="#383947" stroke="#140e10" stroke-width="6"/>
    <path d="M149 749 Q256 796 362 757 L366 767 Q259 813 146 760Z" fill="#282933" stroke="none" stroke-width="6"/>
    <path d="M194 742 L181 775 M328 740 L345 778" fill="none" stroke="#140e10" stroke-width="4"/>
  </g>
</svg>

```

### `assets/heroine-walk/body.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M140 428 Q169 401 223 394 L305 388 Q351 391 376 411 Q401 430 391 464 L366 510 Q350 560 329 608 L201 607 Q181 559 158 508 L133 473 Q121 451 140 428Z" fill="#f6cfb3" stroke="#140e10" stroke-width="6"/>
    <path d="M132 450 Q155 471 183 479 L201 516 L178 546 L147 494 Q125 476 132 450Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M325 397 Q363 402 376 414 Q398 431 388 457 L371 476 Q372 431 325 397Z" fill="#e3a989" stroke="none" stroke-width="6"/>
    <path d="M183 462 Q208 443 232 453 M273 447 Q301 428 329 436" fill="none" stroke="#140e10" stroke-width="3.5"/>
  </g>
</svg>

```

### `assets/heroine-walk/braidR.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(373 345) scale(-1 1) rotate(-7)">
    <g transform="translate(0 0)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(5 44)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(9 87)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <g transform="translate(11 128)">
    <path d="M-31 -19 Q-17 -32 -2 -20 Q16 -30 33 -14 Q35 4 23 16 L7 38 Q-18 29 -33 5Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M-30 -12 Q-15 13 6 22 L19 17 L7 35 Q-13 28 -30 4Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M-22 -15 Q-6 -10 3 4 Q15 1 28 -13" fill="none" stroke="#140e10" stroke-width="3.2"/>
    </g>
    <path d="M-25 -31 Q-3 -41 24 -29 L23 -16 Q0 -9 -25 -18Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    <path d="M-21 -28 Q-2 -35 19 -27 L18 -22 Q0 -17 -21 -23Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M11 161 L33 160 Q29 186 49 210 Q29 226 2 217 Q16 193 11 161Z" fill="#382218" stroke="#140e10" stroke-width="6"/>
    <path d="M17 168 L25 168 Q23 190 38 213 L28 217 Q12 202 17 168Z" fill="#28160c" stroke="none" stroke-width="6"/>
    <path d="M8 155 Q19 161 32 154 L35 169 Q23 175 8 169Z" fill="#21171c" stroke="#140e10" stroke-width="4"/>
    </g>
  </g>
</svg>

```

### `assets/heroine-walk/eyes_closed.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="2000" viewBox="0 0 1024 2000">
  <g transform="translate(242 224.074074074)" stroke-linejoin="round" stroke-linecap="round">
    <path d="M170 243 Q198 259 234 250 M288 251 Q326 257 350 243" fill="none" stroke="#140e10" stroke-width="5"/>
  </g>
</svg>

```
