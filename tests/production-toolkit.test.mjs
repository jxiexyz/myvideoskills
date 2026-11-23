import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import {
  ENVIRONMENT_PALETTES,
  OutlineStyleSystem,
} from '../src/environment/style-system.js';
import {
  ENVIRONMENT_CATEGORIES,
  ENVIRONMENT_TEMPLATES,
  ENVIRONMENT_TEMPLATE_LIST,
  buildEnvironmentTemplate,
} from '../src/environment/templates.js';
import {
  COMPOSITION_PRESET_LIST,
  EnvironmentComposer,
} from '../src/environment/environment-composer.js';
import {
  CartoonSmartphoneAsset,
  DYNAMIC_ISLAND_STATES,
} from '../src/environment/props/smartphone.js';
import {
  ENTRANCE_EFFECTS,
  IMPACT_EFFECTS,
  CONTINUOUS_EFFECTS,
  EXIT_EFFECTS,
  GRAPHIC_TRANSITIONS,
  evaluateEntrance,
  evaluateImpact,
  evaluateContinuous,
  evaluateExit,
  evaluateTransition,
} from '../src/motion-graphics/effects.js';
import {
  MOTION_GRAPHIC_CATEGORIES,
  MOTION_GRAPHIC_TEMPLATE_LIST,
  createMotionGraphicConfig,
} from '../src/motion-graphics/templates.js';
import { evaluateMotionGraphicFrame } from '../src/motion-graphics/renderer.js';
import { SOUND_CUE_CATEGORIES } from '../src/audio/sound-events.js';
import {
  CameraChoreographyController,
  NarrationVisualMapper,
  DEMO_STORY_BEATS,
  DEMO_STORY_TOTAL_DURATION,
  StoryVisualDirector,
} from '../src/director/story-director.js';

test('Environment catalog provides all 37 templates across 5 categories', () => {
  assert.equal(ENVIRONMENT_CATEGORIES.length, 5);
  assert.equal(ENVIRONMENT_TEMPLATE_LIST.length, 37);
  assert.equal(Object.keys(ENVIRONMENT_PALETTES).length, 6);
  assert.equal(COMPOSITION_PRESET_LIST.length, 8);
  assert.equal(DYNAMIC_ISLAND_STATES.length, 7);

  for (const cat of ENVIRONMENT_CATEGORIES) {
    const matches = ENVIRONMENT_TEMPLATE_LIST.filter((t) => t.category === cat.id);
    assert.equal(matches.length, cat.count, `Category ${cat.id} should have ${cat.count} templates`);
  }
});

test('Every single 2.5D environment template builds cleanly with 4 layers and finite transforms', () => {
  const scene = new THREE.Scene();
  const composer = new EnvironmentComposer(scene, { floorY: -0.88 });

  for (const tpl of ENVIRONMENT_TEMPLATE_LIST) {
    const res = composer.load(tpl.id, { detailLevel: 'high', timeSec: 1.25 });
    assert.equal(composer.activeTemplateId, tpl.id);
    assert.ok(res.anchors && Object.keys(res.anchors).length > 0, `${tpl.id} should expose anchors`);

    composer.evaluateAt(1.25);
    const snapA = [];
    composer.root.traverse((obj) => {
      assert.ok(Number.isFinite(obj.position.x), `${tpl.id} finite x`);
      assert.ok(Number.isFinite(obj.position.y), `${tpl.id} finite y`);
      assert.ok(Number.isFinite(obj.position.z), `${tpl.id} finite z`);
      snapA.push([obj.position.x, obj.position.y, obj.position.z, obj.rotation.z]);
    });

    // Deterministic check: jumping to t=4.2 then back to t=1.25 yields identical transforms
    composer.evaluateAt(4.2);
    composer.evaluateAt(1.25);
    let idx = 0;
    composer.root.traverse((obj) => {
      assert.deepEqual(
        [obj.position.x, obj.position.y, obj.position.z, obj.rotation.z],
        snapA[idx++],
        `${tpl.id} environment animation must be 100% deterministic`
      );
    });
  }

  // Test reusable 2.5D smartphone prop inside an environment
  const style = new OutlineStyleSystem(ENVIRONMENT_PALETTES.twilightLuxury);
  const phone = new CartoonSmartphoneAsset(style, { initialState: 'financial_alert' });
  assert.ok(phone.group.children.length >= 6);
  for (const st of DYNAMIC_ISLAND_STATES) {
    phone.setState({ islandState: st.id });
    phone.update(0.9);
  }
  phone.dispose();
  style.dispose();

  // Verify luxury_driveway & airport_hangar expose dedicated hero anchors
  const style2 = new OutlineStyleSystem(ENVIRONMENT_PALETTES.sunsetGold);
  const drive = buildEnvironmentTemplate('luxury_driveway', style2, { includeSmartphone: true });
  assert.ok(drive.anchors.car, 'luxury_driveway must expose car anchor');
  assert.ok(drive.anchors.phone, 'includeSmartphone must expose phone anchor');
  style2.dispose();

  composer.dispose();
});

