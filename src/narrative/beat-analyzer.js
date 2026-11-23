/**
 * Semantic Story Beat Analyzer & Phrase-Level Voice Timing Synchronizer for PuppetKit.
 *
 * Strictly deterministic — zero Math.random(), zero Date.now().
 * Splits raw narration or timestamped voice cues into meaningful semantic beats,
 * detects emotional polarity and context (e.g., making vs losing vs owing vs wishing for money),
 * extracts entities/numbers, and aligns entrance/emphasis/hold/exit timestamps.
 */

export const STORY_BEAT_TYPES = [
  'hook',
  'introduction',
  'question',
  'explanation',
  'financial_info',
  'decision',
  'object_reveal',
  'emotional_reaction',
  'conflict',
  'twist',
  'consequence',
  'conclusion',
  'audience_question',
];

export const SEMANTIC_INTENTS = [
  'financial_salary',
  'financial_ambition',
  'financial_gain',
  'financial_loss',
  'financial_debt',
  'financial_expense',
  'financial_growth',
  'financial_balance',
  'financial_countdown',
  'object_sports_car',
  'object_private_jet',
  'object_mansion',
  'object_smartphone',
  'narrative_problem',
  'narrative_twist',
  'narrative_decision',
  'narrative_question',
  'narrative_hook',
  'narrative_conclusion',
  'narrative_explanation',
];

/**
 * Normalize numeric / currency strings from narration so graphics display crisp,
 * accurate numbers (e.g., "two thousand dollars" -> "$2,000", "one million" -> "$1,000,000").
 */
export function extractFinancialEntity(text = '') {
  const raw = String(text || '');
  const lower = raw.toLowerCase();

  // Direct numeric currency match ($2,000, $1,000,000, $800, $320K, $1M)
  const dollarRegex = /\$\s*([\d,]+(?:\.\d+)?)\s*(billion|million|thousand|b|m|k)?/i;
  const dm = raw.match(dollarRegex);
  if (dm) {
    let base = parseFloat(dm[1].replace(/,/g, '')) || 0;
    const unit = (dm[2] || '').toLowerCase();
    if (unit === 'billion' || unit === 'b') base *= 1_000_000_000;
    else if (unit === 'million' || unit === 'm') base *= 1_000_000;
    else if (unit === 'thousand' || unit === 'k') base *= 1_000;
    return {
      value: Math.round(base),
      formatted: `$${Math.round(base).toLocaleString('en-US')}`,
      raw: dm[0].trim(),
      period: /per month|a month|every month|monthly|\/\s*mo/i.test(raw)
        ? 'MONTH'
        : /per year|a year|yearly|annual/i.test(raw)
          ? 'YEAR'
          : null,
    };
  }

  // Spoken number detection
  if (/(nine zeros|9 zeros|one billion|a billion)/i.test(lower)) {
    return { value: 1_000_000_000, formatted: '$1,000,000,000', raw: 'nine zeros', period: null };
  }
  if (/(one million|a million|millionaire|seven figures|7 figures)/i.test(lower)) {
    return { value: 1_000_000, formatted: '$1,000,000', raw: 'one million', period: null };
  }
  if (/(two thousand|2 thousand)/i.test(lower)) {
    return {
      value: 2000,
      formatted: '$2,000',
      raw: 'two thousand dollars',
      period: /month|monthly/i.test(lower) ? 'MONTH' : null,
    };
  }
  if (/(eight hundred)/i.test(lower)) {
    return { value: 800, formatted: '$800', raw: 'eight hundred dollars', period: /month|rent/i.test(lower) ? 'MONTH' : null };
  }

  // Days / countdown match
  const daysMatch = raw.match(/(\d+)\s*(days?|hours?|months?|years?)/i);
  if (daysMatch) {
    return {
      value: parseInt(daysMatch[1], 10),
      formatted: `${daysMatch[1]} ${daysMatch[2].toUpperCase()}`,
      raw: daysMatch[0],
      period: daysMatch[2].toUpperCase(),
      isTimeframe: true,
    };
  }

  // Percentage match
  const pctMatch = raw.match(/(\d+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    return {
      value: parseFloat(pctMatch[1]),
      formatted: `${pctMatch[1]}%`,
      raw: pctMatch[0],
      period: null,
      isPercent: true,
    };
  }

  return null;
}

/**
 * Split compound narration into semantic clauses while preserving natural readability.
 * Example:
 *  "Imagine making just $2,000 a month, but dreaming of becoming a millionaire."
 *  -> ["Imagine making just $2,000 a month", "but dreaming of becoming a millionaire."]
 */
export function segmentNarrationIntoClauses(script = '') {
  const cleaned = String(script || '').replace(/\r\n/g, '\n').trim();
  if (!cleaned) return [];

  // Split by explicit paragraph / newline first, then sentence boundaries
  const rawSentences = cleaned
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);

  const clauses = [];
  const pivotRegex = /,\s+(?=(?:but|however|until|then|yet|suddenly|while|and then|instead)\b)/i;

  for (const sentence of rawSentences) {
    // Only split a sentence on a semantic contrast/pivot if both halves carry real meaning (>= 18 chars)
    const parts = sentence.split(pivotRegex);
    if (parts.length > 1 && parts.every((p) => p.trim().length >= 16)) {
      for (const p of parts) {
        clauses.push(p.trim());
      }
    } else {
      clauses.push(sentence);
    }
  }
  return clauses;
}

