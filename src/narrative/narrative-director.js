/**
 * Central Narrative-to-Visual Director, Unified Story Event System,
 * Priority & Conflict Resolution Engine, Editable Automatic Storyboard Generator,
 * and Deterministic Timeline Evaluator for PuppetKit.
 *
 * Strictly deterministic — zero Math.random(), zero Date.now().
 */

import { analyzeNarrationScript } from './beat-analyzer.js';
import {
  CharacterActingDirector,
  SemanticPopupDirector,
  SmartCameraHighlightDirector,
  BackgroundResponseDirector,
  buildVisualHierarchy,
  NARRATIVE_EXPRESSION_MAP,
  resolveGazeForTarget,
} from './acting-popup-camera-directors.js';
import { evaluateCameraPreset, DEFAULT_BASE_FRAME } from '../camera/presets.js';
import { evaluateCameraTransition } from '../camera/transitions-and-combos.js';
import { SubjectTargetRegistry } from '../camera/subject-tracker.js';
import { clamp01, easeOutCubic } from '../motion-graphics/effects.js';

export const PRIORITY_RANK = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

/**
 * Complete 8-beat Demonstration Story exercising every narrative & sound scenario:
 *  1. Walking entrance + $2,000/month salary ceiling
 *  2. Ambition pivot -> $1,000,000 dream (gaze shift + target push-in)
 *  3. Smartphone tap & balance check
 *  4. Problem + $800 rent expense conflict (serious reaction + intentional silence/ducking)
 *  5. Savings compounding -> $1,000,000 breakthrough
 *  6. Sports car purchase & whip-pan reveal
 *  7. Private jet hangar tracking & ambience crossfade
 *  8. Calm audience-facing closing question
 */
export const NARRATIVE_DEMO_SCRIPT = [
  {
    id: 'demo_1_salary',
    text: 'Imagine walking into your workspace making just $2,000 a month.',
    duration: 4.4,
  },
  {
    id: 'demo_2_ambition',
    text: 'But dreaming of becoming a millionaire.',
    duration: 3.8,
  },
  {
    id: 'demo_3_phone_balance',
    text: 'You tap your smartphone and check your bank balance every morning.',
    duration: 4.2,
  },
  {
    id: 'demo_4_problem',
    text: "But here's the problem: you spend $800 on rent and lose momentum.",
    duration: 4.4,
  },
  {
    id: 'demo_5_breakthrough',
    text: 'Until your savings keep growing and you just made $1,000,000.',
    duration: 4.6,
  },
  {
    id: 'demo_6_sports_car',
    text: 'You buy a brand-new $320,000 sports car paid cleanly in cash.',
    duration: 4.6,
  },
  {
    id: 'demo_7_private_jet',
    text: 'Then you step onto the tarmac beside a private jet.',
    duration: 4.6,
  },
  {
    id: 'demo_8_conclusion',
    text: 'What would you build if money was no longer the limit?',
    duration: 4.0,
  },
];

/**
 * Semantic Disambiguation Showcase Scripts (for 1-click comparison in the Narrative Lab)
 */
export const SEMANTIC_CONTRAST_PRESETS = [
  {
    id: 'money_made',
    label: 'Made $1M (Gain)',
    script: 'You just made one million dollars.',
  },
  {
    id: 'money_lost',
    label: 'Lost $1M (Shock)',
    script: 'You lost one million dollars.',
  },
  {
    id: 'money_owe',
    label: 'Owe $1M (Debt)',
    script: 'You owe one million dollars.',
  },
  {
    id: 'money_wish',
    label: 'Wish for $1M (Goal)',
    script: 'You wish you had one million dollars.',
  },
  {
    id: 'compound_split',
    label: '2-Beat Salary -> Millionaire',
    script: 'Imagine making just $2,000 a month, but dreaming of becoming a millionaire.',
  },
  {
    id: 'full_demo',
    label: 'Full 8-Beat Story',
    script: NARRATIVE_DEMO_SCRIPT,
  },
];

/**
 * Resolve visual priority, camera ownership, popup overlap, number-counter holds,
 * and decorative suppression across all ordered story events.
 */
