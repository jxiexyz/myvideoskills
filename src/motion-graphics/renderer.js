import {
  clamp01,
  lerp,
  easeOutCubic,
  easeOutBack,
  evaluateEntrance,
  evaluateImpact,
  evaluateContinuous,
  evaluateExit,
  evaluateTransition,
} from './effects.js';
import { GRAPHIC_THEMES, createMotionGraphicConfig } from './templates.js';
import { renderCameraVisualEffects } from '../camera/compositions-and-effects.js';

function drawRoundedRect(ctx, x, y, w, h, r) {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function drawCartoonBox(ctx, x, y, w, h, r, fill, ink, outline = true, shadowOffset = 6) {
  if (outline && shadowOffset > 0) {
    drawRoundedRect(ctx, x + shadowOffset, y + shadowOffset, w, h, r);
    ctx.fillStyle = ink;
    ctx.fill();
  }
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (outline) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = ink;
    ctx.stroke();
  }
}

/**
 * Parse a leading numeric money value like "$1,000,000" or "$83,333" for deterministic count-up animation.
 */
function formatAnimatedNumber(text, progress) {
  const match = String(text).match(/^([+-]?\$?)([\d,]+)(.*)$/);
  if (!match) return text;
  const [, prefix, numStr, suffix] = match;
  const target = parseInt(numStr.replace(/,/g, ''), 10);
  if (!Number.isFinite(target) || target === 0) return text;
  const eased = easeOutCubic(clamp01(progress));
  const current = Math.round(target * eased);
  return `${prefix}${current.toLocaleString('en-US')}${suffix}`;
}

/**
 * Evaluate pure deterministic graphic choreography timing & transforms at `localTime`.
 * Exported for unit testing so identical timestamp checks run cleanly in Node without DOM.
 */
export function evaluateMotionGraphicFrame(rawConfig, localTime = 0) {
  const cfg = rawConfig?.layout ? rawConfig : createMotionGraphicConfig(rawConfig?.template, rawConfig);
  const t = Math.max(0, Number(localTime) || 0);
  const dur = Math.max(1.2, cfg.duration || 4.2);
  const inDur = Math.min(cfg.entranceDuration || 0.65, dur * 0.4);
  const outDur = Math.min(cfg.exitDuration || 0.55, dur * 0.35);
  const exitStart = Math.max(inDur, dur - outDur);

  const inP = clamp01(t / inDur);
  const impactP = clamp01((t - inDur * 0.65) / 0.65);
  const outP = t > exitStart ? clamp01((t - exitStart) / Math.max(0.01, outDur)) : 0;
  const transP = cfg.transition && cfg.transition !== 'none' ? clamp01(t / 0.55) : 0;

  const entrance = evaluateEntrance(cfg.entrance, inP);
  const impact = evaluateImpact(cfg.impact, impactP);
  const continuous = evaluateContinuous(cfg.continuous, t);
  const exit = evaluateExit(cfg.exit, outP);
  const transition = evaluateTransition(cfg.transition, transP);

  return {
    config: cfg,
    time: t,
    duration: dur,
    inP,
    impactP,
    outP,
    entrance,
    impact,
    continuous,
    exit,
    transition,
    x: entrance.x + impact.x + continuous.x + exit.x,
    y: entrance.y + impact.y + continuous.y + exit.y,
    scaleX: entrance.scaleX * impact.scaleX * continuous.scaleX * exit.scaleX,
    scaleY: entrance.scaleY * impact.scaleY * continuous.scaleY * exit.scaleY,
    rotation: entrance.rotation + impact.rotation + continuous.rotation + exit.rotation,
    opacity: clamp01(entrance.opacity * exit.opacity),
    countProgress: clamp01(t / Math.max(0.75, inDur * 1.45)),
  };
}

/**
 * High-DPI Deterministic 2D Canvas Motion Graphics Renderer layered cleanly above PuppetEngine.
 */
