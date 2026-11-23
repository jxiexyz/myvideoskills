import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

import { PuppetCharacter } from '../src/core/puppet-character.js';
import { AnimationController } from '../src/animation/animation-controller.js';
import { ViewAdapter } from '../src/animation/view-adapter.js';
import { MOTION_DEFINITIONS } from '../src/animation/catalog.js';
import { mainCharacterManifest } from '../assets/characters/main-character/manifest.js';
import {
  MAIN_CHARACTER_VIEWS,
  SUPPORTED_VIEW_IDS,
  getMotionSupportForView,
} from '../assets/characters/main-character/shared/view-catalog.js';

function createHeadlessSkeleton(manifest) {
  const parts = new Map();
  const root = new THREE.Group();
  root.name = `${manifest.name || 'Mock'}-root`;
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
      dispose() {},
    };
    parts.set(def.name, part);
    root.add(group);
  }

  return {
    manifest,
    root,
    parts,
    partAliases,
    worldHeight: 2.0 * (manifest.worldHeightScale ?? 1.0),
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
    setDebugVisible() {},
    resetToRestPose(includeVis = false) {
      for (const p of parts.values()) p.resetToRest(includeVis);
    },
    dispose() {
      parts.clear();
    },
  };
}

function createHeadlessMultiViewCharacter() {
  const frontSkel = createHeadlessSkeleton(mainCharacterManifest);
  const backSkel = createHeadlessSkeleton(MAIN_CHARACTER_VIEWS.back);
  const topSkel = createHeadlessSkeleton(MAIN_CHARACTER_VIEWS.top);
  const bottomSkel = createHeadlessSkeleton(MAIN_CHARACTER_VIEWS.bottom);

  // Build PuppetCharacter directly using headless skeletons (no browser Image/Canvas required)
  const char = Object.create(PuppetCharacter.prototype);
  char.baseManifest = mainCharacterManifest;
  char._createOptions = { worldHeight: 2.0, scale: 1, position: [0, 0, 0], autoBlink: false };
  char.root = new THREE.Group();
  char._viewManifests = new Map([
    ['front', mainCharacterManifest],
    ['back', MAIN_CHARACTER_VIEWS.back],
    ['top', MAIN_CHARACTER_VIEWS.top],
    ['bottom', MAIN_CHARACTER_VIEWS.bottom],
  ]);
  char.activeView = 'front';
  char.manifest = mainCharacterManifest;
  char._viewCache = new Map();
  char._viewRequestSeq = 0;
  char._viewTransition = null;
  char._debugVisible = false;
  char._debugScene = null;
  char.current = null;

  const frontAdapter = new ViewAdapter('front', mainCharacterManifest.view);
  char._viewCache.set('front', {
    viewId: 'front',
    manifest: mainCharacterManifest,
    skeleton: frontSkel,
    adapter: frontAdapter,
    gazeController: null,
  });
  char.root.add(frontSkel.root);
  char.skeleton = frontSkel;
  char.gazeController = null;
  char.viewAdapter = frontAdapter;
  char._referenceSkeleton = frontSkel;

  // Use real ExpressionController & AnimationController
  const { ExpressionController } = requireLike();
  char.expressions = new ExpressionController(frontSkel, null, {
    blink: { autoBlink: false },
    facialVisibility: frontAdapter.facialVisibility,
  });
  char.controller = new AnimationController(frontSkel, char.expressions, {
    viewAdapter: frontAdapter,
    referenceSkeleton: frontSkel,
  });

  char.registerView('back', MAIN_CHARACTER_VIEWS.back, backSkel, null);
  char.registerView('top', MAIN_CHARACTER_VIEWS.top, topSkel, null);
  char.registerView('bottom', MAIN_CHARACTER_VIEWS.bottom, bottomSkel, null);
  char.controller.play('idle', { loop: true, transition: 0 });
  char.update(0);
  return { char, skeletons: { front: frontSkel, back: backSkel, top: topSkel, bottom: bottomSkel } };
}

import { ExpressionController as ImportedExpressionController } from '../src/animation/expression/expression-controller.js';
function requireLike() {
  return { ExpressionController: ImportedExpressionController };
}

