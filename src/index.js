export { PuppetEngine } from './core/puppet-engine.js';
export { PuppetCharacter } from './core/puppet-character.js';
export { PuppetSkeleton } from './rig/skeleton.js';
export { PuppetPart } from './rig/part.js';
export { Timeline } from './animation/timeline.js';
export { AnimationLibrary } from './animation/library.js';
export { AnimationController } from './animation/animation-controller.js';
export { ViewAdapter, createViewAdapter } from './animation/view-adapter.js';
export { ExpressionController } from './animation/expression/expression-controller.js';
export { BlinkController } from './animation/expression/blink-controller.js';
export { EXPRESSION_PRESETS, EXPRESSION_NAMES } from './animation/expression/expression-presets.js';
export { createGazeController } from './animation/gaze-controller.js';
export {
  MOTION_DEFINITIONS,
  COMBINED_PRESETS,
  UNSUPPORTED_MOTIONS,
  listMotions,
  listExpressions,
  listPresets,
} from './animation/catalog.js';
export { loadCharacterImage, createPartTexture } from './assets/image-loader.js';

// 2.5D Environment & Background Template System
export {
  ENVIRONMENT_PALETTES,
  PALETTE_LIST,
  OutlineStyleSystem,
  StylizedLightingController,
} from './environment/style-system.js';
export {
  ENVIRONMENT_CATEGORIES,
  ENVIRONMENT_TEMPLATES,
  ENVIRONMENT_TEMPLATE_LIST,
  buildEnvironmentTemplate,
} from './environment/templates.js';
export {
  COMPOSITION_PRESETS,
  COMPOSITION_PRESET_LIST,
  EnvironmentAnimationController,
  SceneCompositionDirector,
  EnvironmentComposer,
} from './environment/environment-composer.js';
export {
  CartoonSmartphoneAsset,
  DYNAMIC_ISLAND_STATES,
} from './environment/props/smartphone.js';

// Deterministic Motion Graphics, Effects, Transitions & Sound Hooks
export {
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
} from './motion-graphics/effects.js';
export {
  MOTION_GRAPHIC_CATEGORIES,
  GRAPHIC_THEMES,
  GRAPHIC_THEME_LIST,
  MOTION_GRAPHIC_TEMPLATES,
  MOTION_GRAPHIC_TEMPLATE_LIST,
  createMotionGraphicConfig,
} from './motion-graphics/templates.js';
export {
  MotionGraphicsRenderer,
  evaluateMotionGraphicFrame,
} from './motion-graphics/renderer.js';
export {
  SOUND_CUE_CATEGORIES,
  SOUND_CUE_IDS,
  SoundEventController,
} from './audio/sound-events.js';

// Story Director, Camera Choreography & Narration-to-Visual Mapper
export {
  CameraChoreographyController,
  NarrationVisualMapper,
  DEMO_STORY_BEATS,
  DEMO_STORY_TOTAL_DURATION,
  StoryVisualDirector,
} from './director/story-director.js';

// Cinematic Camera Preset & Movement System (66 Presets, 14 Transitions, 22 Compositions, 16 Effects, 5 Combinations)
export { buildCameraShowcaseScene } from './environment/camera-showcase.js';
export {
  CAMERA_EASINGS,
  CAMERA_EASING_LIST,
  resolveEasing,
  CAMERA_COMPOSITION_CATEGORIES,
  CAMERA_COMPOSITIONS,
  CAMERA_COMPOSITION_LIST,
  CAMERA_EFFECT_DEFINITIONS,
  CAMERA_EFFECT_LIST,
  evaluateCameraMovementEffects,
  evaluateCameraVisualEffects,
  renderCameraVisualEffects,
} from './camera/compositions-and-effects.js';
export {
  CAMERA_PRESET_CATEGORIES,
  CAMERA_PRESETS,
  CAMERA_PRESET_LIST,
  DEFAULT_BASE_FRAME,
  sanitizeCameraState,
  evaluateCameraPreset,
} from './camera/presets.js';
export {
  CAMERA_TRANSITIONS,
  CAMERA_TRANSITION_LIST,
  evaluateCameraTransition,
  CAMERA_COMBINATIONS,
  CAMERA_COMBINATION_LIST,
  evaluateCameraCombination,
} from './camera/transitions-and-combos.js';
export {
  DEFAULT_SHOWCASE_TARGETS,
  SHOWCASE_TARGET_LIST,
  SubjectTargetRegistry,
  CameraTimeline,
  CameraChoreographyDirector,
} from './camera/subject-tracker.js';

// Narrative-Driven Video Logic Engine
export {
  STORY_BEAT_TYPES,
  SEMANTIC_INTENTS,
  extractFinancialEntity,
  segmentNarrationIntoClauses,
  buildPhraseTiming,
  classifyNarrativeSemantics,
  analyzeNarrationScript,
} from './narrative/beat-analyzer.js';
export {
  NARRATIVE_EXPRESSION_MAP,
  NARRATIVE_EMOTION_NAMES,
  GESTURE_CATEGORY_LIBRARY,
  POPUP_CATEGORIES,
  resolveGazeForTarget,
  CharacterActingDirector,
  SemanticPopupDirector,
  SmartCameraHighlightDirector,
  BackgroundResponseDirector,
  buildVisualHierarchy,
} from './narrative/acting-popup-camera-directors.js';
export {
  PRIORITY_RANK,
  NARRATIVE_DEMO_SCRIPT,
  SEMANTIC_CONTRAST_PRESETS,
  resolveStoryConflicts,
  NarrativeToVisualDirector,
  NarrativeTimelineEvaluator,
} from './narrative/narrative-director.js';

// SFX Preset Library, Intelligent Sound Director, 6-Bus Mixer & WAV Renderer
export {
  SFX_CATEGORIES,
  AUDIO_BUS_DEFAULTS,
  BUILTIN_SFX_PRESETS,
  BUILTIN_SFX_COMBINATIONS,
  SFXPresetRegistry,
} from './audio/sfx-presets.js';
export {
  scoreSoundCandidate,
  SFXDirector,
  SFXValidator,
} from './audio/sfx-director.js';
export {
  generatePresetWaveform,
  synthesizePresetSamples,
  SFXBusManager,
  SFXEventScheduler,
  SFXPreviewController,
  renderSFXTimelineToWav,
} from './audio/sfx-engine.js';



