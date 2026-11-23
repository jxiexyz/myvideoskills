/**
 * Deterministic Web Audio SFX Engine, 6-Bus Mixer with Voice Ducking & Limiter,
 * Seek-Safe Event Scheduler, Waveform Visualizer Data, and Consistent PCM WAV Exporter.
 *
 * Design guarantees:
 *  - Never triggers audio before user interaction (respects browser autoplay rules).
 *  - Deterministic PRNG noise synthesis (no Math.random()) so preview and WAV export match cleanly.
 *  - Proper cleanup of all BufferSource/Oscillator nodes on stop/dispose (zero memory leaks).
 *  - Seek-safe: moving backward or scrubbing never fires duplicate stacked sounds.
 */

import { AUDIO_BUS_DEFAULTS, SFXPresetRegistry } from './sfx-presets.js';

/**
 * Deterministic waveform envelope (normalized 0.08..1.0) for crisp UI preset cards & timeline bars.
 */
export function generatePresetWaveform(preset, bars = 32) {
  if (!preset) return Array.from({ length: bars }, () => 0.15);
  const seedStr = `${preset.id}:${preset.category}:${preset.intensity}`;
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const intensityAmp = preset.intensity === 'strong' ? 0.95 : preset.intensity === 'medium' ? 0.76 : 0.56;
  const out = [];
  for (let i = 0; i < bars; i++) {
    const t = i / Math.max(1, bars - 1);
    h = Math.imul(h ^ (i * 374761393), 668265263);
    const jitter = ((h >>> 0) % 1000) / 1000;
    let env;
    if (preset.loopable) {
      env = 0.42 + 0.22 * Math.sin(t * Math.PI * 3) + jitter * 0.25;
    } else if (preset.id.includes('riser')) {
      env = Math.pow(t, 1.45) * (0.7 + jitter * 0.3);
    } else if (preset.id.includes('whoosh') || preset.id.includes('sweep') || preset.id.includes('whip')) {
      env = Math.sin(t * Math.PI) * (0.72 + jitter * 0.28);
    } else {
      const attack = Math.min(1, t / 0.12);
      const decay = Math.exp(-t * 3.4);
      env = attack * decay * (0.72 + jitter * 0.32);
    }
    out.push(Number(Math.max(0.08, Math.min(1, env * intensityAmp)).toFixed(3)));
  }
  return out;
}

/**
 * Synthesize deterministic mono PCM Float32 samples for any procedural SFX preset recipe.
 * Used identically for both live Web Audio AudioBuffers AND offline WAV export so preview === render!
 */