export class MotionGraphicsRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.width = 960;
    this.height = 600;
    this.dpr = 1;
  }

  resize(width, height, dpr = 1) {
    if (!this.canvas) return;
    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    const ratio = Math.min(2, Math.max(1, dpr));
    if (this.width === w && this.height === h && this.dpr === ratio) return;
    this.width = w;
    this.height = h;
    this.dpr = ratio;
    this.canvas.width = Math.round(w * ratio);
    this.canvas.height = Math.round(h * ratio);
  }

  clear() {
    if (!this.ctx) return;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Render one deterministic motion graphic frame + optional camera visual FX + graphic transition + caption.
   * @param {object|null} graphicConfig
   * @param {number} localTime
   * @param {{ anchorScreen?: {x:number,y:number,visible:boolean}|null, caption?: string|null, transitionOverride?: {id:string, progress:number}|null, cameraFx?: object|null, showSafeFrame916?: boolean }} [opts]
   */
  render(
    graphicConfig,
    localTime = 0,
    {
      anchorScreen = null,
      caption = null,
      transitionOverride = null,
      cameraFx = null,
      showSafeFrame916 = false,
    } = {}
  ) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Camera optical/stylized FX layer sits beneath editorial motion graphics & captions
    if (cameraFx || showSafeFrame916) {
      renderCameraVisualEffects(ctx, W, H, cameraFx, { showSafeFrame916 });
    }

    if (graphicConfig) {
      const frame = evaluateMotionGraphicFrame(graphicConfig, localTime);
      const theme = GRAPHIC_THEMES[frame.config.colorTheme] || GRAPHIC_THEMES.editorialGold;

      if (frame.opacity > 0.005) {
        this._renderGraphic(ctx, W, H, frame, theme, anchorScreen);
      }

      if (frame.transition.coverage > 0.01) {
        this._renderTransition(ctx, W, H, frame.transition, theme);
      }
    }

    if (transitionOverride && transitionOverride.id && transitionOverride.id !== 'none') {
      const tr = evaluateTransition(transitionOverride.id, transitionOverride.progress);
      if (tr.coverage > 0.01) {
        this._renderTransition(ctx, W, H, tr, GRAPHIC_THEMES.editorialGold);
      }
    }

    if (caption) {
      this._renderNarrationCaption(ctx, W, H, caption);
    }
  }

  _renderGraphic(ctx, W, H, frame, theme, anchorScreen) {
    const { config, entrance, impact, continuous, exit } = frame;
    const layout = config.layout;
    const scaleBase = Math.max(0.72, Math.min(1.12, Math.min(W / 980, H / 620)));

    // Special case: object-connected callout draws connector from 3D world anchor to graphic card
    if (layout === 'object_callout') {
      this._renderObjectCallout(ctx, W, H, frame, theme, anchorScreen, scaleBase);
      return;
    }

    // Resolve editorial screen placement so character stays unobstructed
    let cx = W * 0.56;
    let cy = H * 0.175;
    if (layout === 'lower_third') {
      cx = W * 0.34;
      cy = H * 0.83;
    } else if (layout === 'dynamic_island' || layout === 'call_island' || layout === 'music_island') {
      cx = W * 0.54;
      cy = H * 0.14;
    } else if (layout === 'message_alert' || layout === 'toast_stack' || layout === 'payment_confirm') {
      cx = W * 0.66;
      cy = H * 0.19;
    } else if (config.position === 'top_right') {
      cx = W * 0.63;
      cy = H * 0.2;
    } else if (config.position === 'top_left') {
      cx = W * 0.34;
      cy = H * 0.2;
    } else if (config.position === 'center') {
      cx = W * 0.56;
      cy = H * 0.26;
    }

    ctx.save();
    ctx.globalAlpha = frame.opacity;
    ctx.translate(cx + frame.x, cy + frame.y);
    ctx.rotate(frame.rotation);
    ctx.scale(frame.scaleX * scaleBase, frame.scaleY * scaleBase);

    // Optional directional / horizontal clip wipe
    const clipP = Math.min(entrance.clipProgress, exit.clipProgress);
    const clipDir = exit.clipProgress < 1 ? exit.clipDir : entrance.clipDir;
    if (clipDir !== 'none' && clipP < 0.999) {
      ctx.beginPath();
      const hw = 420;
      const hh = 220;
      if (clipDir === 'left') {
        ctx.rect(hw - hw * 2 * clipP, -hh, hw * 2 * clipP, hh * 2);
      } else if (clipDir === 'right') {
        ctx.rect(-hw, -hh, hw * 2 * clipP, hh * 2);
      } else {
        ctx.rect(-hw * clipP, -hh, hw * 2 * clipP, hh * 2);
      }
      ctx.clip();
    }

    // Radial accent burst behind hero graphics
    if (impact.burstProgress > 0 && impact.burstProgress < 1) {
      this._drawRadialBurst(ctx, impact.burstProgress, theme.primary);
    }

    switch (layout) {
      case 'million_reveal':
      case 'nine_zeros':
        this._drawMillionReveal(ctx, frame, theme);
        break;
      case 'monthly_income':
      case 'monthly_breakdown':
      case 'roi_stamp':
      case 'price_tag':
        this._drawFinancialHero(ctx, frame, theme);
        break;
      case 'bar_chart':
      case 'podium_bars':
        this._drawBarChart(ctx, frame, theme);
        break;
      case 'line_chart':
        this._drawLineChart(ctx, frame, theme);
        break;
      case 'comparison_bars':
        this._drawComparisonBars(ctx, frame, theme);
        break;
      case 'progress_meter':
        this._drawProgressMeter(ctx, frame, theme);
        break;
      case 'checklist':
      case 'pros_cons':
        this._drawChecklist(ctx, frame, theme);
        break;
      case 'timeline_nodes':
      case 'kpi_strip':
        this._drawNodeStrip(ctx, frame, theme);
        break;
      case 'donut_ring':
        this._drawDonutRing(ctx, frame, theme);
        break;
      case 'dynamic_island':
      case 'call_island':
      case 'music_island':
        this._drawDynamicIslandGraphic(ctx, frame, theme);
        break;
      case 'message_alert':
      case 'toast_stack':
      case 'payment_confirm':
        this._drawNotificationBanner(ctx, frame, theme);
        break;
      case 'ribbon_banner':
      case 'fact_ribbon':
        this._drawCartoonRibbon(ctx, frame, theme);
        break;
      case 'lower_third':
        this._drawLowerThird(ctx, frame, theme);
        break;
      case 'verdict_stamp':
        this._drawVerdictStamp(ctx, frame, theme);
        break;
      case 'big_stat':
        this._drawBigStat(ctx, frame, theme);
        break;
      case 'stacked_words':
      case 'equation_strip':
        this._drawStackedWords(ctx, frame, theme);
        break;
      default:
        this._drawEditorialHeadline(ctx, frame, theme);
        break;
    }

    // Highlight sweep or continuous shimmer overlay
    const sweep = impact.sweepProgress >= 0 ? impact.sweepProgress : continuous.shimmerPos;
    if (sweep >= 0 && sweep <= 1.1) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      const sx = lerp(-340, 340, sweep);
      const grad = ctx.createLinearGradient(sx - 55, -80, sx + 55, 80);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.42)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(-380, -160, 760, 320);
      ctx.restore();
    }

    ctx.restore();
  }

  _drawRadialBurst(ctx, p, color) {
    const rays = 12;
    const inner = lerp(40, 175, easeOutCubic(p));
    const outer = lerp(80, 235, easeOutCubic(p));
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lerp(7, 1.5, p);
    ctx.lineCap = 'round';
    ctx.globalAlpha = 1 - p;
    for (let i = 0; i < rays; i++) {
      const ang = (i / rays) * Math.PI * 2 + 0.15;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * inner, Math.sin(ang) * inner * 0.62);
      ctx.lineTo(Math.cos(ang) * outer, Math.sin(ang) * outer * 0.62);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawEditorialHeadline(ctx, frame, theme) {
    const { config, impact } = frame;
    const isDarkPanel = config.layout === 'chapter_banner' || config.layout === 'versus_banner' || config.layout === 'split_mask';
    const w = 620;
    const h = 132;
    if (config.layout !== 'thesis_underline' && config.layout !== 'marker_highlight') {
      drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 22, isDarkPanel ? theme.panel : theme.bg, theme.ink, config.outline, 7);
    }

    // Decorative left accent bar
    if (config.layout !== 'thesis_underline' && config.layout !== 'marker_highlight') {
      drawRoundedRect(ctx, -w / 2 + 16, -h / 2 + 18, 12, h - 36, 6);
      ctx.fillStyle = theme.primary;
      ctx.fill();
    }

    // Marker highlight band
    if (config.layout === 'marker_highlight') {
      const mw = 540 * easeOutCubic(frame.inP);
      ctx.save();
      ctx.rotate(-0.025);
      drawCartoonBox(ctx, -mw / 2, -38, mw, 76, 12, theme.primary, theme.ink, config.outline, 6);
      ctx.restore();
    }

    // Kicker label
    if (config.secondaryValue) {
      ctx.textAlign = 'center';
      ctx.font = '800 13px "JetBrains Mono", monospace';
      ctx.fillStyle = isDarkPanel ? theme.primary : theme.secondary;
      ctx.fillText(config.secondaryValue.toUpperCase(), 0, -h / 2 + 28);
    }

    // Main bold kinetic headline
    ctx.textAlign = 'center';
    ctx.font = '800 44px "Bricolage Grotesque", "Plus Jakarta Sans", sans-serif';
    if (config.outline) {
      ctx.lineWidth = 7;
      ctx.strokeStyle = theme.ink;
      ctx.lineJoin = 'round';
      ctx.strokeText(config.content, 0, 12);
    }
    ctx.fillStyle = isDarkPanel ? theme.textLight : (config.layout === 'marker_highlight' ? '#ffffff' : theme.text);
    ctx.fillText(config.content, 0, 12);

    // Animated underline draw
    const underP = Math.max(impact.underlineProgress, config.layout === 'thesis_underline' ? easeOutCubic(frame.inP) : 0);
    if (underP > 0.02) {
      const uw = 400 * underP;
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-uw / 2, 26);
      ctx.lineTo(uw / 2, 26);
      ctx.stroke();
    }

    // Subtitle
    if (config.subtitle) {
      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDarkPanel ? '#cbd5e1' : (config.layout === 'marker_highlight' ? theme.textLight : '#475569');
      if (config.layout === 'marker_highlight' || config.layout === 'thesis_underline') {
        ctx.lineWidth = 5;
        ctx.strokeStyle = theme.ink;
        ctx.strokeText(config.subtitle, 0, 52);
      }
      ctx.fillText(config.subtitle, 0, 48);
    }
  }

  _drawMillionReveal(ctx, frame, theme) {
    const { config } = frame;
    const isNine = config.layout === 'nine_zeros';
    const w = isNine ? 680 : 600;
    const h = 156;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 26, theme.panel, theme.ink, config.outline, 9);

    // Inner accent frame
    drawRoundedRect(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 18);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = theme.primary;
    ctx.setLineDash(frame.continuous.borderDashOffset ? [14, 10] : []);
    ctx.lineDashOffset = frame.continuous.borderDashOffset;
    ctx.stroke();
    ctx.setLineDash([]);

    // Top tag
    drawCartoonBox(ctx, -96, -h / 2 - 18, 192, 34, 10, theme.primary, theme.ink, config.outline, 3);
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.ink;
    ctx.font = '800 13px "JetBrains Mono", monospace';
    ctx.fillText((config.secondaryValue || 'MILESTONE').toUpperCase(), 0, -h / 2 + 4);

    // Animated counting giant number
    const displayNum = formatAnimatedNumber(config.content, frame.countProgress);
    ctx.font = isNine
      ? '800 54px "JetBrains Mono", monospace'
      : '800 66px "JetBrains Mono", monospace';
    if (config.outline) {
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#090b10';
      ctx.lineJoin = 'round';
      ctx.strokeText(displayNum, 0, 18);
    }
    ctx.fillStyle = theme.primary;
    ctx.fillText(displayNum, 0, 18);

    // Subtitle
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.textLight;
    ctx.fillText(config.subtitle || '', 0, 54);
  }

  _drawFinancialHero(ctx, frame, theme) {
    const { config, impact } = frame;
    const w = 520;
    const h = 140;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 22, theme.bg, theme.ink, config.outline, 8);

    // Left accent chip
    drawCartoonBox(ctx, -w / 2 + 18, -h / 2 + 18, 104, h - 36, 16, theme.primary, theme.ink, config.outline, 4);
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.ink;
    ctx.font = '800 40px "Bricolage Grotesque", sans-serif';
    ctx.fillText(config.layout === 'roi_stamp' ? '%' : '$', -w / 2 + 70, 14);

    // Animated number right side
    const displayNum = formatAnimatedNumber(config.content, frame.countProgress);
    ctx.textAlign = 'left';
    ctx.font = '800 13px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.secondary;
    ctx.fillText((config.secondaryValue || 'CASHFLOW').toUpperCase(), -w / 2 + 146, -24);

    ctx.font = '800 46px "JetBrains Mono", monospace';
    if (config.outline) {
      ctx.lineWidth = 6;
      ctx.strokeStyle = theme.ink;
      ctx.strokeText(displayNum, -w / 2 + 144, 24);
    }
    ctx.fillStyle = theme.primary;
    ctx.fillText(displayNum, -w / 2 + 144, 24);

    if (impact.underlineProgress > 0.05) {
      ctx.strokeStyle = theme.secondary;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 146, 34);
      ctx.lineTo(-w / 2 + 146 + 290 * impact.underlineProgress, 34);
      ctx.stroke();
    }

    ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.text;
    ctx.fillText(config.subtitle || '', -w / 2 + 146, 54);
  }

  _drawBarChart(ctx, frame, theme) {
    const { config } = frame;
    const w = 520;
    const h = 196;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 22, theme.panel, theme.ink, config.outline, 8);

    ctx.textAlign = 'left';
    ctx.font = '800 19px "Bricolage Grotesque", sans-serif';
    ctx.fillStyle = theme.textLight;
    ctx.fillText(config.content, -w / 2 + 24, -h / 2 + 34);
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(config.subtitle || '', -w / 2 + 24, -h / 2 + 54);

    ctx.textAlign = 'right';
    ctx.font = '800 20px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.primary;
    ctx.fillText(config.secondaryValue || '+420%', w / 2 - 24, -h / 2 + 38);

    const bars = [0.24, 0.4, 0.56, 0.78, 1.0];
    const barColors = [theme.accent, theme.secondary, theme.primary, theme.secondary, theme.primary];
    const labels = ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'];
    const baseY = h / 2 - 30;
    const maxH = 92;
    for (let i = 0; i < bars.length; i++) {
      const bp = clamp01((frame.time - i * 0.09) / 0.55);
      const bh = Math.max(8, maxH * bars[i] * easeOutBack(bp, 1.2));
      const bx = -w / 2 + 44 + i * 92;
      drawCartoonBox(ctx, bx, baseY - bh, 56, bh, 8, barColors[i], theme.ink, config.outline, 3);
      ctx.textAlign = 'center';
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(labels[i], bx + 28, baseY + 18);
    }
  }

  _drawLineChart(ctx, frame, theme) {
    const { config } = frame;
    const w = 520;
    const h = 190;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 22, theme.panel, theme.ink, config.outline, 8);

    ctx.textAlign = 'left';
    ctx.font = '800 19px "Bricolage Grotesque", sans-serif';
    ctx.fillStyle = theme.textLight;
    ctx.fillText(config.content, -w / 2 + 24, -h / 2 + 34);
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(config.subtitle || '', -w / 2 + 24, -h / 2 + 54);

    const pts = [
      [-210, 62],
      [-120, 50],
      [-30, 32],
      [60, 2],
      [145, -36],
      [215, -62],
    ];
    const drawP = easeOutCubic(clamp01(frame.time / 0.95));
    const segCount = (pts.length - 1) * drawP;

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    let tipX = pts[0][0];
    let tipY = pts[0][1];
    for (let i = 0; i < pts.length - 1; i++) {
      const seg = clamp01(segCount - i);
      if (seg <= 0) break;
      tipX = lerp(pts[i][0], pts[i + 1][0], seg);
      tipY = lerp(pts[i][1], pts[i + 1][1], seg);
      ctx.lineTo(tipX, tipY);
    }
    ctx.stroke();

    // Pulsing tip dot
    const r = 8 + frame.continuous.chartPulse * 3;
    ctx.beginPath();
    ctx.arc(tipX, tipY, r, 0, Math.PI * 2);
    ctx.fillStyle = theme.secondary;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = theme.ink;
    ctx.stroke();
  }

  _drawComparisonBars(ctx, frame, theme) {
    const { config } = frame;
    const w = 540;
    const h = 152;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 22, theme.bg, theme.ink, config.outline, 8);
    ctx.textAlign = 'left';
    ctx.font = '800 20px "Bricolage Grotesque", sans-serif';
    ctx.fillStyle = theme.text;
    ctx.fillText(config.content, -w / 2 + 24, -h / 2 + 36);

    const p = easeOutCubic(frame.countProgress);
    // Bar 1 (baseline)
    drawCartoonBox(ctx, -w / 2 + 24, -12, Math.max(40, 120 * p), 28, 8, '#94a3b8', theme.ink, config.outline, 3);
    // Bar 2 (breakthrough)
    drawCartoonBox(ctx, -w / 2 + 24, 28, Math.max(60, (w - 130) * p), 34, 8, theme.primary, theme.ink, config.outline, 3);

    ctx.textAlign = 'right';
    ctx.font = '800 24px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.secondary;
    ctx.fillText(config.secondaryValue || '41.6x', w / 2 - 22, 52);
  }

  _drawProgressMeter(ctx, frame, theme) {
    const { config } = frame;
    const w = 540;
    const h = 128;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 20, theme.panel, theme.ink, config.outline, 7);
    ctx.textAlign = 'left';
    ctx.font = '800 22px "Bricolage Grotesque", sans-serif';
    ctx.fillStyle = theme.textLight;
    ctx.fillText(config.content, -w / 2 + 24, -14);
    ctx.textAlign = 'right';
    ctx.font = '800 18px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.primary;
    ctx.fillText(config.secondaryValue || '$840K / $1M', w / 2 - 24, -14);

    // Track + animated fill
    drawRoundedRect(ctx, -w / 2 + 24, 10, w - 48, 30, 12);
    ctx.fillStyle = '#253142';
    ctx.fill();
    const fillW = (w - 48) * 0.84 * easeOutCubic(frame.countProgress);
    drawCartoonBox(ctx, -w / 2 + 24, 10, Math.max(24, fillW), 30, 12, theme.primary, theme.ink, config.outline, 0);
  }

  _drawChecklist(ctx, frame, theme) {
    const { config } = frame;
    const items = String(config.content).split('|').map((s) => s.trim()).filter(Boolean);
    const w = 500;
    const h = 76 + items.length * 40;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 22, theme.bg, theme.ink, config.outline, 8);
    ctx.textAlign = 'left';
    ctx.font = '800 13px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.secondary;
    ctx.fillText(config.subtitle || 'CHECKLIST', -w / 2 + 24, -h / 2 + 30);

    items.forEach((item, idx) => {
      const ip = clamp01((frame.time - idx * 0.16) / 0.42);
      const y = -h / 2 + 64 + idx * 40;
      ctx.save();
      ctx.globalAlpha = easeOutCubic(ip);
      ctx.translate(lerp(24, 0, easeOutCubic(ip)), 0);
      drawCartoonBox(ctx, -w / 2 + 24, y - 16, 24, 24, 7, theme.primary, theme.ink, config.outline, 2);
      ctx.fillStyle = theme.text;
      ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(item, -w / 2 + 62, y + 3);
      ctx.restore();
    });
  }

  _drawNodeStrip(ctx, frame, theme) {
    const { config } = frame;
    const items = String(config.content).split('|').map((s) => s.trim()).filter(Boolean);
    const w = 600;
    const h = 124;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 20, theme.panel, theme.ink, config.outline, 7);
    ctx.textAlign = 'center';
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.primary;
    ctx.fillText(config.subtitle || 'MILESTONES', 0, -h / 2 + 26);

    const step = (w - 110) / Math.max(1, items.length - 1);
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 55, 8);
    ctx.lineTo(-w / 2 + 55 + (w - 110) * easeOutCubic(frame.inP), 8);
    ctx.stroke();

    items.forEach((label, idx) => {
      const x = items.length === 1 ? 0 : -w / 2 + 55 + idx * step;
      ctx.beginPath();
      ctx.arc(x, 8, 10, 0, Math.PI * 2);
      ctx.fillStyle = theme.secondary;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = theme.ink;
      ctx.stroke();
      ctx.fillStyle = theme.textLight;
      ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(label, x, 40);
    });
  }

  _drawDonutRing(ctx, frame, theme) {
    const { config } = frame;
    const w = 440;
    const h = 152;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 24, theme.panel, theme.ink, config.outline, 8);

    const rx = -w / 2 + 84;
    ctx.beginPath();
    ctx.arc(rx, 0, 44, 0, Math.PI * 2);
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#253142';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rx, 0, 44, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.72 * easeOutCubic(frame.countProgress));
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.strokeStyle = theme.primary;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '800 28px "Bricolage Grotesque", sans-serif';
    ctx.fillStyle = theme.textLight;
    ctx.fillText(config.content, rx + 72, -2);
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(config.subtitle || '', rx + 72, 26);
  }

  _drawDynamicIslandGraphic(ctx, frame, theme) {
    const { config } = frame;
    const expand = clamp01(easeOutBack(clamp01(frame.inP), 1.35));
    const w = lerp(170, 520, expand);
    const h = lerp(46, 104, expand);
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, Math.min(h / 2, 34), '#090b10', theme.primary, true, 0);

    if (expand > 0.35) {
      ctx.save();
      ctx.globalAlpha = clamp01((expand - 0.35) / 0.45);
      // Left icon badge
      ctx.beginPath();
      ctx.arc(-w / 2 + 52, 0, 28, 0, Math.PI * 2);
      ctx.fillStyle = theme.primary;
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#090b10';
      ctx.font = '800 26px "Bricolage Grotesque", sans-serif';
      const iconChar = config.layout === 'call_island' ? 'C' : config.layout === 'music_island' ? 'M' : '$';
      ctx.fillText(iconChar, -w / 2 + 52, 9);

      ctx.textAlign = 'left';
      ctx.fillStyle = theme.primary;
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillText((config.subtitle || 'ALERT').toUpperCase(), -w / 2 + 94, -12);

      const val = formatAnimatedNumber(config.content, frame.countProgress);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 30px "JetBrains Mono", monospace';
      ctx.fillText(val, -w / 2 + 94, 24);

      if (config.layout === 'music_island') {
        for (let i = 0; i < 4; i++) {
          const bh = 12 + Math.abs(Math.sin(frame.time * 5 + i * 1.1)) * 28;
          ctx.fillStyle = theme.secondary;
          ctx.fillRect(w / 2 - 74 + i * 13, -bh / 2, 8, bh);
        }
      }
      ctx.restore();
    }
  }

  _drawNotificationBanner(ctx, frame, theme) {
    const { config } = frame;
    const w = 430;
    const h = 98;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 24, theme.bg, theme.ink, config.outline, 7);

    ctx.beginPath();
    ctx.arc(-w / 2 + 46, 0, 24, 0, Math.PI * 2);
    ctx.fillStyle = theme.primary;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = theme.ink;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.secondary;
    ctx.fillText(config.subtitle || 'NOTIFICATION', -w / 2 + 86, -12);
    ctx.font = '800 21px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.text;
    ctx.fillText(config.content, -w / 2 + 86, 18);
  }

  _drawCartoonRibbon(ctx, frame, theme) {
    const { config } = frame;
    const w = 540;
    const h = 96;
    ctx.save();
    ctx.rotate(-0.02);
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 16, theme.primary, theme.ink, config.outline, 8);
    ctx.textAlign = 'center';
    ctx.font = '800 36px "Bricolage Grotesque", sans-serif';
    ctx.lineWidth = 6;
    ctx.strokeStyle = theme.ink;
    ctx.strokeText(config.content, 0, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(config.content, 0, 8);
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.ink;
    ctx.fillText(config.subtitle || '', 0, 34);
    ctx.restore();
  }

  _drawLowerThird(ctx, frame, theme) {
    const { config } = frame;
    const w = 440;
    const h = 88;
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 16, theme.panel, theme.ink, config.outline, 6);
    drawRoundedRect(ctx, -w / 2 + 12, -h / 2 + 12, 10, h - 24, 5);
    ctx.fillStyle = theme.primary;
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.font = '800 24px "Bricolage Grotesque", sans-serif';
    ctx.fillStyle = theme.textLight;
    ctx.fillText(config.content, -w / 2 + 36, -4);
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(config.subtitle || '', -w / 2 + 36, 22);
  }

  _drawVerdictStamp(ctx, frame, theme) {
    const { config } = frame;
    const w = 440;
    const h = 108;
    ctx.save();
    ctx.rotate(-0.06);
    drawCartoonBox(ctx, -w / 2, -h / 2, w, h, 14, theme.bg, theme.primary, true, 6);
    ctx.textAlign = 'center';
    ctx.font = '800 40px "Bricolage Grotesque", sans-serif';
    ctx.fillStyle = theme.primary;
    ctx.fillText(config.content, 0, 12);
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.text;
    ctx.fillText(config.subtitle || '', 0, 38);
    ctx.restore();
  }

  _drawBigStat(ctx, frame, theme) {
    const { config } = frame;
    ctx.textAlign = 'center';
    ctx.font = '800 84px "Bricolage Grotesque", sans-serif';
    ctx.lineWidth = 12;
    ctx.strokeStyle = theme.ink;
    ctx.strokeText(config.content, 0, 12);
    ctx.fillStyle = theme.primary;
    ctx.fillText(config.content, 0, 12);
    drawCartoonBox(ctx, -230, 30, 460, 40, 12, theme.panel, theme.ink, config.outline, 4);
    ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.textLight;
    ctx.fillText(config.subtitle || '', 0, 55);
  }

  _drawStackedWords(ctx, frame, theme) {
    const { config } = frame;
    const words = String(config.content).split(/[\/×=]/).map((s) => s.trim()).filter(Boolean);
    const totalW = words.length * 185;
    words.forEach((word, i) => {
      const wp = clamp01((frame.time - i * 0.14) / 0.42);
      const x = -totalW / 2 + i * 185 + 92;
      ctx.save();
      ctx.globalAlpha = easeOutCubic(wp);
      ctx.translate(x, lerp(28, 0, easeOutBack(wp)));
      drawCartoonBox(ctx, -82, -36, 164, 72, 16, i % 2 === 0 ? theme.primary : theme.panel, theme.ink, config.outline, 5);
      ctx.textAlign = 'center';
      ctx.font = '800 24px "Bricolage Grotesque", sans-serif';
      ctx.fillStyle = i % 2 === 0 ? theme.ink : theme.textLight;
      ctx.fillText(word, 0, 8);
      ctx.restore();
    });
  }

  _renderObjectCallout(ctx, W, H, frame, theme, anchorScreen, scaleBase) {
    const { config, entrance, continuous } = frame;
    const ax = anchorScreen?.visible ? anchorScreen.x : W * 0.64;
    const ay = anchorScreen?.visible ? anchorScreen.y : H * 0.58;

    // Smart card position above and right/left of anchor staying inside viewport
    const cardW = 310 * scaleBase;
    const cardH = 88 * scaleBase;
    const preferRight = ax < W * 0.58;
    const cx = Math.max(cardW * 0.56, Math.min(W - cardW * 0.56, ax + (preferRight ? 155 : -155) * scaleBase));
    const cy = Math.max(cardH * 0.85, Math.min(H * 0.42, ay - 120 * scaleBase));
    const midX = lerp(ax, cx, 0.45);
    const midY = cy + cardH * 0.48;

    const lineP = clamp01(entrance.lineProgress || frame.inP);

    ctx.save();
    ctx.globalAlpha = frame.opacity;

    // Animated anchor ring on the 3D object
    const dotR = (9 + (continuous.dotScale - 1) * 14) * scaleBase;
    ctx.beginPath();
    ctx.arc(ax, ay, dotR * 1.75, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(242, 184, 75, 0.25)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ax, ay, dotR, 0, Math.PI * 2);
    ctx.fillStyle = theme.primary;
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = theme.ink;
    ctx.stroke();

    // Animated segmented callout pointer line
    const p1 = clamp01(lineP * 2);
    const p2 = clamp01((lineP - 0.5) * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = theme.ink;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(lerp(ax, midX, p1), lerp(ay, midY, p1));
    if (p2 > 0) ctx.lineTo(lerp(midX, cx, p2), midY);
    ctx.stroke();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = theme.primary;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(lerp(ax, midX, p1), lerp(ay, midY, p1));
    if (p2 > 0) ctx.lineTo(lerp(midX, cx, p2), midY);
    ctx.stroke();

    // Card reveals as line finishes
    const cardP = clamp01((frame.inP - 0.25) / 0.75);
    if (cardP > 0.02) {
      ctx.translate(cx + frame.x, cy + frame.y);
      ctx.scale(easeOutBack(cardP, 1.3), easeOutBack(cardP, 1.3));
      drawCartoonBox(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 16 * scaleBase, theme.panel, theme.ink, config.outline, 6 * scaleBase);

      ctx.textAlign = 'left';
      ctx.font = `800 ${Math.round(11 * scaleBase)}px "JetBrains Mono", monospace`;
      ctx.fillStyle = theme.primary;
      ctx.fillText((config.secondaryValue || 'CALLOUT').toUpperCase(), -cardW / 2 + 16 * scaleBase, -14 * scaleBase);

      ctx.font = `800 ${Math.round(21 * scaleBase)}px "Bricolage Grotesque", sans-serif`;
      ctx.fillStyle = theme.textLight;
      ctx.fillText(config.content, -cardW / 2 + 16 * scaleBase, 12 * scaleBase);

      ctx.font = `600 ${Math.round(12 * scaleBase)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(config.subtitle || '', -cardW / 2 + 16 * scaleBase, 32 * scaleBase);
    }

    ctx.restore();
  }

  _renderTransition(ctx, W, H, tr, theme) {
    ctx.save();
    const p = tr.eased;
    if (tr.id === 'shape_wipe' || tr.id === 'directional_slide') {
      const bandW = W * 0.45 * tr.coverage;
      const x = lerp(-bandW, W, p);
      ctx.fillStyle = theme.primary;
      ctx.fillRect(x, 0, bandW, H);
      ctx.fillStyle = theme.ink;
      ctx.fillRect(x + bandW - 10, 0, 10, H);
    } else if (tr.id === 'panel_split_reveal') {
      const half = (W * 0.5) * tr.coverage;
      ctx.fillStyle = theme.panel;
      ctx.fillRect(0, 0, half, H);
      ctx.fillRect(W - half, 0, half, H);
    } else if (tr.id === 'iris_circle_expand') {
      const r = Math.hypot(W, H) * 0.55 * tr.coverage;
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
      ctx.fillStyle = theme.primary;
      ctx.globalAlpha = 0.25 * tr.coverage;
      ctx.fill();
    } else if (tr.id === 'diagonal_ribbon_cut' || tr.id === 'ink_band_sweep') {
      const x = lerp(-W * 0.5, W * 1.2, p);
      ctx.fillStyle = theme.ink;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + W * 0.3, 0);
      ctx.lineTo(x + W * 0.12, H);
      ctx.lineTo(x - W * 0.18, H);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = theme.panel;
      ctx.globalAlpha = 0.28 * tr.coverage;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  _renderNarrationCaption(ctx, W, H, text) {
    ctx.save();
    const padX = 24;
    ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
    const textW = Math.min(W - 80, ctx.measureText(text).width + padX * 2);
    const boxH = 44;
    const x = (W - textW) / 2;
    const y = H - 62;
    drawCartoonBox(ctx, x, y, textW, boxH, 12, 'rgba(15, 19, 28, 0.92)', '#140e10', true, 4);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fdf8ef';
    ctx.fillText(text, W / 2, y + 28, textW - 24);
    ctx.restore();
  }
}