/**
 * Estimate natural spoken duration & phrase-level word timestamps when external audio
 * timestamps are not provided, or map directly onto real word/phrase timestamps if supplied.
 */
export function buildPhraseTiming(text = '', startTime = 0, explicitCue = null) {
  const words = String(text || '')
    .replace(/[“”"]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const hasExactWords = Array.isArray(explicitCue?.words) && explicitCue.words.length > 0;
  const hasExplicitWindow =
    typeof explicitCue?.startTime === 'number' &&
    typeof explicitCue?.endTime === 'number' &&
    explicitCue.endTime > explicitCue.startTime;

  const naturalDur = Math.max(2.6, Math.min(6.4, 1.35 + words.length * 0.27));
  const start = hasExplicitWindow ? explicitCue.startTime : startTime;
  const duration = hasExplicitWindow
    ? Math.max(1.2, explicitCue.endTime - explicitCue.startTime)
    : typeof explicitCue?.duration === 'number'
      ? Math.max(1.2, explicitCue.duration)
      : naturalDur;

  // Build word-level timings (exact if supplied, otherwise proportional syllable-weighted)
  const wordTimings = [];
  if (hasExactWords) {
    for (const w of explicitCue.words) {
      wordTimings.push({
        word: String(w.word || ''),
        start: Number(w.start) || start,
        end: Number(w.end) || (Number(w.start) || start) + 0.25,
      });
    }
  } else {
    const speakStart = start + 0.14;
    const speakSpan = Math.max(0.8, duration - 0.52);
    const weights = words.map((w) => Math.max(1, Math.min(4.2, w.replace(/[^a-z0-9$]/gi, '').length * 0.36 + 0.6)));
    const totalW = weights.reduce((a, b) => a + b, 0) || 1;
    let cursor = speakStart;
    for (let i = 0; i < words.length; i++) {
      const span = (weights[i] / totalW) * speakSpan;
      wordTimings.push({
        word: words[i],
        start: Number(cursor.toFixed(3)),
        end: Number((cursor + span).toFixed(3)),
      });
      cursor += span;
    }
  }

  // Locate primary emphasis word (number, currency, key noun, or contrast pivot)
  const emphasisPatterns = [
    /\$[\d,]+/i,
    /(million|millionaire|billion|zeros|thousand|83,333|2,000|800|30)/i,
    /(ferrari|sports|supercar|car|jet|aircraft|mansion|smartphone|phone|balance)/i,
    /(lost|lose|owe|debt|problem|twist|disappeared|everything|shock|warning|countdown)/i,
    /(dream|goal|growing|savings|achieved|breakthrough|freedom|limit)/i,
  ];

  let emphasisWord = wordTimings[Math.floor(wordTimings.length * 0.45)] || { word: '', start: start + 0.4, end: start + 0.8 };
  for (const pat of emphasisPatterns) {
    const found = wordTimings.find((w) => pat.test(w.word));
    if (found) {
      emphasisWord = found;
      break;
    }
  }

  const localEmphasis = Math.max(0.28, Math.min(duration - 0.9, emphasisWord.start - start));
  const entranceOffset = Math.max(0.12, Number((localEmphasis - 0.22).toFixed(3)));
  const holdDuration = Number(Math.max(1.1, duration - localEmphasis - 0.42).toFixed(3));
  const exitOffset = Number(Math.max(localEmphasis + 0.75, duration - 0.36).toFixed(3));

  return {
    timingSource: hasExactWords ? 'exact_word_timestamps' : hasExplicitWindow ? 'phrase_timestamps' : 'estimated_cadence',
    startTime: Number(start.toFixed(3)),
    endTime: Number((start + duration).toFixed(3)),
    duration: Number(duration.toFixed(3)),
    emphasisWord: emphasisWord.word,
    emphasisOffset: Number(localEmphasis.toFixed(3)),
    emphasisTime: Number((start + localEmphasis).toFixed(3)),
    entranceOffset,
    entranceTime: Number((start + entranceOffset).toFixed(3)),
    holdDuration,
    exitOffset,
    exitTime: Number((start + exitOffset).toFixed(3)),
    speakingIntervals: words.length
      ? [{ start: Number((start + 0.1).toFixed(3)), end: Number((start + duration - 0.32).toFixed(3)) }]
      : [],
    words: wordTimings,
  };
}

/**
 * Semantic classifier: determines WHAT is being said, WHAT it means, emotional tone,
 * polarity, beat type, and primary visual subject — distinguishing context like:
 *  - "You just made one million dollars" -> financial_gain (excited)
 *  - "You lost one million dollars"      -> financial_loss (shocked / disappointed)
 *  - "You owe one million dollars"       -> financial_debt (worried)
 *  - "You wish you had one million..."   -> financial_ambition (determined)
 */
export function classifyNarrativeSemantics(text = '', index = 0, totalBeats = 1) {
  const raw = String(text || '').trim();
  const s = raw.toLowerCase();
  const entity = extractFinancialEntity(raw);

  const isQuestion = /\?\s*$/.test(raw) || /^(what if|imagine if|have you ever|how would|what would|why do)/i.test(s);
  const mentionsMoney = Boolean(
    entity && !entity.isTimeframe && !entity.isPercent
  ) || /(money|dollar|dollars|million|millionaire|billion|salary|income|bank|balance|cash|wealth|savings|rent|spend|debt|owe|profit|loss|budget|invest|nine zeros|9 zeros)/.test(s);

  const hasLossVerb = /\b(lost|lose|losing|wiped out|vanished|disappeared|crashed|dropped|gone|bankrupt|blew)\b/.test(s);
  const hasDebtVerb = /\b(owe|owed|owing|debt|loan|bill|bills|overdue|behind on|trapped in debt)\b/.test(s);
  const hasWishVerb = /\b(wish|dream|dreaming|want to become|goal is|hoping|aspire|target is|imagine becoming|striving)\b/.test(s);
  const hasGainVerb = /\b(just made|made|earned a million|hit|reached|verified|deposited|won|achieved|grew|growing|compounding|crossed|shows \$|shows one million|nine zeros)\b/.test(s);
  const hasExpenseVerb = /\b(spend|spent|spending|pay for|rent|mortgage|groceries|expenses|cost you|costs)\b/.test(s);
  const hasProblemSignal = /(here'?s the problem|\bbig problem\b|\bone problem\b|\bcatch is\b|\btrap\b|\bmistake\b|\bfailing\b|\bstuck\b|stops working|real obstacle|\bwarning\b|\brisk\b)/.test(s);
  const hasTwistSignal = /\b(suddenly|plot twist|unexpected|overnight|turns out|nobody expected|without warning|everything changed)\b/.test(s);
  const hasDecisionSignal = /\b(decided|decision|choose|choice|commit|walked away|changed strategy|started building|pivoted)\b/.test(s);
  const hasWalkSignal = /\b(walk|walking|stepped|steps onto|enter the room|head into|pace)\b/.test(s);
  const hasPhoneInteraction = /\b(smartphone|phone|tap|tapped|unlocked|unlock|notification|dynamic island|screen|bank account|checked the balance|check your balance|app)\b/.test(s);
  const hasCar = /\b(sports car|supercar|ferrari|lamborghini|porsche|garage|driveway|car)\b/.test(s);
  const hasJet = /\b(private jet|jet|hangar|tarmac|aircraft|airplane|aviation|fly private)\b/.test(s);
  const hasMansion = /\b(mansion|villa|estate|penthouse|hillside house)\b/.test(s);
  const hasCountdown = Boolean(entity?.isTimeframe) || /(only \d+ days|\bcountdown\b|running out of time|\bdeadline\b|days left)/.test(s);

  // 1. Sports car reveal
  if (hasCar) {
    const isPurchase = /(buy|bought|paid|brand-new|brand new|keys|own)/.test(s);
    return {
      beatType: 'object_reveal',
      intent: 'object_sports_car',
      meaning: isPurchase ? 'Luxury sports car acquisition & milestone reveal' : 'Sports car visual spotlight',
      emotionalTone: 'excited',
      polarity: 'positive',
      intensity: 'strong',
      subjectTarget: 'sports_car',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Spotlight the sports car with character gaze and spec price tag',
    };
  }

  // 2. Private jet reveal
  if (hasJet) {
    return {
      beatType: 'object_reveal',
      intent: 'object_private_jet',
      meaning: 'Private jet scale reveal & time-freedom elevation',
      emotionalTone: 'proud',
      polarity: 'positive',
      intensity: 'strong',
      subjectTarget: 'private_jet',
      secondaryTarget: 'character',
      wantsMotionWalk: hasWalkSignal,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Track toward the private jet on the hangar tarmac with wide establishing reveal',
    };
  }

  // 3. Mansion reveal
  if (hasMansion) {
    return {
      beatType: 'object_reveal',
      intent: 'object_mansion',
      meaning: 'Luxury real-estate milestone reveal',
      emotionalTone: 'proud',
      polarity: 'positive',
      intensity: 'medium',
      subjectTarget: 'mansion',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Frame hillside mansion estate with character presenting',
    };
  }

  // 4. Contextual Money Disambiguation (Expense vs Loss vs Debt vs Wish/Ambition vs Balance vs Gain vs Salary)
  if (mentionsMoney && hasExpenseVerb) {
    return {
      beatType: hasProblemSignal ? 'conflict' : 'financial_info',
      intent: 'financial_expense',
      meaning: `Monthly expense drain${entity ? ` (${entity.formatted})` : ''}`,
      emotionalTone: hasProblemSignal ? 'frustrated' : 'worried',
      polarity: 'negative',
      intensity: 'medium',
      subjectTarget: 'financial_popup',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Break down recurring expenses visually with restrained cautionary framing',
    };
  }

  if (mentionsMoney && hasLossVerb) {
    return {
      beatType: hasTwistSignal ? 'twist' : 'consequence',
      intent: 'financial_loss',
      meaning: `Major financial loss${entity ? ` (${entity.formatted})` : ''}`,
      emotionalTone: 'shocked',
      polarity: 'negative',
      intensity: 'strong',
      subjectTarget: 'financial_popup',
      secondaryTarget: 'character_face',
      wantsMotionWalk: false,
      wantsPhoneInteraction: hasPhoneInteraction,
      entity,
      visualSummary: 'Show financial loss alert while character reacts with shock and disappointment',
    };
  }

  if (mentionsMoney && hasDebtVerb) {
    return {
      beatType: 'conflict',
      intent: 'financial_debt',
      meaning: `Financial debt obligation${entity ? ` (${entity.formatted})` : ''}`,
      emotionalTone: 'worried',
      polarity: 'negative',
      intensity: 'medium',
      subjectTarget: 'financial_popup',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: hasPhoneInteraction,
      entity,
      visualSummary: 'Display debt warning graphic as character shows worried tension',
    };
  }

  if (mentionsMoney && hasWishVerb) {
    return {
      beatType: 'financial_info',
      intent: 'financial_ambition',
      meaning: `Ambition and financial target${entity ? ` (${entity.formatted})` : ''}`,
      emotionalTone: 'determined',
      polarity: 'aspirational',
      intensity: 'medium',
      subjectTarget: 'financial_popup',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Character looks upward with determination toward the animated wealth target',
    };
  }

  if (hasPhoneInteraction && (mentionsMoney || /(balance|account|alert|confirm|tap)/.test(s))) {
    const isBillion = entity && entity.value >= 1_000_000_000;
    const isMillion = entity && entity.value >= 1_000_000;
    return {
      beatType: isBillion || isMillion ? 'object_reveal' : 'financial_info',
      intent: 'financial_balance',
      meaning: isBillion
        ? 'Nine-zeros bank balance breakthrough on smartphone'
        : isMillion
          ? 'Seven-figure bank account balance verification'
          : 'Checking smartphone bank balance & notification',
      emotionalTone: isBillion || isMillion ? 'excited' : 'curious',
      polarity: 'positive',
      intensity: isBillion || isMillion ? 'strong' : 'medium',
      subjectTarget: 'smartphone',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: true,
      entity,
      visualSummary: 'Track into the smartphone display to highlight the live balance update',
    };
  }

  if (mentionsMoney && /(savings|growing|grow|compound|investment|invest|roi|chart|rising)/.test(s)) {
    return {
      beatType: 'financial_info',
      intent: 'financial_growth',
      meaning: `Compounding savings & investment growth${entity ? ` (${entity.formatted})` : ''}`,
      emotionalTone: 'confident',
      polarity: 'positive',
      intensity: 'medium',
      subjectTarget: 'financial_popup',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Animate rising savings growth chart while character presents confidently',
    };
  }

  if (mentionsMoney && /(just|only|salary|a month|per month|monthly|starting|2,000|2000|paycheck)/.test(s) && (!entity || entity.value < 100_000)) {
    return {
      beatType: index === 0 ? 'hook' : 'financial_info',
      intent: 'financial_salary',
      meaning: `Limited monthly income baseline${entity ? ` (${entity.formatted}/mo)` : ''}`,
      emotionalTone: index === 0 ? 'curious' : 'thinking',
      polarity: 'neutral',
      intensity: 'subtle',
      subjectTarget: hasPhoneInteraction ? 'smartphone' : 'financial_popup',
      secondaryTarget: 'character',
      wantsMotionWalk: hasWalkSignal,
      wantsPhoneInteraction: hasPhoneInteraction,
      entity: entity || { value: 2000, formatted: '$2,000', period: 'MONTH', raw: '$2,000' },
      visualSummary: 'Show monthly salary card while character gestures calmly toward the figure',
    };
  }

  if (mentionsMoney && (hasGainVerb || (entity && entity.value >= 100_000))) {
    return {
      beatType: 'emotional_reaction',
      intent: 'financial_gain',
      meaning: `Major financial breakthrough${entity ? ` (${entity.formatted})` : ''}`,
      emotionalTone: 'excited',
      polarity: 'positive',
      intensity: 'strong',
      subjectTarget: 'financial_popup',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: hasPhoneInteraction,
      entity,
      visualSummary: 'Celebrate the financial milestone with animated counter and energetic acting',
    };
  }

  // 5. Problem / Conflict / Twist / Countdown
  if (hasProblemSignal) {
    return {
      beatType: 'conflict',
      intent: 'narrative_problem',
      meaning: 'Introducing a critical obstacle or tension point',
      emotionalTone: 'serious',
      polarity: 'negative',
      intensity: 'strong',
      subjectTarget: 'character_face',
      secondaryTarget: 'financial_popup',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Leave decorative visuals and push cleanly onto the character’s serious reaction',
    };
  }

  if (hasCountdown) {
    return {
      beatType: 'conflict',
      intent: 'financial_countdown',
      meaning: `Time-sensitive deadline${entity ? ` (${entity.formatted})` : ''}`,
      emotionalTone: 'nervous',
      polarity: 'negative',
      intensity: 'medium',
      subjectTarget: 'financial_popup',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Display countdown timeline card with focused urgency',
    };
  }

  if (hasTwistSignal) {
    return {
      beatType: 'twist',
      intent: 'narrative_twist',
      meaning: 'Unexpected narrative turn requiring visual punctuation',
      emotionalTone: 'surprised',
      polarity: 'dramatic',
      intensity: 'strong',
      subjectTarget: 'character_face',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Snap attention to character reaction with controlled dramatic push-in',
    };
  }

  // 6. Smartphone without explicit money
  if (hasPhoneInteraction) {
    return {
      beatType: 'object_reveal',
      intent: 'object_smartphone',
      meaning: 'Direct smartphone interaction or notification check',
      emotionalTone: 'curious',
      polarity: 'neutral',
      intensity: 'medium',
      subjectTarget: 'smartphone',
      secondaryTarget: 'character',
      wantsMotionWalk: false,
      wantsPhoneInteraction: true,
      entity,
      visualSummary: 'Focus on smartphone interaction and Dynamic Island alert',
    };
  }

  // 7. Decision
  if (hasDecisionSignal) {
    return {
      beatType: 'decision',
      intent: 'narrative_decision',
      meaning: 'Character makes a pivotal strategic decision',
      emotionalTone: 'determined',
      polarity: 'positive',
      intensity: 'medium',
      subjectTarget: 'character',
      secondaryTarget: 'character_face',
      wantsMotionWalk: hasWalkSignal,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Frame character confidently during turning-point decision',
    };
  }

  // 8. Audience engagement question or conclusion
  if (isQuestion && index >= Math.max(1, totalBeats - 1)) {
    return {
      beatType: 'audience_question',
      intent: 'narrative_question',
      meaning: 'Closing direct question to engage the viewer',
      emotionalTone: 'curious',
      polarity: 'positive',
      intensity: 'subtle',
      subjectTarget: 'character',
      secondaryTarget: 'character_face',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Direct audience-facing gaze with open, inviting framing and breathing room',
    };
  }

  if (isQuestion) {
    return {
      beatType: index === 0 ? 'hook' : 'question',
      intent: 'narrative_question',
      meaning: 'Engaging question to spark viewer curiosity',
      emotionalTone: 'curious',
      polarity: 'neutral',
      intensity: 'subtle',
      subjectTarget: 'character',
      secondaryTarget: 'character_face',
      wantsMotionWalk: hasWalkSignal,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Audience-facing curiosity beat with gentle push-in',
    };
  }

  if (index === totalBeats - 1 && totalBeats > 2) {
    return {
      beatType: 'conclusion',
      intent: 'narrative_conclusion',
      meaning: 'Story resolution and takeaway reflection',
      emotionalTone: 'relieved',
      polarity: 'positive',
      intensity: 'subtle',
      subjectTarget: 'character',
      secondaryTarget: 'character_face',
      wantsMotionWalk: false,
      wantsPhoneInteraction: false,
      entity,
      visualSummary: 'Calm audience-facing wrap-up with gentle camera drift',
    };
  }

  return {
    beatType: index === 0 ? 'introduction' : 'explanation',
    intent: 'narrative_explanation',
    meaning: 'Explanatory narrative progression',
    emotionalTone: hasWalkSignal ? 'confident' : 'thinking',
    polarity: 'neutral',
    intensity: 'subtle',
    subjectTarget: 'character',
    secondaryTarget: 'character',
    wantsMotionWalk: hasWalkSignal,
    wantsPhoneInteraction: false,
    entity,
    visualSummary: 'Natural presenter framing with purposeful explanatory gesture',
  };
}

/**
 * Analyze a full narration script (string OR array of timestamped cues) into ordered semantic beats.
 */
export function analyzeNarrationScript(input) {
  let rawEntries = [];
  if (Array.isArray(input)) {
    rawEntries = input
      .filter((item) => item && String(item.text || item.narration || '').trim())
      .map((item) => ({
        text: String(item.text || item.narration).trim(),
        explicitCue: item,
      }));
  } else {
    const clauses = segmentNarrationIntoClauses(String(input || ''));
    rawEntries = clauses.map((text) => ({ text, explicitCue: null }));
  }

  const beats = [];
  let cursor = 0;

  for (let i = 0; i < rawEntries.length; i++) {
    const { text, explicitCue } = rawEntries[i];
    const timing = buildPhraseTiming(text, cursor, explicitCue);
    const semantics = classifyNarrativeSemantics(text, i, rawEntries.length);

    beats.push({
      id: explicitCue?.id || `nbeat_${i + 1}_${semantics.intent}`,
      index: i + 1,
      narration: text,
      timing,
      ...semantics,
    });

    cursor = timing.endTime;
  }

  return {
    beats,
    totalDuration: Number(cursor.toFixed(3)),
    beatCount: beats.length,
  };
}
