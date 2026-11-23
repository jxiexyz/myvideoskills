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