test('Multi-view manifests & SVG packs: all 4 views valid, files exist on disk, and non-front views use distinct directional SVGs', () => {
  assert.deepEqual(SUPPORTED_VIEW_IDS, ['front', 'back', 'top', 'bottom']);
  const frontBodyImages = new Set(
    MAIN_CHARACTER_VIEWS.front.parts.map((p) => p.image)
  );

  for (const viewId of SUPPORTED_VIEW_IDS) {
    const manifest = MAIN_CHARACTER_VIEWS[viewId];
    assert.ok(manifest, `Missing view manifest for ${viewId}`);
    assert.ok(mainCharacterManifest.views[viewId], `mainCharacterManifest.views missing ${viewId}`);
    assert.ok(manifest.parts.length >= 16, `${viewId} should have layered articulated parts`);

    const seen = new Set();
    let reusedFrontCount = 0;

    for (const part of manifest.parts) {
      assert.ok(!seen.has(part.name), `Duplicate part ${part.name} in ${viewId}`);
      if (part.parent) {
        assert.ok(seen.has(part.parent), `Parent ${part.parent} must appear before ${part.name} in ${viewId}`);
      }
      assert.ok(Number.isFinite(part.pivot.x) && Number.isFinite(part.pivot.y), `Invalid pivot on ${viewId}.${part.name}`);
      assert.ok(Array.isArray(part.polygon) && part.polygon.length >= 3, `Invalid polygon on ${viewId}.${part.name}`);

      // Verify actual SVG file exists on disk and contains valid SVG markup
      const filePath = fileURLToPath(part.image);
      assert.ok(fs.existsSync(filePath), `Missing SVG asset on disk: ${filePath}`);
      const svgText = fs.readFileSync(filePath, 'utf8');
      assert.ok(svgText.includes('<svg') && svgText.includes('</svg>'), `Malformed SVG: ${filePath}`);

      if (viewId !== 'front' && frontBodyImages.has(part.image)) {
        reusedFrontCount++;
      }
      seen.add(part.name);
    }

    if (viewId !== 'front') {
      assert.equal(reusedFrontCount, 0, `View "${viewId}" must NOT alias front SVG assets!`);
      // Confirm ZERO front eye/brow/mouth layers exist on back/top/bottom views
      for (const name of seen) {
        assert.ok(
          !name.startsWith('eyes') && !name.startsWith('brows') && !name.startsWith('mouth'),
          `Non-front view "${viewId}" must not include front face layer "${name}"`
        );
      }
    }
  }
});

test('Motion support matrix classifies every registered motion across all 4 views', () => {
  const validStatuses = new Set(['native', 'adapted', 'limited', 'hidden', 'unsupported']);
  const motionIds = Object.keys(MOTION_DEFINITIONS);
  assert.ok(motionIds.length >= 40);

  for (const viewId of SUPPORTED_VIEW_IDS) {
    for (const motionId of motionIds) {
      const info = getMotionSupportForView(motionId, viewId);
      assert.ok(validStatuses.has(info.status), `Invalid support status for ${motionId} in ${viewId}`);
    }
    const thumbs = getMotionSupportForView('thumbsUp', viewId);
    assert.equal(thumbs.status, 'unsupported');
  }
});

test('Mid-animation view switching preserves active motions, exact phase, speed, loop, expression, and talking across all 4 views', async () => {
  const { char, skeletons } = createHeadlessMultiViewCharacter();

  char.setSpeed(1.35);
  char.setLoop(true);
  char.play('walk', { transition: 0 });
  char.play('wave', { transition: 0 });
  char.play('nod', { transition: 0, loop: true });
  char.expression('happy', { transition: 0 });
  char.talk(true);
  char.lookAt({ x: 0.5, y: -0.25 });

  // Advance to mid-cycle (~0.52s)
  for (let i = 0; i < 16; i++) char.update(1 / 30);

  const before = char.getState();
  const frontWaveArmDeg = THREE.MathUtils.radToDeg(
    skeletons.front.get('rightUpperArm').group.rotation.z
  );
  assert.ok(frontWaveArmDeg > 80, `Front wave rightUpperArm should be raised (+deg), got ${frontWaveArmDeg}`);

  // Switch Front -> Back (instant)
  await char.setView('back', { transition: 0 });
  const atBack = char.getState();
  assert.equal(atBack.view.activeView, 'back');
  assert.equal(atBack.view.faceVisible, false);
  assert.equal(atBack.channels.locomotion?.id, 'walk');
  assert.equal(atBack.channels.gesture?.id, 'wave');
  assert.equal(atBack.channels.head?.id, 'nod');
  assert.equal(atBack.channels.locomotion?.time, before.channels.locomotion?.time);
  assert.equal(atBack.channels.locomotion?.phase, before.channels.locomotion?.phase);
  assert.equal(atBack.channels.gesture?.time, before.channels.gesture?.time);
  assert.equal(atBack.speed, 1.35);
  assert.equal(atBack.face.expression, 'happy');
  assert.equal(atBack.face.talking, true);

  // Back view anatomically mirrors rightUpperArm rotation sign!
  const backWaveArmDeg = THREE.MathUtils.radToDeg(
    skeletons.back.get('rightUpperArm').group.rotation.z
  );
  assert.ok(backWaveArmDeg < -80, `Back wave rightUpperArm should be mirrored (-deg), got ${backWaveArmDeg}`);

  // Switch Back -> Top -> Bottom -> Front
  await char.setView('top', { transition: 0 });
  const atTop = char.getState();
  assert.equal(atTop.view.activeView, 'top');
  assert.equal(atTop.channels.locomotion?.phase, before.channels.locomotion?.phase);
  assert.equal(atTop.face.expression, 'happy');

  // Verify Top view moves stepping feet forward/back from rest during walk
  const topFootL = skeletons.top.get('footL');
  const topFootR = skeletons.top.get('footR');
  assert.ok(
    Math.abs(topFootL.group.position.y - topFootL.restTransform.y) > 0.005 ||
      Math.abs(topFootR.group.position.y - topFootR.restTransform.y) > 0.005,
    'Top view walk should project stride onto stepping feet Y offsets'
  );

  await char.setView('bottom', { transition: 0 });
  const atBottom = char.getState();
  assert.equal(atBottom.view.activeView, 'bottom');
  assert.equal(atBottom.channels.locomotion?.phase, before.channels.locomotion?.phase);

  // Return to Front -> verify exact expression & talking state restored!
  await char.setView('front', { transition: 0 });
  const backAtFront = char.getState();
  assert.equal(backAtFront.view.activeView, 'front');
  assert.equal(backAtFront.view.faceVisible, true);
  assert.equal(backAtFront.channels.locomotion?.phase, before.channels.locomotion?.phase);
  assert.equal(backAtFront.face.expression, 'happy');
  assert.equal(backAtFront.face.talking, true);
  assert.equal(skeletons.front.get('brows_raised').group.visible, true);
});

