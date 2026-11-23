import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import { AnimationController } from '../src/animation/animation-controller.js';
import { ExpressionController } from '../src/animation/expression/expression-controller.js';
import { BlinkController } from '../src/animation/expression/blink-controller.js';
import { EXPRESSION_NAMES, EXPRESSION_PRESETS } from '../src/animation/expression/expression-presets.js';
import {
  MOTION_DEFINITIONS,
  COMBINED_PRESETS,
  listMotions,
  listExpressions,
  listPresets,
} from '../src/animation/catalog.js';
import { mainCharacterManifest } from '../assets/characters/main-character/manifest.js';
import { minimalStarterManifest } from '../assets/characters/minimal-starter/manifest.js';

/**
 * Lightweight headless mock skeleton implementing the exact PuppetSkeleton interface
 * so we can unit-test the full multi-channel AnimationController & ExpressionController
 * in pure Node without a browser or DOM canvas.
 */
function createHeadlessSkeleton(manifest) {
  const parts = new Map();
  const root = new THREE.Group();
  const partAliases = manifest.partAliases ? { ...manifest.partAliases } : {};

  for (const def of manifest.parts) {
    const group = new THREE.Group();
    group.name = `${def.name}-pivot`;
    group.position.set(def.pivot.x, 1 - def.pivot.y, def.z ?? 0);
    group.rotation.z = THREE.MathUtils.degToRad(def.rotation ?? 0);
    group.visible = def.visible !== false;

    const restTransform = {
      x: group.position.x,
      y: group.position.y,
      z: group.position.z,
      rotation: group.rotation.z,
      scaleX: 1,
      scaleY: 1,
      visible: group.visible,
    };

    const part = {
      name: def.name,
      definition: def,
      group,
      mesh: { material: { opacity: 1 } },
      restTransform,
      resetToRest(includeVis = false) {
        group.position.set(restTransform.x, restTransform.y, restTransform.z);
        group.rotation.z = restTransform.rotation;
        group.scale.set(restTransform.scaleX, restTransform.scaleY, 1);
        if (includeVis) group.visible = restTransform.visible;
      },
    };
    parts.set(def.name, part);
  }

  return {
    manifest,
    root,
    parts,
    partAliases,
    worldHeight: 2.0,
    resolveName(name) {
      if (parts.has(name)) return name;
      const aliased = partAliases[name];
      if (aliased && parts.has(aliased)) return aliased;
      return name;
    },
    get(name) {
      return parts.get(this.resolveName(name));
    },
    has(name) {
      return parts.has(this.resolveName(name));
    },
    setVisible(name, v) {
      const p = this.get(name);
      if (p) p.group.visible = v;
    },
    resetToRestPose(includeVis = false) {
      for (const p of parts.values()) p.resetToRest(includeVis);
    },
  };
}

test('Manifest structure: main-character and minimal-starter have valid parents, pivots, and 16 expressions', () => {
  for (const manifest of [mainCharacterManifest, minimalStarterManifest]) {
    const seen = new Set();
    for (const part of manifest.parts) {
      assert.ok(!seen.has(part.name), `Duplicate part ${part.name} in ${manifest.id}`);
      if (part.parent) {
        assert.ok(seen.has(part.parent), `Parent ${part.parent} must precede ${part.name} in ${manifest.id}`);
      }
      assert.ok(Number.isFinite(part.pivot.x) && Number.isFinite(part.pivot.y));
      assert.ok(Array.isArray(part.polygon) && part.polygon.length >= 3);
      seen.add(part.name);
    }
    for (const expr of EXPRESSION_NAMES) {
      assert.ok(manifest.expressions[expr], `Manifest ${manifest.id} missing expression ${expr}`);
    }
  }
  assert.equal(EXPRESSION_NAMES.length, 16);
  assert.equal(listExpressions().length, 16);
  assert.equal(listPresets().length, 7);
});

