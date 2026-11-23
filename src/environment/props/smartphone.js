import * as THREE from 'three';

export const DYNAMIC_ISLAND_STATES = [
  { id: 'compact', label: 'Compact Idle', description: 'Minimal sleek pill tucked cleanly in top bezel.' },
  { id: 'incoming_message', label: 'Incoming Message', description: 'Expanded pill with avatar badge and crisp message alert.' },
  { id: 'incoming_call', label: 'Incoming Call', description: 'Live caller bar with accept/decline cartoon action buttons.' },
  { id: 'music_playback', label: 'Music Playback', description: 'Album cover tile + animated deterministic equalizer bars.' },
  { id: 'payment_confirmation', label: 'Payment Confirmed', description: 'Emerald check ring expansion confirming instant transfer.' },
  { id: 'financial_alert', label: 'Financial Alert', description: 'Gold deposit alert expanding into nine-zeros bank balance emphasis.' },
  { id: 'notification_collapse', label: 'Notification Collapse', description: 'Smooth contraction back into compact pill state.' },
];

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function createRoundedRectShape(w, h, r) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

export class CartoonSmartphoneAsset {
  constructor(style, {
    width = 0.62,
    height = 1.28,
    depth = 0.068,
    frameColor = '#3a4152',
    accentColor = '#f2b84b',
    initialState = 'financial_alert',
  } = {}) {
    this.style = style;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.group = new THREE.Group();
    this.group.name = 'CartoonSmartphone';

    this.state = {
      islandState: initialState,
      balanceTarget: 1000000000,
      balanceLabel: 'CHECKING BALANCE',
      headline: '+$1,000,000,000',
      subtitle: 'Wire Deposit Cleared',
      callerName: 'Studio Producer',
      messageSender: 'Alex',
      messageText: 'Deal closed! Check your balance.',
      trackTitle: 'Golden Horizon',
      paymentAmount: '$285,000',
      accentColor,
    };

    const bodyShape = createRoundedRectShape(width, height, 0.095);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.01,
      bevelSegments: 2,
    });
    bodyGeo.translate(0, 0, -depth / 2);
    const bodyMesh = style.createOutlinedMesh(bodyGeo, frameColor, {
      outline: 'both',
      edgeThreshold: 32,
      hullScale: 1.032,
    });
    this.group.add(bodyMesh);

    const powerBtn = style.box(0.018, 0.16, 0.026, '#232836', { outline: 'edges' });
    powerBtn.position.set(width / 2 + 0.014, 0.16, 0);
    const volUp = style.box(0.018, 0.11, 0.026, '#232836', { outline: 'edges' });
    volUp.position.set(-width / 2 - 0.014, 0.24, 0);
    const volDown = style.box(0.018, 0.11, 0.026, '#232836', { outline: 'edges' });
    volDown.position.set(-width / 2 - 0.014, 0.09, 0);
    const actionBtn = style.box(0.018, 0.06, 0.026, accentColor, { outline: 'edges' });
    actionBtn.position.set(-width / 2 - 0.014, 0.37, 0);
    this.group.add(powerBtn, volUp, volDown, actionBtn);

    const camIsland = style.box(0.24, 0.24, 0.028, '#2b3140', { outline: 'edges' });
    camIsland.position.set(-0.12, height * 0.32, -depth / 2 - 0.018);
    this.group.add(camIsland);
    const lensOffsets = [[-0.17, height * 0.37], [-0.17, height * 0.27], [-0.07, height * 0.32]];
    for (const [lx, ly] of lensOffsets) {
      const ring = style.cylinder(0.045, 0.045, 0.024, 14, '#141720', { outline: 'hull', hullScale: 1.1 });
      ring.rotation.x = Math.PI / 2;
      ring.position.set(lx, ly, -depth / 2 - 0.032);
      const lens = style.cylinder(0.028, 0.028, 0.028, 12, '#3a6e9e', { unlit: true, outline: 'none' });
      lens.rotation.x = Math.PI / 2;
      lens.position.set(lx, ly, -depth / 2 - 0.035);
      this.group.add(ring, lens);
    }

    this.screenCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    if (this.screenCanvas) {
      this.screenCanvas.width = 512;
      this.screenCanvas.height = 1024;
      this.screenCtx = this.screenCanvas.getContext('2d');
      this.screenTexture = style.trackTexture(new THREE.CanvasTexture(this.screenCanvas));
      this.screenTexture.colorSpace = THREE.SRGBColorSpace;
      this.screenTexture.minFilter = THREE.LinearFilter;
      this.screenTexture.magFilter = THREE.LinearFilter;
    } else {
      this.screenCtx = null;
      this.screenTexture = null;
    }

    const screenGeo = style.trackGeometry(new THREE.PlaneGeometry(width - 0.06, height - 0.06));
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.screenTexture,
      color: this.screenTexture ? 0xffffff : 0x162030,
    });
    this._screenMat = screenMat;
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = depth / 2 + 0.015;
    this.group.add(screenMesh);

    this.update(0.8);
  }

  setState(patch = {}) {
    Object.assign(this.state, patch);
    return this;
  }

  update(timeSec = 0) {
    if (!this.screenCtx || !this.screenCanvas) return;
    const ctx = this.screenCtx;
    const W = this.screenCanvas.width;
    const H = this.screenCanvas.height;
    const t = Math.max(0, Number(timeSec) || 0);
    const mode = this.state.islandState || 'compact';

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 62);
    ctx.clip();

    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#162136');
    bgGrad.addColorStop(0.55, '#1d2d4a');
    bgGrad.addColorStop(1, '#121929');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(242, 184, 75, 0.12)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.28, 170, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('9:41', 42, 56);
    ctx.textAlign = 'right';
    ctx.fillText('100%', W - 42, 56);

    const cardY = mode === 'compact' || mode === 'notification_collapse' ? 210 : 286;
    drawRoundedRect(ctx, 32, cardY, W - 64, 340, 34);
    ctx.fillStyle = '#fdf8ef';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#140e10';
    ctx.stroke();

    drawRoundedRect(ctx, 56, cardY + 28, 190, 34, 10);
    ctx.fillStyle = '#1b8a5a';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PRIVATE VAULT', 72, cardY + 51);

    ctx.fillStyle = '#475569';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(this.state.balanceLabel, 56, cardY + 106);

    const countP = clamp01(t / 1.5);
    const easedCount = 1 - Math.pow(1 - countP, 3);
    const currentBal = Math.round(this.state.balanceTarget * easedCount);
    const formatted = '$' + currentBal.toLocaleString('en-US');

    const pulse = countP >= 0.98 ? 1 + Math.sin((t - 1.5) * 6) * 0.035 : 1;
    ctx.save();
    ctx.translate(W / 2, cardY + 188);
    ctx.scale(pulse, pulse);
    ctx.textAlign = 'center';
    ctx.font = '800 50px "JetBrains Mono", monospace';
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#140e10';
    ctx.strokeText(formatted, 0, 0);
    ctx.fillStyle = '#f2b84b';
    ctx.fillText(formatted, 0, 0);
    ctx.restore();

    drawRoundedRect(ctx, 56, cardY + 232, W - 112, 74, 18);
    ctx.fillStyle = '#162136';
    ctx.fill();
    ctx.fillStyle = '#5eead4';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('STATUS: ACTIVE', 78, cardY + 277);
    ctx.fillStyle = '#f2b84b';
    ctx.textAlign = 'right';
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillText('+99,900%', W - 78, cardY + 277);

    const chartY = cardY + 372;
    drawRoundedRect(ctx, 32, chartY, W - 64, 240, 30);
    ctx.fillStyle = '#243554';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#140e10';
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MONTHLY GROWTH', 60, chartY + 48);

    const bars = [0.22, 0.36, 0.5, 0.72, 1.0];
    const barColors = ['#60a5fa', '#38bdf8', '#34d399', '#fbbf24', '#f97316'];
    for (let i = 0; i < bars.length; i++) {
      const bp = clamp01((t - i * 0.12) / 0.65);
      const bh = 135 * bars[i] * easeOutBack(bp);
      const bx = 66 + i * 78;
      const by = chartY + 210 - bh;
      drawRoundedRect(ctx, bx, by, 54, Math.max(12, bh), 10);
      ctx.fillStyle = barColors[i];
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#140e10';
      ctx.stroke();
    }

    // Integrated Dynamic Island Pill
    const expandP = mode === 'compact'
      ? 0
      : mode === 'notification_collapse'
        ? 1 - clamp01(t / 0.85)
        : clamp01(easeOutBack(clamp01(t / 0.55)));

    const pillW = 154 + (W - 208) * Math.max(0, Math.min(1.06, expandP));
    const pillH = 44 + 132 * Math.max(0, Math.min(1.04, expandP));
    const pillX = (W - pillW) / 2;
    const pillY = 26;
    const pillR = Math.min(pillH / 2, 36);

    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, pillR);
    ctx.fillStyle = '#090b10';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = expandP > 0.25 ? '#f2b84b' : '#262d3d';
    ctx.stroke();

    if (expandP < 0.25) {
      ctx.beginPath();
      ctx.arc(pillX + pillW - 26, pillY + pillH / 2, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#1f324d';
      ctx.fill();
    } else {
      ctx.save();
      ctx.globalAlpha = clamp01((expandP - 0.25) / 0.5);
      this._drawIslandContent(ctx, mode, pillX, pillY, pillW, pillH, t);
      ctx.restore();
    }

    drawRoundedRect(ctx, W / 2 - 74, H - 30, 148, 8, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W * 0.52, 0);
    ctx.lineTo(0, H * 0.42);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 62);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#140e10';
    ctx.stroke();

    if (this.screenTexture) {
      this.screenTexture.needsUpdate = true;
    }
  }

  _drawIslandContent(ctx, mode, x, y, w, h, t) {
    const cy = y + h / 2;
    if (mode === 'financial_alert') {
      ctx.beginPath();
      ctx.arc(x + 54, cy, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#f2b84b';
      ctx.fill();
      ctx.fillStyle = '#140e10';
      ctx.font = '800 34px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('$', x + 54, cy + 12);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('BANK ALERT · 9 ZEROS', x + 102, cy - 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 30px "JetBrains Mono", monospace';
      ctx.fillText(this.state.headline, x + 102, cy + 22);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(this.state.subtitle, x + 102, cy + 50);
    } else if (mode === 'payment_confirmation') {
      ctx.beginPath();
      ctx.arc(x + 56, cy, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x + 42, cy + 2);
      ctx.lineTo(x + 52, cy + 12);
      ctx.lineTo(x + 72, cy - 12);
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('PAYMENT CONFIRMED', x + 104, cy - 14);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 34px "JetBrains Mono", monospace';
      ctx.fillText(this.state.paymentAmount, x + 104, cy + 28);
    } else if (mode === 'incoming_message') {
      ctx.beginPath();
      ctx.arc(x + 52, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.state.messageSender[0] || 'A', x + 52, cy + 10);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#7dd3fc';
      ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`NEW MESSAGE · ${this.state.messageSender}`, x + 98, cy - 14);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(this.state.messageText, x + 98, cy + 22);
    } else if (mode === 'incoming_call') {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('INCOMING CALL', x + 32, cy - 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(this.state.callerName, x + 32, cy + 22);

      ctx.beginPath();
      ctx.arc(x + w - 108, cy, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + w - 44, cy, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
    } else if (mode === 'music_playback') {
      drawRoundedRect(ctx, x + 28, cy - 30, 60, 60, 14);
      ctx.fillStyle = '#e0644c';
      ctx.fill();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(this.state.trackTitle, x + 104, cy - 4);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Now Playing', x + 104, cy + 24);

      for (let i = 0; i < 5; i++) {
        const bh = 14 + Math.abs(Math.sin(t * 5.2 + i * 1.15)) * 34;
        ctx.fillStyle = '#f2b84b';
        ctx.fillRect(x + w - 98 + i * 14, cy - bh / 2, 8, bh);
      }
    } else {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('NOTIFICATION CLEARED', x + w / 2, cy + 8);
    }
  }

  dispose() {
    this._screenMat?.dispose?.();
  }
}