test('Smooth view transition completes while paused without resuming animation playback', async () => {
  const { char, skeletons } = createHeadlessMultiViewCharacter();

  char.play('walk', { transition: 0 });
  char.update(0.35);
  char.pause();

  const pausedTime = char.getState().channels.locomotion.time;

  await char.setView('back', { transition: 0.25 });
  assert.equal(char.getViewState().isTransitioning, true);
  assert.equal(char.getState().paused, true);

  // Step through view transition while paused
  char.update(0.15);
  assert.equal(char.getViewState().isTransitioning, true);
  assert.equal(char.getState().channels.locomotion.time, pausedTime, 'Walk timer must NOT advance while paused');

  char.update(0.15);
  assert.equal(char.getViewState().isTransitioning, false);
  assert.equal(char.getViewState().transitionProgress, 1);
  assert.equal(char.getState().paused, true);
  assert.equal(char.getState().channels.locomotion.time, pausedTime, 'Walk timer must remain frozen after view transition');
  assert.equal(skeletons.front.root.visible, false, 'Previous view must be hidden once transition finishes');
  assert.equal(skeletons.back.root.visible, true, 'Target view must be visible once transition finishes');
});

test('Top and Bottom views project vertical jump depth cleanly in opposite directions', async () => {
  const { char, skeletons } = createHeadlessMultiViewCharacter();

  char.play('jump', { transition: 0 });
  // Advance to jump apex (u ~ 0.52 of 1.05s = 0.546s)
  char.update(0.546);

  await char.setView('top', { transition: 0 });
  const topScaleAtApex = skeletons.top.get('body').group.scale.x;
  assert.ok(topScaleAtApex > 1.05, `Top view should scale UP toward overhead camera at jump apex (got ${topScaleAtApex})`);

  await char.setView('bottom', { transition: 0 });
  const bottomScaleAtApex = skeletons.bottom.get('body').group.scale.x;
  assert.ok(bottomScaleAtApex < 0.96, `Bottom view should scale DOWN away from low camera at jump apex (got ${bottomScaleAtApex})`);
});

test('Rapid sequential setView calls and round-trip stopAll leave zero rest-pose drift', async () => {
  const { char, skeletons } = createHeadlessMultiViewCharacter();
  char.play('run', { transition: 0 });
  char.update(0.25);

  await Promise.all([
    char.setView('back', { transition: 0.2 }),
    char.setView('top', { transition: 0.2 }),
    char.setView('bottom', { transition: 0 }),
  ]);
  assert.equal(char.getViewState().activeView, 'bottom');

  await char.setView('front', { transition: 0 });
  char.stopAll({ transition: 0 });
  char.update(0);

  for (const part of skeletons.front.parts.values()) {
    assert.ok(
      Math.abs(part.group.rotation.z - part.restTransform.rotation) < 1e-4,
      `Part ${part.name} drifted from rest rotation after multi-view round-trip`
    );
  }
});
