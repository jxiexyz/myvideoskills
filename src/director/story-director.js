import { clamp01, lerp, easeInOutCubic, easeOutCubic } from '../motion-graphics/effects.js';
import { createMotionGraphicConfig } from '../motion-graphics/templates.js';
import { evaluateCameraPreset } from '../camera/presets.js';
import { CameraChoreographyDirector } from '../camera/subject-tracker.js';

/**
 * Deterministic Camera Choreography Controller.
 * Evaluates absolute beat-relative time `localTime` into smooth pan, dolly, FOV, 2.5D orbit, parallax tilt, and shake.
 * Supports both legacy `{ start, end }` keyframes and named Cinematic Camera Presets (`presetId`).
 */
export class CameraChoreographyController {
  static evaluate(moveSpec, localTime = 0, duration = 4.0) {
    if (moveSpec?.presetId && !moveSpec?.start) {
      const res = evaluateCameraPreset(moveSpec.presetId, {
        time: localTime,
        duration,
        intensity: moveSpec.intensity ?? 1.0,
        easing: moveSpec.easing || null,
        targetFrame: moveSpec.targetFrame || null,
        effects: moveSpec.effects || null,
      });
      return res.camera;
    }

    const start = moveSpec?.start || { x: 0, y: 0.05, viewHeight: 2.35, tiltX: 0, tiltY: 0.04, roll: 0 };
    const end = moveSpec?.end || start;
    const p = easeInOutCubic(clamp01(localTime / Math.max(0.2, duration)));

    let shakeX = 0;
    let shakeY = 0;
    if (moveSpec?.impactShakeAt !== undefined) {
      const dt = localTime - moveSpec.impactShakeAt;
      if (dt >= 0 && dt < 0.42) {
        const damp = Math.exp(-dt * 9.5);
        const amp = moveSpec.impactShakeAmp ?? 0.032;
        shakeX = Math.sin(dt * 48) * amp * damp;
        shakeY = Math.cos(dt * 42) * amp * 0.6 * damp;
      }
    }

    // Subtle organic handheld parallax drift (strictly deterministic via sine)
    const drift = moveSpec?.parallaxDrift ? Math.sin(localTime * 1.1) * 0.025 : 0;

    return {
      x: lerp(start.x ?? 0, end.x ?? 0, p),
      y: lerp(start.y ?? 0.05, end.y ?? 0.05, p),
      viewHeight: lerp(start.viewHeight ?? 2.35, end.viewHeight ?? 2.35, p),
      fov: lerp(start.fov ?? 24, end.fov ?? 24, p),
      orbitYaw: lerp(start.orbitYaw ?? 0, end.orbitYaw ?? 0, p),
      orbitPitch: lerp(start.orbitPitch ?? 0, end.orbitPitch ?? 0, p),
      tiltX: lerp(start.tiltX ?? 0, end.tiltX ?? 0, p) + drift,
      tiltY: lerp(start.tiltY ?? 0.04, end.tiltY ?? 0.04, p),
      roll: lerp(start.roll ?? 0, end.roll ?? 0, p),
      shakeX,
      shakeY,
    };
  }
}

/**
 * Semantic Narration-to-Visual Scene Mapper.
 * Turns any narration line into a coordinated environment, camera move, character posture/expression,
 * smartphone state, motion graphic template, transition, and sound cue.
 */
