import test from 'node:test';
import assert from 'node:assert/strict';

import {
  analyzeNarrationScript,
  segmentNarrationIntoClauses,
} from '../src/narrative/beat-analyzer.js';
import {
  NarrativeToVisualDirector,
  NarrativeTimelineEvaluator,
  NARRATIVE_DEMO_SCRIPT,
} from '../src/narrative/narrative-director.js';
import {
  SFX_CATEGORIES,
  SFXPresetRegistry,
} from '../src/audio/sfx-presets.js';
import {
  SFXDirector,
  SFXValidator,
  scoreSoundCandidate,
} from '../src/audio/sfx-director.js';
import {
  SFXBusManager,
  SFXEventScheduler,
  generatePresetWaveform,
  renderSFXTimelineToWav,
} from '../src/audio/sfx-engine.js';

test('Semantic context disambiguates 4 different meanings of one million dollars', () => {
  const made = NarrativeToVisualDirector.generateStoryboard('You just made one million dollars.').events[0];
  const lost = NarrativeToVisualDirector.generateStoryboard('You lost one million dollars.').events[0];
  const owe = NarrativeToVisualDirector.generateStoryboard('You owe one million dollars.').events[0];
  const wish = NarrativeToVisualDirector.generateStoryboard('You wish you had one million dollars.').events[0];

  assert.equal(made.intent, 'financial_gain');
  assert.equal(lost.intent, 'financial_loss');
  assert.equal(owe.intent, 'financial_debt');
  assert.equal(wish.intent, 'financial_ambition');

  // Distinct expressions & visual templates
  assert.equal(made.character.expression, 'excited');
  assert.equal(lost.character.expression, 'scared');
  assert.equal(owe.character.expression, 'worried');
  assert.equal(wish.character.expression, 'determined');

  assert.equal(made.visual.config.colorTheme, 'emeraldWealth');
  assert.equal(lost.visual.config.colorTheme, 'coralPunch');
  assert.equal(owe.visual.config.colorTheme, 'coralPunch');
  assert.equal(wish.visual.config.colorTheme, 'editorialGold');

  // Serious loss/debt suppresses decorative continuous loops via conflict resolution
  assert.equal(lost.visual.config.continuous, 'none');
  assert.equal(owe.visual.config.continuous, 'none');
});

test('Compound narration splits into connected visual beats (salary -> millionaire)', () => {
  const script = 'Imagine making just $2,000 a month, but dreaming of becoming a millionaire.';
  const clauses = segmentNarrationIntoClauses(script);
  assert.equal(clauses.length, 2);

  const sb = NarrativeToVisualDirector.generateStoryboard(script);
  assert.equal(sb.beatCount, 2);
  assert.equal(sb.events[0].intent, 'financial_salary');
  assert.equal(sb.events[0].visual.templateId, 'monthly_income_badge');
  assert.equal(sb.events[0].visual.config.content, '$2,000');

  assert.equal(sb.events[1].intent, 'financial_ambition');
  assert.equal(sb.events[1].visual.templateId, 'million_dollar_reveal');
  assert.equal(sb.events[1].visual.config.content, '$1,000,000');
  assert.equal(sb.events[1].character.expression, 'determined');
  assert.ok(sb.events[1].character.gaze.eye.y < 0, 'Character looks upward toward the $1M financial target');
});

test('8-beat Demonstration Story coordinates acting, gaze, anti-repetition, conflict rules, and determinism', () => {
  const sb = NarrativeToVisualDirector.generateStoryboard(NARRATIVE_DEMO_SCRIPT);
  assert.equal(sb.beatCount, 8);
  assert.ok(sb.totalDuration > 30);
  assert.ok(sb.conflictResolutions.length >= 2, 'Expected priority & conflict resolution rules to fire');

  // Sports car beat moves camera to sports_car with whip-pan + character looks right
  const carBeat = sb.events.find((e) => e.intent === 'object_sports_car');
  assert.ok(carBeat);
  assert.equal(carBeat.camera.targetId, 'sports_car');
  assert.equal(carBeat.camera.transitionId, 'whip_pan_transition');
  assert.ok(carBeat.character.gaze.eye.x > 0.5, 'Character looks right toward the sports car');

  // Strict determinism check: identical timestamp produces deep-equal snapshot
  const snapA = NarrativeTimelineEvaluator.evaluateAt(sb, 14.2);
  const snapB = NarrativeTimelineEvaluator.evaluateAt(sb, 14.2);
  assert.deepEqual(snapA, snapB);

  // Storyboard manual override deterministically updates evaluation
  const edited = NarrativeToVisualDirector.applyStoryboardOverride(sb, sb.events[0].id, {
    expression: 'proud',
    cameraTarget: 'smartphone',
  });
  assert.equal(edited.events[0].character.expression, 'happy');
  assert.equal(edited.events[0].camera.targetId, 'smartphone');
});

