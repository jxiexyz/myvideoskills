import { clamp, smoothstep } from '../../utils/math.js';

/**
 * Controlled one-shot and automatic idle blinking.
 * Works across every expression and always restores the active eye state cleanly.
 */
export class BlinkController {
  constructor(options = {}) {
    this.autoBlink = options.autoBlink ?? true;
    this.minInterval = options.minInterval ?? 2.8;
    this.maxInterval = options.maxInterval ?? 4.6;
    this.closeDuration = options.closeDuration ?? 0.055;
    this.holdDuration = options.holdDuration ?? 0.035;
    this.openDuration = options.openDuration ?? 0.095;

    this._elapsedSinceBlink = 0;
    this._nextInterval = 3.2;
    this._blinking = false;
    this._blinkTime = 0;
    this._progress = 0; // 0 = open, 1 = fully closed
    this._rngSeed = options.seed ?? 1337;
  }

  _nextRandom() {
    // Deterministic LCG so tests and replays are reproducible
    this._rngSeed = (this._rngSeed * 1664525 + 1013904223) >>> 0;
    return this._rngSeed / 4294967296;
  }

  get totalDuration() {
    return this.closeDuration + this.holdDuration + this.openDuration;
  }

  get isBlinking() {
    return this._blinking;
  }

  get progress() {
    return this._progress;
  }

  setAutoBlink(enabled) {
    this.autoBlink = Boolean(enabled);
    if (!this.autoBlink) {
      this._elapsedSinceBlink = 0;
    }
  }

  trigger() {
    this._blinking = true;
    this._blinkTime = 0;
    this._elapsedSinceBlink = 0;
    this._nextInterval = this.minInterval + (this.maxInterval - this.minInterval) * this._nextRandom();
  }

  reset() {
    this._blinking = false;
    this._blinkTime = 0;
    this._progress = 0;
    this._elapsedSinceBlink = 0;
  }

  /**
   * Advance blink state by `dt` seconds.
   * @param {number} dt
   * @param {boolean} allowBlink - false when active expression already has closed/squinted eyes
   * @returns {number} blink closure progress (0..1)
   */
  update(dt, allowBlink = true) {
    if (!allowBlink) {
      this._blinking = false;
      this._progress = 0;
      return 0;
    }

    if (this._blinking) {
      this._blinkTime += dt;
      const c = this.closeDuration;
      const h = this.holdDuration;
      const o = this.openDuration;
      if (this._blinkTime < c) {
        this._progress = smoothstep(this._blinkTime / c);
      } else if (this._blinkTime < c + h) {
        this._progress = 1;
      } else if (this._blinkTime < c + h + o) {
        this._progress = 1 - smoothstep((this._blinkTime - c - h) / o);
      } else {
        this._blinking = false;
        this._blinkTime = 0;
        this._progress = 0;
      }
      return clamp(this._progress, 0, 1);
    }

    if (this.autoBlink) {
      this._elapsedSinceBlink += dt;
      if (this._elapsedSinceBlink >= this._nextInterval) {
        this.trigger();
      }
    }
    return 0;
  }
}
