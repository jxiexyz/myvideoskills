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

