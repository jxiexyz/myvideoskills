/**
 * Intelligent SFX Director & SFX Validator for PuppetKit.
 *
 * Converts unified Narrative Storyboard events into timed, restrained, non-cluttered
 * SFX Timeline Events, Ambience Crossfades, Voice-Ducking Envelopes, and Explicit Silence Decisions.
 *
 * Strictly deterministic — zero Math.random(), zero Date.now().
 */

import { SFXPresetRegistry } from './sfx-presets.js';

const AMBIENCE_FOR_CONTEXT = {
  room: 'env_room_tone',
  office: 'env_office_ambience',
  city: 'env_city_ambience',
  rain: 'env_rain_ambience',
  wind: 'env_wind_ambience',
  hangar: 'env_hangar_air',
};

/**
 * Importance scorer (0..100) following Section 5:
 * Combines narrative importance, visual prominence, emotional relevance,
 * action intensity, timing clarity, and audio density penalty.
 */
export function scoreSoundCandidate({
  narrativeImportance = 50,
  visualProminence = 50,
  emotionalRelevance = 50,
  actionIntensity = 50,
  timingClarity = 70,
  nearbyEventCount = 0,
}) {
  const base =
    narrativeImportance * 0.28 +
    visualProminence * 0.24 +
    emotionalRelevance * 0.18 +
    actionIntensity * 0.15 +
    timingClarity * 0.15;
  const densityPenalty = Math.min(35, nearbyEventCount * 14);
  return Math.round(Math.max(0, Math.min(100, base - densityPenalty)));
}

export class SFXDirector {
  constructor(registry = null) {
    this.registry = registry || new SFXPresetRegistry();
  }

