/**
 * Coordinated Directors for PuppetKit's Narrative-Driven Video Logic Engine:
 *  - CharacterActingDirector (20 narrative emotions -> 16 rig expressions + 17 gesture categories + anti-repetition + gaze)
 *  - SemanticPopupDirector (4 popup categories -> 52 motion-graphic templates + 6-phase lifecycle + restraint)
 *  - SmartCameraHighlightDirector (target-aware selection from 66 presets + 14 transitions)
 *  - BackgroundResponseDirector (contextual 2.5D environment selection with no gratuitous switching)
 *  - VisualHierarchyManager (Primary / Secondary / Supporting / Environment attention roles)
 *
 * Strictly deterministic — zero Math.random(), zero Date.now().
 */

import { createMotionGraphicConfig } from '../motion-graphics/templates.js';

// ═════════════════════════════════════════════════════════════════════════════
// 1. CHARACTER ACTING DIRECTOR (EXPRESSIONS, GESTURES, GAZE & ANTI-REPETITION)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Full 20+ emotional narrative tones mapped onto PuppetKit's 16 live Three.js rig expressions
 * with appropriate transition curve speeds and default energy levels.
 */
export const NARRATIVE_EXPRESSION_MAP = {
  happy: { rigExpression: 'happy', transition: 0.22, energy: 0.72, label: 'Happy' },
  excited: { rigExpression: 'excited', transition: 0.16, energy: 0.94, label: 'Excited' },
  curious: { rigExpression: 'confused', transition: 0.22, energy: 0.62, label: 'Curious' },
  confused: { rigExpression: 'confused', transition: 0.22, energy: 0.55, label: 'Confused' },
  surprised: { rigExpression: 'surprised', transition: 0.08, energy: 0.88, label: 'Surprised' },
  shocked: { rigExpression: 'scared', transition: 0.06, energy: 0.96, label: 'Shocked' },
  worried: { rigExpression: 'worried', transition: 0.24, energy: 0.45, label: 'Worried' },
  nervous: { rigExpression: 'worried', transition: 0.18, energy: 0.52, label: 'Nervous' },
  sad: { rigExpression: 'sad', transition: 0.3, energy: 0.32, label: 'Sad' },
  disappointed: { rigExpression: 'sad', transition: 0.28, energy: 0.35, label: 'Disappointed' },
  angry: { rigExpression: 'angry', transition: 0.14, energy: 0.84, label: 'Angry' },
  frustrated: { rigExpression: 'angry', transition: 0.18, energy: 0.76, label: 'Frustrated' },
  confident: { rigExpression: 'determined', transition: 0.22, energy: 0.78, label: 'Confident' },
  determined: { rigExpression: 'determined', transition: 0.2, energy: 0.82, label: 'Determined' },
  serious: { rigExpression: 'determined', transition: 0.18, energy: 0.64, label: 'Serious' },
  thinking: { rigExpression: 'thinking', transition: 0.24, energy: 0.48, label: 'Thinking' },
  skeptical: { rigExpression: 'confused', transition: 0.22, energy: 0.52, label: 'Skeptical' },
  relieved: { rigExpression: 'happy', transition: 0.28, energy: 0.58, label: 'Relieved' },
  proud: { rigExpression: 'happy', transition: 0.24, energy: 0.8, label: 'Proud' },
  embarrassed: { rigExpression: 'shy', transition: 0.22, energy: 0.44, label: 'Embarrassed' },
  neutral: { rigExpression: 'neutral', transition: 0.24, energy: 0.45, label: 'Neutral' },
};

export const NARRATIVE_EMOTION_NAMES = Object.keys(NARRATIVE_EXPRESSION_MAP);

/**
 * 17 Narrative Gesture Categories mapped onto PuppetKit's real 45-motion library
 * with primary + alternates so consecutive beats never look repetitive.
 */