test('SFXPresetRegistry covers all 8 categories, full metadata, honest missing-file reporting, and search/custom presets', () => {
  const reg = new SFXPresetRegistry();
  const all = reg.list();
  assert.equal(SFX_CATEGORIES.length, 8);
  assert.ok(all.length >= 75);

  for (const cat of SFX_CATEGORIES) {
    const items = reg.search({ category: cat.id });
    assert.ok(items.length >= 5, `Category ${cat.id} should have at least 5 presets`);
  }

  // Every preset has required metadata fields
  for (const p of all) {
    assert.ok(p.id && p.name && p.category && p.description);
    assert.ok(Array.isArray(p.tags) && Array.isArray(p.volumeRange));
    assert.ok(p.assetStatus === 'ready_procedural' || p.assetStatus === 'missing_file');
    assert.ok(typeof p.cooldown === 'number' && typeof p.defaultVolume === 'number');
  }

  // Honest missing asset report
  const report = reg.getMissingAssetsReport();
  assert.equal(report.missingFileCount, 4);
  assert.ok(report.readyProceduralCount >= 70);

  // Save custom preset & verify search
  const custom = reg.saveCustomPreset({ id: 'custom_test_ping', name: 'Studio Velvet Ping', category: 'ui' });
  assert.equal(reg.search({ query: 'velvet ping' }).length, 1);
  assert.equal(custom.id, 'custom_test_ping');
});

test('SFXDirector applies semantic restraint, footstep alignment, silence cues, ambience crossfades, and excludes comedy', () => {
  const reg = new SFXPresetRegistry();
  const director = new SFXDirector(reg);
  const sb = NarrativeToVisualDirector.generateStoryboard(NARRATIVE_DEMO_SCRIPT);
  const plan = director.directFromStoryboard(sb, { storyStyle: 'cinematic' });

  assert.ok(plan.events.length >= 8, 'Should generate synchronized SFX cues');
  assert.ok(plan.ambienceTracks.length >= 3, 'Should crossfade ambience beds across scene environments');
  assert.ok(plan.silenceCues.length >= 2, 'Should explicitly preserve silence/ducking on problem and closing beats');

  // Verify walking footsteps exist on beat 1
  const footsteps = plan.events.filter((e) => e.presetId === 'char_footsteps_light');
  assert.ok(footsteps.length >= 2, 'Expected synchronized footstep contacts during walking beat');

  // Verify phone tap + balance reveal on smartphone beat
  assert.ok(plan.events.some((e) => e.presetId === 'obj_phone_tap'));
  assert.ok(plan.events.some((e) => e.presetId === 'fin_balance_reveal'));

  // Verify sports car whip-pan & omitted engine rev (parked car!)
  assert.ok(plan.events.some((e) => e.presetId === 'cam_whip_pan'));
  assert.ok(plan.omittedDecisions.some((o) => o.presetId === 'obj_engine_idle_rev'));

  // Verify zero comedy presets and zero missing-file presets were scheduled
  assert.equal(plan.events.filter((e) => e.category === 'comedy').length, 0);
  for (const ev of plan.events) {
    assert.equal(reg.get(ev.presetId).assetStatus, 'ready_procedural');
  }

  // Validator confirms zero errors on directed plan
  const validation = SFXValidator.validate(plan.events, reg);
  assert.equal(validation.valid, true);
  const highScore = scoreSoundCandidate({
    narrativeImportance: 90,
    visualProminence: 90,
    emotionalRelevance: 85,
    actionIntensity: 80,
    nearbyEventCount: 0,
  });
  const crowdedScore = scoreSoundCandidate({
    narrativeImportance: 90,
    visualProminence: 90,
    emotionalRelevance: 85,
    actionIntensity: 80,
    nearbyEventCount: 2,
  });
  assert.ok(highScore > 75);
  assert.ok(crowdedScore < highScore, 'Audio density penalty must reduce candidate score');
});

test('SFXEventScheduler is seek-safe without duplicate triggers and WAV renderer outputs valid non-clipping PCM', () => {
  const reg = new SFXPresetRegistry();
  const busManager = new SFXBusManager();
  const scheduler = new SFXEventScheduler();

  const events = [
    { id: 'e1', presetId: 'ui_popup_appear', startTime: 0.5, duration: 0.16, bus: 'sfx_secondary', volume: 0.45, muted: false, solo: false, disabled: false, loop: false },
    { id: 'e2', presetId: 'cam_whip_pan', startTime: 1.2, duration: 0.22, bus: 'transition', volume: 0.55, muted: false, solo: false, disabled: false, loop: false },
  ];

  // Stepping forward triggers e1 once, never twice
  assert.equal(scheduler.collectTriggers(events, 0.2).length, 0);
  const hit1 = scheduler.collectTriggers(events, 0.52);
  assert.equal(hit1.length, 1);
  assert.equal(hit1[0].id, 'e1');
  assert.equal(scheduler.collectTriggers(events, 0.55).length, 0);

  // Backward seek resets cleanly without firing anything mid-seek
  assert.equal(scheduler.collectTriggers(events, 0.1).length, 0);
  const replayHit = scheduler.collectTriggers(events, 0.52);
  assert.equal(replayHit.length, 1);
  assert.equal(replayHit[0].id, 'e1');

  // Voice ducking reduces music/ambience gain cleanly
  const musicUnducked = busManager.getBusGain('music', { voiceActive: false });
  const musicDucked = busManager.getBusGain('music', { voiceActive: true });
  assert.ok(musicDucked < musicUnducked, 'Voice ducking must lower music bed during narration');

  // Deterministic waveform & WAV render check
  const wf1 = generatePresetWaveform(reg.get('ui_popup_appear'), 24);
  const wf2 = generatePresetWaveform(reg.get('ui_popup_appear'), 24);
  assert.deepEqual(wf1, wf2);

  const wav = renderSFXTimelineToWav({
    events,
    totalDuration: 2.0,
    registry: reg,
    busManager,
    sampleRate: 16000,
  });
  assert.ok(wav.wavBuffer.byteLength > 44);
  assert.equal(wav.clipped, false, 'Master soft limiter must prevent clipping');
  assert.ok(wav.peakAmplitude > 0.01, 'Rendered WAV must contain audible signal');
});