export class NarrationVisualMapper {
  static map(sentence = '') {
    const raw = String(sentence || '').trim();
    const s = raw.toLowerCase();

    // 1. Nine zeros / bank account / smartphone focus
    if (/(nine zeros|9 zeros|billion|bank account|smartphone|dynamic island|phone)/.test(s)) {
      return {
        label: 'Bank Balance & Dynamic Island Focus',
        environmentId: 'smartphone_hero_stage',
        paletteId: 'twilightLuxury',
        lightingMood: 'dramatic',
        includeSmartphone: true,
        smartphoneState: {
          islandState: 'financial_alert',
          balanceTarget: 1000000000,
          headline: '+$1,000,000,000',
          subtitle: 'Nine Zeros Verified',
        },
        character: { x: -0.92, y: 0, scale: 0.92, view: 'front', motion: 'raiseBothHands', expression: 'excited', talking: true },
        cameraMove: {
          start: { x: -0.05, y: 0.2, viewHeight: 2.62, tiltX: -0.05, tiltY: 0.04 },
          end: { x: 0.18, y: 0.22, viewHeight: 2.28, tiltX: 0.12, tiltY: 0.02 },
          impactShakeAt: 0.72,
          parallaxDrift: true,
        },
        graphic: createMotionGraphicConfig('nine_zeros_balance', {
          content: '$1,000,000,000',
          subtitle: 'NINE ZEROS · VERIFIED BANK BALANCE',
          secondaryValue: '9 ZEROS',
          transition: 'iris_circle_expand',
          position: 'top_center',
          duration: 5.0,
        }),
        soundCue: 'cinematic_hit',
      };
    }

    // 2. Private jet / aviation / airport
    if (/(private jet|jet|hangar|airplane|flight|aviation|fly)/.test(s)) {
      return {
        label: 'Private Jet Wide Establishing Reveal',
        environmentId: 'airport_hangar',
        paletteId: 'sunlitDay',
        lightingMood: 'day',
        includeSmartphone: false,
        character: { x: -1.05, y: 0, scale: 0.88, view: 'front', motion: 'point', expression: 'happy', talking: true },
        cameraMove: {
          start: { x: -0.55, y: 0.16, viewHeight: 2.25, tiltX: -0.1, tiltY: 0.06 },
          end: { x: 0.45, y: 0.24, viewHeight: 2.95, tiltX: 0.12, tiltY: 0.08 },
          parallaxDrift: true,
        },
        graphic: createMotionGraphicConfig('jet_aviation_callout', {
          content: 'PRIVATE JET · $28M',
          subtitle: 'Global Range · On-Demand Departure',
          anchorName: 'jet',
          transition: 'diagonal_ribbon_cut',
          duration: 4.8,
        }),
        soundCue: 'whoosh',
      };
    }

    // 3. Sports car / supercar / garage / driveway
    if (/(sports car|supercar|ferrari|lamborghini|car|garage|driveway)/.test(s)) {
      return {
        label: 'Sports Car Pan + Object Callout',
        environmentId: 'luxury_driveway',
        paletteId: 'sunsetGold',
        lightingMood: 'warm',
        includeSmartphone: false,
        character: { x: -0.96, y: 0, scale: 0.92, view: 'front', motion: 'point', expression: 'excited', talking: true },
        cameraMove: {
          start: { x: -0.22, y: 0.18, viewHeight: 2.75, tiltX: -0.07, tiltY: 0.04 },
          end: { x: 0.22, y: 0.15, viewHeight: 2.42, tiltX: 0.12, tiltY: 0.03 },
          parallaxDrift: true,
        },
        graphic: createMotionGraphicConfig('car_spec_callout', {
          content: 'SPORTS CAR · $320K',
          subtitle: 'Paid In Full · Zero Monthly Payments',
          anchorName: 'car',
          transition: 'shape_wipe',
          duration: 4.6,
        }),
        soundCue: 'whoosh',
      };
    }

    // 4. $83,333 / monthly breakdown
    if (/(83,333|83333|divide|divided by 12|monthly cashflow|per month.*million)/.test(s)) {
      return {
        label: 'Monthly Cashflow Breakdown ($83,333/mo)',
        environmentId: 'trading_desk',
        paletteId: 'emeraldFinance',
        lightingMood: 'day',
        includeSmartphone: false,
        character: { x: -0.75, y: 0, scale: 0.96, view: 'front', motion: 'explain', expression: 'thinking', talking: true },
        cameraMove: {
          start: { x: 0.1, y: 0.1, viewHeight: 2.45, tiltX: 0.06, tiltY: 0.04 },
          end: { x: 0.22, y: 0.12, viewHeight: 2.18, tiltX: -0.06, tiltY: 0.04 },
          parallaxDrift: true,
        },
        graphic: createMotionGraphicConfig('monthly_breakdown_counter', {
          content: '$83,333',
          subtitle: 'PER MONTH · $1,000,000 ÷ 12 MONTHS',
          secondaryValue: 'MONTHLY',
          transition: 'panel_split_reveal',
          position: 'top_right',
          duration: 4.5,
        }),
        soundCue: 'cash_counter',
      };
    }

    // 5. $1,000,000 / millionaire milestone
    if (/(1,000,000|one million|millionaire|a million|7 figures)/.test(s)) {
      return {
        label: '$1,000,000 Impact Milestone',
        environmentId: 'vault_wealth_room',
        paletteId: 'emeraldFinance',
        lightingMood: 'dramatic',
        includeSmartphone: false,
        character: { x: -0.92, y: 0, scale: 0.92, view: 'front', motion: 'emphasisGesture', expression: 'surprised', talking: true },
        cameraMove: {
          start: { x: 0.0, y: 0.22, viewHeight: 2.8, tiltX: 0, tiltY: 0.05 },
          end: { x: 0.08, y: 0.2, viewHeight: 2.45, tiltX: 0.08, tiltY: 0.04 },
          impactShakeAt: 0.55,
          parallaxDrift: true,
        },
        graphic: createMotionGraphicConfig('million_dollar_reveal', {
          content: '$1,000,000',
          subtitle: 'THE SEVEN-FIGURE TARGET',
          secondaryValue: 'BREAKTHROUGH',
          transition: 'ink_band_sweep',
          position: 'top_center',
          duration: 4.5,
        }),
        soundCue: 'deep_impact',
      };
    }

    // 6. $2,000/month / starting salary / home office
    if (/(2,000|2000|salary|starting out|month|bedroom|apartment|desk)/.test(s)) {
      return {
        label: 'Humble Start ($2,000/mo)',
        environmentId: 'home_office',
        paletteId: 'warmEditorial',
        lightingMood: 'warm',
        includeSmartphone: false,
        character: { x: -0.78, y: 0, scale: 0.96, view: 'front', motion: 'explain', expression: 'neutral', talking: true },
        cameraMove: {
          start: { x: -0.15, y: 0.08, viewHeight: 2.48, tiltX: -0.05, tiltY: 0.04 },
          end: { x: 0.08, y: 0.08, viewHeight: 2.24, tiltX: 0.05, tiltY: 0.04 },
          parallaxDrift: true,
        },
        graphic: createMotionGraphicConfig('monthly_income_badge', {
          content: '$2,000',
          subtitle: 'PER MONTH · WHERE THE JOURNEY STARTS',
          secondaryValue: 'STARTING POINT',
          transition: 'shape_wipe',
          position: 'top_right',
          duration: 4.5,
        }),
        soundCue: 'soft_pop',
      };
    }

    // 7. Luxury mansion / yacht / penthouse
    if (/(mansion|villa|estate|house)/.test(s)) {
      return {
        label: 'Estate Valuation Reveal',
        environmentId: 'luxury_mansion_exterior',
        paletteId: 'warmEditorial',
        lightingMood: 'warm',
        includeSmartphone: false,
        character: { x: -0.95, y: 0, scale: 0.9, view: 'front', motion: 'wave', expression: 'happy', talking: true },
        cameraMove: {
          start: { x: -0.3, y: 0.2, viewHeight: 2.9, tiltX: -0.08, tiltY: 0.06 },
          end: { x: 0.35, y: 0.22, viewHeight: 2.4, tiltX: 0.08, tiltY: 0.06 },
          parallaxDrift: true,
        },
        graphic: createMotionGraphicConfig('property_estate_callout', {
          content: 'HILLSIDE ESTATE',
          subtitle: raw.slice(0, 48),
          anchorName: 'mansion',
          transition: 'shape_wipe',
          duration: 4.5,
        }),
        soundCue: 'soft_pop',
      };
    }

    // Generic dynamic fallback mapped directly to user's text
    const moneyMatch = raw.match(/\$[\d,]+(?:\s*\/\s*mo(?:nth)?)?/i);
    return {
      label: 'Editorial Story Beat',
      environmentId: 'modern_office',
      paletteId: 'mintStudio',
      lightingMood: 'day',
      includeSmartphone: false,
      character: { x: -0.75, y: 0, scale: 0.96, view: 'front', motion: 'explain', expression: 'happy', talking: true },
      cameraMove: {
        start: { x: -0.1, y: 0.1, viewHeight: 2.4, tiltX: -0.05, tiltY: 0.04 },
        end: { x: 0.12, y: 0.1, viewHeight: 2.2, tiltX: 0.05, tiltY: 0.04 },
        parallaxDrift: true,
      },
      graphic: createMotionGraphicConfig(moneyMatch ? 'monthly_income_badge' : 'kinetic_headline', {
        content: moneyMatch ? moneyMatch[0] : (raw ? raw.slice(0, 26).toUpperCase() : 'STORY BEAT'),
        subtitle: raw || 'Live Semantic Narration Preview',
        secondaryValue: 'CUSTOM BEAT',
        position: 'top_center',
        duration: 4.4,
      }),
      soundCue: 'soft_pop',
    };
  }
}