export const GESTURE_CATEGORY_LIBRARY = {
  explaining: { channel: 'gesture', motions: ['explain', 'talkingGesture', 'raiseRightHand'] },
  pointing: { channel: 'gesture', motions: ['pointRight', 'point', 'pointLeft'] },
  presenting: { channel: 'gesture', motions: ['raiseRightHand', 'explain', 'waveOnce'] },
  counting: { channel: 'gesture', motions: ['emphasisGesture', 'talkingGesture', 'raiseLeftHand'] },
  showing_object: { channel: 'gesture', motions: ['pointRight', 'raiseRightHand', 'point'] },
  holding_smartphone: { channel: 'gesture', motions: ['raiseLeftHand', 'lookDown', 'explain'] },
  looking_at: { channel: 'head', motions: ['lookRight', 'glance', 'lookUp'] },
  thinking: { channel: 'head', motions: ['tiltLeft', 'lookUp', 'tiltRight'] },
  shrugging: { channel: 'gesture', motions: ['shrug', 'lowerHands', 'tiltRight'] },
  celebrating: { channel: 'gesture', motions: ['raiseBothHands', 'clap', 'handsUp'] },
  surprise_reaction: { channel: 'locomotion', motions: ['surprisedReaction', 'recoil'] },
  frustration: { channel: 'gesture', motions: ['shrug', 'emphasisGesture', 'shake'] },
  walking: { channel: 'locomotion', motions: ['walk'] },
  turning_toward: { channel: 'head', motions: ['headTurnRight', 'lookRight', 'glance'] },
  reaching_toward: { channel: 'gesture', motions: ['pointRight', 'raiseRightHand'] },
  comparing: { channel: 'gesture', motions: ['explain', 'raiseBothHands', 'talkingGesture'] },
  emphasizing_number: { channel: 'gesture', motions: ['emphasisGesture', 'pointRight', 'raiseRightHand'] },
};

/**
 * Compute eye & head gaze vector pointing toward the active visual target on stage.
 * Coordinates: x in [-1..1] (right = positive), y in [-1..1] (up = negative, down = positive).
 */
export function resolveGazeForTarget(targetId, popupPosition = 'top_right', beatType = 'explanation') {
  if (beatType === 'audience_question' || beatType === 'conclusion' || beatType === 'hook') {
    if (targetId === 'character' || targetId === 'character_face') {
      return {
        targetId: 'audience',
        label: 'Direct to Audience',
        eye: { x: 0, y: 0 },
        headMotion: 'nod',
      };
    }
  }

  switch (targetId) {
    case 'sports_car':
      return {
        targetId: 'sports_car',
        label: 'Look Right -> Sports Car',
        eye: { x: 0.72, y: 0.14 },
        headMotion: 'lookRight',
      };
    case 'private_jet':
      return {
        targetId: 'private_jet',
        label: 'Look Up-Right -> Private Jet',
        eye: { x: 0.68, y: -0.22 },
        headMotion: 'lookRight',
      };
    case 'mansion':
      return {
        targetId: 'mansion',
        label: 'Look Up-Left -> Mansion',
        eye: { x: -0.52, y: -0.24 },
        headMotion: 'lookLeft',
      };
    case 'smartphone':
    case 'bank_balance':
      return {
        targetId: 'smartphone',
        label: 'Look Down-Right -> Smartphone',
        eye: { x: 0.48, y: 0.32 },
        headMotion: 'lookDown',
      };
    case 'financial_popup': {
      if (popupPosition === 'top_center') {
        return {
          targetId: 'financial_popup',
          label: 'Look Up -> Financial Graphic',
          eye: { x: 0.12, y: -0.58 },
          headMotion: 'lookUp',
        };
      }
      if (popupPosition === 'top_left') {
        return {
          targetId: 'financial_popup',
          label: 'Look Up-Left -> Financial Graphic',
          eye: { x: -0.42, y: -0.42 },
          headMotion: 'lookLeft',
        };
      }
      return {
        targetId: 'financial_popup',
        label: 'Look Right -> Financial Graphic',
        eye: { x: 0.64, y: -0.28 },
        headMotion: 'lookRight',
      };
    }
    case 'character_face':
    case 'character':
    default:
      return {
        targetId: 'audience',
        label: 'Direct to Audience',
        eye: { x: 0, y: -0.02 },
        headMotion: beatType === 'conflict' ? 'shake' : 'nod',
      };
  }
}

