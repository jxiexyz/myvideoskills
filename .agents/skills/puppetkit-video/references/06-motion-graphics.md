# 06 — Motion Graphics, Popups & Visual Effects

PuppetKit includes a high-DPI 2D canvas overlay engine for rendering animated data cards, financial callouts, milestone popups, and typographic titles composited directly above the Three.js stage.

---

## 52 Motion Graphic Templates by Category

### 1. Typography & Titles (12 templates)
- `bold_title_header`, `minimal_caption`, `split_headline`, `quote_callout`, `statement_banner`, `subtle_footer_note`, `chapter_slate`, `kinetic_emphasis_words`, `side_badge_title`, `counter_label_hero`, `punchy_one_word`, `dialogue_box`

### 2. Info Graphics & Lists (12 templates)
- `bullet_checklist`, `numbered_step_card`, `comparison_dual_column`, `progress_bar_horizontal`, `pie_chart_callout`, `bar_comparison_chart`, `timeline_node_badge`, `feature_grid_card`, `warning_caution_box`, `statistic_callout`, `key_takeaway_pill`, `pro_con_card`

### 3. Financial & Money (12 templates)
- `salary_monthly_card` (e.g. `$2,000 / month`), `million_dollar_badge` (`$1,000,000`), `nine_zeros_milestone`, `debt_deficit_banner`, `roi_growth_badge`, `crypto_coin_tracker`, `bank_account_balance`, `cash_flow_counter`, `spending_breakdown`, `wealth_target_progress`, `compound_interest_curve`, `financial_freedom_stamp`

### 4. Object-Connected 3D Callouts (6 templates)
- `pointer_callout_left`, `pointer_callout_right`, `pin_spec_sheet` (e.g. Sports car specs, Jet speed), `floating_anchor_label`, `focus_bracket_card`, `target_reticle_spec`

### 5. Smartphone & Dynamic Island Alerts (10 templates)
- `phone_push_notification`, `phone_bank_transfer_alert`, `phone_sms_preview`, `phone_incoming_call_card`, `phone_stock_gain_alert`, `dynamic_island_transfer_pill`, `dynamic_island_music_pill`, `dynamic_island_faceid_check`, `dynamic_island_charge_alert`, `dynamic_island_critical_warn`

---

## 6 Visual Themes

Managed via `GRAPHIC_THEMES` in `src/motion-graphics/templates.js`:
- `emeraldWealth` (financial gains, investments)
- `coralDanger` (losses, debts, risks)
- `cyberNeon` (technology, data, fintech)
- `monochromeMinimal` (clean editorial titles)
- `sunsetGold` (luxury, milestones, celebration)
- `oceanCorporate` (trust, business, corporate metrics)

---

## Effects & Transitions

Timestamp-driven pure evaluators in `src/motion-graphics/effects.js`:
- **12 Entrance Effects**: `popScale`, `slideUpFade`, `slideInLeft`, `slideInRight`, `bounceDrop`, `whipIn`, `zoomOvershoot`, `flipReveal`, `expandHorizontal`, `fadeGlitch`, `typewriterStagger`, `splitUnfold`.
- **10 Impact Effects**: `screenFlash`, `badgeJolt`, `glowBurst`, `stampSlam`, `elasticPing`, `coinScatter`, `shakeGlitch`, `borderPulse`, `sparkleShower`, `soundSyncJolt`.
- **10 Continuous Effects**: `subtleFloat`, `pulseGlow`, `gentleBob`, `breathingScale`, `shimmerSweep`, `radarPing`, `counterIncrement`, `tetherElasticWiggle`, `shadowShift`, `orbitingSparks`.
- **8 Exit Effects**: `fadeDown`, `zoomShrink`, `slideOutRight`, `slideOutLeft`, `snapCollapse`, `smokeDissolve`, `disperseParticles`, `quickCut`.
- **10 Graphic Transitions**: `crossDissolve`, `whipWipe`, `radialUnmask`, `curtainClose`, `boxSqueeze`, `digitalShatter`, `cardFlipTransition`, `slidePush`, `flashTransition`, `irisClose`.

---

## Programmatic Usage

```javascript
import {
  MotionGraphicsRenderer,
  createMotionGraphicConfig,
  evaluateMotionGraphicFrame
} from './src/index.js';

// 1. Create a template instance with custom copy & timing:
const config = createMotionGraphicConfig('salary_monthly_card', {
  content: '$5,000 / MO',
  subtitle: 'MONTHLY REVENUE',
  theme: 'emeraldWealth',
  position: 'top_right',
  entrance: 'popScale',
  duration: 4.0
});

// 2. Evaluate at timestamp t:
const mgFrame = evaluateMotionGraphicFrame(config, 1.5, { screenWidth: 1080, screenHeight: 1920 });

// 3. Render onto an overlay 2D canvas:
const renderer = new MotionGraphicsRenderer(canvas2D);
renderer.render(mgFrame);
```

---

## Key Files
- Templates & Themes: `src/motion-graphics/templates.js`
- Timestamp Evaluators: `src/motion-graphics/effects.js`
- 2D Canvas Renderer: `src/motion-graphics/renderer.js`
- Doc: `docs/PRODUCTION_TOOLKIT.md`