export function resolveStoryConflicts(events) {
  const resolved = events.map((ev) => ({
    ...ev,
    camera: { ...ev.camera },
    character: { ...ev.character, gaze: { ...ev.character.gaze } },
    visual: ev.visual ? { ...ev.visual, lifecycle: { ...ev.visual.lifecycle }, config: { ...ev.visual.config } } : null,
    timing: { ...ev.timing },
  }));

  const resolutions = [];

  for (let i = 0; i < resolved.length; i++) {
    const ev = resolved[i];
    const next = resolved[i + 1] || null;

    // Rule 1: Protect animated number counters so camera & beat never leave before numbers finish
    if (ev.visual?.hasNumberCounter && ev.timing.holdDuration < 1.35) {
      const oldHold = ev.timing.holdDuration;
      ev.timing.holdDuration = 1.35;
      ev.visual.lifecycle.hold = 1.35;
      resolutions.push({
        beatId: ev.id,
        rule: 'protect_number_counter',
        severity: 'info',
        message: `Extended number-counter hold from ${oldHold.toFixed(2)}s to 1.35s so the animated value finishes clearly before moving away.`,
      });
    }

    // Rule 2: Suppress decorative effects during serious, shocked, or conflict emotional moments
    if (!ev.camera.decorativeEffectsAllowed && ev.visual?.config?.continuous && ev.visual.config.continuous !== 'none') {
      const prevFx = ev.visual.config.continuous;
      ev.visual.config.continuous = 'none';
      resolutions.push({
        beatId: ev.id,
        rule: 'suppress_decorative_effects',
        severity: 'resolved',
        message: `Suppressed decorative "${prevFx}" loop during ${ev.emotionalTone} beat to preserve emotional clarity.`,
      });
    }

    // Rule 3: Prevent character from pointing at a visual target that has no active popup or prop
    if (
      ev.character.gestureCategory === 'pointing' &&
      !ev.visual &&
      !['sports_car', 'private_jet', 'mansion', 'smartphone'].includes(ev.camera.targetId)
    ) {
      ev.character.gesture = 'explain';
      ev.character.gestureCategory = 'explaining';
      resolutions.push({
        beatId: ev.id,
        rule: 'prevent_pointing_at_missing_target',
        severity: 'resolved',
        message: 'Switched pointing gesture to natural explanatory gesture because no target popup/object is visible.',
      });
    }

    // Rule 4: Prevent overlapping popups across adjacent beats by enforcing clean exit before next entrance
    if (next && ev.visual && next.visual) {
      const exitEnd = ev.timing.startTime + ev.visual.lifecycle.exit;
      const nextEnter = next.timing.startTime + next.visual.lifecycle.enter;
      if (exitEnd > nextEnter - 0.08) {
        ev.visual.lifecycle.exit = Number(Math.max(0.8, ev.timing.duration - 0.34).toFixed(3));
        resolutions.push({
          beatId: ev.id,
          rule: 'prevent_popup_overlap',
          severity: 'resolved',
          message: `Clamped "${ev.visual.templateId}" exit to ${ev.visual.lifecycle.exit}s so it clears cleanly before "${next.visual.templateId}" enters.`,
        });
      }
    }

    // Rule 5: Camera target ownership lock on critical object reveals
    if (ev.camera.priority === 'critical' && ['sports_car', 'private_jet', 'mansion'].includes(ev.camera.targetId)) {
      ev.camera.targetLocked = true;
      resolutions.push({
        beatId: ev.id,
        rule: 'camera_ownership_lock',
        severity: 'info',
        message: `Locked camera ownership to "${ev.camera.targetId}" (priority: critical) during hero object reveal.`,
      });
    }
  }

  return { events: resolved, conflictResolutions: resolutions };
}

/**
 * Central Narrative-to-Visual Director.
 * Converts any narration script or timestamped cue array into a complete, editable Storyboard.
 */
export class NarrativeToVisualDirector {
  static generateStoryboard(scriptInput = NARRATIVE_DEMO_SCRIPT, { title = 'PuppetKit Directed Story', overrides = {} } = {}) {
    const analysis = analyzeNarrationScript(scriptInput);

    let prevGesture = null;
    let prevCamPreset = null;
    let prevCamTarget = null;
    let prevEnv = null;

    const rawEvents = analysis.beats.map((beat) => {
      const popup = SemanticPopupDirector.selectPopup(beat);
      const popupPos = popup?.config?.position || 'top_right';
      const acting = CharacterActingDirector.selectActing(beat, {
        previousGesture: prevGesture,
        popupPosition: popupPos,
      });
      const camera = SmartCameraHighlightDirector.selectCameraPlan(beat, {
        previousPreset: prevCamPreset,
        previousTarget: prevCamTarget,
      });
      const background = BackgroundResponseDirector.selectEnvironment(beat, prevEnv);
      const hierarchy = buildVisualHierarchy(beat, acting, popup, background);

      prevGesture = acting.gesture;
      prevCamPreset = camera.presetId;
      prevCamTarget = camera.targetId;
      prevEnv = background;

      const baseEvent = {
        id: beat.id,
        index: beat.index,
        narration: beat.narration,
        beatType: beat.beatType,
        intent: beat.intent,
        meaning: beat.meaning,
        emotionalTone: beat.emotionalTone,
        polarity: beat.polarity,
        intensity: beat.intensity,
        entity: beat.entity,
        wantsMotionWalk: beat.wantsMotionWalk,
        wantsPhoneInteraction: beat.wantsPhoneInteraction,
        priority: camera.priority,
        timing: beat.timing,
        character: acting,
        visual: popup,
        background,
        camera,
        hierarchy,
        manualOverrides: {},
      };

      // Apply any user storyboard overrides cleanly
      const ov = overrides?.[beat.id];
      if (ov) {
        return NarrativeToVisualDirector._applyPatchToEvent(baseEvent, ov);
      }
      return baseEvent;
    });

    const { events, conflictResolutions } = resolveStoryConflicts(rawEvents);

    return {
      title,
      generatedFrom: typeof scriptInput === 'string' ? 'script_text' : 'structured_cues',
      totalDuration: analysis.totalDuration,
      beatCount: events.length,
      events,
      conflictResolutions,
      overrides: { ...(overrides || {}) },
    };
  }