export class CharacterActingDirector {
  static selectActing(beat, { previousGesture = null, popupPosition = 'top_right' } = {}) {
    const tone = beat.emotionalTone || 'neutral';
    const exprMeta = NARRATIVE_EXPRESSION_MAP[tone] || NARRATIVE_EXPRESSION_MAP.neutral;

    // Pick semantic gesture category based on intent & meaning
    let gestureCategory = 'explaining';
    let locomotion = null;

    if (beat.wantsMotionWalk) {
      locomotion = 'walk';
    }

    switch (beat.intent) {
      case 'financial_salary':
        gestureCategory = beat.wantsPhoneInteraction ? 'holding_smartphone' : 'explaining';
        break;
      case 'financial_ambition':
        gestureCategory = 'pointing';
        break;
      case 'financial_gain':
        gestureCategory = 'celebrating';
        break;
      case 'financial_loss':
        gestureCategory = 'surprise_reaction';
        locomotion = 'surprisedReaction';
        break;
      case 'financial_debt':
      case 'financial_expense':
        gestureCategory = 'frustration';
        break;
      case 'financial_growth':
        gestureCategory = 'presenting';
        break;
      case 'financial_balance':
        gestureCategory = beat.entity?.value >= 1_000_000 ? 'celebrating' : 'holding_smartphone';
        break;
      case 'financial_countdown':
        gestureCategory = 'emphasizing_number';
        break;
      case 'object_sports_car':
      case 'object_private_jet':
      case 'object_mansion':
        gestureCategory = 'showing_object';
        break;
      case 'object_smartphone':
        gestureCategory = 'holding_smartphone';
        break;
      case 'narrative_problem':
        gestureCategory = 'emphasizing_number';
        break;
      case 'narrative_twist':
        gestureCategory = 'surprise_reaction';
        locomotion = 'recoil';
        break;
      case 'narrative_decision':
        gestureCategory = 'presenting';
        break;
      case 'narrative_question':
        gestureCategory = 'shrugging';
        break;
      case 'narrative_conclusion':
        gestureCategory = 'presenting';
        break;
      default:
        gestureCategory = 'explaining';
    }

    const catSpec = GESTURE_CATEGORY_LIBRARY[gestureCategory] || GESTURE_CATEGORY_LIBRARY.explaining;
    let motionId = catSpec.motions[0];

    // Anti-repetition: never repeat the exact same gesture motion two beats in a row if an alternate exists
    if (previousGesture && motionId === previousGesture && catSpec.motions.length > 1) {
      motionId = catSpec.motions.find((m) => m !== previousGesture) || catSpec.motions[1];
    }

    // If surprise reaction occupies locomotion, avoid overwriting startled arms with casual explain
    const gestureMotion =
      gestureCategory === 'surprise_reaction'
        ? null
        : catSpec.channel === 'gesture'
          ? motionId
          : 'explain';
    const gaze = resolveGazeForTarget(beat.subjectTarget, popupPosition, beat.beatType);
    const headMotion = catSpec.channel === 'head' ? motionId : gaze.headMotion;

    // Position character cleanly so objects/graphics never collide with Heroine and outer arm never clips left edge
    const charX = beat.subjectTarget === 'sports_car' || beat.subjectTarget === 'private_jet'
      ? -0.90
      : beat.subjectTarget === 'smartphone'
        ? -0.84
        : beat.subjectTarget === 'character_face'
          ? -0.40
          : -0.70;
    const charScale = beat.subjectTarget === 'private_jet' ? 0.88 : 0.94;

    return {
      emotionalTone: tone,
      expressionLabel: exprMeta.label,
      expression: exprMeta.rigExpression,
      expressionTransition: exprMeta.transition,
      gestureCategory,
      gesture: gestureMotion,
      locomotion,
      headMotion,
      gaze,
      talking: true,
      autoBlink: true,
      basePose: 'standing',
      position: { x: charX, y: 0, scale: charScale },
      notes: `${exprMeta.label} expression + ${gestureCategory.replace(/_/g, ' ')} (${gestureMotion}), gaze: ${gaze.label}`,
    };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. SEMANTIC POPUP & VISUAL GRAPHICS DIRECTOR
// ═════════════════════════════════════════════════════════════════════════════

export const POPUP_CATEGORIES = {
  financial: 'Financial Graphics',
  object_product: 'Object & Product Graphics',
  information: 'Information Graphics',
  emotional_story: 'Emotional & Story Graphics',
};

export class SemanticPopupDirector {
  /**
   * Choose the most informative popup template for the beat — or return `null` when
   * restraint is better (e.g., quiet emotional conclusion where visuals shouldn't clutter).
   */
  static selectPopup(beat) {
    const dur = beat.timing?.duration || 4.0;
    const entity = beat.entity;

    const lifecycle = {
      prepare: 0,
      enter: beat.timing?.entranceOffset ?? 0.18,
      reveal: beat.timing?.emphasisOffset ?? 0.45,
      emphasize: Number(((beat.timing?.emphasisOffset ?? 0.45) + 0.35).toFixed(3)),
      hold: beat.timing?.holdDuration ?? 1.4,
      exit: beat.timing?.exitOffset ?? Math.max(1.5, dur - 0.36),
    };

    const build = (category, templateId, overrides, reason, hasNumberCounter = false) => ({
      category,
      categoryLabel: POPUP_CATEGORIES[category],
      templateId,
      targetId: overrides.anchorName || 'financial_popup',
      reason,
      hasNumberCounter,
      lifecycle,
      config: createMotionGraphicConfig(templateId, {
        duration: dur,
        ...overrides,
      }),
    });

    switch (beat.intent) {
      case 'financial_salary':
        return build(
          'financial',
          'monthly_income_badge',
          {
            content: entity?.formatted || '$2,000',
            subtitle: entity?.period ? `PER ${entity.period} · STARTING INCOME` : 'PER MONTH · BASELINE SALARY',
            secondaryValue: 'SALARY CARD',
            colorTheme: 'warmCream',
            position: 'top_right',
          },
          'Visualizes baseline monthly salary directly referenced by narrator',
          true
        );

      case 'financial_ambition':
        return build(
          'financial',
          'million_dollar_reveal',
          {
            content: entity?.formatted || '$1,000,000',
            subtitle: 'FINANCIAL GOAL · LONG-TERM TARGET',
            secondaryValue: 'GOAL TARGET',
            colorTheme: 'editorialGold',
            position: 'top_center',
          },
          'Visualizes aspirational wealth target to anchor character’s upward gaze',
          true
        );

      case 'financial_gain':
        return build(
          'financial',
          entity?.value >= 1_000_000_000 ? 'nine_zeros_balance' : 'million_dollar_reveal',
          {
            content: entity?.formatted || '$1,000,000',
            subtitle: 'BREAKTHROUGH ACHIEVED · VERIFIED GAIN',
            secondaryValue: 'MILESTONE',
            colorTheme: 'emeraldWealth',
            position: 'top_center',
          },
          'Emphasizes positive financial milestone with animated counter',
          true
        );

      case 'financial_loss':
        return build(
          'financial',
          'stamp_verdict_title',
          {
            content: entity ? `-${entity.formatted}` : 'TOTAL LOSS',
            subtitle: 'FINANCIAL LOSS · CAPITAL WIPED OUT',
            secondaryValue: 'LOSS ALERT',
            colorTheme: 'coralPunch',
            position: 'top_center',
            entrance: 'kinetic_scale_punch',
            impact: 'pulse_emphasis',
          },
          'Communicates negative financial shock distinctly from positive gain graphics',
          false
        );

      case 'financial_debt':
        return build(
          'financial',
          'expense_vs_income_bar',
          {
            content: entity ? `OWED ${entity.formatted}` : 'DEBT OBLIGATION',
            subtitle: 'LIABILITY WARNING · REPAYMENT PRESSURE',
            secondaryValue: 'DEBT RISK',
            colorTheme: 'coralPunch',
            position: 'top_right',
          },
          'Shows financial debt burden with warning color semantics',
          true
        );

      case 'financial_expense':
        return build(
          'financial',
          'expense_vs_income_bar',
          {
            content: entity ? `${entity.formatted} / MO` : '$800 / MO',
            subtitle: 'MONTHLY EXPENSE BREAKDOWN · CASH DRAIN',
            secondaryValue: 'EXPENSES',
            colorTheme: 'coralPunch',
            position: 'top_right',
          },
          'Breaks down recurring monthly rent/expense outflow',
          true
        );

      case 'financial_growth':
        return build(
          'financial',
          'compound_interest_curve',
          {
            content: entity?.formatted || 'COMPOUND GROWTH',
            subtitle: 'SAVINGS PROGRESS · RISING MOMENTUM',
            secondaryValue: 'GROWING',
            colorTheme: 'emeraldWealth',
            position: 'top_right',
          },
          'Charts compounding savings trajectory visually',
          true
        );

      case 'financial_balance':
        return build(
          'object_product',
          entity?.value >= 1_000_000_000 ? 'nine_zeros_balance' : 'phone_balance_callout',
          {
            content: entity?.formatted || '$1,000,000',
            subtitle: 'SMARTPHONE BANK BALANCE · VERIFIED',
            secondaryValue: 'BANK APP',
            anchorName: 'phone',
            colorTheme: 'cobaltTech',
            position: 'top_right',
          },
          'Highlights verified smartphone account balance synchronized with phone view',
          true
        );

      case 'financial_countdown':
        return build(
          'information',
          'horizontal_timeline_nodes',
          {
            content: entity?.formatted || '30 DAYS',
            subtitle: 'CRITICAL DEADLINE · TIME REMAINING',
            secondaryValue: 'COUNTDOWN',
            colorTheme: 'coralPunch',
            position: 'top_center',
          },
          'Displays concrete countdown constraint',
          true
        );

      case 'object_sports_car':
        return build(
          'object_product',
          'car_spec_callout',
          {
            content: entity ? `SPORTS CAR · ${entity.formatted}` : 'SPORTS CAR · $320K',
            subtitle: 'SHOWCASE REVEAL · PAID IN FULL',
            secondaryValue: 'ASSET TAG',
            anchorName: 'car',
            colorTheme: 'editorialGold',
            position: 'top_right',
          },
          'Anchors price tag and showcase label directly to the visible sports car',
          false
        );

      case 'object_private_jet':
        return build(
          'object_product',
          'jet_aviation_callout',
          {
            content: entity ? `PRIVATE JET · ${entity.formatted}` : 'PRIVATE JET · $28M',
            subtitle: 'GLOBAL RANGE · TIME LEVERAGE',
            secondaryValue: 'AVIATION',
            anchorName: 'jet',
            colorTheme: 'cobaltTech',
            position: 'top_right',
          },
          'Highlights the private jet aircraft with contextual aviation callout',
          false
        );

      case 'object_mansion':
        return build(
          'object_product',
          'property_estate_callout',
          {
            content: entity ? `ESTATE · ${entity.formatted}` : 'HILLSIDE MANSION',
            subtitle: 'LUXURY REAL ESTATE SHOWCASE',
            secondaryValue: 'PROPERTY',
            anchorName: 'mansion',
            colorTheme: 'editorialGold',
            position: 'top_left',
          },
          'Calls out the hillside mansion in the background',
          false
        );

      case 'object_smartphone':
        return build(
          'object_product',
          'dynamic_island_expansion',
          {
            content: 'ACCOUNT ALERT',
            subtitle: 'SMARTPHONE NOTIFICATION RECEIVED',
            secondaryValue: 'LIVE ALERT',
            anchorName: 'phone',
            colorTheme: 'cobaltTech',
            position: 'top_right',
          },
          'Mirrors the visible smartphone notification interaction',
          false
        );

      case 'narrative_problem':
        return build(
          'emotional_story',
          'stamp_verdict_title',
          {
            content: 'THE PROBLEM',
            subtitle: beat.narration.slice(0, 48).toUpperCase(),
            secondaryValue: 'WARNING',
            colorTheme: 'coralPunch',
            position: 'top_center',
          },
          'Flags the central conflict clearly without cluttering the character reaction',
          false
        );

      case 'narrative_twist':
        return build(
          'emotional_story',
          'highlight_marker_title',
          {
            content: 'PLOT TWIST',
            subtitle: beat.narration.slice(0, 48).toUpperCase(),
            secondaryValue: 'TURN',
            colorTheme: 'coralPunch',
            position: 'top_center',
          },
          'Punctuates an unexpected turn in the narrative',
          false
        );

      case 'narrative_question':
        if (beat.beatType === 'audience_question') {
          return build(
            'emotional_story',
            'editorial_quote_callout',
            {
              content: 'WHAT WOULD YOU BUILD?',
              subtitle: beat.narration.slice(0, 62),
              secondaryValue: 'YOUR TURN',
              colorTheme: 'editorialGold',
              position: 'top_center',
            },
            'Frames the closing audience-engagement prompt cleanly',
            false
          );
        }
        return null; // Restraint: let the character carry mid-story rhetorical questions without popup clutter

      case 'narrative_conclusion':
        return null; // Intentional restraint: clean frame for emotional wrap-up

      default:
        // Only show an info card if a concrete number or percentage was spoken
        if (entity) {
          return build(
            'information',
            'big_stat_kicker',
            {
              content: entity.formatted,
              subtitle: beat.narration.slice(0, 52),
              secondaryValue: 'KEY STAT',
              theme: 'cobaltTech',
              position: 'top_right',
            },
            'Visualizes concrete statistic mentioned by narrator',
            true
          );
        }
        return null;
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. SMART CAMERA HIGHLIGHT DIRECTOR
// ═════════════════════════════════════════════════════════════════════════════

export class SmartCameraHighlightDirector {
  static selectCameraPlan(beat, { previousPreset = null, previousTarget = null } = {}) {
    let targetId = beat.subjectTarget || 'character';
    let presetId = 'slow_push_in';
    let transitionId = 'smooth_reframe';
    let compositionId = 'character_object_split';
    let intensity = 0.85;
    let priority = 'medium';
    let rationale = 'Follow primary story subject smoothly';

    switch (beat.intent) {
      case 'object_sports_car':
        targetId = 'sports_car';
        presetId = 'cinematic_push_in';
        transitionId = 'whip_pan_transition';
        compositionId = 'object_hero_center';
        intensity = 1.05;
        priority = 'critical';
        rationale = 'Whip-pan from character to sports car and push in for hero reveal';
        break;
      case 'object_private_jet':
        targetId = 'private_jet';
        presetId = 'reveal_zoom_out';
        transitionId = 'dolly_transition';
        compositionId = 'object_wide_context';
        intensity = 0.95;
        priority = 'critical';
        rationale = 'Reframe wide to reveal the scale of the private jet';
        break;
      case 'object_mansion':
        targetId = 'mansion';
        presetId = 'pan_left';
        transitionId = 'parallax_transition';
        compositionId = 'object_wide_context';
        intensity = 0.85;
        priority = 'high';
        rationale = 'Pan smoothly toward the hillside estate';
        break;
      case 'financial_balance':
      case 'object_smartphone':
        targetId = 'smartphone';
        presetId = 'focus_zoom_on_object';
        transitionId = 'zoom_through_transition';
        compositionId = 'smartphone_closeup';
        intensity = 0.95;
        priority = 'high';
        rationale = 'Track into the smartphone display to highlight the live balance';
        break;
      case 'financial_salary':
        targetId = 'financial_popup';
        presetId = 'micro_push_in';
        transitionId = 'smooth_reframe';
        compositionId = 'rule_of_thirds_left';
        intensity = 0.72;
        priority = 'medium';
        rationale = 'Settle calmly on the salary figure alongside the narrator';
        break;
      case 'financial_ambition':
        targetId = 'financial_popup';
        presetId = 'cinematic_push_in';
        transitionId = 'parallax_transition';
        compositionId = 'rule_of_thirds_right';
        intensity = 0.9;
        priority = 'high';
        rationale = 'Move from salary framing toward the elevated $1M ambition target';
        break;
      case 'financial_gain':
        targetId = 'financial_popup';
        presetId = 'impact_zoom';
        transitionId = 'snap_zoom_transition';
        compositionId = 'dramatic_reveal_frame';
        intensity = 1.05;
        priority = 'critical';
        rationale = 'Deliver energetic milestone emphasis on the $1M breakthrough';
        break;
      case 'financial_loss':
      case 'narrative_twist':
        targetId = 'character_face';
        presetId = 'dolly_zoom';
        transitionId = 'focus_shift_transition';
        compositionId = 'character_closeup';
        intensity = 0.92;
        priority = 'critical';
        rationale = 'Controlled dramatic push-in / dolly tension onto character shock';
        break;
      case 'narrative_problem':
      case 'financial_debt':
      case 'financial_expense':
        targetId = 'character_face';
        presetId = 'dramatic_push_in';
        transitionId = 'smooth_reframe';
        compositionId = 'character_medium_closeup';
        intensity = 0.82;
        priority = 'high';
        rationale = 'Leave financial graphic and tighten onto serious character reaction';
        break;
      case 'financial_growth':
        targetId = 'financial_popup';
        presetId = 'track_right';
        transitionId = 'cinematic_ease_transition';
        compositionId = 'character_object_split';
        intensity = 0.8;
        priority = 'medium';
        rationale = 'Track smoothly along the rising savings growth visual';
        break;
      case 'narrative_question':
      case 'narrative_conclusion':
        targetId = 'character';
        presetId = 'slow_drift';
        transitionId = 'cinematic_ease_transition';
        compositionId = 'character_center';
        intensity = 0.55;
        priority = 'low';
        rationale = 'Calm audience-facing framing without distracting camera motion';
        break;
      default:
        targetId = 'character';
        presetId = 'subtle_breathing_zoom';
        transitionId = 'smooth_reframe';
        compositionId = 'rule_of_thirds_left';
        intensity = 0.65;
        priority = 'low';
        rationale = 'Restrained presenter framing during explanation';
    }

    // Anti-repetition: avoid identical preset twice in a row on same target
    if (previousPreset === presetId && previousTarget === targetId) {
      presetId = presetId === 'cinematic_push_in' ? 'slow_drift' : 'micro_push_in';
    }

    const decorativeEffectsAllowed = !['conflict', 'twist', 'consequence'].includes(beat.beatType) &&
      !['serious', 'shocked', 'worried', 'sad'].includes(beat.emotionalTone);

    return {
      targetId,
      presetId,
      transitionId,
      compositionId,
      intensity,
      priority,
      decorativeEffectsAllowed,
      rationale,
    };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. BACKGROUND & ENVIRONMENT RESPONSE DIRECTOR
// ═════════════════════════════════════════════════════════════════════════════

export class BackgroundResponseDirector {
  static selectEnvironment(beat, previousEnv = null) {
    // Only switch environment when the story beat calls for a distinct narrative context
    switch (beat.intent) {
      case 'financial_salary':
        return {
          environmentId: 'home_office',
          paletteId: 'warmEditorial',
          lightingMood: 'warm',
          ambienceContext: 'room',
          includeSmartphone: beat.wantsPhoneInteraction,
          changedReason: 'Everyday home workspace matches starting monthly salary context',
        };
      case 'financial_ambition':
        // Stay in current workspace if already in home_office/bedroom so transition feels continuous
        if (previousEnv && ['home_office', 'bedroom_cozy', 'modern_office'].includes(previousEnv.environmentId)) {
          return {
            ...previousEnv,
            lightingMood: 'warm',
            changedReason: 'Maintained workspace continuity while pivoting to ambition beat',
          };
        }
        return {
          environmentId: 'modern_office',
          paletteId: 'editorialWarm',
          lightingMood: 'warm',
          ambienceContext: 'office',
          includeSmartphone: false,
          changedReason: 'Aspirational workspace setting for long-term goal',
        };
      case 'financial_balance':
      case 'object_smartphone':
        return {
          environmentId: 'smartphone_hero_stage',
          paletteId: 'twilightLuxury',
          lightingMood: 'dramatic',
          ambienceContext: 'room',
          includeSmartphone: true,
          smartphoneState: {
            islandState: beat.entity?.value >= 1_000_000 ? 'financial_alert' : 'payment_received',
            balanceTarget: beat.entity?.value || 1_000_000,
            headline: beat.entity?.formatted ? `+${beat.entity.formatted}` : '+$1,000,000',
            subtitle: 'Balance Verified',
          },
          changedReason: 'Dedicated smartphone showcase environment for screen focus',
        };
      case 'financial_growth':
        return {
          environmentId: 'trading_desk',
          paletteId: 'emeraldFinance',
          lightingMood: 'day',
          ambienceContext: 'office',
          includeSmartphone: false,
          changedReason: 'Modern financial workspace supports compounding investment story',
        };
      case 'financial_gain':
        return {
          environmentId: 'vault_wealth_room',
          paletteId: 'emeraldFinance',
          lightingMood: 'dramatic',
          ambienceContext: 'room',
          includeSmartphone: false,
          changedReason: 'Celebratory high-contrast wealth vault for $1M breakthrough',
        };
      case 'financial_loss':
      case 'financial_debt':
      case 'financial_expense':
      case 'narrative_problem':
        return {
          environmentId: previousEnv?.environmentId === 'home_office' ? 'home_office' : 'minimalist_studio',
          paletteId: 'twilightLuxury',
          lightingMood: 'night',
          ambienceContext: 'room',
          includeSmartphone: false,
          changedReason: 'Restrained low-key lighting reinforces financial tension and seriousness',
        };
      case 'object_sports_car':
        return {
          environmentId: 'luxury_driveway',
          paletteId: 'sunsetGold',
          lightingMood: 'warm',
          ambienceContext: 'city',
          includeSmartphone: false,
          changedReason: 'Luxury driveway stages the sports car hero reveal',
        };
      case 'object_private_jet':
        return {
          environmentId: 'airport_hangar',
          paletteId: 'sunlitDay',
          lightingMood: 'day',
          ambienceContext: 'hangar',
          includeSmartphone: false,
          changedReason: 'Open airport hangar tarmac stages the private jet',
        };
      case 'object_mansion':
        return {
          environmentId: 'luxury_mansion_exterior',
          paletteId: 'warmEditorial',
          lightingMood: 'warm',
          ambienceContext: 'wind',
          includeSmartphone: false,
          changedReason: 'Hillside luxury exterior highlights the estate',
        };
      default:
        if (previousEnv) {
          return {
            ...previousEnv,
            lightingMood: beat.emotionalTone === 'relieved' || beat.beatType === 'audience_question' ? 'warm' : previousEnv.lightingMood,
            changedReason: 'Preserved scene continuity (no unmotivated background cut)',
          };
        }
        return {
          environmentId: 'home_office',
          paletteId: 'warmEditorial',
          lightingMood: 'warm',
          ambienceContext: 'office',
          includeSmartphone: false,
          changedReason: 'Clean editorial starting environment',
        };
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. VISUAL HIERARCHY & ATTENTION MANAGER
// ═════════════════════════════════════════════════════════════════════════════

export function buildVisualHierarchy(beat, acting, popup, environment) {
  const targetLabels = {
    character: 'Main Character',
    character_face: 'Character Reaction',
    smartphone: 'Smartphone Display',
    bank_balance: 'Bank Balance UI',
    sports_car: 'Sports Car',
    private_jet: 'Private Jet',
    mansion: 'Hillside Mansion',
    financial_popup: popup?.config?.content || 'Financial Graphic',
  };

  const primary = targetLabels[beat.subjectTarget] || 'Main Character';
  const secondary = beat.subjectTarget === 'character' || beat.subjectTarget === 'character_face'
    ? (popup ? popup.categoryLabel : 'Facial Expression & Gesture')
    : `Character (${acting.expressionLabel})`;
  const supporting = popup
    ? `${popup.templateId} (${popup.config.content})`
    : environment.includeSmartphone
      ? 'Smartphone Prop'
      : 'None (Intentional Clean Frame)';
  const envDesc = `${environment.environmentId} (${environment.lightingMood})`;

  return {
    primary,
    secondary,
    supporting,
    environment: envDesc,
  };
}
