/**
 * Procedural Web Audio Sound Event Hooks for PuppetKit Motion Graphics & Story Director.
 * Supports all 10 required storytelling sound categories with zero external audio dependencies.
 */

export const SOUND_CUE_CATEGORIES = [
  { id: 'soft_pop', label: 'Soft Pop', description: 'Crisp tactile pop for badges and icon reveals.' },
  { id: 'deep_impact', label: 'Deep Impact', description: 'Sub-bass thump for milestone reveals like $1,000,000.' },
  { id: 'whoosh', label: 'Whoosh', description: 'Filtered noise sweep for camera pans and graphic slides.' },
  { id: 'swipe', label: 'Swipe', description: 'Snappy directional air brush for wipes and panels.' },
  { id: 'mechanical_click', label: 'Mechanical Click', description: 'Sharp micro-click for callouts and chart ticks.' },
  { id: 'cash_counter', label: 'Cash Counter', description: 'Rising multi-tick chime for animated money counters.' },
  { id: 'notification_chime', label: 'Notification Chime', description: 'Clean dual-tone bell for Dynamic Island alerts.' },
  { id: 'digital_confirm', label: 'Digital Confirm', description: 'Pleasant ascending confirmation chord for payments.' },
  { id: 'subtle_sparkle', label: 'Subtle Sparkle', description: 'High harmonic shimmer for highlight sweeps and luxury beats.' },
  { id: 'cinematic_hit', label: 'Cinematic Hit', description: 'Layered low boom + metallic sheen for hero climaxes.' },
];

export const SOUND_CUE_IDS = SOUND_CUE_CATEGORIES.map((s) => s.id);

export class SoundEventController {
  constructor({ enabled = true, volume = 0.38 } = {}) {
    this.enabled = Boolean(enabled);
    this.volume = Math.max(0, Math.min(1, volume));
    this._ctx = null;
    this._firedKeys = new Set();
  }

  _ensureContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this._ctx) {
      this._ctx = new AudioCtx();
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }
    return this._ctx;
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, Number(vol) || 0));
  }

  resetTimelineTriggers() {
    this._firedKeys.clear();
  }

  /** Trigger a cue once when timeline crosses from prevTime -> currentTime. */
  triggerOnce(key, cueId) {
    if (this._firedKeys.has(key)) return false;
    this._firedKeys.add(key);
    return this.play(cueId);
  }

  play(cueId = 'soft_pop') {
    if (!this.enabled || this.volume <= 0.001) return false;
    const ctx = this._ensureContext();
    if (!ctx) return false;

    const now = ctx.currentTime;
    const gainMaster = ctx.createGain();
    gainMaster.gain.setValueAtTime(this.volume, now);
    gainMaster.connect(ctx.destination);

    const tone = (freqStart, freqEnd, dur, type = 'sine', startOffset = 0, vol = 0.5) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, now + startOffset);
      if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + startOffset + dur);
      }
      g.gain.setValueAtTime(0.0001, now + startOffset);
      g.gain.linearRampToValueAtTime(vol, now + startOffset + Math.min(0.015, dur * 0.2));
      g.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + dur);
      osc.connect(g);
      g.connect(gainMaster);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + dur + 0.02);
    };

    const noise = (dur, filterFreqStart, filterFreqEnd, vol = 0.35, startOffset = 0) => {
      const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * dur));
      const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      // Deterministic PRNG noise so synthesis is consistent
      let seed = 1337;
      for (let i = 0; i < sampleCount; i++) {
        seed = (seed * 16807) % 2147483647;
        data[i] = (seed / 1073741823.5) - 1;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(filterFreqStart, now + startOffset);
      filter.frequency.exponentialRampToValueAtTime(Math.max(80, filterFreqEnd), now + startOffset + dur);
      filter.Q.value = 1.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now + startOffset);
      g.gain.linearRampToValueAtTime(vol, now + startOffset + dur * 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + dur);
      src.connect(filter);
      filter.connect(g);
      g.connect(gainMaster);
      src.start(now + startOffset);
      src.stop(now + startOffset + dur + 0.02);
    };

    switch (cueId) {
      case 'soft_pop':
        tone(340, 620, 0.09, 'sine', 0, 0.55);
        break;
      case 'deep_impact':
        tone(145, 42, 0.38, 'sine', 0, 0.85);
        tone(220, 65, 0.22, 'triangle', 0, 0.4);
        break;
      case 'whoosh':
        noise(0.28, 320, 1950, 0.42, 0);
        break;
      case 'swipe':
        noise(0.15, 1600, 480, 0.38, 0);
        tone(520, 260, 0.1, 'sine', 0, 0.18);
        break;
      case 'mechanical_click':
        tone(1800, 520, 0.035, 'square', 0, 0.25);
        break;
      case 'cash_counter':
        tone(660, 660, 0.06, 'triangle', 0.0, 0.32);
        tone(880, 880, 0.06, 'triangle', 0.055, 0.34);
        tone(1174, 1318, 0.11, 'sine', 0.11, 0.38);
        break;
      case 'notification_chime':
        tone(880, 880, 0.16, 'sine', 0, 0.42);
        tone(1318.5, 1318.5, 0.24, 'sine', 0.09, 0.45);
        break;
      case 'digital_confirm':
        tone(523.25, 523.25, 0.12, 'triangle', 0, 0.36);
        tone(659.25, 659.25, 0.14, 'triangle', 0.07, 0.38);
        tone(1046.5, 1046.5, 0.22, 'sine', 0.14, 0.42);
        break;
      case 'subtle_sparkle':
        tone(1568, 1760, 0.18, 'sine', 0, 0.24);
        tone(2093, 2349, 0.22, 'sine', 0.06, 0.22);
        break;
      case 'cinematic_hit':
        tone(120, 36, 0.55, 'sine', 0, 0.9);
        tone(310, 90, 0.32, 'sawtooth', 0, 0.22);
        noise(0.32, 900, 220, 0.34, 0);
        break;
      default:
        tone(440, 660, 0.1, 'sine', 0, 0.4);
    }
    return true;
  }

  dispose() {
    if (this._ctx && typeof this._ctx.close === 'function') {
      this._ctx.close().catch(() => {});
    }
    this._ctx = null;
  }
}