test('Multi-channel independence: gesture does not cancel breathing/idle or expression', () => {
  const skeleton = createHeadlessSkeleton(mainCharacterManifest);
  const expr = new ExpressionController(skeleton, null, { blink: { autoBlink: false } });
  const ctrl = new AnimationController(skeleton, expr);

  expr.setExpression('happy', { transition: 0 });
  ctrl.play('breathing', { channel: 'base', loop: true, transition: 0 });
  ctrl.play('waveOnce', { channel: 'gesture', transition: 0 });
  ctrl.play('nod', { channel: 'head', transition: 0 });

  // Step to mid-gesture
  for (let i = 0; i < 15; i++) {
    ctrl.update(1 / 30);
    expr.update(1 / 30);
  }

  const st = ctrl.getState();
  assert.equal(st.channels.base?.id, 'breathing');
  assert.equal(st.channels.gesture?.id, 'waveOnce');
  assert.equal(st.channels.head?.id, 'nod');
  assert.equal(expr.currentName, 'happy');

  // Verify rightUpperArm actually moved significantly for wave
  const rArm = skeleton.get('rightUpperArm');
  assert.ok(
    Math.abs(rArm.group.rotation.z - rArm.restTransform.rotation) > 0.5,
    'Wave gesture should rotate rightUpperArm'
  );
  // Verify body breathing also still offsets body.y
  const body = skeleton.get('body');
  assert.notEqual(body.group.position.y, body.restTransform.y, 'Breathing should keep animating body.y');
});

test('One-shot rest-pose recovery and clean mid-action interruption (no stuck limbs)', () => {
  const skeleton = createHeadlessSkeleton(mainCharacterManifest);
  const ctrl = new AnimationController(skeleton, null);

  ctrl.play('raiseBothHands', { transition: 0, fadeOut: 0.1 });
  ctrl.update(0.6); // mid-raise
  const lArm = skeleton.get('leftUpperArm');
  assert.ok(Math.abs(lArm.group.rotation.z - lArm.restTransform.rotation) > 1.0);

  // Interrupt mid-raise with pointRight, then let pointRight finish completely
  ctrl.play('pointRight', { transition: 0.1, fadeOut: 0.1 });
  for (let i = 0; i < 80; i++) ctrl.update(1 / 30);

  // Both left and right arms must cleanly return to rest transform (no drift or stuck limb!)
  assert.ok(
    Math.abs(lArm.group.rotation.z - lArm.restTransform.rotation) < 1e-4,
    'Interrupted leftUpperArm must return cleanly to rest'
  );
  const rArm = skeleton.get('rightUpperArm');
  assert.ok(
    Math.abs(rArm.group.rotation.z - rArm.restTransform.rotation) < 1e-4,
    'Completed rightUpperArm must return cleanly to rest'
  );
  assert.equal(ctrl.getState().channels.gesture, null);
});

test('Looping motion boundary continuity: t=0 and t=duration match seamlessly for all looping clips', () => {
  const skeleton = createHeadlessSkeleton(mainCharacterManifest);
  const looping = Object.values(MOTION_DEFINITIONS).filter((m) => m.defaultLoop);
  assert.ok(looping.length >= 10);

  for (const def of looping) {
    const p0 = def.evaluate(0, def.duration, { skeleton });
    const pEnd = def.evaluate(def.duration, def.duration, { skeleton });
    for (const [partName, vals] of Object.entries(p0.parts || {})) {
      const endVals = pEnd.parts?.[partName] || {};
      for (const prop of ['x', 'y', 'rot', 'scaleX', 'scaleY']) {
        if (vals[prop] !== undefined && endVals[prop] !== undefined) {
          assert.ok(
            Math.abs(vals[prop] - endVals[prop]) < 0.05,
            `Loop discontinuity in ${def.id}.${partName}.${prop}: start=${vals[prop]} end=${endVals[prop]}`
          );
        }
      }
    }
  }
});

test('Walk + Wave simultaneously: legs keep walking while right arm waves', () => {
  const skeleton = createHeadlessSkeleton(mainCharacterManifest);
  const ctrl = new AnimationController(skeleton, null);

  ctrl.play('walk', { transition: 0 });
  ctrl.play('wave', { transition: 0 });

  ctrl.update(0.35);
  const thighL = skeleton.get('thighL');
  const rArm = skeleton.get('rightUpperArm');

  assert.ok(Math.abs(thighL.group.rotation.z - thighL.restTransform.rotation) > 0.05, 'Walk moves legs');
  assert.ok(THREE.MathUtils.radToDeg(rArm.group.rotation.z) > 90, 'Wave owns rightUpperArm over walk swing');
});

