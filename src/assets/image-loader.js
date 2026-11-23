/** Load an image from a File, URL, or already decoded HTMLImageElement. */
export async function loadCharacterImage(input) {
  if (input instanceof HTMLImageElement) {
    if (!input.complete) await new Promise((resolve, reject) => { input.onload = resolve; input.onerror = reject; });
    return input;
  }
  let url = input;
  let revoke = false;
  if (input instanceof Blob) { url = URL.createObjectURL(input); revoke = true; }
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;
  try {
    await image.decode();
    return image;
  } finally {
    if (revoke) URL.revokeObjectURL(url);
  }
}

/**
 * Part definition coordinates are normalized to the original image (0..1).
 * polygon is an array of {x,y}; pivot is normalized image-space coordinates.
 */
export function createPartTexture(image, definition) {
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;
  const points = definition.polygon.map(p => ({ x: p.x * w, y: p.y * h }));
  const minX = Math.max(0, Math.floor(Math.min(...points.map(p => p.x))));
  const minY = Math.max(0, Math.floor(Math.min(...points.map(p => p.y))));
  const maxX = Math.min(w, Math.ceil(Math.max(...points.map(p => p.x))));
  const maxY = Math.min(h, Math.ceil(Math.max(...points.map(p => p.y))));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, maxX - minX);
  canvas.height = Math.max(1, maxY - minY);
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.beginPath();
  points.forEach((p, i) => i ? ctx.lineTo(p.x - minX, p.y - minY) : ctx.moveTo(p.x - minX, p.y - minY));
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, minX, minY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  ctx.restore();
  return { canvas, bounds: { minX, minY, width: canvas.width, height: canvas.height }, imageSize: { width: w, height: h } };
}

