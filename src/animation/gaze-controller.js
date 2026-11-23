import * as THREE from 'three';

/**
 * Dynamic 2D eye gaze & eyelid renderer.
 * Preserves 100% backward compatibility with `createGazeController(puppet, rig)`
 * while supporting expression-specific eyelid profiles (`setProfile(profileName)`)
 * and smooth lid closure (`setBlinkProgress(0..1)`).
 */
export function createGazeController(puppet, rig) {
  if (!rig) return null;
  const part = puppet.skeleton.get('eyes');
  if (!part) throw new Error('gazeRig requires eyes part');
  if (typeof document === 'undefined') return null;

  const { bounds } = part;
  const canvas = document.createElement('canvas');
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const originalMap = part.mesh.material.map;

  const compileProfile = (spec) => ({
    eyes: spec.eyes,
    masks: spec.eyes.map((e) => new Path2D(e.path)),
    lid: new Path2D(spec.lidPath),
    lowerLid: spec.lowerLidPath ? new Path2D(spec.lowerLidPath) : null,
    crease: spec.creasePath ? new Path2D(spec.creasePath) : null,
    irisRadius: spec.irisRadius || rig.irisRadius,
    pupilRadius: spec.pupilRadius || rig.pupilRadius,
    extraGlint: Boolean(spec.extraGlint),
    tearHighlight: Boolean(spec.tearHighlight),
  });

  const profiles = new Map();
  if (rig.profiles) {
    for (const [key, spec] of Object.entries(rig.profiles)) {
      profiles.set(key, compileProfile(spec));
    }
  }
  if (!profiles.has('neutral')) {
    profiles.set('neutral', compileProfile(rig));
  }

  let activeProfileName = 'neutral';
  let activeProfile = profiles.get('neutral');
  let last = { x: 0, y: 0 };
  let blinkProgress = 0;

  const ellipse = (x, y, rx, ry, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
    ctx.fill();
  };

  const redraw = () => {
    if (part.mesh.material.map !== texture) {
      part.mesh.material.map = texture;
      part.mesh.material.needsUpdate = true;
    }
    const { x, y } = last;
    const p = activeProfile;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(rig.offset.x - bounds.minX, rig.offset.y - bounds.minY);

    if (blinkProgress >= 0.92) {
      // Fully closed blink curve matching heroine eyes_closed style
      ctx.strokeStyle = rig.pupil;
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(168, 245);
      ctx.quadraticCurveTo(202, 260, 236, 250);
      ctx.moveTo(287, 250);
      ctx.quadraticCurveTo(322, 260, 352, 245);
      ctx.stroke();
      texture.needsUpdate = true;
      return;
    }

    for (let i = 0; i < p.eyes.length; i++) {
      const e = p.eyes[i];
      const cx = e.cx + x * rig.travel.x;
      const cy = e.cy + y * rig.travel.y;
      ctx.fillStyle = rig.white;
      ctx.fill(p.masks[i]);
      ctx.save();
      ctx.clip(p.masks[i]);
      ellipse(cx, cy, p.irisRadius.x, p.irisRadius.y, rig.iris);
      ellipse(cx + 1, cy + 1, p.pupilRadius.x, p.pupilRadius.y, rig.pupil);
      ellipse(cx + 4, cy - 3, 2.8, 3.2, rig.glint);
      if (p.extraGlint) {
        ellipse(cx - 5, cy + 5, 1.8, 1.8, rig.glint);
      }
      if (p.tearHighlight) {
        ellipse(cx - 7, cy + 6, 2.3, 1.8, 'rgba(223,244,255,0.92)');
      }
      // Partial blink lid sweep from top of eye
      if (blinkProgress > 0.02) {
        const lidH = 44 * blinkProgress;
        ctx.fillStyle = '#f6cfb3';
        ctx.fillRect(e.cx - 46, e.cy - 34, 92, lidH);
        ctx.strokeStyle = rig.pupil;
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(e.cx - 42, e.cy - 34 + lidH);
        ctx.lineTo(e.cx + 42, e.cy - 34 + lidH);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (p.crease) {
      ctx.strokeStyle = '#9c5d4b';
      ctx.lineWidth = 2.5;
      ctx.stroke(p.crease);
    }
    if (p.lowerLid) {
      ctx.strokeStyle = rig.pupil;
      ctx.lineWidth = 2.6;
      ctx.stroke(p.lowerLid);
    }
    ctx.strokeStyle = rig.pupil;
    ctx.lineWidth = 5;
    ctx.stroke(p.lid);
    texture.needsUpdate = true;
  };

  return {
    apply(gaze) {
      if (!gaze) {
        if (part.mesh.material.map !== originalMap) {
          part.mesh.material.map = originalMap;
          part.mesh.material.needsUpdate = true;
        }
        return;
      }
      const x = Math.max(-1, Math.min(1, gaze.x ?? 0));
      const y = Math.max(-1, Math.min(1, gaze.y ?? 0));
      last = { x, y };
      redraw();
    },

    setProfile(profileName) {
      const next = profiles.has(profileName) ? profileName : 'neutral';
      if (next !== activeProfileName) {
        activeProfileName = next;
        activeProfile = profiles.get(next);
      }
      redraw();
    },

    setBlinkProgress(amount) {
      const clamped = Math.max(0, Math.min(1, amount ?? 0));
      if (Math.abs(clamped - blinkProgress) > 1e-3 || clamped === 0) {
        blinkProgress = clamped;
        redraw();
      }
    },

    getProfile() {
      return activeProfileName;
    },

    snapshot() {
      return {
        gaze: { ...last },
        profile: activeProfileName,
        blinkProgress,
        irisCenters: activeProfile.eyes.map((e) => ({
          x: e.cx + last.x * rig.travel.x,
          y: e.cy + last.y * rig.travel.y,
        })),
        width: canvas.width,
        height: canvas.height,
      };
    },

    dispose() {
      if (part.mesh.material.map === texture) {
        part.mesh.material.map = originalMap;
        part.mesh.material.needsUpdate = true;
      }
      texture.dispose();
    },
  };
}