  static _applyPatchToEvent(event, patch) {
    const next = {
      ...event,
      character: { ...event.character, gaze: { ...event.character.gaze } },
      camera: { ...event.camera },
      background: { ...event.background },
      visual: event.visual ? { ...event.visual, config: { ...event.visual.config }, lifecycle: { ...event.visual.lifecycle } } : null,
      manualOverrides: { ...(event.manualOverrides || {}), ...patch },
    };

    if (patch.expression) {
      const mapped = NARRATIVE_EXPRESSION_MAP[patch.expression];
      next.character.expression = mapped ? mapped.rigExpression : patch.expression;
      next.character.expressionLabel = mapped ? mapped.label : patch.expression;
      next.emotionalTone = patch.expression;
    }
    if (patch.gesture) {
      next.character.gesture = patch.gesture;
    }
    if (patch.gazeTarget) {
      next.character.gaze = resolveGazeForTarget(patch.gazeTarget, next.visual?.config?.position || 'top_right', next.beatType);
    }
    if (patch.cameraPreset) {
      next.camera.presetId = patch.cameraPreset;
    }
    if (patch.cameraTarget) {
      next.camera.targetId = patch.cameraTarget;
    }
    if (patch.environmentId) {
      next.background.environmentId = patch.environmentId;
      next.background.changedReason = 'Manual storyboard override';
    }
    if (patch.popupEnabled === false) {
      next.visual = null;
    } else if (patch.popupContent && next.visual) {
      next.visual.config.content = patch.popupContent;
    }

    next.hierarchy = buildVisualHierarchy(
      { ...next, subjectTarget: next.camera.targetId },
      next.character,
      next.visual,
      next.background
    );
    return next;
  }

  /**
   * Immutably apply a user edit to a single storyboard beat and re-run conflict resolution.
   */
  static applyStoryboardOverride(storyboard, beatId, patch) {
    const nextEvents = storyboard.events.map((ev) =>
      ev.id === beatId ? NarrativeToVisualDirector._applyPatchToEvent(ev, patch) : ev
    );
    const { events, conflictResolutions } = resolveStoryConflicts(nextEvents);
    return {
      ...storyboard,
      events,
      conflictResolutions,
      overrides: {
        ...(storyboard.overrides || {}),
        [beatId]: { ...(storyboard.overrides?.[beatId] || {}), ...patch },
      },
    };
  }
}

/**
 * Pure, stateless, 100% deterministic evaluator for any storyboard at absolute timestamp `timeSec`.
 * Identical `timeSec` ALWAYS returns identical character, gaze, popup, camera, and environment state.
 */
