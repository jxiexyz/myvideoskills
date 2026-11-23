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

