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

