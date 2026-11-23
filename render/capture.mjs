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

