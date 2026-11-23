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