export function synthesizePresetSamples(preset, sampleRate = 22050, options = {}) {
  const dur = Math.max(0.05, Math.min(6.0, Number(options.duration ?? preset.duration) || 0.25));
  const pitch = Math.max(0.5, Math.min(2.0, Number(options.pitch ?? preset.pitch) || 1.0));
  const rate = Math.max(0.5, Math.min(2.0, Number(options.playbackRate ?? preset.playbackRate) || 1.0));
  const effectiveDur = Math.max(0.05, Math.min(6.0, dur / rate));
  const count = Math.max(1, Math.floor(effectiveDur * sampleRate));
  const buf = new Float32Array(count);

  const recipe = preset?.asset?.synthRecipe || 'ui_pop_modern';

  // Deterministic LCG noise generator
  let seed = 133791;
  for (let i = 0; i < recipe.length; i++) seed = (seed * 31 + recipe.charCodeAt(i)) % 2147483647;
  const nextNoise = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 1073741823.5 - 1;
  };

  // Helper: additive tone with frequency glide & AD envelope
  const addTone = (f0, f1, startS, durS, amp = 0.45, wave = 'sine') => {
    const i0 = Math.floor(startS * sampleRate);
    const len = Math.max(1, Math.floor(durS * sampleRate));
    let phase = 0;
    for (let k = 0; k < len; k++) {
      const idx = i0 + k;
      if (idx < 0 || idx >= count) continue;
      const u = k / len;
      const freq = (f0 + (f1 - f0) * u) * pitch;
      phase += (2 * Math.PI * freq) / sampleRate;
      let val = Math.sin(phase);
      if (wave === 'triangle') val = (2 / Math.PI) * Math.asin(Math.sin(phase));
      else if (wave === 'soft_square') val = Math.tanh(Math.sin(phase) * 2.2);
      const attack = Math.min(1, u / 0.08);
      const decay = Math.pow(1 - u, 1.8);
      buf[idx] += val * amp * attack * decay;
    }
  };

  // Helper: 1-pole smoothed filtered noise sweep (whooshes, footsteps, ambience)
  const addNoise = (startS, durS, amp = 0.3, cutoffStart = 0.12, cutoffEnd = 0.45, bellEnvelope = true) => {
    const i0 = Math.floor(startS * sampleRate);
    const len = Math.max(1, Math.floor(durS * sampleRate));
    let lp = 0;
    let prev = 0;
    for (let k = 0; k < len; k++) {
      const idx = i0 + k;
      if (idx < 0 || idx >= count) continue;
      const u = k / len;
      const alpha = Math.max(0.01, Math.min(0.95, cutoffStart + (cutoffEnd - cutoffStart) * u));
      const n = nextNoise();
      lp = lp + alpha * (n - lp);
      const hp = lp - prev * 0.62;
      prev = lp;
      const env = bellEnvelope ? Math.sin(u * Math.PI) : Math.min(1, u / 0.06) * Math.pow(1 - u, 2.2);
      buf[idx] += hp * amp * env;
    }
  };

  switch (recipe) {
    case 'footstep_light':
      addTone(135, 58, 0, 0.09, 0.45, 'sine');
      addNoise(0, 0.08, 0.24, 0.16, 0.06, false);
      break;
    case 'footstep_heavy':
      addTone(110, 42, 0, 0.13, 0.62, 'sine');
      addNoise(0, 0.12, 0.34, 0.2, 0.05, false);
      break;
    case 'footstep_run':
      addTone(165, 68, 0, 0.07, 0.52, 'triangle');
      addNoise(0, 0.07, 0.32, 0.28, 0.1, false);
      break;
    case 'cloth_rustle':
    case 'gesture_air':
    case 'head_turn':
      addNoise(0, effectiveDur, 0.26, 0.12, 0.35, true);
      break;
    case 'surprise_accent':
      addTone(320, 640, 0, 0.16, 0.36, 'triangle');
      addTone(520, 780, 0.04, 0.18, 0.28, 'sine');
      break;
    case 'curious_pluck':
      addTone(440, 587, 0, 0.16, 0.34, 'sine');
      addTone(660, 740, 0.07, 0.14, 0.22, 'triangle');
      break;
    case 'thinking_pulse':
      addTone(293.66, 293.66, 0, 0.26, 0.32, 'sine');
      addTone(440, 440, 0.05, 0.2, 0.16, 'sine');
      break;
    case 'small_gasp':
      addNoise(0, 0.18, 0.35, 0.25, 0.65, true);
      break;
    case 'soft_thud':
      addTone(125, 44, 0, 0.16, 0.6, 'sine');
      addNoise(0, 0.08, 0.18, 0.12, 0.04, false);
      break;
    case 'ui_pop_modern':
      addTone(360, 690, 0, 0.085, 0.48, 'sine');
      addTone(720, 960, 0.025, 0.09, 0.22, 'triangle');
      break;
    case 'ui_pop_dismiss':
      addTone(560, 290, 0, 0.1, 0.34, 'sine');
      break;
    case 'card_slide_in':
      addNoise(0, 0.16, 0.28, 0.14, 0.42, true);
      addTone(420, 620, 0.02, 0.11, 0.18, 'sine');
      break;
    case 'card_slide_out':
      addNoise(0, 0.13, 0.22, 0.38, 0.12, true);
      break;
    case 'notif_ping':
      addTone(880, 880, 0, 0.18, 0.36, 'sine');
      addTone(1318.5, 1318.5, 0.08, 0.24, 0.38, 'sine');
      break;
    case 'micro_click':
    case 'glass_tap':
    case 'phone_tap':
      addTone(1480, 480, 0, 0.04, 0.44, 'triangle');
      addNoise(0, 0.03, 0.22, 0.55, 0.2, false);
      break;
    case 'phone_unlock':
      addTone(659.25, 659.25, 0, 0.09, 0.32, 'sine');
      addTone(987.77, 987.77, 0.075, 0.12, 0.34, 'sine');
      break;
    case 'confirm_triad':
      addTone(523.25, 523.25, 0, 0.14, 0.3, 'triangle');
      addTone(659.25, 659.25, 0.06, 0.16, 0.3, 'triangle');
      addTone(1046.5, 1046.5, 0.12, 0.2, 0.34, 'sine');
      break;
    case 'warning_low':
      addTone(246.94, 220, 0, 0.16, 0.42, 'triangle');
      addTone(196, 174.6, 0.13, 0.2, 0.44, 'sine');
      break;
    case 'success_chime':
      addTone(587.33, 587.33, 0, 0.16, 0.34, 'sine');
      addTone(880, 880, 0.09, 0.25, 0.38, 'sine');
      break;
    case 'number_tick_rise':
      addTone(587, 587, 0, 0.06, 0.28, 'triangle');
      addTone(740, 740, 0.07, 0.06, 0.3, 'triangle');
      addTone(987.7, 1046.5, 0.14, 0.12, 0.34, 'sine');
      break;
    case 'chart_sweep':
    case 'chart_rise':
      addTone(330, 660, 0, 0.32, 0.3, 'sine');
      addTone(495, 990, 0.06, 0.28, 0.22, 'triangle');
      break;
    case 'chart_drop':
      addTone(440, 220, 0, 0.3, 0.34, 'triangle');
      break;
    case 'whoosh_soft':
      addNoise(0, effectiveDur, 0.42, 0.06, 0.28, true);
      break;
    case 'whoosh_fast':
      addNoise(0, effectiveDur, 0.56, 0.1, 0.52, true);
      break;
    case 'cinematic_sweep':
      addNoise(0, effectiveDur, 0.48, 0.05, 0.34, true);
      addTone(95, 62, 0.08, effectiveDur * 0.8, 0.28, 'sine');
      break;
    case 'whip_pan':
      addNoise(0, effectiveDur, 0.65, 0.14, 0.65, true);
      addTone(240, 90, 0, effectiveDur * 0.7, 0.24, 'sine');
      break;
    case 'zoom_in_swell':
      addNoise(0, effectiveDur, 0.34, 0.08, 0.36, true);
      addTone(160, 260, 0, effectiveDur, 0.18, 'sine');
      break;
    case 'zoom_out_swell':
      addNoise(0, effectiveDur, 0.34, 0.34, 0.08, true);
      addTone(240, 140, 0, effectiveDur, 0.18, 'sine');
      break;
    case 'focus_lock':
      addTone(1174.66, 1318.5, 0, 0.12, 0.22, 'sine');
      break;
    case 'scene_wash':
      addNoise(0, effectiveDur, 0.4, 0.08, 0.3, true);
      break;
    case 'impact_hit':
    case 'dramatic_reveal':
    case 'milestone_hit':
      addTone(130, 38, 0, Math.min(0.55, effectiveDur), 0.72, 'sine');
      addTone(260, 78, 0, 0.26, 0.28, 'triangle');
      if (recipe === 'milestone_hit') {
        addTone(1046.5, 1318.5, 0.06, 0.36, 0.22, 'sine');
      }
      addNoise(0, 0.28, 0.24, 0.22, 0.06, false);
      break;
    case 'subtle_riser':
      addNoise(0, effectiveDur, 0.32, 0.04, 0.48, true);
      addTone(220, 520, 0, effectiveDur, 0.2, 'sine');
      break;
    case 'balance_reveal':
      addTone(523.25, 523.25, 0, 0.24, 0.32, 'sine');
      addTone(783.99, 783.99, 0.07, 0.26, 0.32, 'sine');
      addTone(1046.5, 1046.5, 0.14, 0.22, 0.24, 'triangle');
      break;
    case 'profit_lift':
      addTone(440, 440, 0, 0.24, 0.32, 'sine');
      addTone(659.25, 659.25, 0.07, 0.28, 0.32, 'sine');
      addTone(880, 1108.7, 0.14, 0.26, 0.26, 'sine');
      break;
    case 'loss_drop':
      addTone(220, 110, 0, 0.38, 0.54, 'sine');
      addTone(261.6, 155.6, 0.05, 0.32, 0.24, 'triangle');
      break;
    case 'cash_subtle':
      addNoise(0, 0.1, 0.24, 0.42, 0.18, false);
      addTone(987.7, 1318.5, 0.05, 0.16, 0.24, 'sine');
      break;
    case 'wealth_sparkle':
      addTone(1568, 1760, 0, 0.18, 0.22, 'sine');
      addTone(2093, 2349, 0.06, 0.22, 0.2, 'sine');
      break;
    case 'risk_pulse':
    case 'tension_pulse':
      addTone(98, 72, 0, effectiveDur, 0.56, 'sine');
      addTone(146.8, 138.6, 0.04, effectiveDur * 0.85, 0.22, 'triangle');
      break;
    case 'shock_sting':
    case 'twist_pivot':
      addTone(150, 52, 0, 0.34, 0.62, 'sine');
      addTone(392, 277.18, 0.02, 0.26, 0.24, 'soft_square');
      break;
    case 'hopeful_lift':
      addTone(392, 392, 0, 0.34, 0.28, 'sine');
      addTone(493.88, 587.33, 0.08, 0.36, 0.28, 'sine');
      addTone(783.99, 880, 0.16, 0.32, 0.2, 'sine');
      break;
    case 'relief_chord':
    case 'gentle_ending':
      addTone(261.63, 261.63, 0, effectiveDur, 0.28, 'sine');
      addTone(329.63, 329.63, 0.05, effectiveDur * 0.9, 0.24, 'sine');
      addTone(392.0, 392.0, 0.1, effectiveDur * 0.85, 0.22, 'sine');
      break;
    case 'sad_decay':
      addTone(293.66, 261.63, 0, effectiveDur, 0.3, 'sine');
      addTone(349.23, 329.63, 0.06, effectiveDur * 0.85, 0.2, 'sine');
      break;
    case 'vehicle_purr':
      addTone(72, 118, 0, 0.24, 0.44, 'soft_square');
      addTone(118, 82, 0.22, 0.3, 0.36, 'triangle');
      break;
    case 'engine_rev':
      addTone(82, 210, 0, 0.32, 0.48, 'soft_square');
      addTone(210, 105, 0.3, 0.32, 0.34, 'triangle');
      break;
    case 'object_pickup':
      addTone(260, 420, 0, 0.1, 0.3, 'sine');
      addNoise(0, 0.08, 0.16, 0.25, 0.4, false);
      break;
    case 'paper_flip':
      addNoise(0, 0.18, 0.34, 0.38, 0.62, true);
      break;
    case 'keyboard_burst':
      addTone(1650, 520, 0, 0.035, 0.3, 'triangle');
      addTone(1520, 480, 0.075, 0.035, 0.28, 'triangle');
      addTone(1760, 560, 0.15, 0.04, 0.32, 'triangle');
      break;
    case 'coin_clink':
      addTone(2489, 2489, 0, 0.24, 0.28, 'sine');
      addTone(3729, 3729, 0.015, 0.2, 0.2, 'sine');
      break;
    case 'com_pop':
      addTone(240, 880, 0, 0.11, 0.48, 'sine');
      break;
    case 'com_boing': {
      let ph = 0;
      for (let i = 0; i < count; i++) {
        const u = i / count;
        const freq = (190 + 180 * u + Math.sin(u * 26) * 55 * (1 - u)) * pitch;
        ph += (2 * Math.PI * freq) / sampleRate;
        buf[i] = Math.sin(ph) * 0.45 * Math.pow(1 - u, 1.3);
      }
      break;
    }
    case 'com_tiny_fail':
      addTone(392, 349, 0, 0.16, 0.36, 'triangle');
      addTone(311, 246, 0.17, 0.2, 0.38, 'triangle');
      break;
    case 'amb_room_tone':
    case 'amb_office':
    case 'amb_city':
    case 'amb_rain':
    case 'amb_wind':
    case 'amb_hangar': {
      // Seamless loopable filtered ambience texture with crossfade edges
      let lp = 0;
      const cutoff =
        recipe === 'amb_rain'
          ? 0.28
          : recipe === 'amb_wind'
            ? 0.14
            : recipe === 'amb_hangar'
              ? 0.11
              : recipe === 'amb_city'
                ? 0.08
                : 0.06;
      const baseGain = recipe === 'amb_room_tone' ? 0.14 : 0.22;
      for (let i = 0; i < count; i++) {
        const u = i / count;
        const mod = 0.8 + 0.2 * Math.sin(u * Math.PI * 2);
        const n = nextNoise();
        lp = lp + cutoff * (n - lp);
        const drone = recipe === 'amb_hangar' || recipe === 'amb_office'
          ? Math.sin((2 * Math.PI * 64 * i) / sampleRate) * 0.045
          : 0;
        // Seamless loop cosine taper on first/last 5%
        const edge = Math.min(1, u / 0.05, (1 - u) / 0.05);
        buf[i] = (lp * baseGain * mod + drone) * edge;
      }
      break;
    }
    default:
      addTone(440, 660, 0, 0.12, 0.36, 'sine');
  }

  // Apply clean fade-in / fade-out and soft-clip safety limiter (-0.95..0.95)
  const fadeInSamples = Math.min(Math.floor(count * 0.4), Math.floor((options.fadeIn ?? preset.fadeIn ?? 0.005) * sampleRate));
  const fadeOutSamples = Math.min(Math.floor(count * 0.4), Math.floor((options.fadeOut ?? preset.fadeOut ?? 0.03) * sampleRate));
  for (let i = 0; i < count; i++) {
    let g = 1;
    if (fadeInSamples > 0 && i < fadeInSamples) g *= i / fadeInSamples;
    if (fadeOutSamples > 0 && i >= count - fadeOutSamples) g *= (count - 1 - i) / fadeOutSamples;
    buf[i] = Math.tanh(buf[i] * g * 1.15) * 0.9;
  }

  return { samples: buf, sampleRate, duration: effectiveDur };
}