  /**
   * Generate a complete deterministic SFX plan from a Narrative Storyboard.
   * Returns `{ events, ambienceTracks, omittedDecisions, silenceCues, totalDuration }`.
   */
  directFromStoryboard(storyboard, { storyStyle = 'cinematic', importanceThreshold = 54 } = {}) {
    if (!storyboard?.events?.length) {
      return { events: [], ambienceTracks: [], omittedDecisions: [], silenceCues: [], totalDuration: 0 };
    }

    const sfxEvents = [];
    const omittedDecisions = [];
    const silenceCues = [];
    const lastFiredByPreset = new Map();
    const lastImpactTimeRef = { value: -10 };
    let seq = 1;

    const nearbyCount = (tSec, windowSec = 0.45) =>
      sfxEvents.filter((e) => Math.abs(e.startTime - tSec) <= windowSec && e.bus !== 'ambience').length;

    const tryAddSound = ({
      presetId,
      startTime,
      beat,
      visualEventId,
      targetId,
      reason,
      scoreInputs,
      volumeScale = 1.0,
      pan = 0,
      customDuration = null,
    }) => {
      const preset = this.registry.get(presetId);
      if (!preset) return false;

      // Never auto-select missing-file presets or comedy presets in non-comedy stories
      if (preset.assetStatus === 'missing_file') {
        omittedDecisions.push({
          beatId: beat.id,
          presetId,
          startTime: Number(startTime.toFixed(3)),
          reason: `Omitted "${preset.name}" because external audio file is missing (${preset.asset.path}).`,
        });
        return false;
      }
      if (preset.category === 'comedy' && storyStyle !== 'comedy') {
        omittedDecisions.push({
          beatId: beat.id,
          presetId,
          startTime: Number(startTime.toFixed(3)),
          reason: `Excluded comedy preset "${preset.name}" because story style is "${storyStyle}".`,
        });
        return false;
      }

      const t = Number(Math.max(0, startTime).toFixed(3));
      const score = scoreSoundCandidate({ ...scoreInputs, nearbyEventCount: nearbyCount(t) });

      if (score < importanceThreshold) {
        omittedDecisions.push({
          beatId: beat.id,
          presetId,
          startTime: t,
          importanceScore: score,
          reason: `Omitted "${preset.name}" (score ${score} < threshold ${importanceThreshold}) to prevent audio clutter.`,
        });
        return false;
      }

      // Enforce per-preset cooldown
      const prevTime = lastFiredByPreset.get(presetId);
      if (prevTime !== undefined && t - prevTime < preset.cooldown) {
        omittedDecisions.push({
          beatId: beat.id,
          presetId,
          startTime: t,
          importanceScore: score,
          reason: `Skipped duplicate "${preset.name}" inside ${preset.cooldown}s cooldown window.`,
        });
        return false;
      }

      // Prevent stacking two strong impacts within 0.85s
      if (preset.intensity === 'strong' && preset.bus !== 'transition' && t - lastImpactTimeRef.value < 0.85) {
        omittedDecisions.push({
          beatId: beat.id,
          presetId,
          startTime: t,
          importanceScore: score,
          reason: `Prevented overlapping strong impact "${preset.name}" within 0.85s of prior impact.`,
        });
        return false;
      }

      lastFiredByPreset.set(presetId, t);
      if (preset.intensity === 'strong' && preset.bus !== 'transition') {
        lastImpactTimeRef.value = t;
      }

      const clampedVol = Number(
        Math.max(preset.volumeRange[0], Math.min(preset.volumeRange[1], preset.defaultVolume * volumeScale)).toFixed(3)
      );

      sfxEvents.push({
        id: `sfx_ev_${seq++}_${preset.id}`,
        presetId: preset.id,
        presetName: preset.name,
        category: preset.category,
        bus: preset.bus,
        startTime: t,
        duration: Number((customDuration ?? preset.duration).toFixed(3)),
        volume: clampedVol,
        pitch: preset.pitch,
        playbackRate: preset.playbackRate,
        fadeIn: preset.fadeIn,
        fadeOut: preset.fadeOut,
        pan: Number(Math.max(-0.85, Math.min(0.85, pan)).toFixed(2)),
        loop: preset.loopable,
        muted: false,
        solo: false,
        disabled: false,
        sourceBeatId: beat.id,
        sourceBeatIndex: beat.index,
        sourceNarration: beat.narration,
        visualEventId,
        targetId: targetId || beat.camera?.targetId || 'character',
        reason,
        importanceScore: score,
        manualOverride: false,
      });
      return true;
    };

    // Walk every beat and direct synchronized, restrained sound choices
    let prevEnvId = null;

    for (const beat of storyboard.events) {
      const start = beat.timing.startTime;
      const enterT = beat.timing.entranceTime;
      const emphasisT = beat.timing.emphasisTime;

      // 1. Character walking footsteps aligned strictly to foot-contact phases (0.22s, 0.72s, 1.22s)
      if (beat.character?.locomotion === 'walk' || beat.wantsMotionWalk) {
        const footPreset = beat.background?.environmentId === 'airport_hangar'
          ? 'char_footsteps_heavy'
          : 'char_footsteps_light';
        const stepOffsets = [0.22, 0.72, 1.22];
        for (let s = 0; s < stepOffsets.length; s++) {
          if (stepOffsets[s] < beat.timing.duration - 0.5) {
            tryAddSound({
              presetId: footPreset,
              startTime: start + stepOffsets[s],
              beat,
              visualEventId: `${beat.id}:walk_contact_${s + 1}`,
              targetId: 'character',
              reason: `Footstep contact #${s + 1} aligned to walk cycle foot-plant phase`,
              scoreInputs: {
                narrativeImportance: 62,
                visualProminence: 68,
                emotionalRelevance: 52,
                actionIntensity: 58,
                timingClarity: 92,
              },
              volumeScale: 0.9,
              pan: -0.25,
            });
          }
        }
      }

      // 2. Scene transition / Camera movement accents (matched to speed & intensity!)
      const envChanged = prevEnvId !== null && beat.background?.environmentId !== prevEnvId;
      prevEnvId = beat.background?.environmentId || prevEnvId;

      if (beat.camera?.transitionId === 'whip_pan_transition' || beat.intent === 'object_sports_car') {
        tryAddSound({
          presetId: 'cam_whip_pan',
          startTime: start + 0.08,
          beat,
          visualEventId: `${beat.id}:camera_whip_pan`,
          targetId: beat.camera.targetId,
          reason: 'Velocity-matched whip-pan air whoosh aligned with fast track toward sports car',
          scoreInputs: {
            narrativeImportance: 84,
            visualProminence: 88,
            emotionalRelevance: 74,
            actionIntensity: 86,
            timingClarity: 90,
          },
          pan: 0.25,
        });
      } else if (beat.intent === 'object_private_jet') {
        tryAddSound({
          presetId: 'cam_cinematic_sweep',
          startTime: start + 0.1,
          beat,
          visualEventId: `${beat.id}:camera_wide_sweep`,
          targetId: 'private_jet',
          reason: 'Wide establishing sweep matching smooth reveal zoom-out toward private jet',
          scoreInputs: {
            narrativeImportance: 82,
            visualProminence: 86,
            emotionalRelevance: 72,
            actionIntensity: 68,
            timingClarity: 86,
          },
          pan: 0.2,
        });
      } else if (envChanged && beat.intent !== 'narrative_problem') {
        tryAddSound({
          presetId: 'cam_scene_transition',
          startTime: start + 0.04,
          beat,
          visualEventId: `${beat.id}:scene_transition`,
          targetId: beat.camera?.targetId,
          reason: `Subtle scene wash supporting environment change to ${beat.background.environmentId}`,
          scoreInputs: {
            narrativeImportance: 68,
            visualProminence: 72,
            emotionalRelevance: 58,
            actionIntensity: 55,
            timingClarity: 84,
          },
          volumeScale: 0.85,
        });
      }

      // 3. Physical Object Interactions (Smartphone tap + balance reveal — never cash spam!)
      if (beat.wantsPhoneInteraction || beat.intent === 'financial_balance' || beat.intent === 'object_smartphone') {
        tryAddSound({
          presetId: 'obj_phone_tap',
          startTime: start + 0.28,
          beat,
          visualEventId: `${beat.id}:phone_contact`,
          targetId: 'smartphone',
          reason: 'Crisp glass tap aligned to visible smartphone interaction',
          scoreInputs: {
            narrativeImportance: 76,
            visualProminence: 84,
            emotionalRelevance: 64,
            actionIntensity: 62,
            timingClarity: 94,
          },
          pan: 0.12,
        });
        if (beat.intent === 'financial_balance') {
          tryAddSound({
            presetId: 'fin_balance_reveal',
            startTime: emphasisT,
            beat,
            visualEventId: `${beat.id}:balance_reveal`,
            targetId: 'smartphone',
            reason: 'Restrained financial data accent synchronized to bank balance reveal',
            scoreInputs: {
              narrativeImportance: 86,
              visualProminence: 86,
              emotionalRelevance: 76,
              actionIntensity: 68,
              timingClarity: 90,
            },
            pan: 0.14,
          });
        }
      }

      // 4. Semantic Popup & Financial / Emotional Beat Accents
      if (beat.intent === 'financial_salary' && beat.visual) {
        tryAddSound({
          presetId: 'ui_popup_appear',
          startTime: enterT,
          beat,
          visualEventId: `${beat.id}:popup_salary`,
          targetId: 'financial_popup',
          reason: 'Clean modern UI appear synced to monthly salary card entrance',
          scoreInputs: {
            narrativeImportance: 72,
            visualProminence: 80,
            emotionalRelevance: 62,
            actionIntensity: 54,
            timingClarity: 92,
          },
          pan: 0.25,
        });
      } else if (beat.intent === 'financial_ambition') {
        tryAddSound({
          presetId: 'emo_hopeful_lift',
          startTime: emphasisT,
          beat,
          visualEventId: `${beat.id}:ambition_target`,
          targetId: 'financial_popup',
          reason: 'Subtle aspirational lift synchronized to $1M financial goal reveal',
          scoreInputs: {
            narrativeImportance: 82,
            visualProminence: 80,
            emotionalRelevance: 84,
            actionIntensity: 64,
            timingClarity: 88,
          },
        });
      } else if (beat.intent === 'financial_gain') {
        tryAddSound({
          presetId: 'fin_milestone_achieved',
          startTime: emphasisT,
          beat,
          visualEventId: `${beat.id}:million_breakthrough`,
          targetId: 'financial_popup',
          reason: 'Controlled dramatic milestone reveal impact for $1,000,000 breakthrough',
          scoreInputs: {
            narrativeImportance: 95,
            visualProminence: 92,
            emotionalRelevance: 92,
            actionIntensity: 88,
            timingClarity: 94,
          },
        });
      } else if (beat.intent === 'financial_loss') {
        tryAddSound({
          presetId: 'char_surprise_reaction',
          startTime: start + 0.18,
          beat,
          visualEventId: `${beat.id}:char_shock`,
          targetId: 'character_face',
          reason: 'Subtle character shock reaction synced to recoil',
          scoreInputs: {
            narrativeImportance: 82,
            visualProminence: 84,
            emotionalRelevance: 88,
            actionIntensity: 78,
            timingClarity: 88,
          },
          pan: -0.2,
        });
        tryAddSound({
          presetId: 'fin_loss_reveal',
          startTime: emphasisT,
          beat,
          visualEventId: `${beat.id}:loss_alert`,
          targetId: 'financial_popup',
          reason: 'Restrained financial loss drop accent (no stacked impacts)',
          scoreInputs: {
            narrativeImportance: 92,
            visualProminence: 88,
            emotionalRelevance: 90,
            actionIntensity: 82,
            timingClarity: 90,
          },
        });
      } else if (beat.intent === 'financial_expense' || beat.intent === 'narrative_problem' || beat.intent === 'financial_debt') {
        // Intentional restraint: single restrained warning/tension pulse + explicit silence/ducking cue for voice clarity!
        tryAddSound({
          presetId: beat.intent === 'financial_expense' ? 'ui_error_warning' : 'emo_tension_pulse',
          startTime: emphasisT,
          beat,
          visualEventId: `${beat.id}:problem_emphasis`,
          targetId: beat.camera?.targetId,
          reason: 'Single restrained warning cue; surrounding ambience ducked for serious dialogue clarity',
          scoreInputs: {
            narrativeImportance: 86,
            visualProminence: 82,
            emotionalRelevance: 88,
            actionIntensity: 70,
            timingClarity: 90,
          },
        });
        silenceCues.push({
          id: `silence_${beat.id}`,
          beatId: beat.id,
          startTime: Number((start + 0.15).toFixed(3)),
          endTime: Number((beat.timing.endTime - 0.15).toFixed(3)),
          action: 'duck_ambience_and_music',
          duckFactor: 0.25,
          reason: 'Intentional space & ambience ducking so the serious problem lands cleanly with full voice clarity.',
        });
      } else if (beat.intent === 'financial_growth') {
        tryAddSound({
          presetId: 'fin_chart_rise',
          startTime: enterT,
          beat,
          visualEventId: `${beat.id}:chart_growth`,
          targetId: 'financial_popup',
          reason: 'Smooth chart-rise harmonic glide aligned to compounding curve reveal',
          scoreInputs: {
            narrativeImportance: 76,
            visualProminence: 80,
            emotionalRelevance: 70,
            actionIntensity: 62,
            timingClarity: 88,
          },
          pan: 0.22,
        });
      } else if (beat.intent === 'object_sports_car') {
        tryAddSound({
          presetId: 'emo_dramatic_reveal',
          startTime: emphasisT,
          beat,
          visualEventId: `${beat.id}:car_hero_reveal`,
          targetId: 'sports_car',
          reason: 'Controlled reveal accent on sports car hero shot (omitted engine rev since car is parked)',
          scoreInputs: {
            narrativeImportance: 90,
            visualProminence: 94,
            emotionalRelevance: 82,
            actionIntensity: 84,
            timingClarity: 92,
          },
          pan: 0.3,
        });
        omittedDecisions.push({
          beatId: beat.id,
          presetId: 'obj_engine_idle_rev',
          startTime: emphasisT,
          reason: 'Omitted engine rev because the sports car is displayed parked on the driveway rather than accelerating.',
        });
      } else if (beat.intent === 'object_private_jet') {
        tryAddSound({
          presetId: 'emo_triumph_cue',
          startTime: emphasisT,
          beat,
          visualEventId: `${beat.id}:jet_reveal`,
          targetId: 'private_jet',
          reason: 'Subtle achievement lift as the private jet fills the wide frame',
          scoreInputs: {
            narrativeImportance: 84,
            visualProminence: 88,
            emotionalRelevance: 80,
            actionIntensity: 70,
            timingClarity: 88,
          },
          pan: 0.22,
        });
      } else if (beat.beatType === 'audience_question' || beat.beatType === 'conclusion') {
        tryAddSound({
          presetId: 'emo_gentle_ending',
          startTime: Number((beat.timing.endTime - 1.1).toFixed(3)),
          beat,
          visualEventId: `${beat.id}:gentle_ending`,
          targetId: 'character',
          reason: 'Soft closing harmonic note after final phrase, preserving silence during spoken question',
          scoreInputs: {
            narrativeImportance: 74,
            visualProminence: 68,
            emotionalRelevance: 82,
            actionIntensity: 48,
            timingClarity: 90,
          },
          volumeScale: 0.85,
        });
        silenceCues.push({
          id: `silence_${beat.id}`,
          beatId: beat.id,
          startTime: start,
          endTime: Number(Math.max(start + 0.5, beat.timing.endTime - 1.15).toFixed(3)),
          action: 'preserve_silence',
          duckFactor: 0.35,
          reason: 'Preserved quiet breathing room while narrator asks the closing audience question.',
        });
      } else if (beat.visual) {
        tryAddSound({
          presetId: 'ui_popup_appear',
          startTime: enterT,
          beat,
          visualEventId: `${beat.id}:popup_generic`,
          targetId: beat.camera?.targetId,
          reason: 'Clean subtle UI entrance for supporting graphic',
          scoreInputs: {
            narrativeImportance: 66,
            visualProminence: 72,
            emotionalRelevance: 56,
            actionIntensity: 50,
            timingClarity: 84,
          },
          volumeScale: 0.82,
        });
      } else {
        // Explicit intentional silence record when no sound is needed
        silenceCues.push({
          id: `silence_${beat.id}`,
          beatId: beat.id,
          startTime: start,
          endTime: beat.timing.endTime,
          action: 'preserve_silence',
          duckFactor: 0.6,
          reason: 'No SFX triggered: voice-over carries this beat without sound clutter.',
        });
      }
    }

    // 5. Build continuous scene-driven Ambience Tracks with smooth crossfades
    const ambienceTracks = [];
    for (const beat of storyboard.events) {
      const ctxKey = beat.background?.ambienceContext || 'room';
      const ambPresetId = AMBIENCE_FOR_CONTEXT[ctxKey] || 'env_room_tone';
      const ambPreset = this.registry.get(ambPresetId);
      if (!ambPreset) continue;

      const prev = ambienceTracks[ambienceTracks.length - 1];
      if (prev && prev.presetId === ambPresetId) {
        prev.endTime = beat.timing.endTime;
        prev.duration = Number((prev.endTime - prev.startTime).toFixed(3));
      } else {
        // Overlap crossfade slightly with previous ambience bed
        if (prev) {
          prev.fadeOut = 0.65;
          prev.endTime = Number(Math.min(storyboard.totalDuration, prev.endTime + 0.25).toFixed(3));
          prev.duration = Number((prev.endTime - prev.startTime).toFixed(3));
        }
        ambienceTracks.push({
          id: `amb_${ambienceTracks.length + 1}_${ambPresetId}`,
          presetId: ambPresetId,
          presetName: ambPreset.name,
          category: 'environment',
          bus: 'ambience',
          startTime: beat.timing.startTime,
          endTime: beat.timing.endTime,
          duration: Number((beat.timing.endTime - beat.timing.startTime).toFixed(3)),
          volume: ambPreset.defaultVolume,
          pitch: 1.0,
          playbackRate: 1.0,
          fadeIn: ambienceTracks.length === 0 ? 0.35 : 0.65,
          fadeOut: 0.65,
          pan: 0,
          loop: true,
          muted: false,
          solo: false,
          disabled: false,
          sourceBeatId: beat.id,
          sourceBeatIndex: beat.index,
          visualEventId: `${beat.id}:environment_${beat.background?.environmentId || 'room'}`,
          targetId: 'environment',
          reason: `Continuous ${ctxKey} ambience bed synced to ${beat.background?.environmentId || 'scene'} with seamless crossfade`,
          importanceScore: 60,
          manualOverride: false,
        });
      }
    }

    sfxEvents.sort((a, b) => a.startTime - b.startTime);

    return {
      events: sfxEvents,
      ambienceTracks,
      omittedDecisions,
      silenceCues,
      totalDuration: storyboard.totalDuration,
    };
  }
}