export class NarrativeTimelineEvaluator {
  /**
   * @param {any} storyboard
   * @param {number} [timeSec=0]
   * @param {{ targetRegistry?: any, layerToggles?: { character?: boolean, gaze?: boolean, popups?: boolean, camera?: boolean, background?: boolean, sfx?: boolean } | Record<string, boolean> | null }} [options]
   */
  static evaluateAt(storyboard, timeSec = 0, { targetRegistry = null, layerToggles = null } = {}) {
    if (!storyboard?.events?.length) return null;

    const layers = {
      character: true,
      gaze: true,
      popups: true,
      camera: true,
      background: true,
      ...layerToggles,
    };

    const totalDuration = Math.max(0.1, storyboard.totalDuration || 1);
    const t = Math.max(0, Math.min(totalDuration - 0.0001, Number(timeSec) || 0));

    let activeEvent = storyboard.events[0];
    let prevEvent = null;
    for (let i = 0; i < storyboard.events.length; i++) {
      const ev = storyboard.events[i];
      if (t >= ev.timing.startTime && t < ev.timing.endTime) {
        activeEvent = ev;
        prevEvent = i > 0 ? storyboard.events[i - 1] : null;
        break;
      }
      if (i === storyboard.events.length - 1) {
        activeEvent = ev;
        prevEvent = i > 0 ? storyboard.events[i - 1] : null;
      }
    }

    const localTime = Math.max(0, t - activeEvent.timing.startTime);
    const beatProgress = clamp01(localTime / Math.max(0.01, activeEvent.timing.duration));

    // Active speaking check based on phrase intervals (honest speech-driven mouth sync)
    const isSpeaking = activeEvent.timing.speakingIntervals.some(
      (iv) => t >= iv.start && t <= iv.end
    );

    // Highlight current spoken word for synchronized caption readout
    let activeWord = null;
    for (const w of activeEvent.timing.words || []) {
      if (t >= w.start && t <= w.end) {
        activeWord = w.word;
        break;
      }
    }

    // Evaluate camera deterministically against registered subject targets
    const reg = targetRegistry || new SubjectTargetRegistry();
    const baseFrame = { ...DEFAULT_BASE_FRAME, x: 0.05, y: 0.14, viewHeight: 2.55 };
    let cameraState = baseFrame;
    let cameraEffects = { subtleVignette: 0.24, progress: beatProgress };

    if (layers.camera) {
      const targetFrame = reg.resolveFraming(activeEvent.camera.targetId, activeEvent.camera.compositionId);
      const evalCam = evaluateCameraPreset(activeEvent.camera.presetId, {
        time: localTime,
        duration: activeEvent.timing.duration,
        intensity: activeEvent.camera.intensity ?? 0.9,
        startFrame: baseFrame,
        targetFrame,
        characterFrame: reg.get('character'),
        compositionId: activeEvent.camera.compositionId,
      });
      cameraState = evalCam.camera;
      cameraEffects = { ...evalCam.effects, progress: beatProgress };

      // Blend smoothly from previous beat's camera during first 0.45s
      if (prevEvent && localTime < 0.45) {
        const prevTarget = reg.resolveFraming(prevEvent.camera.targetId, prevEvent.camera.compositionId);
        const prevEndCam = evaluateCameraPreset(prevEvent.camera.presetId, {
          time: prevEvent.timing.duration,
          duration: prevEvent.timing.duration,
          intensity: prevEvent.camera.intensity ?? 0.9,
          startFrame: baseFrame,
          targetFrame: prevTarget,
          characterFrame: reg.get('character'),
          compositionId: prevEvent.camera.compositionId,
        }).camera;
        const blended = evaluateCameraTransition(
          activeEvent.camera.transitionId || 'smooth_reframe',
          prevEndCam,
          cameraState,
          localTime / 0.45,
          activeEvent.camera.intensity ?? 0.9
        );
        cameraState = blended.camera;
        cameraEffects = { ...cameraEffects, ...blended.effects };
      }
    }

    // Popup visibility respects exact lifecycle window (prepare -> enter -> hold -> exit)
    const activePopup =
      layers.popups &&
      activeEvent.visual &&
      localTime >= activeEvent.visual.lifecycle.enter &&
      localTime <= activeEvent.timing.duration
        ? {
            ...activeEvent.visual,
            localPopupTime: Math.max(0, localTime - activeEvent.visual.lifecycle.enter),
          }
        : null;

    const transitionOverride =
      activeEvent.index > 1 && localTime < 0.42 && activeEvent.visual?.config?.transition
        ? { id: activeEvent.visual.config.transition, progress: easeOutCubic(localTime / 0.42) }
        : null;

    return {
      time: Number(t.toFixed(3)),
      totalDuration,
      event: activeEvent,
      beatIndex: activeEvent.index,
      localTime: Number(localTime.toFixed(3)),
      beatProgress: Number(beatProgress.toFixed(4)),
      activeWord,
      characterState: {
        visible: layers.character,
        ...activeEvent.character,
        talking: isSpeaking,
        gaze: layers.gaze ? activeEvent.character.gaze : { targetId: 'audience', label: 'Gaze Locked', eye: { x: 0, y: 0 }, headMotion: null },
      },
      popupState: activePopup,
      backgroundState: {
        visible: layers.background,
        ...activeEvent.background,
      },
      cameraState,
      cameraEffects,
      transitionOverride,
      hierarchy: activeEvent.hierarchy,
    };
  }
}