/**
 * 6-Bus Audio Mixer Manager with Mute/Solo, Automatic Voice Ducking, and Master Soft Limiter.
 */
export class SFXBusManager {
  constructor() {
    this.buses = {};
    for (const [id, cfg] of Object.entries(AUDIO_BUS_DEFAULTS)) {
      this.buses[id] = { ...cfg };
    }
    this.masterVolume = 0.85;
    this.voiceDuckingEnabled = true;
    this.voiceDuckAmount = 0.38; // reduces music/ambience/secondary under active narration
  }

  setBus(busId, patch) {
    if (!this.buses[busId]) return null;
    this.buses[busId] = { ...this.buses[busId], ...patch };
    return this.buses[busId];
  }

  getBusGain(busId, { voiceActive = false, silenceDuckFactor = 1.0 } = {}) {
    const bus = this.buses[busId];
    if (!bus) return 0;
    const anySolo = Object.values(this.buses).some((b) => b.solo);
    if (anySolo && !bus.solo) return 0;
    if (bus.muted) return 0;

    let gain = bus.volume * this.masterVolume;

    // Automatic voice protection ducking
    if (this.voiceDuckingEnabled && voiceActive && busId !== 'voice') {
      const duckScale =
        busId === 'music' || busId === 'ambience'
          ? 1 - this.voiceDuckAmount
          : busId === 'sfx_secondary'
            ? 1 - this.voiceDuckAmount * 0.45
            : 1 - this.voiceDuckAmount * 0.2;
      gain *= duckScale;
    }

    if (busId === 'ambience' || busId === 'music') {
      gain *= silenceDuckFactor;
    }

    return Math.max(0, Math.min(1, gain));
  }

