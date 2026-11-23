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