/**
 * Complete 6-Beat Demonstration Story covering every Master Prompt scenario (~28.0 seconds total).
 */
export const DEMO_STORY_BEATS = [
  {
    id: 'beat_1_2000_month',
    index: 1,
    title: 'The $2,000/Month Ceiling',
    narration: '“If you earn $2,000 a month, building real wealth feels impossible at first.”',
    startTime: 0.0,
    duration: 4.5,
    ...NarrationVisualMapper.map('If you earn $2,000 a month at your desk'),
  },
  {
    id: 'beat_2_one_million',
    index: 2,
    title: '$1,000,000 Milestone Target',
    narration: '“Most people dream of making $1,000,000 — without ever breaking down the math.”',
    startTime: 4.5,
    duration: 4.5,
    ...NarrationVisualMapper.map('Most people dream of making $1,000,000'),
  },
  {
    id: 'beat_3_83333_month',
    index: 3,
    title: '$83,333/Month Breakdown',
    narration: '“Divided by twelve, a million a year is $83,333 every single month.”',
    startTime: 9.0,
    duration: 4.5,
    ...NarrationVisualMapper.map('Divided by 12, that is $83,333 a month'),
  },
  {
    id: 'beat_4_sports_car',
    index: 4,
    title: 'Sports Car Pan & Callout',
    narration: '“Once cashflow compounds, a $320,000 sports car is bought cleanly in cash.”',
    startTime: 13.5,
    duration: 4.6,
    ...NarrationVisualMapper.map('A $320,000 sports car in the luxury driveway'),
  },
  {
    id: 'beat_5_private_jet',
    index: 5,
    title: 'Private Jet Wide Establishing',
    narration: '“Scale your systems globally, and even private aviation becomes pure time leverage.”',
    startTime: 18.1,
    duration: 4.8,
    ...NarrationVisualMapper.map('Walking onto the tarmac beside a private jet'),
  },
  {
    id: 'beat_6_nine_zeros_phone',
    index: 6,
    title: 'Nine Zeros Smartphone Focus',
    narration: '“Until one morning you open your smartphone — and see nine zeros in your bank account.”',
    startTime: 22.9,
    duration: 5.1,
    ...NarrationVisualMapper.map('Open your smartphone and see nine zeros in your bank account'),
  },
];