  getState() {
    return {
      masterVolume: this.masterVolume,
      voiceDuckingEnabled: this.voiceDuckingEnabled,
      buses: Object.values(this.buses).map((b) => ({ ...b })),
    };
  }
}

/**
 * Deterministic Seek-Safe SFX Timeline Event Scheduler.
 * Guarantees each event fires once when playhead crosses its startTime,
 * resets cleanly on backward seek, and never double-triggers on React re-renders.
 */
export class SFXEventScheduler {
  constructor() {
    this._lastTime = -1;
    this._firedIds = new Set();
  }

  reset() {
    this._lastTime = -1;
    this._firedIds.clear();
  }

  /**
   * Returns the deterministic list of events to trigger between previous playhead and `currentTime`.
   */
  collectTriggers(events, currentTime) {
    const t = Number(currentTime) || 0;

    // Detect backward seek or loop wrap -> reset fired history cleanly
    if (this._lastTime >= 0 && t < this._lastTime - 0.04) {
      this._firedIds.clear();
      this._lastTime = t;
      return [];
    }

    const from = this._lastTime < 0 ? Math.max(0, t - 0.06) : this._lastTime;
    this._lastTime = t;

    const anySolo = events.some((e) => e.solo && !e.disabled);
    const due = [];

    for (const ev of events) {
      if (ev.disabled || ev.muted || ev.loop) continue;
      if (anySolo && !ev.solo) continue;
      if (this._firedIds.has(ev.id)) continue;

      if (ev.startTime >= from - 0.02 && ev.startTime <= t + 0.02) {
        this._firedIds.add(ev.id);
        due.push(ev);
      }
    }
    return due;
  }
}

