import { clamp, lerp, easeInOut } from '../utils/math.js';

export class Timeline {
  constructor() { this.tracks = []; this.duration = 1; this.loop = false; this.elapsed = 0; this.playing = false; this.speed = 1; }
  addTrack(target, property, keyframes, options = {}) {
    const frames = [...keyframes].sort((a, b) => a.time - b.time);
    this.tracks.push({ target, property, frames, easing: options.easing || 'linear' });
    this.duration = Math.max(this.duration, frames.at(-1)?.time || 0);
    return this;
  }
  play({ loop = false, speed = 1, restart = true } = {}) { this.loop = loop; this.speed = speed; this.playing = true; if (restart) this.elapsed = 0; return this; }
  stop() { this.playing = false; this.elapsed = 0; }
  pause() { this.playing = false; }
  update(delta) {
    if (!this.playing) return;
    this.elapsed += delta * this.speed;
    if (this.elapsed >= this.duration) {
      if (this.loop) this.elapsed %= this.duration;
      else { this.elapsed = this.duration; this.playing = false; }
    }
    const t = this.elapsed;
    for (const track of this.tracks) {
      const { frames, target, property } = track;
      if (!frames.length || !target) continue;
      let a = frames[0], b = frames.at(-1);
      for (let i = 0; i < frames.length - 1; i++) if (t >= frames[i].time && t <= frames[i + 1].time) { a = frames[i]; b = frames[i + 1]; break; }
      const span = Math.max(0.00001, b.time - a.time);
      let p = clamp((t - a.time) / span, 0, 1);
      if (track.easing === 'smooth') p = easeInOut(p);
      const value = lerp(a.value, b.value, p);
      if (property === 'rotation') target.rotation.z = value;
      else if (property === 'x' || property === 'y') target.position[property] = value;
      else target[property] = value;
    }
  }
}

