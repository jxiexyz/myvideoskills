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