/**
 * Live Web Audio Preview & Playback Controller (autoplay-safe, clean disposal).
 */
export class SFXPreviewController {
  constructor(registry = null, busManager = null) {
    this.registry = registry || new SFXPresetRegistry();
    this.busManager = busManager || new SFXBusManager();
    this.scheduler = new SFXEventScheduler();
    this.enabled = true;
    this._ctx = null;
    this._activeSources = new Set();
    this._bufferCache = new Map();
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

  setEnabled(flag) {
    this.enabled = Boolean(flag);
    if (!this.enabled) this.stopAll();
  }

  playPreset(presetId, overrides = {}) {
    if (!this.enabled) return { played: false, reason: 'Audio muted' };
    const preset = this.registry.get(presetId);
    if (!preset) return { played: false, reason: 'Unknown preset' };
    if (preset.assetStatus === 'missing_file') {
      return { played: false, reason: `Missing audio asset: ${preset.asset.path}` };
    }

    const ctx = this._ensureContext();
    if (!ctx) return { played: false, reason: 'Web Audio unavailable in environment' };

    const pitch = overrides.pitch ?? preset.pitch ?? 1.0;
    const playbackRate = overrides.playbackRate ?? preset.playbackRate ?? 1.0;
    const busId = overrides.bus ?? preset.bus ?? 'sfx_secondary';
    const busGain = this.busManager.getBusGain(busId, {
      voiceActive: Boolean(overrides.voiceActive),
      silenceDuckFactor: overrides.silenceDuckFactor ?? 1.0,
    });
    const vol = (overrides.volume ?? preset.defaultVolume ?? 0.5) * busGain;
    if (vol <= 0.001) return { played: false, reason: 'Muted or zero gain' };

    const cacheKey = `${preset.id}:${pitch.toFixed(2)}:${playbackRate.toFixed(2)}:${(overrides.duration ?? preset.duration).toFixed(2)}`;
    let audioBuffer = this._bufferCache.get(cacheKey);
    if (!audioBuffer) {
      const synth = synthesizePresetSamples(preset, 22050, {
        pitch,
        playbackRate,
        duration: overrides.duration ?? preset.duration,
        fadeIn: overrides.fadeIn ?? preset.fadeIn,
        fadeOut: overrides.fadeOut ?? preset.fadeOut,
      });
      audioBuffer = ctx.createBuffer(1, synth.samples.length, synth.sampleRate);
      audioBuffer.copyToChannel(synth.samples, 0);
      this._bufferCache.set(cacheKey, audioBuffer);
    }

    const src = ctx.createBufferSource();
    src.buffer = audioBuffer;
    src.loop = Boolean(overrides.loop);

    const gainNode = ctx.createGain();
    const startAt = ctx.currentTime + Math.max(0, Number(overrides.delaySec) || 0);
    gainNode.gain.setValueAtTime(vol, startAt);

    if (typeof ctx.createStereoPanner === 'function' && overrides.pan) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, overrides.pan)), startAt);
      src.connect(panner);
      panner.connect(gainNode);
    } else {
      src.connect(gainNode);
    }

    gainNode.connect(ctx.destination);
    this._activeSources.add(src);
    src.onended = () => {
      this._activeSources.delete(src);
      try {
        src.disconnect();
        gainNode.disconnect();
      } catch {
        // already disconnected
      }
    };
    src.start(startAt);
    return { played: true, presetId: preset.id };
  }

  playCombination(combo) {
    if (!combo?.layers?.length) return false;
    let triggered = false;
    for (const layer of combo.layers) {
      if (!layer.enabled) continue;
      const res = this.playPreset(layer.presetId, {
        volume: layer.volume,
        delaySec: layer.offsetSec || 0,
      });
      if (res.played) triggered = true;
    }
    return triggered;
  }

  tickTimeline(events, currentTime, { voiceActive = false, silenceCues = [] } = {}) {
    if (!this.enabled) return [];
    const due = this.scheduler.collectTriggers(events, currentTime);
    const activeSilence = silenceCues.find((c) => currentTime >= c.startTime && currentTime <= c.endTime);
    const duckFactor = activeSilence ? activeSilence.duckFactor : 1.0;

    for (const ev of due) {
      this.playPreset(ev.presetId, {
        volume: ev.volume,
        pitch: ev.pitch,
        playbackRate: ev.playbackRate,
        bus: ev.bus,
        pan: ev.pan,
        fadeIn: ev.fadeIn,
        fadeOut: ev.fadeOut,
        duration: ev.duration,
        voiceActive,
        silenceDuckFactor: duckFactor,
      });
    }
    return due;
  }

  stopAll() {
    for (const src of this._activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // ignore stopped source
      }
    }
    this._activeSources.clear();
  }

  dispose() {
    this.stopAll();
    this._bufferCache.clear();
    if (this._ctx && typeof this._ctx.close === 'function') {
      this._ctx.close().catch(() => {});
    }
    this._ctx = null;
  }
}

