import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CAMERA_PRESET_CATEGORIES,
  CAMERA_PRESETS,
  CAMERA_PRESET_LIST,
  evaluateCameraPreset,
} from '../src/camera/presets.js';
import {
  CAMERA_TRANSITIONS,
  CAMERA_TRANSITION_LIST,
  evaluateCameraTransition,
  CAMERA_COMBINATIONS,
  CAMERA_COMBINATION_LIST,
  evaluateCameraCombination,
} from '../src/camera/transitions-and-combos.js';
import {
  CAMERA_COMPOSITION_CATEGORIES,
  CAMERA_COMPOSITIONS,
  CAMERA_COMPOSITION_LIST,
  CAMERA_EFFECT_DEFINITIONS,
  CAMERA_EFFECT_LIST,
  evaluateCameraMovementEffects,
  evaluateCameraVisualEffects,
} from '../src/camera/compositions-and-effects.js';
import {
  SubjectTargetRegistry,
  CameraTimeline,
  CameraChoreographyDirector,
} from '../src/camera/subject-tracker.js';
import { OutlineStyleSystem, ENVIRONMENT_PALETTES } from '../src/environment/style-system.js';
import { buildCameraShowcaseScene } from '../src/environment/camera-showcase.js';

function assertFiniteCameraState(cam, label) {
  for (const key of [
    'x',
    'y',
    'viewHeight',
    'fov',
    'orbitYaw',
    'orbitPitch',
    'dollyZ',
    'lookAtZ',
    'tiltX',
    'tiltY',
    'roll',
    'shakeX',
    'shakeY',
  ]) {
    assert.ok(Number.isFinite(cam[key]), `${label}: ${key} must be finite (got ${cam[key]})`);
  }
  assert.ok(cam.viewHeight >= 0.42 && cam.viewHeight <= 6.5, `${label}: viewHeight in safe bounds`);
  assert.ok(cam.fov >= 14 && cam.fov <= 46, `${label}: fov in safe bounds`);
  assert.ok(Math.abs(cam.orbitYaw) <= 0.42, `${label}: orbitYaw stays 2.5D-safe`);
  assert.ok(Math.abs(cam.orbitPitch) <= 0.22, `${label}: orbitPitch stays 2.5D-safe`);
}

test('Exact Cinematic Camera Library counts: 66 presets (16+12+12+10+16), 14 transitions, 22 compositions, 16 effects, 5 combos', () => {
  assert.equal(CAMERA_PRESET_LIST.length, 66);
  const counts = {};
  for (const p of CAMERA_PRESET_LIST) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }
  assert.deepEqual(counts, {
    zoom: 16,
    pan_tilt: 12,
    tracking: 12,
    orbit: 10,
    dynamic: 16,
  });
  assert.equal(CAMERA_PRESET_CATEGORIES.length, 5);
  assert.equal(CAMERA_TRANSITION_LIST.length, 14);
  assert.equal(CAMERA_COMPOSITION_LIST.length, 22);
  assert.equal(CAMERA_COMPOSITION_CATEGORIES.length, 3);
  assert.equal(CAMERA_EFFECT_LIST.length, 16);
  assert.equal(CAMERA_COMBINATION_LIST.length, 5);
});

test('All 66 camera presets evaluate deterministically at start, midpoint, and end with safe 2.5D bounds', () => {
  const registry = new SubjectTargetRegistry();
  for (const preset of CAMERA_PRESET_LIST) {
    const targetFrame = registry.get(preset.recommendedTarget);
    const s0 = evaluateCameraPreset(preset.id, { progress: 0, time: 0, targetFrame });
    const sMid = evaluateCameraPreset(preset.id, { progress: 0.5, time: preset.defaultDuration * 0.5, targetFrame });
    const s1 = evaluateCameraPreset(preset.id, { progress: 1, time: preset.defaultDuration, targetFrame });

    assertFiniteCameraState(s0.camera, `${preset.id}@0`);
    assertFiniteCameraState(sMid.camera, `${preset.id}@0.5`);
    assertFiniteCameraState(s1.camera, `${preset.id}@1`);

    // 100% determinism check
    const sMidRepeat = evaluateCameraPreset(preset.id, { progress: 0.5, time: preset.defaultDuration * 0.5, targetFrame });
    assert.deepEqual(sMid, sMidRepeat, `${preset.id} must be 100% deterministic`);
  }
});

test('Dolly Zoom modulates FOV cleanly while locking vertical subject framing', () => {
  const start = evaluateCameraPreset('dolly_zoom', { progress: 0, time: 0 });
  const end = evaluateCameraPreset('dolly_zoom', { progress: 1, time: 3.2 });
  assert.ok(end.camera.fov - start.camera.fov >= 20, 'Dolly zoom must sweep FOV noticeably');
  assert.ok(Math.abs(end.camera.viewHeight - start.camera.viewHeight) < 0.05, 'Subject viewHeight stays locked');
});

test('All 14 camera transitions blend smoothly and deterministically', () => {
  const from = { x: -1.0, y: 0.1, viewHeight: 2.3, fov: 24 };
  const to = { x: 1.9, y: -0.2, viewHeight: 1.5, fov: 24 };
  for (const tr of CAMERA_TRANSITION_LIST) {
    const t0 = evaluateCameraTransition(tr.id, from, to, 0);
    const tMid = evaluateCameraTransition(tr.id, from, to, 0.5);
    const t1 = evaluateCameraTransition(tr.id, from, to, 1);

    assertFiniteCameraState(t0.camera, `${tr.id}@0`);
    assertFiniteCameraState(tMid.camera, `${tr.id}@0.5`);
    assertFiniteCameraState(t1.camera, `${tr.id}@1`);
    assert.ok(Math.abs(t0.camera.x - from.x) < 0.01);
    assert.ok(Math.abs(t1.camera.x - to.x) < 0.01);
    assert.deepEqual(tMid, evaluateCameraTransition(tr.id, from, to, 0.5));
  }
});