test('Expression transitions, non-destructive talking mouth, and blink restoration', () => {
  const skeleton = createHeadlessSkeleton(mainCharacterManifest);
  const mockGaze = {
    last: null,
    profile: 'neutral',
    blink: 0,
    setProfile(p) { this.profile = p; },
    setBlinkProgress(b) { this.blink = b; },
    apply(g) { this.last = g; },
  };
  const expr = new ExpressionController(skeleton, mockGaze, { blink: { autoBlink: false } });

  // Switch expression with smooth transition
  expr.setExpression('sad', { transition: 0.2 });
  expr.update(0.05);
  expr.update(0.2);
  assert.equal(expr.currentName, 'sad');
  assert.equal(mockGaze.profile, 'sad');
  assert.equal(skeleton.get('mouth_frown').group.visible, true);
  assert.equal(skeleton.get('brows_sad').group.visible, true);

  // Talking overlays mouth temporarily and restores sad frown when stopped
  expr.setTalking(true);
  expr.update(0.15);
  expr.setTalking(false);
  expr.update(0.05);
  assert.equal(skeleton.get('mouth_frown').group.visible, true, 'Stopping talking must restore active expression mouth');

  // Blink closes and reopens back to 0 without losing sad expression
  expr.blink();
  expr.update(0.06);
  assert.ok(mockGaze.blink > 0.8, 'Blink should reach closed state');
  expr.update(0.2);
  assert.equal(mockGaze.blink, 0, 'Blink should cleanly reopen');
  assert.equal(mockGaze.profile, 'sad', 'Active expression eye profile preserved after blink');

  // Viseme hook works and restores on rest
  expr.setViseme('O');
  assert.equal(skeleton.get('mouth_small_o').group.visible, true);
  expr.setViseme('rest');
  assert.equal(skeleton.get('mouth_frown').group.visible, true);
});

test('All 16 expressions produce distinct face configurations and all 7 combined presets reference valid motions/expressions', () => {
  const signatures = new Set();
  for (const name of EXPRESSION_NAMES) {
    const p = EXPRESSION_PRESETS[name];
    const sig = `${p.eyes}|${p.brows}|${p.mouth}|${p.blush > 0 ? 1 : 0}|${p.defaultGaze.x},${p.defaultGaze.y}`;
    assert.ok(!signatures.has(sig), `Duplicate facial signature for expression "${name}"`);
    signatures.add(sig);
  }
  assert.equal(signatures.size, 16);

  for (const preset of Object.values(COMBINED_PRESETS)) {
    assert.ok(EXPRESSION_PRESETS[preset.expression], `Invalid expression in preset ${preset.id}`);
    if (preset.base) assert.ok(MOTION_DEFINITIONS[preset.base], `Invalid base in preset ${preset.id}`);
    if (preset.locomotion) assert.ok(MOTION_DEFINITIONS[preset.locomotion], `Invalid locomotion in preset ${preset.id}`);
    if (preset.head) assert.ok(MOTION_DEFINITIONS[preset.head], `Invalid head in preset ${preset.id}`);
    if (preset.gesture) assert.ok(MOTION_DEFINITIONS[preset.gesture], `Invalid gesture in preset ${preset.id}`);
  }
});

test('BlinkController respects allowBlink=false for closed-eye expressions like laughing', () => {
  const bc = new BlinkController({ autoBlink: true, minInterval: 0.5, maxInterval: 0.5 });
  assert.equal(bc.update(1.0, false), 0);
  bc.trigger();
  assert.equal(bc.update(0.05, false), 0);
  assert.equal(bc.isBlinking, false);
});

test('Catalog exposes complete motion metadata across all required categories', () => {
  const all = listMotions();
  assert.ok(all.length >= 38, `Expected >= 38 motions, got ${all.length}`);
  const ids = new Set(all.map((m) => m.id));
  for (const required of [
    'idle', 'breathing', 'bodySway', 'weightShift',
    'nod', 'nodLoop', 'shake', 'tiltLeft', 'tiltRight',
    'lookLeft', 'lookRight', 'lookUp', 'lookDown', 'glance', 'lookAround',
    'wave', 'waveOnce', 'point', 'pointLeft', 'pointRight',
    'raiseLeftHand', 'raiseRightHand', 'raiseBothHands', 'lowerHands',
    'shrug', 'clap', 'explain', 'handsUp',
    'walk', 'walkStart', 'walkStop', 'run', 'runStart', 'runStop',
    'jump', 'land', 'crouch', 'recoil', 'surprisedReaction', 'laugh', 'bow',
  ]) {
    assert.ok(ids.has(required), `Missing required motion: ${required}`);
  }
});
