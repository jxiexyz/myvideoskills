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