test('All 5 multi-layer combinations evaluate cleanly across all phases with determinism', () => {
  const registry = new SubjectTargetRegistry();
  const resolveTarget = (id) => registry.get(id);
  for (const combo of CAMERA_COMBINATION_LIST) {
    for (const frac of [0, 0.25, 0.5, 0.75, 1.0]) {
      const t = combo.defaultDuration * frac;
      const a = evaluateCameraCombination(combo.id, { time: t, resolveTarget });
      const b = evaluateCameraCombination(combo.id, { time: t, resolveTarget });
      assertFiniteCameraState(a.camera, `${combo.id}@${frac}`);
      assert.deepEqual(a, b, `${combo.id} must be deterministic`);
    }
  }
});

test('All 16 camera effects (9 movement + 7 visual) evaluate deterministically without NaN', () => {
  const allOn = {};
  for (const fx of CAMERA_EFFECT_LIST) allOn[fx.id] = 1;
  const moveA = evaluateCameraMovementEffects(allOn, { time: 1.25, progress: 0.45, intensity: 1.2 });
  const moveB = evaluateCameraMovementEffects(allOn, { time: 1.25, progress: 0.45, intensity: 1.2 });
  assert.deepEqual(moveA, moveB);
  for (const v of Object.values(moveA)) assert.ok(Number.isFinite(v));

  const visA = evaluateCameraVisualEffects(allOn, { progress: 0.3, velocity: 0.9, directionX: 1, intensity: 1 });
  const visB = evaluateCameraVisualEffects(allOn, { progress: 0.3, velocity: 0.9, directionX: 1, intensity: 1 });
  assert.deepEqual(visA, visB);
  assert.ok(visA.whipPanBlur > 0.5);
  assert.ok(visA.zoomBlur > 0.5);
});

test('CameraTimeline resolves overlapping priority conflicts and smoothly blends consecutive events', () => {
  const registry = new SubjectTargetRegistry();
  const timeline = new CameraTimeline([
    { id: 'base_ev', preset: 'cinematic_push_in', target: 'character', start: 0, duration: 4, priority: 1 },
    { id: 'override_ev', preset: 'whip_pan', target: 'sports_car', start: 2, duration: 2, priority: 5, transition: 'whip_pan_transition' },
    { id: 'jet_ev', combination: 'combo_private_jet_reveal', target: 'private_jet', start: 4, duration: 4.5, priority: 2 },
  ]);

  assert.equal(timeline.totalDuration, 8.5);
  const at1 = timeline.evaluateAt(1.0, registry);
  assert.equal(at1.activeEvent.id, 'base_ev');

  const at25 = timeline.evaluateAt(2.5, registry);
  assert.equal(at25.activeEvent.id, 'override_ev', 'Higher-priority overlapping event must win cleanly');

  const at41 = timeline.evaluateAt(4.1, registry);
  assert.equal(at41.activeEvent.id, 'jet_ev');
  assert.equal(at41.inTransition, true, 'Entry transition should cross-blend smoothly');
  assertFiniteCameraState(at41.camera, 'timeline@4.1');

  // Identical timestamp produces identical snapshot
  assert.deepEqual(at41, timeline.evaluateAt(4.1, registry));
});

test('CameraChoreographyDirector maps storytelling narrations intelligently and avoids consecutive repetition', () => {
  const director = new CameraChoreographyDirector();
  const lines = [
    'Imagine this: starting from zero.',
    'You buy a sports car.',
    'You buy another sports car.',
    'A private jet waits on the runway.',
    'Look at your bank account on your smartphone.',
    "But here's the problem.",
    'Everything changes today.',
  ];
  const shots = lines.map((narration) => director.directShot({ narration }));
  assert.equal(shots[1].target, 'sports_car');
  assert.notEqual(shots[1].preset, shots[2].preset, 'Director must avoid repeating identical consecutive presets');
  assert.equal(shots[3].target, 'private_jet');
  assert.equal(shots[4].target, 'smartphone');
  assert.equal(shots[5].target, 'character_face');

  const tl = director.buildTimelineFromNarration(lines);
  assert.equal(tl.events.length, lines.length);
  assert.ok(tl.totalDuration > 25);
});

test('Camera Showcase Scene constructs all 4 depth layers and exposes all required demo subject anchors', () => {
  const style = new OutlineStyleSystem(ENVIRONMENT_PALETTES.sunlitDay);
  const built = buildCameraShowcaseScene(style);
  assert.ok(built.layers.background.children.length > 0);
  assert.ok(built.layers.midground.children.length > 0);
  assert.ok(built.layers.interaction.children.length > 0);
  assert.ok(built.layers.foreground.children.length > 0);
  assert.ok(built.smartphone, 'Showcase must include live 2.5D Smartphone asset');
  for (const anchor of ['character', 'character_face', 'smartphone', 'bank_balance', 'sports_car', 'private_jet', 'mansion', 'financial_popup']) {
    assert.ok(built.anchors[anchor], `Showcase missing required anchor "${anchor}"`);
  }
  built.smartphone.dispose();
  style.dispose();
});