/**
 * Deterministic Pure-JS Stereo PCM 16-bit WAV Mixdown Renderer.
 * Mixes all enabled SFX & Ambience events using the exact same synthesizer and bus/ducking math
 * so exported audio is 100% consistent with live preview (and testable in Node!).
 */
export function renderSFXTimelineToWav({
  events = [],
  ambienceTracks = [],
  silenceCues = [],
  totalDuration = 8.0,
  registry = null,
  busManager = null,
  sampleRate = 22050,
}) {
  const reg = registry || new SFXPresetRegistry();
  const mixer = busManager || new SFXBusManager();
  const dur = Math.max(0.5, Math.min(60, Number(totalDuration) || 8.0));
  const totalSamples = Math.floor(dur * sampleRate);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  const allTracks = [...ambienceTracks, ...events];
  const anySolo = allTracks.some((e) => e.solo && !e.disabled);

  for (const ev of allTracks) {
    if (ev.disabled || ev.muted) continue;
    if (anySolo && !ev.solo) continue;
    const preset = reg.get(ev.presetId);
    if (!preset || preset.assetStatus === 'missing_file') continue;

    const synth = synthesizePresetSamples(preset, sampleRate, {
      pitch: ev.pitch ?? preset.pitch,
      playbackRate: ev.playbackRate ?? preset.playbackRate,
      duration: ev.loop ? Math.min(4.0, preset.duration) : ev.duration ?? preset.duration,
      fadeIn: ev.fadeIn ?? preset.fadeIn,
      fadeOut: ev.fadeOut ?? preset.fadeOut,
    });

    const startIdx = Math.max(0, Math.floor((ev.startTime || 0) * sampleRate));
    const spanSamples = ev.loop
      ? Math.floor((ev.duration || 2.0) * sampleRate)
      : synth.samples.length;

    const pan = Math.max(-1, Math.min(1, ev.pan || 0));
    const panL = Math.cos(((pan + 1) * Math.PI) / 4);
    const panR = Math.sin(((pan + 1) * Math.PI) / 4);
    const fadeInS = Math.floor((ev.fadeIn ?? 0.01) * sampleRate);
    const fadeOutS = Math.floor((ev.fadeOut ?? 0.04) * sampleRate);

    for (let k = 0; k < spanSamples; k++) {
      const dst = startIdx + k;
      if (dst >= totalSamples) break;
      const tSec = dst / sampleRate;
      const sil = silenceCues.find((c) => tSec >= c.startTime && tSec <= c.endTime);
      const busGain = mixer.getBusGain(ev.bus || preset.bus, {
        voiceActive: true,
        silenceDuckFactor: sil ? sil.duckFactor : 1.0,
      });

      let env = 1;
      if (fadeInS > 0 && k < fadeInS) env *= k / fadeInS;
      if (fadeOutS > 0 && k >= spanSamples - fadeOutS) env *= (spanSamples - 1 - k) / fadeOutS;

      const sample = synth.samples[k % synth.samples.length] * (ev.volume ?? preset.defaultVolume) * busGain * env;
      left[dst] += sample * panL;
      right[dst] += sample * panR;
    }
  }

  // Master soft limiter + peak measurement
  let peak = 0;
  for (let i = 0; i < totalSamples; i++) {
    left[i] = Math.tanh(left[i]);
    right[i] = Math.tanh(right[i]);
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  }

  // Encode RIFF WAVE 16-bit stereo PCM
  const dataBytes = totalSamples * 4;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  const writeStr = (off, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 2, true); // Stereo
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    view.setInt16(offset, Math.max(-32768, Math.min(32767, Math.round(left[i] * 32767))), true);
    view.setInt16(offset + 2, Math.max(-32768, Math.min(32767, Math.round(right[i] * 32767))), true);
    offset += 4;
  }

  return {
    wavBuffer: buffer,
    sampleRate,
    duration: dur,
    totalSamples,
    peakAmplitude: Number(peak.toFixed(4)),
    clipped: peak >= 0.999,
  };
}