export const DEMO_STORY_TOTAL_DURATION = DEMO_STORY_BEATS.reduce((acc, b) => acc + b.duration, 0);

/**
 * Deterministic Story Visual Director.
 * Evaluates any absolute timestamp `timeSec` (0..totalDuration) into a full scene snapshot.
 */
export class StoryVisualDirector {
  constructor(beats = DEMO_STORY_BEATS) {
    this.beats = beats;
    this.totalDuration = beats.reduce((sum, b) => sum + b.duration, 0);
  }

  evaluateAt(timeSec = 0) {
    const t = Math.max(0, Math.min(this.totalDuration - 0.0001, Number(timeSec) || 0));
    let activeBeat = this.beats[0];
    for (const beat of this.beats) {
      if (t >= beat.startTime && t < beat.startTime + beat.duration) {
        activeBeat = beat;
        break;
      }
    }
    const localTime = Math.max(0, t - activeBeat.startTime);
    const camera = CameraChoreographyController.evaluate(activeBeat.cameraMove, localTime, activeBeat.duration);
    const beatProgress = clamp01(localTime / Math.max(0.01, activeBeat.duration));
    const directedPlan = new CameraChoreographyDirector().directShot({
      narration: activeBeat.narration || activeBeat.label,
    });

    // Smooth entry transition during first 0.45s of each beat (after beat 1)
    const transitionOverride = activeBeat.index > 1 && localTime < 0.45 && activeBeat.graphic?.transition
      ? { id: activeBeat.graphic.transition, progress: easeOutCubic(localTime / 0.45) }
      : null;

    return {
      time: t,
      totalDuration: this.totalDuration,
      beat: activeBeat,
      beatIndex: activeBeat.index,
      localTime,
      beatProgress,
      camera,
      cameraPresetId: directedPlan.preset,
      cameraEffects: { subtleVignette: 0.32, progress: beatProgress },
      transitionOverride,
    };
  }
}