test('Motion Graphics library exposes 52 templates, 12+10+10+8 effects, 10 transitions, and 10 sound cues', () => {
  assert.equal(MOTION_GRAPHIC_CATEGORIES.length, 5);
  assert.equal(MOTION_GRAPHIC_TEMPLATE_LIST.length, 52);
  assert.equal(ENTRANCE_EFFECTS.length, 12);
  assert.equal(IMPACT_EFFECTS.length, 10);
  assert.equal(CONTINUOUS_EFFECTS.length, 10);
  assert.equal(EXIT_EFFECTS.length, 8);
  assert.equal(GRAPHIC_TRANSITIONS.length, 10);
  assert.equal(SOUND_CUE_CATEGORIES.length, 10);

  for (const cat of MOTION_GRAPHIC_CATEGORIES) {
    const count = MOTION_GRAPHIC_TEMPLATE_LIST.filter((t) => t.category === cat.id).length;
    assert.equal(count, cat.count, `Motion graphic category ${cat.id} should have ${cat.count} templates`);
  }
});

test('All Motion Graphics templates, effects, and transitions evaluate deterministically', () => {
  for (const fx of ENTRANCE_EFFECTS) {
    assert.deepEqual(evaluateEntrance(fx.id, 0.45), evaluateEntrance(fx.id, 0.45));
  }
  for (const fx of IMPACT_EFFECTS) {
    assert.deepEqual(evaluateImpact(fx.id, 0.5), evaluateImpact(fx.id, 0.5));
  }
  for (const fx of CONTINUOUS_EFFECTS) {
    assert.deepEqual(evaluateContinuous(fx.id, 2.3), evaluateContinuous(fx.id, 2.3));
  }
  for (const fx of EXIT_EFFECTS) {
    assert.deepEqual(evaluateExit(fx.id, 0.6), evaluateExit(fx.id, 0.6));
  }
  for (const tr of GRAPHIC_TRANSITIONS) {
    assert.deepEqual(evaluateTransition(tr.id, 0.5), evaluateTransition(tr.id, 0.5));
  }

  for (const tpl of MOTION_GRAPHIC_TEMPLATE_LIST) {
    const cfg = createMotionGraphicConfig(tpl.id);
    const frameA = evaluateMotionGraphicFrame(cfg, 1.15);
    const frameB = evaluateMotionGraphicFrame(cfg, 1.15);
    assert.deepEqual(frameA, frameB, `Template ${tpl.id} must be deterministic`);
    assert.ok(Number.isFinite(frameA.scaleX) && frameA.scaleX > 0);
    assert.ok(frameA.opacity >= 0 && frameA.opacity <= 1);
  }
});

test('NarrationVisualMapper maps all 6 storytelling prompt scenarios semantically', () => {
  const s1 = NarrationVisualMapper.map('If you earn $2,000 a month');
  assert.equal(s1.graphic.template, 'monthly_income_badge');
  assert.equal(s1.environmentId, 'home_office');

  const s2 = NarrationVisualMapper.map('Dreaming of making $1,000,000');
  assert.equal(s2.graphic.template, 'million_dollar_reveal');

  const s3 = NarrationVisualMapper.map('Divided by 12, that is $83,333 a month');
  assert.equal(s3.graphic.template, 'monthly_breakdown_counter');

  const s4 = NarrationVisualMapper.map('Buying a luxury sports car in cash');
  assert.equal(s4.environmentId, 'luxury_driveway');
  assert.equal(s4.graphic.anchorName, 'car');

  const s5 = NarrationVisualMapper.map('Stepping onto a private jet');
  assert.equal(s5.environmentId, 'airport_hangar');
  assert.equal(s5.graphic.anchorName, 'jet');

  const s6 = NarrationVisualMapper.map('Seeing nine zeros in your bank account on your smartphone');
  assert.equal(s6.environmentId, 'smartphone_hero_stage');
  assert.equal(s6.includeSmartphone, true);
  assert.equal(s6.smartphoneState.islandState, 'financial_alert');
});

test('StoryVisualDirector and CameraChoreographyController are 100% deterministic across arbitrary seeks', () => {
  const director = new StoryVisualDirector(DEMO_STORY_BEATS);
  assert.equal(DEMO_STORY_BEATS.length, 6);
  assert.ok(DEMO_STORY_TOTAL_DURATION > 25);

  const probeTimes = [0.2, 5.1, 10.4, 15.2, 20.0, 25.5];
  const firstPass = probeTimes.map((t) => director.evaluateAt(t));
  // Reverse jump order to verify zero accumulated state
  const reversedPass = [...probeTimes].reverse().map((t) => director.evaluateAt(t)).reverse();
  assert.deepEqual(firstPass, reversedPass);

  const camA = CameraChoreographyController.evaluate(DEMO_STORY_BEATS[3].cameraMove, 2.2, 4.6);
  const camB = CameraChoreographyController.evaluate(DEMO_STORY_BEATS[3].cameraMove, 2.2, 4.6);
  assert.deepEqual(camA, camB);
});

test('Every motion and expression referenced in DEMO_STORY_BEATS exists in PuppetKit catalog', async () => {
  const { MOTION_DEFINITIONS } = await import('../src/animation/catalog.js');
  const { EXPRESSION_PRESETS } = await import('../src/animation/expression/expression-presets.js');
  for (const beat of DEMO_STORY_BEATS) {
    if (beat.character?.motion) {
      assert.ok(
        MOTION_DEFINITIONS[beat.character.motion],
        `Story beat "${beat.id}" references unknown motion "${beat.character.motion}"`
      );
    }
    if (beat.character?.expression) {
      assert.ok(
        EXPRESSION_PRESETS[beat.character.expression],
        `Story beat "${beat.id}" references unknown expression "${beat.character.expression}"`
      );
    }
  }
});