/**
 * SFX Validator: audits preset assets, timeline conflicts, overlap density, cooldown violations,
 * and potential gain clipping risks.
 */
export class SFXValidator {
  static validate(events = [], registry = null) {
    const reg = registry || new SFXPresetRegistry();
    const warnings = [];
    const active = events.filter((e) => !e.muted && !e.disabled);

    // 1. Asset integrity check for every event
    for (const ev of active) {
      const preset = reg.get(ev.presetId);
      if (!preset) {
        warnings.push({
          id: `warn_unknown_${ev.id}`,
          eventId: ev.id,
          severity: 'error',
          type: 'unknown_preset',
          message: `Event "${ev.id}" references unknown preset "${ev.presetId}".`,
        });
        continue;
      }
      if (preset.assetStatus === 'missing_file') {
        warnings.push({
          id: `warn_missing_${ev.id}`,
          eventId: ev.id,
          severity: 'error',
          type: 'missing_asset',
          message: `Preset "${preset.name}" requires missing audio file: ${preset.asset.path}`,
        });
      }
    }

    // 2. Pairwise overlap, cooldown, and impact collision checks (exclude continuous ambience loops)
    const oneshots = active.filter((e) => e.bus !== 'ambience').sort((a, b) => a.startTime - b.startTime);
    for (let i = 0; i < oneshots.length; i++) {
      const a = oneshots[i];
      const pa = reg.get(a.presetId);

      // Count simultaneous non-ambience sounds at a.startTime
      const concurrent = oneshots.filter(
        (b) => b.id !== a.id && b.startTime <= a.startTime + 0.12 && b.startTime + b.duration >= a.startTime
      );
      if (concurrent.length >= 3) {
        warnings.push({
          id: `warn_density_${a.id}`,
          eventId: a.id,
          severity: 'warning',
          type: 'high_density',
          message: `${concurrent.length + 1} simultaneous SFX at ${a.startTime.toFixed(2)}s may mask narration clarity.`,
        });
      }

      const next = oneshots[i + 1];
      if (!next) continue;
      const dt = next.startTime - a.startTime;

      if (a.presetId === next.presetId && pa && dt < pa.cooldown) {
        warnings.push({
          id: `warn_cooldown_${next.id}`,
          eventId: next.id,
          severity: 'warning',
          type: 'cooldown_violation',
          message: `"${a.presetName}" repeats after ${dt.toFixed(2)}s (recommended cooldown: ${pa.cooldown}s).`,
        });
      }

      const pb = reg.get(next.presetId);
      if (pa?.intensity === 'strong' && pb?.intensity === 'strong' && dt < 0.35 && a.bus === next.bus) {
        warnings.push({
          id: `warn_impact_${next.id}`,
          eventId: next.id,
          severity: 'warning',
          type: 'impact_collision',
          message: `Strong accents "${a.presetName}" and "${next.presetName}" collide within ${dt.toFixed(2)}s — risk of low-end mud.`,
        });
      }
    }

    // 3. Peak gain headroom check
    for (const ev of active) {
      if (ev.volume > 0.92 && ev.bus !== 'voice') {
        warnings.push({
          id: `warn_gain_${ev.id}`,
          eventId: ev.id,
          severity: 'warning',
          type: 'headroom_risk',
          message: `"${ev.presetName}" gain (${Math.round(ev.volume * 100)}%) is high and may compete with narration.`,
        });
      }
    }

    return {
      valid: warnings.filter((w) => w.severity === 'error').length === 0,
      warningCount: warnings.length,
      warnings,
      missingAssetsReport: reg.getMissingAssetsReport(),
    };
  }
}
