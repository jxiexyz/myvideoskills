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

