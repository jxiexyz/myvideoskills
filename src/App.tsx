import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Eye,
  Grid2x2,
  LayoutGrid,
  Layers,
  Crosshair,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  User,
  Mountain,
  Sparkles,
  Clapperboard,
  Camera,
  BookOpen,
  AudioWaveform,
} from 'lucide-react';
import { PuppetEngine } from './core/puppet-engine.js';
import { PuppetCharacter } from './core/puppet-character.js';
import {
  listExpressions,
  listMotions,
  listPresets,
  UNSUPPORTED_MOTIONS,
} from './animation/catalog.js';
import { mainCharacterManifest } from '../assets/characters/main-character/manifest.js';
import { minimalStarterManifest } from '../assets/characters/minimal-starter/manifest.js';
import {
  ToolbarViewSwitcher,
  ViewPresetPanel,
  type ViewId,
  type ViewOptionMeta,
} from './components/MultiViewControls';
import {
  MultiViewSheet,
  type MultiViewTile,
} from './components/MultiViewSheet';
import {
  EnvironmentComposer,
  SceneCompositionDirector,
  COMPOSITION_PRESETS,
} from './environment/environment-composer.js';
import { ENVIRONMENT_TEMPLATES } from './environment/templates.js';
import { MotionGraphicsRenderer } from './motion-graphics/renderer.js';
import { createMotionGraphicConfig } from './motion-graphics/templates.js';
import { SoundEventController } from './audio/sound-events.js';
import {
  StoryVisualDirector,
  NarrationVisualMapper,
  DEMO_STORY_TOTAL_DURATION,
  CameraChoreographyController,
} from './director/story-director.js';
import {
  EnvironmentPreviewLab,
  type EnvironmentLabState,
} from './components/EnvironmentPreviewLab';
import {
  MotionGraphicsLab,
  type MotionGraphicLabConfig,
} from './components/MotionGraphicsLab';
import { StoryDirectorPanel } from './components/StoryDirectorPanel';
import {
  CameraPreviewLab,
  type CameraLabState,
  type CameraTelemetry,
} from './components/CameraPreviewLab';
import {
  DEFAULT_BASE_FRAME,
  evaluateCameraPreset,
} from './camera/presets.js';
import {
  evaluateCameraCombination,
  evaluateCameraTransition,
} from './camera/transitions-and-combos.js';
import { SubjectTargetRegistry } from './camera/subject-tracker.js';
import {
  NarrativeLogicLab,
  type NarrativeLayerToggles,
} from './components/NarrativeLogicLab';
import { SFXStudioLab } from './components/SFXStudioLab';
import {
  NarrativeToVisualDirector,
  NarrativeTimelineEvaluator,
  NARRATIVE_DEMO_SCRIPT,
} from './narrative/narrative-director.js';
import { SFXPresetRegistry } from './audio/sfx-presets.js';
import { SFXDirector, SFXValidator } from './audio/sfx-director.js';
import {
  SFXBusManager,
  SFXPreviewController,
  renderSFXTimelineToWav,
} from './audio/sfx-engine.js';

interface DebugLabel {
  name: string;
  x: number;
  y: number;
  rotationDeg: number;
}

interface HierarchyNode {
  name: string;
  parent: string | null;
  z: number;
  visible: boolean;
  children: HierarchyNode[];
}

interface LabChannelState {
  paused: boolean;
  speed: number;
  activeView?: string;
  view?: {
    activeView: string;
    availableViews: string[];
    isTransitioning: boolean;
    transitionProgress: number;
    faceVisible: boolean;
    showGround: boolean;
    framingConvention: string;
    label: string;
  };
  channels: {
    base: { id: string; label: string; phase?: number } | null;
    locomotion: { id: string; label: string; phase?: number } | null;
    head: { id: string; label: string; phase?: number } | null;
    gesture: { id: string; label: string; phase?: number } | null;
  };
  face: {
    expression: string;
    talking: boolean;
    autoBlink: boolean;
    isBlinking: boolean;
    faceVisible?: boolean;
    gaze: { x: number; y: number };
  };
}

interface ExpressionTile {
  id: string;
  label: string;
  dataUrl: string;
}

const CHARACTER_PACKS = {
  'main-character': {
    id: 'main-character',
    label: 'Main Character (Heroine)',
    manifest: mainCharacterManifest,
  },
  'minimal-starter': {
    id: 'minimal-starter',
    label: 'Minimal Starter (Demo Rig)',
    manifest: minimalStarterManifest,
  },
} as const;

type CharacterPackId = keyof typeof CHARACTER_PACKS;
type StudioWorkspace = 'character' | 'environments' | 'graphics' | 'camera' | 'story' | 'narrative' | 'sfx';
type InspectorTab = 'all' | 'motions' | 'expressions' | 'presets';
type FramingMode = 'fullBody' | 'faceCloseup';
type StageMode = 'stage' | 'sheet' | 'multiview';

const BASIC_MOTIONS = listMotions('basic');
const HEAD_MOTIONS = listMotions('head');
const GESTURE_MOTIONS = listMotions('gesture');
const REACTION_MOTIONS = listMotions('reaction');
const LOCOMOTION_MOTIONS = listMotions('locomotion');
const EXPRESSIONS = listExpressions();
const PRESETS = listPresets();

function HierarchyTree({ nodes, depth = 0 }: { nodes: HierarchyNode[]; depth?: number }) {
  return (
    <ul className={depth === 0 ? 'space-y-0.5' : 'pl-3 border-l border-slate-700/60 ml-1.5 space-y-0.5'}>
      {nodes.map((node) => (
        <li key={node.name}>
          <div className="flex items-center justify-between text-[11px] leading-4 text-slate-200 font-mono">
            <span className={node.visible ? 'text-slate-100' : 'text-slate-500'}>{node.name}</span>
            <span className="text-[10px] text-slate-400">z:{node.z}</span>
          </div>
          {node.children.length > 0 && <HierarchyTree nodes={node.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

function SupportDot({ status }: { status?: string }) {
  if (!status || status === 'native') return null;
  const cls =
    status === 'adapted'
      ? 'bg-sky-400'
      : status === 'limited'
        ? 'bg-amber-400'
        : 'bg-slate-500';
  return <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${cls}`} aria-hidden="true" />;
}

export default function App() {
  const stageMountRef = useRef<HTMLDivElement | null>(null);
  const mgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<any>(null);
  const characterRef = useRef<any>(null);
  const envComposerRef = useRef<any>(null);
  const mgRendererRef = useRef<any>(null);
  const soundRef = useRef<any>(null);
  const storyDirectorRef = useRef<any>(null);
  const lastUiSyncRef = useRef<number>(0);

  const [workspace, setWorkspace] = useState<StudioWorkspace>('character');
  const [packId, setPackId] = useState<CharacterPackId>('main-character');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);
  const [tab, setTab] = useState<InspectorTab>('all');
  const [framing, setFraming] = useState<FramingMode>('fullBody');
  const [viewMode, setViewMode] = useState<StageMode>('stage');
  const [rigDebug, setRigDebug] = useState(false);
  const [pointerGaze, setPointerGaze] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [loopOverride, setLoopOverride] = useState<boolean>(false);
  const [autoBlink, setAutoBlink] = useState(true);
  const [talking, setTalking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Multi-View state
  const [activeView, setActiveView] = useState<string>('front');
  const [availableViews, setAvailableViews] = useState<ViewOptionMeta[]>([]);
  const [viewTransitionMs, setViewTransitionMs] = useState<number>(250);
  const [viewBusy, setViewBusy] = useState(false);

  const [debugLabels, setDebugLabels] = useState<DebugLabel[]>([]);
  const [hierarchy, setHierarchy] = useState<HierarchyNode[]>([]);
  const [sheetTiles, setSheetTiles] = useState<ExpressionTile[]>([]);
  const [sheetBusy, setSheetBusy] = useState(false);

  // 4-Up Synchronized Multi-View Sheet state
  const [multiViewTiles, setMultiViewTiles] = useState<MultiViewTile[]>([]);
  const [multiViewBusy, setMultiViewBusy] = useState(false);
  const [multiViewScenario, setMultiViewScenario] = useState<string>('walkWaveHappy');
  const [multiViewPhase, setMultiViewPhase] = useState<number>(0.32);

  // 2.5D Environment Lab state
  const [envState, setEnvState] = useState<EnvironmentLabState>({
    templateId: 'luxury_driveway',
    paletteId: 'sunsetGold',
    detailLevel: 'high',
    lightingMood: 'warm',
    cameraMode: 'perspective25d',
    compositionId: 'object_focus',
    animateEnv: true,
    showCharacter: true,
    includeSmartphone: false,
    islandState: 'financial_alert',
    layers: {
      background: true,
      midground: true,
      interaction: true,
      foreground: true,
    },
  });

  // Motion Graphics Lab state
  const [mgConfig, setMgConfig] = useState<MotionGraphicLabConfig>(
    () => createMotionGraphicConfig('million_dollar_reveal') as MotionGraphicLabConfig
  );
  const [mgTime, setMgTime] = useState<number>(1.05);
  const [mgPlaying, setMgPlaying] = useState<boolean>(true);
  const [mgSpeed, setMgSpeed] = useState<number>(1.0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Story Director state
  const [storyTime, setStoryTime] = useState<number>(0.85);
  const [storyPlaying, setStoryPlaying] = useState<boolean>(true);
  const [storyActiveBeat, setStoryActiveBeat] = useState<number>(1);
  const [customNarrationBeat, setCustomNarrationBeat] = useState<any>(null);

  // Cinematic Camera Preview Lab state
  const [cameraLab, setCameraLab] = useState<CameraLabState>({
    mode: 'combo',
    presetId: 'cinematic_push_in',
    comboId: 'combo_sports_car_reveal',
    targetId: 'sports_car',
    compositionId: 'character_object_split',
    transitionId: 'cinematic_ease_transition',
    easing: 'easeInOutCubic',
    duration: 4.8,
    intensity: 1.0,
    compareStatic: false,
    showSafeFrame916: false,
    showDemoPopup: false,
    parallaxStrength: 1.0,
    effectOverrides: {},
  });
  const [cameraTime, setCameraTime] = useState<number>(1.35);
  const [cameraPlaying, setCameraPlaying] = useState<boolean>(true);
  const [cameraTelemetry, setCameraTelemetry] = useState<CameraTelemetry>({
    x: DEFAULT_BASE_FRAME.x,
    y: DEFAULT_BASE_FRAME.y,
    viewHeight: DEFAULT_BASE_FRAME.viewHeight,
    fov: 24,
    orbitYaw: 0,
  });

  const [labState, setLabState] = useState<LabChannelState>({
    paused: false,
    speed: 1,
    activeView: 'front',
    channels: { base: { id: 'idle', label: 'Idle' }, locomotion: null, head: null, gesture: null },
    face: { expression: 'neutral', talking: false, autoBlink: true, isBlinking: false, faceVisible: true, gaze: { x: 0, y: 0 } },
  });

  const rigDebugRef = useRef(rigDebug);
  rigDebugRef.current = rigDebug;
  const framingRef = useRef(framing);
  framingRef.current = framing;
  const viewTransitionMsRef = useRef(viewTransitionMs);
  viewTransitionMsRef.current = viewTransitionMs;

  const workspaceRef = useRef<StudioWorkspace>(workspace);
  workspaceRef.current = workspace;
  const envStateRef = useRef<EnvironmentLabState>(envState);
  envStateRef.current = envState;
  const mgConfigRef = useRef<MotionGraphicLabConfig>(mgConfig);
  mgConfigRef.current = mgConfig;
  const mgTimeRef = useRef<number>(mgTime);
  mgTimeRef.current = mgTime;
  const mgPlayingRef = useRef<boolean>(mgPlaying);
  mgPlayingRef.current = mgPlaying;
  const mgSpeedRef = useRef<number>(mgSpeed);
  mgSpeedRef.current = mgSpeed;
  const storyTimeRef = useRef<number>(storyTime);
  storyTimeRef.current = storyTime;
  const storyPlayingRef = useRef<boolean>(storyPlaying);
  storyPlayingRef.current = storyPlaying;
  const customNarrationRef = useRef<any>(customNarrationBeat);
  customNarrationRef.current = customNarrationBeat;
  const customTimeRef = useRef<number>(0);
  const envClockRef = useRef<number>(0);
  const activeStoryEnvKeyRef = useRef<string>('');
  const activeStoryBeatIdRef = useRef<string>('');

  const cameraLabRef = useRef<CameraLabState>(cameraLab);
  cameraLabRef.current = cameraLab;
  const cameraTimeRef = useRef<number>(cameraTime);
  cameraTimeRef.current = cameraTime;
  const cameraPlayingRef = useRef<boolean>(cameraPlaying);
  cameraPlayingRef.current = cameraPlaying;
  const cameraTelemetryRef = useRef<CameraTelemetry>(cameraTelemetry);
  const targetRegistryRef = useRef<any>(new SubjectTargetRegistry());
  const cameraDemoPopupRef = useRef<any>(
    createMotionGraphicConfig('million_dollar_reveal', {
      content: '$1,000,000',
      subtitle: 'CINEMATIC CAMERA DEMO POPUP',
      secondaryValue: 'NET WORTH',
      position: 'top_right',
      duration: 5.5,
    })
  );

  // Narrative-Driven Video Logic Engine & SFX Studio unified state
  const sfxRegistryRef = useRef<any>(null);
  if (!sfxRegistryRef.current) sfxRegistryRef.current = new SFXPresetRegistry();
  const sfxBusManagerRef = useRef<any>(null);
  if (!sfxBusManagerRef.current) sfxBusManagerRef.current = new SFXBusManager();
  const sfxDirectorRef = useRef<any>(null);
  if (!sfxDirectorRef.current) sfxDirectorRef.current = new SFXDirector(sfxRegistryRef.current);
  const sfxPreviewRef = useRef<any>(null);
  if (!sfxPreviewRef.current) sfxPreviewRef.current = new SFXPreviewController(sfxRegistryRef.current, sfxBusManagerRef.current);

  const [narrativeScriptText, setNarrativeScriptText] = useState<string>(
    NARRATIVE_DEMO_SCRIPT.map((b) => b.text).join(' ')
  );
  const [narrativeStoryboard, setNarrativeStoryboard] = useState<any>(() =>
    NarrativeToVisualDirector.generateStoryboard(NARRATIVE_DEMO_SCRIPT, {
      title: 'From $2,000/mo to Private Jet — Narrative Demo',
    })
  );
  const [sfxPlan, setSfxPlan] = useState<any>(() =>
    sfxDirectorRef.current.directFromStoryboard(
      NarrativeToVisualDirector.generateStoryboard(NARRATIVE_DEMO_SCRIPT, {
        title: 'From $2,000/mo to Private Jet — Narrative Demo',
      })
    )
  );
  const [sfxValidation, setSfxValidation] = useState<any>(() =>
    SFXValidator.validate(sfxPlan.events, sfxRegistryRef.current)
  );
  const [sfxBusState, setSfxBusState] = useState<any>(() => sfxBusManagerRef.current.getState());
  const [sfxRegistryRev, setSfxRegistryRev] = useState<number>(0);

  const [narrativeTime, setNarrativeTime] = useState<number>(0.85);
  const [narrativePlaying, setNarrativePlaying] = useState<boolean>(true);
  const [narrativeLayers, setNarrativeLayers] = useState<NarrativeLayerToggles>({
    character: true,
    gaze: true,
    popups: true,
    camera: true,
    background: true,
    sfx: true,
  });
  const [narrativeSnapshot, setNarrativeSnapshot] = useState<any>(() =>
    NarrativeTimelineEvaluator.evaluateAt(narrativeStoryboard, 0.85)
  );

  const narrativeStoryboardRef = useRef<any>(narrativeStoryboard);
  narrativeStoryboardRef.current = narrativeStoryboard;
  const sfxPlanRef = useRef<any>(sfxPlan);
  sfxPlanRef.current = sfxPlan;
  const narrativeTimeRef = useRef<number>(narrativeTime);
  narrativeTimeRef.current = narrativeTime;
  const narrativePlayingRef = useRef<boolean>(narrativePlaying);
  narrativePlayingRef.current = narrativePlaying;
  const narrativeLayersRef = useRef<NarrativeLayerToggles>(narrativeLayers);
  narrativeLayersRef.current = narrativeLayers;
  const narrativeSnapshotRef = useRef<any>(narrativeSnapshot);
  const activeNarrativeEnvKeyRef = useRef<string>('');
  const activeNarrativeBeatIdRef = useRef<string>('');

  const applyFraming = useCallback((mode: FramingMode, manifest: any) => {
    const engine = engineRef.current;
    if (!engine) return;
    const preset =
      manifest?.framing?.[mode] ||
      (mode === 'faceCloseup'
        ? { viewHeight: 0.56, cameraY: 0.52 }
        : { viewHeight: 2.05, cameraY: -0.02 });
    engine.setFraming(preset);
  }, []);

  const syncDebugLabels = useCallback(() => {
    const engine = engineRef.current;
    const char = characterRef.current;
    if (!engine || !char || !rigDebugRef.current || !stageMountRef.current) {
      setDebugLabels([]);
      return;
    }
    const rect = stageMountRef.current.getBoundingClientRect();
    const raw: DebugLabel[] = char.skeleton.getDebugScreenLabels(engine.camera, rect.width, rect.height);
    const midX = rect.width * 0.5;
    const deoverlap = (items: DebugLabel[]) => {
      items.sort((a, b) => a.y - b.y);
      let lastY = -Infinity;
      for (const item of items) {
        if (item.y - lastY < 20) item.y = lastY + 20;
        lastY = item.y;
      }
      return items;
    };
    const left = deoverlap(raw.filter((l) => l.x < midX).map((l) => ({ ...l })));
    const right = deoverlap(raw.filter((l) => l.x >= midX).map((l) => ({ ...l })));
    setDebugLabels([...left, ...right]);
  }, []);

  const loadCharacterPack = useCallback(
    async (nextPackId: CharacterPackId, nextFraming: FramingMode) => {
      const engine = engineRef.current;
      if (!engine) return;
      setLoading(true);
      setErrorMsg(null);
      setViewError(null);
      setActivePreset(null);

      try {
        if (characterRef.current) {
          engine.remove(characterRef.current);
          characterRef.current.dispose();
          characterRef.current = null;
        }

        const pack = CHARACTER_PACKS[nextPackId];
        const char = await PuppetCharacter.create({
          manifest: pack.manifest,
          worldHeight: 2.0,
          autoIdle: true,
          autoBlink: true,
        });

        characterRef.current = char;
        engine.add(char);
        const vs = char.getViewState();
        engine.setGroundVisible(vs.showGround, char.skeleton.getFloorWorldY());
        applyFraming(nextFraming, char.manifest);
        char.setDebugVisible(rigDebugRef.current, engine.scene);
        char.setSpeed(speed);
        char.setAutoBlink(autoBlink);
        engine.step(0);

        setActiveView(vs.activeView);
        setAvailableViews(char.listViews());
        setHierarchy(char.skeleton.getHierarchy());
        setLabState(char.getState());
        setTalking(false);
        setPaused(false);
        setSheetTiles([]);
        setMultiViewTiles([]);
        if (rigDebugRef.current) syncDebugLabels();
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to load character rig.');
      } finally {
        setLoading(false);
      }
    },
    [applyFraming, autoBlink, speed, syncDebugLabels]
  );

  // Apply active 2.5D environment configuration cleanly
  const syncEnvironmentToStage = useCallback((cfg: EnvironmentLabState) => {
    const engine = engineRef.current;
    const composer = envComposerRef.current;
    const char = characterRef.current;
    if (!engine || !composer) return;

    const info = composer.load(cfg.templateId, {
      paletteId: cfg.paletteId,
      detailLevel: cfg.detailLevel,
      lightingMood: cfg.lightingMood,
      includeSmartphone: cfg.includeSmartphone,
      smartphoneState: { islandState: cfg.islandState },
      timeSec: envClockRef.current,
    });
    composer.setLayerVisibility(cfg.layers);
    composer.setAnimationEnabled(cfg.animateEnv);

    engine.setBackground(info.backgroundHex || 0xf4f1ec);
    engine.setGroundVisible(false);
    engine.setCameraMode(cfg.cameraMode);

    const preset = COMPOSITION_PRESETS[cfg.compositionId as keyof typeof COMPOSITION_PRESETS] || COMPOSITION_PRESETS.center;
    engine.setCameraState(preset.camera);

    if (char) {
      char.root.visible = cfg.showCharacter;
      SceneCompositionDirector.applyToCharacter(char, cfg.compositionId);
    }
    engine.render();
  }, []);

  // Apply Story Director beat (environment + character action + camera + motion graphic)
  const applyStoryFrame = useCallback((tSec: number, triggerSound = false) => {
    const engine = engineRef.current;
    const composer = envComposerRef.current;
    const mgRenderer = mgRendererRef.current;
    const director = storyDirectorRef.current;
    const char = characterRef.current;
    if (!engine || !composer || !mgRenderer || !director) return;

    const customBeat = customNarrationRef.current;
    let activeBeat: any;
    let localTime = 0;
    let cameraState: any;
    let transitionOverride: any = null;
    let beatIdx = 1;

    if (customBeat) {
      activeBeat = customBeat;
      localTime = customTimeRef.current;
      cameraState = CameraChoreographyController.evaluate(customBeat.cameraMove, localTime, 4.5);
      beatIdx = 0;
    } else {
      const snap = director.evaluateAt(tSec);
      activeBeat = snap.beat;
      localTime = snap.localTime;
      cameraState = snap.camera;
      transitionOverride = snap.transitionOverride;
      beatIdx = snap.beatIndex;
    }

    const envKey = `${activeBeat.environmentId}:${activeBeat.paletteId}:${activeBeat.lightingMood}:${Boolean(activeBeat.includeSmartphone)}`;
    if (activeStoryEnvKeyRef.current !== envKey) {
      activeStoryEnvKeyRef.current = envKey;
      const info = composer.load(activeBeat.environmentId, {
        paletteId: activeBeat.paletteId,
        detailLevel: 'high',
        lightingMood: activeBeat.lightingMood || 'day',
        includeSmartphone: Boolean(activeBeat.includeSmartphone),
        smartphoneState: activeBeat.smartphoneState || null,
        timeSec: localTime,
      });
      composer.setLayerVisibility({ background: true, midground: true, interaction: true, foreground: true });
      composer.setAnimationEnabled(true);
      engine.setBackground(info.backgroundHex || 0x161b26);
      engine.setGroundVisible(false);
      engine.setCameraMode('perspective25d');
    }

    if (activeStoryBeatIdRef.current !== (activeBeat.id || activeBeat.label)) {
      activeStoryBeatIdRef.current = activeBeat.id || activeBeat.label;
      if (char && activeBeat.character) {
        char.root.visible = true;
        char.root.position.set(activeBeat.character.x ?? -0.8, activeBeat.character.y ?? 0, 0);
        char.root.scale.setScalar(activeBeat.character.scale ?? 0.96);
        if (activeBeat.character.motion) {
          try {
            char.play(activeBeat.character.motion, { transition: 0.14, loop: true });
          } catch {
            char.play('idle', { transition: 0.14, loop: true });
          }
        }
        if (activeBeat.character.expression) {
          char.expression(activeBeat.character.expression, { transition: 0.14 });
        }
        char.talk(Boolean(activeBeat.character.talking));
      }
      if (triggerSound && activeBeat.soundCue && soundRef.current) {
        soundRef.current.triggerOnce(`beat:${activeStoryBeatIdRef.current}`, activeBeat.soundCue);
      }
    }

    composer.evaluateAt(localTime);
    composer.applyCameraParallax(cameraState, 0.75);
    engine.setCameraState(cameraState);

    let anchorScreen = null;
    const anchorName = activeBeat.graphic?.anchorName;
    if (anchorName) {
      const worldPos = composer.getAnchorWorldPosition(anchorName);
      if (worldPos) anchorScreen = engine.worldToScreen(worldPos);
    }

    mgRenderer.render(activeBeat.graphic, localTime, {
      anchorScreen,
      caption: activeBeat.narration || activeBeat.label,
      transitionOverride,
      cameraFx: { subtleVignette: 0.28, progress: localTime / Math.max(0.5, activeBeat.duration || 4.5) },
    });

    return beatIdx;
  }, []);

  // Apply deterministic Cinematic Camera Lab frame (presets, combinations, transitions, parallax & FX)
  const applyCameraLabFrame = useCallback((tSec: number) => {
    const engine = engineRef.current;
    const composer = envComposerRef.current;
    const mgRenderer = mgRendererRef.current;
    if (!engine || !composer || !mgRenderer) return;

    const cfg = cameraLabRef.current;
    const reg = targetRegistryRef.current;
    const t = Math.max(0, Math.min(cfg.duration, tSec));

    let camState: any = DEFAULT_BASE_FRAME;
    let fxState: any = null;
    let phaseLabel: string | undefined;

    if (cfg.compareStatic) {
      camState = { ...DEFAULT_BASE_FRAME, x: 0.35, y: 0.2, viewHeight: 2.85 };
      fxState = null;
      phaseLabel = 'Static Baseline (Before)';
    } else if (cfg.mode === 'combo') {
      const evalCombo = evaluateCameraCombination(cfg.comboId, {
        time: t,
        duration: cfg.duration,
        intensity: cfg.intensity,
        resolveTarget: (id: string) => reg.resolveFraming(id, null),
        baseFrame: { ...DEFAULT_BASE_FRAME, x: 0.2, y: 0.18, viewHeight: 2.8 },
      });
      camState = evalCombo.camera;
      fxState = evalCombo.effects;
      phaseLabel = evalCombo.phaseLabel;
    } else {
      const targetFrame = reg.resolveFraming(cfg.targetId, cfg.compositionId);
      const activeOverrides: Record<string, number> = {};
      for (const [k, v] of Object.entries(cfg.effectOverrides || {})) {
        if (v) activeOverrides[k] = 1;
      }
      const evalPreset = evaluateCameraPreset(cfg.presetId, {
        time: t,
        duration: cfg.duration,
        intensity: cfg.intensity,
        easing: cfg.easing,
        startFrame: { ...DEFAULT_BASE_FRAME, x: 0.2, y: 0.18, viewHeight: 2.8 },
        targetFrame,
        characterFrame: reg.get('character'),
        compositionId: cfg.compositionId,
        effects: activeOverrides,
      });
      camState = evalPreset.camera;
      fxState = evalPreset.effects;

      // Apply selected entry camera transition over the first 0.45s for live transition preview
      if (t < 0.45 && cfg.transitionId && cfg.transitionId !== 'smooth_reframe') {
        const blended = evaluateCameraTransition(
          cfg.transitionId,
          { ...DEFAULT_BASE_FRAME, x: 0.2, y: 0.18, viewHeight: 2.8 },
          evalPreset.camera,
          t / 0.45,
          cfg.intensity
        );
        camState = blended.camera;
        fxState = { ...fxState, ...blended.effects };
      }
    }

    composer.evaluateAt(envClockRef.current);
    composer.applyCameraParallax(camState, cfg.compareStatic ? 0 : cfg.parallaxStrength);
    engine.setCameraState(camState);

    cameraTelemetryRef.current = {
      x: camState.x,
      y: camState.y,
      viewHeight: camState.viewHeight,
      fov: camState.fov ?? 24,
      orbitYaw: camState.orbitYaw ?? 0,
      phaseLabel,
    };

    mgRenderer.render(cfg.showDemoPopup ? cameraDemoPopupRef.current : null, t, {
      cameraFx: fxState,
      showSafeFrame916: cfg.showSafeFrame916,
    });
  }, []);

  // Apply deterministic Narrative-Driven Video Logic + Synchronized SFX frame
  const applyNarrativeFrame = useCallback((tSec: number, triggerAudio = false) => {
    const engine = engineRef.current;
    const composer = envComposerRef.current;
    const mgRenderer = mgRendererRef.current;
    const char = characterRef.current;
    const sb = narrativeStoryboardRef.current;
    if (!engine || !composer || !mgRenderer || !sb) return null;

    const layers = narrativeLayersRef.current;
    const snap = NarrativeTimelineEvaluator.evaluateAt(sb, tSec, {
      targetRegistry: targetRegistryRef.current,
      layerToggles: layers,
    });
    if (!snap) return null;

    const bg = snap.backgroundState;
    const envKey = `${bg.visible}:${bg.environmentId}:${bg.paletteId}:${bg.lightingMood}:${Boolean(bg.includeSmartphone)}`;
    if (activeNarrativeEnvKeyRef.current !== envKey) {
      activeNarrativeEnvKeyRef.current = envKey;
      if (bg.visible) {
        const info = composer.load(bg.environmentId, {
          paletteId: bg.paletteId || 'warmEditorial',
          detailLevel: 'high',
          lightingMood: bg.lightingMood || 'day',
          includeSmartphone: Boolean(bg.includeSmartphone),
          smartphoneState: bg.smartphoneState || null,
          timeSec: snap.localTime,
        });
        composer.setVisible(true);
        composer.setLayerVisibility({ background: true, midground: true, interaction: true, foreground: true });
        composer.setAnimationEnabled(true);
        engine.setBackground(info.backgroundHex || 0x161b26);
      } else {
        composer.setVisible(false);
        engine.setBackground(0x14171e);
      }
      engine.setGroundVisible(false);
      engine.setCameraMode('perspective25d');
    }

    if (char) {
      char.root.visible = Boolean(snap.characterState.visible);
      char.root.position.set(
        snap.characterState.position?.x ?? -0.70,
        snap.characterState.position?.y ?? 0,
        0
      );
      char.root.scale.setScalar(snap.characterState.position?.scale ?? 0.94);

      const beatKey = `${sb.title || ''}:${snap.event.id}:${snap.characterState.expression}:${snap.characterState.gesture || 'none'}:${snap.characterState.locomotion || 'none'}`;
      if (activeNarrativeBeatIdRef.current !== beatKey) {
        activeNarrativeBeatIdRef.current = beatKey;
        const tr = triggerAudio ? 0.14 : 0;
        char.controller.stopChannel('locomotion', { transition: tr });
        char.controller.stopChannel('gesture', { transition: tr });
        if (snap.characterState.locomotion) {
          try {
            char.play(snap.characterState.locomotion, {
              transition: tr,
              loop: snap.characterState.locomotion === 'walk',
            });
          } catch {
            // fallback cleanly
          }
        }
        if (snap.characterState.gesture) {
          try {
            char.play(snap.characterState.gesture, { channel: 'gesture', transition: tr, loop: true });
          } catch {
            char.play('explain', { channel: 'gesture', transition: tr, loop: true });
          }
        }
        if (snap.characterState.expression) {
          char.expression(snap.characterState.expression, {
            transition: triggerAudio ? (snap.characterState.expressionTransition ?? 0.18) : 0,
          });
        }
        // Advance pose/expression deterministically when paused/scrubbed so frame & HUD reflect new beat immediately
        if (!triggerAudio) {
          char.update(0.16);
          setLabState(char.getState());
        }
      }

      char.talk(Boolean(snap.characterState.talking));
      if (snap.characterState.gaze?.eye) {
        char.lookAt(snap.characterState.gaze.eye);
      }
      if (!triggerAudio) {
        char.update(0.016);
      }
    }

    targetRegistryRef.current.syncFromScene({
      anchors: composer.anchors,
      floorY: composer.floorY,
      characterPos: { x: snap.characterState.position?.x ?? -0.82, y: 0, z: 0 },
    });

    composer.evaluateAt(snap.localTime);
    composer.applyCameraParallax(snap.cameraState, layers.camera ? 0.72 : 0);
    engine.setCameraState(snap.cameraState);

    let anchorScreen = null;
    const anchorName = snap.popupState?.config?.anchorName;
    if (anchorName) {
      const worldPos = composer.getAnchorWorldPosition(anchorName);
      if (worldPos) anchorScreen = engine.worldToScreen(worldPos);
    }

    mgRenderer.render(snap.popupState ? snap.popupState.config : null, snap.popupState?.localPopupTime ?? snap.localTime, {
      anchorScreen,
      caption: snap.event.narration,
      transitionOverride: snap.transitionOverride,
      cameraFx: snap.cameraEffects,
    });

    if (triggerAudio && layers.sfx && sfxPreviewRef.current && sfxPlanRef.current) {
      sfxPreviewRef.current.tickTimeline(sfxPlanRef.current.events, tSec, {
        voiceActive: Boolean(snap.characterState.talking),
        silenceCues: sfxPlanRef.current.silenceCues || [],
      });
    }

    narrativeSnapshotRef.current = snap;
    return snap;
  }, []);

  // Initialize Three.js PuppetEngine + EnvironmentComposer + MotionGraphicsRenderer once
  useEffect(() => {
    const container = stageMountRef.current;
    if (!container) return;

    const engine = new PuppetEngine({
      container,
      background: 0xf4f1ec,
      antialias: true,
      viewHeight: 2.05,
      cameraY: -0.02,
      showGround: true,
      preserveDrawingBuffer: true,
    });
    engineRef.current = engine;

    const composer = new EnvironmentComposer(engine.scene, { floorY: -0.88 });
    envComposerRef.current = composer;

    const mgRenderer = new MotionGraphicsRenderer(mgCanvasRef.current);
    mgRendererRef.current = mgRenderer;

    const soundCtrl = new SoundEventController({ enabled: true, volume: 0.35 });
    soundRef.current = soundCtrl;

    const director = new StoryVisualDirector();
    storyDirectorRef.current = director;

    const resizeAll = () => {
      engine.resize();
      if (mgCanvasRef.current) {
        const dpr = engine.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        mgRenderer.resize(container.clientWidth || 640, container.clientHeight || 480, dpr);
      }
    };
    resizeAll();

    const unsub = engine.onUpdate((dt: number) => {
      const mode = workspaceRef.current;
      const now = performance.now();

      if (mode === 'environments') {
        if (envStateRef.current.animateEnv) {
          envClockRef.current += dt;
        }
        composer.evaluateAt(envClockRef.current);
        mgRenderer.clear();
      } else if (mode === 'graphics') {
        envClockRef.current += dt;
        composer.evaluateAt(envClockRef.current);
        if (mgPlayingRef.current) {
          const dur = mgConfigRef.current.duration || 4.2;
          mgTimeRef.current = (mgTimeRef.current + dt * mgSpeedRef.current) % dur;
        }
        let anchorScreen = null;
        if (mgConfigRef.current.anchorName) {
          const worldPos = composer.getAnchorWorldPosition(mgConfigRef.current.anchorName) || composer.getAnchorWorldPosition('hero');
          if (worldPos) anchorScreen = engine.worldToScreen(worldPos);
        }
        mgRenderer.render(mgConfigRef.current, mgTimeRef.current, { anchorScreen });
      } else if (mode === 'camera') {
        envClockRef.current += dt;
        if (cameraPlayingRef.current) {
          const dur = Math.max(0.5, cameraLabRef.current.duration || 4.8);
          cameraTimeRef.current = (cameraTimeRef.current + dt) % dur;
        }
        applyCameraLabFrame(cameraTimeRef.current);
      } else if (mode === 'story') {
        if (customNarrationRef.current) {
          if (storyPlayingRef.current) {
            customTimeRef.current = (customTimeRef.current + dt) % 4.6;
          }
          applyStoryFrame(storyTimeRef.current, false);
        } else {
          if (storyPlayingRef.current) {
            const nextT = storyTimeRef.current + dt;
            if (nextT >= DEMO_STORY_TOTAL_DURATION) {
              storyTimeRef.current = 0;
              soundCtrl.resetTimelineTriggers();
              activeStoryBeatIdRef.current = '';
            } else {
              storyTimeRef.current = nextT;
            }
          }
          const beatIdx = applyStoryFrame(storyTimeRef.current, storyPlayingRef.current);
          if (now - lastUiSyncRef.current >= 120 && beatIdx) {
            setStoryActiveBeat(beatIdx);
          }
        }
      } else if (mode === 'narrative' || mode === 'sfx') {
        const sb = narrativeStoryboardRef.current;
        const total = Math.max(0.5, sb?.totalDuration || 1);
        if (narrativePlayingRef.current) {
          const nextT = narrativeTimeRef.current + dt;
          if (nextT >= total) {
            narrativeTimeRef.current = 0;
            sfxPreviewRef.current?.scheduler?.reset();
            activeNarrativeBeatIdRef.current = '';
          } else {
            narrativeTimeRef.current = nextT;
          }
        }
        applyNarrativeFrame(narrativeTimeRef.current, narrativePlayingRef.current);
      } else {
        mgRenderer.clear();
      }

      if (now - lastUiSyncRef.current < 120) return;
      lastUiSyncRef.current = now;

      if (mode === 'graphics' && mgPlayingRef.current) {
        setMgTime(mgTimeRef.current);
      } else if (mode === 'camera') {
        if (cameraPlayingRef.current) setCameraTime(cameraTimeRef.current);
        setCameraTelemetry({ ...cameraTelemetryRef.current });
      } else if (mode === 'story' && storyPlayingRef.current && !customNarrationRef.current) {
        setStoryTime(storyTimeRef.current);
      } else if (mode === 'narrative' || mode === 'sfx') {
        if (narrativePlayingRef.current) setNarrativeTime(narrativeTimeRef.current);
        if (narrativeSnapshotRef.current) setNarrativeSnapshot(narrativeSnapshotRef.current);
      }

      const char = characterRef.current;
      if (!char) return;
      setLabState(char.getState());
      if (mode === 'character' && rigDebugRef.current && stageMountRef.current) {
        syncDebugLabels();
      }
    });

    engine.start();

    const ro = new ResizeObserver(() => resizeAll());
    ro.observe(container);

    loadCharacterPack('main-character', 'fullBody');

    return () => {
      ro.disconnect();
      unsub();
      soundCtrl.dispose();
      sfxPreviewRef.current?.dispose();
      composer.dispose();
      if (characterRef.current) {
        engine.remove(characterRef.current);
        characterRef.current.dispose();
        characterRef.current = null;
      }
      engine.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync stage whenever workspace or Environment Lab state changes
  useEffect(() => {
    const engine = engineRef.current;
    const composer = envComposerRef.current;
    const char = characterRef.current;
    const mgRenderer = mgRendererRef.current;
    if (!engine || !composer) return;

    if (workspace === 'character') {
      activeStoryEnvKeyRef.current = '';
      activeStoryBeatIdRef.current = '';
      composer.setVisible(false);
      mgRenderer?.clear();
      engine.setCameraMode('orthographic');
      engine.setBackground(0xf4f1ec);
      if (char) {
        char.root.visible = true;
        char.root.position.set(0, 0, 0);
        char.root.scale.setScalar(1);
        const vs = char.getViewState();
        engine.setGroundVisible(vs.showGround, char.skeleton.getFloorWorldY());
        applyFraming(framingRef.current, char.manifest);
      }
      engine.render();
    } else if (workspace === 'environments') {
      setViewMode('stage');
      activeStoryEnvKeyRef.current = '';
      activeStoryBeatIdRef.current = '';
      mgRenderer?.clear();
      syncEnvironmentToStage(envState);
    } else if (workspace === 'graphics') {
      setViewMode('stage');
      activeStoryEnvKeyRef.current = '';
      activeStoryBeatIdRef.current = '';
      // Auto-pick matching 2.5D backdrop for object callouts or clean studio stage
      const targetEnv = mgConfig.anchorName === 'car'
        ? 'luxury_driveway'
        : mgConfig.anchorName === 'jet'
          ? 'airport_hangar'
          : mgConfig.anchorName === 'phone'
            ? 'smartphone_hero_stage'
            : mgConfig.anchorName === 'vault'
              ? 'vault_wealth_room'
              : mgConfig.anchorName === 'mansion'
                ? 'luxury_mansion_exterior'
                : envState.templateId;
      const meta = ENVIRONMENT_TEMPLATES[targetEnv as keyof typeof ENVIRONMENT_TEMPLATES];
      syncEnvironmentToStage({
        ...envState,
        templateId: targetEnv,
        paletteId: meta?.defaultPalette || envState.paletteId,
        compositionId: mgConfig.anchorName ? 'object_focus' : 'left_anchored',
      });
    } else if (workspace === 'camera') {
      setViewMode('stage');
      activeStoryEnvKeyRef.current = '';
      activeStoryBeatIdRef.current = '';
      if (composer.activeTemplateId !== 'camera_showcase_set') {
        const info = composer.loadShowcase({
          paletteId: 'sunlitDay',
          lightingMood: 'day',
          timeSec: envClockRef.current,
        });
        composer.setLayerVisibility({ background: true, midground: true, interaction: true, foreground: true });
        composer.setAnimationEnabled(true);
        engine.setBackground(info.backgroundHex || 0x8cc8f2);
      }
      engine.setGroundVisible(false);
      engine.setCameraMode('perspective25d');
      if (char) {
        char.root.visible = true;
        char.root.position.set(-1.14, 0, 0);
        char.root.scale.setScalar(0.94);
        char.expression('happy', { transition: 0.14 });
        try {
          char.play('explain', { transition: 0.14, loop: true });
        } catch {
          char.play('idle', { transition: 0.14, loop: true });
        }
      }
      targetRegistryRef.current.syncFromScene({
        anchors: composer.anchors,
        floorY: composer.floorY,
        characterPos: { x: -1.14, y: 0, z: 0 },
      });
      applyCameraLabFrame(cameraTimeRef.current);
      engine.render();
    } else if (workspace === 'story') {
      setViewMode('stage');
      activeStoryEnvKeyRef.current = '';
      activeStoryBeatIdRef.current = '';
      const beatIdx = applyStoryFrame(storyTimeRef.current, false);
      if (beatIdx) setStoryActiveBeat(beatIdx);
    } else if (workspace === 'narrative' || workspace === 'sfx') {
      setViewMode('stage');
      activeStoryEnvKeyRef.current = '';
      activeStoryBeatIdRef.current = '';
      activeNarrativeEnvKeyRef.current = '';
      activeNarrativeBeatIdRef.current = '';
      const snap = applyNarrativeFrame(narrativeTimeRef.current, false);
      if (snap) setNarrativeSnapshot(snap);
      engine.render();
    }
  }, [workspace, envState, mgConfig.anchorName, applyFraming, syncEnvironmentToStage, applyStoryFrame, applyCameraLabFrame, applyNarrativeFrame]);

  // Sync sound toggle
  useEffect(() => {
    soundRef.current?.setEnabled(soundEnabled);
    sfxPreviewRef.current?.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Sync rig debug overlay when toggled
  useEffect(() => {
    const engine = engineRef.current;
    const char = characterRef.current;
    if (!engine || !char) return;
    char.setDebugVisible(rigDebug, engine.scene);
    engine.render();
    syncDebugLabels();
  }, [rigDebug, syncDebugLabels]);

  // Switch directional view smoothly while preserving exact animation phase, speed, loop, pause & expression!
  const handleViewChange = useCallback(
    async (nextViewId: ViewId, overrideTransitionMs?: number) => {
      const engine = engineRef.current;
      const char = characterRef.current;
      if (!engine || !char) return;
      setViewBusy(true);
      setViewError(null);
      try {
        const ms = overrideTransitionMs !== undefined ? overrideTransitionMs : viewTransitionMsRef.current;
        const vs = await char.setView(nextViewId, {
          transition: ms / 1000,
          preserveAnimationState: true,
        });
        engine.setGroundVisible(vs.showGround, char.skeleton.getFloorWorldY());
        applyFraming(framingRef.current, char.manifest);
        char.setDebugVisible(rigDebugRef.current, engine.scene);
        engine.step(0);

        setActiveView(vs.activeView);
        setAvailableViews(char.listViews());
        setHierarchy(char.skeleton.getHierarchy());
        setLabState(char.getState());
        if (rigDebugRef.current) syncDebugLabels();
      } catch (err: any) {
        setViewError(err?.message || `Failed to switch to ${nextViewId} view.`);
      } finally {
        setViewBusy(false);
      }
    },
    [applyFraming, syncDebugLabels]
  );

  // Capture live 16-expression contact sheet directly from the active Three.js renderer (always uses front view)
  const generateExpressionSheet = useCallback(async () => {
    const engine = engineRef.current;
    const char = characterRef.current;
    if (!engine || !char) return [];
    setSheetBusy(true);

    const prevRunning = engine.running;
    const prevView = char.activeView;
    const prevExpression = char.expressionState;
    const prevViewHeight = engine.viewHeight;
    const prevCameraY = engine.cameraY;
    const prevDebug = rigDebugRef.current;
    const prevAutoBlink = char.expressions.blinkController.autoBlink;
    const prevTalking = char.expressions._talking;

    engine.stop();
    if (prevView !== 'front') {
      await char.setView('front', { transition: 0, preserveAnimationState: true });
    }
    char.setDebugVisible(false, engine.scene);
    char.setAutoBlink(false);
    char.talk(false);
    char.expressions.blinkController.reset();
    char.setBasePose('standing', { keepIdle: false });

    const faceFrame = char.manifest?.framing?.faceCloseup || { viewHeight: 0.56, cameraY: 0.52 };
    engine.setFraming(faceFrame);
    engine.setGroundVisible(false);

    const tiles: ExpressionTile[] = [];
    for (const expr of EXPRESSIONS) {
      char.lookAt(null);
      char.expression(expr.id, { transition: 0 });
      char.update(0);
      engine.render();
      tiles.push({
        id: expr.id,
        label: expr.label,
        dataUrl: engine.renderer.domElement.toDataURL('image/png'),
      });
    }

    // Restore previous live view & state cleanly
    if (prevView !== 'front') {
      await char.setView(prevView, { transition: 0, preserveAnimationState: true });
    }
    const vs = char.getViewState();
    engine.setGroundVisible(vs.showGround, char.skeleton.getFloorWorldY());
    engine.setFraming({ viewHeight: prevViewHeight, cameraY: prevCameraY });
    char.controller.play('idle', { loop: true, transition: 0 });
    char.expression(prevExpression, { transition: 0 });
    char.setAutoBlink(prevAutoBlink);
    char.talk(prevTalking);
    char.setDebugVisible(prevDebug, engine.scene);
    char.update(0);
    engine.render();
    if (prevRunning) engine.start();

    setSheetTiles(tiles);
    setSheetBusy(false);
    return tiles;
  }, []);

  // Capture synchronized 4-View Sheet (Front, Back, Top, Bottom at the EXACT same motion phase!)
  const generateMultiViewSheet = useCallback(
    async (scenarioId: string = multiViewScenario, phase01: number = multiViewPhase) => {
      const engine = engineRef.current;
      const char = characterRef.current;
      if (!engine || !char) return [];
      setMultiViewScenario(scenarioId);
      setMultiViewPhase(phase01);
      setMultiViewBusy(true);

      const prevRunning = engine.running;
      const prevView = char.activeView;
      const prevViewHeight = engine.viewHeight;
      const prevCameraY = engine.cameraY;
      const prevDebug = rigDebugRef.current;
      const prevPaused = char.controller.paused;
      const prevExpression = char.expressionState;
      const prevTalking = char.expressions._talking;
      const prevBase = char.controller.channels.base.active?.def?.id || 'idle';
      const prevLoco = char.controller.channels.locomotion.active?.def?.id || null;
      const prevHead = char.controller.channels.head.active?.def?.id || null;
      const prevGesture = char.controller.channels.gesture.active?.def?.id || null;

      engine.stop();
      char.setDebugVisible(false, engine.scene);

      try {
        await char.preloadViews();

        let primaryMotionId = prevLoco || prevGesture || prevHead || prevBase || 'idle';
        if (scenarioId !== 'current') {
          char.controller.stopAll({ includeBase: true, transition: 0 });
          char.controller.play('idle', { loop: true, transition: 0 });
          char.talk(false);
          if (scenarioId === 'walk') {
            char.play('walk', { transition: 0, loop: true });
            char.expression('neutral', { transition: 0 });
            primaryMotionId = 'walk';
          } else if (scenarioId === 'walkWaveHappy') {
            char.play('walk', { transition: 0, loop: true });
            char.play('wave', { transition: 0, loop: true });
            char.expression('happy', { transition: 0 });
            primaryMotionId = 'walk';
          } else if (scenarioId === 'run') {
            char.play('run', { transition: 0, loop: true });
            char.expression('determined', { transition: 0 });
            primaryMotionId = 'run';
          } else if (scenarioId === 'wave') {
            char.play('wave', { transition: 0, loop: true });
            char.expression('happy', { transition: 0 });
            primaryMotionId = 'wave';
          } else if (scenarioId === 'jump') {
            char.play('jump', { transition: 0, loop: false });
            char.expression('excited', { transition: 0 });
            primaryMotionId = 'jump';
          } else if (scenarioId === 'crouch') {
            char.play('crouch', { transition: 0, loop: true });
            char.expression('determined', { transition: 0 });
            primaryMotionId = 'crouch';
          } else if (scenarioId === 'clap') {
            char.play('clap', { transition: 0, loop: true });
            char.expression('happy', { transition: 0 });
            primaryMotionId = 'clap';
          }
          char.controller.setNormalizedPhase(phase01);
        }

        const viewList = char.listViews();
        const tiles: MultiViewTile[] = [];

        for (const viewMeta of viewList) {
          const vs = await char.setView(viewMeta.id, {
            transition: 0,
            preserveAnimationState: true,
          });
          engine.setGroundVisible(vs.showGround, char.skeleton.getFloorWorldY());
          const framePreset = char.manifest?.framing?.fullBody || { viewHeight: 2.05, cameraY: -0.02 };
          engine.setFraming(framePreset);
          char.update(0);
          engine.render();

          const support = char.getViewMotionSupport(primaryMotionId, viewMeta.id);
          tiles.push({
            viewId: viewMeta.id as ViewId,
            label: viewMeta.label,
            framingConvention: viewMeta.framingConvention,
            supportStatus: support.status,
            supportReason: support.reason,
            dataUrl: engine.renderer.domElement.toDataURL('image/png'),
          });
        }

        // Restore original stage state cleanly
        await char.setView(prevView, { transition: 0, preserveAnimationState: true });
        if (scenarioId !== 'current') {
          char.controller.stopAll({ includeBase: true, transition: 0 });
          if (prevBase) char.play(prevBase, { channel: 'base', loop: true, transition: 0 });
          if (prevLoco) char.play(prevLoco, { channel: 'locomotion', transition: 0 });
          if (prevHead) char.play(prevHead, { channel: 'head', transition: 0 });
          if (prevGesture) char.play(prevGesture, { channel: 'gesture', transition: 0 });
          char.expression(prevExpression, { transition: 0 });
          char.talk(prevTalking);
        }
        if (prevPaused) char.pause();
        else char.resume();

        const restoredVs = char.getViewState();
        engine.setGroundVisible(restoredVs.showGround, char.skeleton.getFloorWorldY());
        engine.setFraming({ viewHeight: prevViewHeight, cameraY: prevCameraY });
        char.setDebugVisible(prevDebug, engine.scene);
        char.update(0);
        engine.render();

        setMultiViewTiles(tiles);
        setAvailableViews(char.listViews());
        return tiles;
      } finally {
        if (prevRunning) engine.start();
        setMultiViewBusy(false);
      }
    },
    [multiViewPhase, multiViewScenario]
  );

  const exportCompositeFrame = useCallback(() => {
    const engine = engineRef.current;
    const mgCanvas = mgCanvasRef.current;
    if (!engine) return null;
    engine.render();
    const webglCanvas = engine.renderer.domElement;
    const out = document.createElement('canvas');
    out.width = webglCanvas.width;
    out.height = webglCanvas.height;
    const ctx = out.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(webglCanvas, 0, 0);
    if (mgCanvas && workspaceRef.current !== 'character') {
      ctx.drawImage(mgCanvas, 0, 0, out.width, out.height);
    }
    const url = out.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `puppetkit-${workspaceRef.current}-${Math.round(storyTimeRef.current * 100)}.png`;
    a.click();
    return url;
  }, []);

  // Expose clean inspection API for automated visual verification
  useEffect(() => {
    (window as any).__puppetLab = {
      getEngine: () => engineRef.current,
      getCharacter: () => characterRef.current,
      getEnvironmentComposer: () => envComposerRef.current,
      getState: () => characterRef.current?.getState?.() ?? null,
      getViewState: () => characterRef.current?.getViewState?.() ?? null,
      setWorkspace: (ws: StudioWorkspace) => setWorkspace(ws),
      loadEnvironment: (templateId: string, patch: Partial<EnvironmentLabState> = {}) => {
        const meta = ENVIRONMENT_TEMPLATES[templateId as keyof typeof ENVIRONMENT_TEMPLATES];
        setWorkspace('environments');
        setEnvState((prev) => ({
          ...prev,
          templateId,
          paletteId: patch.paletteId || meta?.defaultPalette || prev.paletteId,
          compositionId: patch.compositionId || meta?.recommendedComposition || prev.compositionId,
          ...patch,
        }));
      },
      previewGraphic: (templateId: string, t = 1.05, overrides: Record<string, any> = {}) => {
        const next = createMotionGraphicConfig(templateId, overrides) as MotionGraphicLabConfig;
        setWorkspace('graphics');
        setMgPlaying(false);
        mgPlayingRef.current = false;
        setMgConfig(next);
        mgConfigRef.current = next;
        setMgTime(t);
        mgTimeRef.current = t;
      },
      seekStory: (t: number, pausedFlag = true) => {
        setWorkspace('story');
        setCustomNarrationBeat(null);
        customNarrationRef.current = null;
        setStoryPlaying(!pausedFlag);
        storyPlayingRef.current = !pausedFlag;
        setStoryTime(t);
        storyTimeRef.current = t;
        const beatIdx = applyStoryFrame(t, false);
        if (beatIdx) setStoryActiveBeat(beatIdx);
        engineRef.current?.render();
      },
      testNarration: (line: string) => {
        const mapped = NarrationVisualMapper.map(line);
        setWorkspace('story');
        setCustomNarrationBeat(mapped);
        customNarrationRef.current = mapped;
        customTimeRef.current = 1.1;
        setStoryPlaying(false);
        storyPlayingRef.current = false;
        applyStoryFrame(0, false);
        engineRef.current?.render();
      },
      previewCameraPreset: (presetId: string, t = 1.2, opts: Partial<CameraLabState> = {}) => {
        setWorkspace('camera');
        setCameraPlaying(false);
        cameraPlayingRef.current = false;
        const next: CameraLabState = {
          ...cameraLabRef.current,
          mode: 'preset',
          presetId,
          compareStatic: false,
          ...opts,
        };
        setCameraLab(next);
        cameraLabRef.current = next;
        setCameraTime(t);
        cameraTimeRef.current = t;
        setTimeout(() => {
          applyCameraLabFrame(t);
          setCameraTelemetry({ ...cameraTelemetryRef.current });
          engineRef.current?.render();
        }, 40);
      },
      previewCameraCombo: (comboId: string, t = 1.8, opts: Partial<CameraLabState> = {}) => {
        setWorkspace('camera');
        setCameraPlaying(false);
        cameraPlayingRef.current = false;
        const next: CameraLabState = {
          ...cameraLabRef.current,
          mode: 'combo',
          comboId,
          compareStatic: false,
          ...opts,
        };
        setCameraLab(next);
        cameraLabRef.current = next;
        setCameraTime(t);
        cameraTimeRef.current = t;
        setTimeout(() => {
          applyCameraLabFrame(t);
          setCameraTelemetry({ ...cameraTelemetryRef.current });
          engineRef.current?.render();
        }, 40);
      },
      setCameraBeforeAfter: (isStatic: boolean) => {
        const next: CameraLabState = { ...cameraLabRef.current, compareStatic: Boolean(isStatic) };
        setCameraLab(next);
        cameraLabRef.current = next;
        applyCameraLabFrame(cameraTimeRef.current);
        setCameraTelemetry({ ...cameraTelemetryRef.current });
        engineRef.current?.render();
      },
      seekNarrative: (t: number, pausedFlag = true) => {
        setWorkspace('narrative');
        setNarrativePlaying(!pausedFlag);
        narrativePlayingRef.current = !pausedFlag;
        setNarrativeTime(t);
        narrativeTimeRef.current = t;
        sfxPreviewRef.current?.scheduler?.reset();
        setTimeout(() => {
          const snap = applyNarrativeFrame(t, false);
          if (snap) setNarrativeSnapshot(snap);
          engineRef.current?.render();
        }, 40);
      },
      directNarrativeScript: (scriptInput: any, title = 'Directed Script') => {
        const sb = NarrativeToVisualDirector.generateStoryboard(scriptInput, { title });
        const plan = sfxDirectorRef.current.directFromStoryboard(sb);
        setNarrativeStoryboard(sb);
        narrativeStoryboardRef.current = sb;
        setSfxPlan(plan);
        sfxPlanRef.current = plan;
        setSfxValidation(SFXValidator.validate(plan.events, sfxRegistryRef.current));
        const startAt = sb.events[0]?.timing?.emphasisTime ?? 0.6;
        setNarrativeTime(startAt);
        narrativeTimeRef.current = startAt;
        setNarrativePlaying(false);
        narrativePlayingRef.current = false;
        activeNarrativeEnvKeyRef.current = '';
        activeNarrativeBeatIdRef.current = '';
        setTimeout(() => {
          const snap = applyNarrativeFrame(startAt, false);
          if (snap) setNarrativeSnapshot(snap);
          engineRef.current?.render();
        }, 40);
        return { storyboard: sb, sfxPlan: plan };
      },
      getNarrativeState: () => ({
        storyboard: narrativeStoryboardRef.current,
        snapshot: narrativeSnapshotRef.current,
        sfxPlan: sfxPlanRef.current,
      }),
      exportCompositeFrame,
      setView: (viewId: ViewId, transitionMs = 0) => handleViewChange(viewId, transitionMs),
      setFraming: (mode: FramingMode) => {
        setFraming(mode);
        applyFraming(mode, characterRef.current?.manifest || CHARACTER_PACKS[packId].manifest);
      },
      setViewMode,
      generateExpressionSheet,
      generateMultiViewSheet,
      setCharacter: (id: CharacterPackId) => {
        setPackId(id);
        return loadCharacterPack(id, framing);
      },
      step: (dt: number) => engineRef.current?.step?.(dt),
    };
    return () => {
      delete (window as any).__puppetLab;
    };
  }, [
    applyCameraLabFrame,
    applyFraming,
    applyNarrativeFrame,
    applyStoryFrame,
    exportCompositeFrame,
    framing,
    generateExpressionSheet,
    generateMultiViewSheet,
    handleViewChange,
    loadCharacterPack,
    packId,
  ]);

  const handleDirectNarrativeScript = useCallback((scriptInput: any, label = 'Custom Directed Story') => {
    const sb = NarrativeToVisualDirector.generateStoryboard(scriptInput, { title: label });
    const plan = sfxDirectorRef.current.directFromStoryboard(sb);
    setNarrativeStoryboard(sb);
    narrativeStoryboardRef.current = sb;
    setSfxPlan(plan);
    sfxPlanRef.current = plan;
    setSfxValidation(SFXValidator.validate(plan.events, sfxRegistryRef.current));
    sfxPreviewRef.current?.scheduler?.reset();
    activeNarrativeEnvKeyRef.current = '';
    activeNarrativeBeatIdRef.current = '';
    const seekTo = sb.events[0]?.timing?.emphasisTime ?? 0.5;
    setNarrativeTime(seekTo);
    narrativeTimeRef.current = seekTo;
    const snap = applyNarrativeFrame(seekTo, false);
    if (snap) setNarrativeSnapshot(snap);
    engineRef.current?.render();
  }, [applyNarrativeFrame]);

  const handleOverrideNarrativeBeat = useCallback((beatId: string, patch: Record<string, any>) => {
    const nextSb = NarrativeToVisualDirector.applyStoryboardOverride(narrativeStoryboardRef.current, beatId, patch);
    const nextPlan = sfxDirectorRef.current.directFromStoryboard(nextSb);
    setNarrativeStoryboard(nextSb);
    narrativeStoryboardRef.current = nextSb;
    setSfxPlan(nextPlan);
    sfxPlanRef.current = nextPlan;
    setSfxValidation(SFXValidator.validate(nextPlan.events, sfxRegistryRef.current));
    activeNarrativeEnvKeyRef.current = '';
    activeNarrativeBeatIdRef.current = '';
    const snap = applyNarrativeFrame(narrativeTimeRef.current, false);
    if (snap) setNarrativeSnapshot(snap);
    engineRef.current?.render();
  }, [applyNarrativeFrame]);

  const handleExportSfxWav = useCallback(() => {
    const plan = sfxPlanRef.current;
    if (!plan) return;
    const rendered = renderSFXTimelineToWav({
      events: plan.events,
      ambienceTracks: plan.ambienceTracks,
      silenceCues: plan.silenceCues,
      totalDuration: plan.totalDuration,
      registry: sfxRegistryRef.current,
      busManager: sfxBusManagerRef.current,
      sampleRate: 22050,
    });
    const blob = new Blob([rendered.wavBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `puppetkit-sfx-mix-${Math.round(plan.totalDuration)}s.wav`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);

  const handlePackChange = (nextId: CharacterPackId) => {
    setPackId(nextId);
    setViewMode('stage');
    loadCharacterPack(nextId, framing);
  };

  const handleFramingToggle = (next: FramingMode) => {
    setFraming(next);
    applyFraming(next, characterRef.current?.manifest || CHARACTER_PACKS[packId].manifest);
  };

  const handleToggleSheet = () => {
    if (viewMode === 'sheet') {
      setViewMode('stage');
      return;
    }
    setViewMode('sheet');
    if (sheetTiles.length === 0) {
      setTimeout(() => {
        generateExpressionSheet();
      }, 30);
    }
  };

  const handleToggleMultiView = () => {
    if (viewMode === 'multiview') {
      setViewMode('stage');
      return;
    }
    setViewMode('multiview');
    setTimeout(() => {
      generateMultiViewSheet(multiViewScenario, multiViewPhase);
    }, 30);
  };

  const triggerMotion = (motionId: string, channel?: string) => {
    const char = characterRef.current;
    if (!char) return;
    setActivePreset(null);
    if (paused) {
      char.resume();
      setPaused(false);
    }
    const opts: any = { transition: 0.16 };
    if (channel) opts.channel = channel;
    if (channel !== 'base' && loopOverride) {
      opts.loop = true;
    }
    char.play(motionId, opts);
    setLabState(char.getState());
  };

  const triggerExpression = (exprId: string) => {
    const char = characterRef.current;
    if (!char) return;
    setActivePreset(null);
    char.expression(exprId, { transition: 0.2 });
    setLabState(char.getState());
  };

  const triggerPreset = (presetId: string) => {
    const char = characterRef.current;
    if (!char) return;
    if (paused) {
      char.resume();
      setPaused(false);
    }
    char.preset(presetId, { transition: 0.2 });
    setActivePreset(presetId);
    const st = char.getState();
    setTalking(st.face.talking);
    setLabState(st);
  };

  const handleStopActions = () => {
    const char = characterRef.current;
    if (!char) return;
    char.stop();
    setTalking(false);
    setActivePreset(null);
    setLabState(char.getState());
  };

  const handleResetPose = () => {
    const char = characterRef.current;
    if (!char) return;
    char.setBasePose('standing', { keepIdle: true });
    char.resetExpression({ transition: 0.15 });
    char.setSpeed(1);
    char.resume();
    setSpeed(1);
    setPaused(false);
    setTalking(false);
    setPointerGaze(false);
    setActivePreset(null);
    setLabState(char.getState());
  };

  const handleSpeedChange = (nextSpeed: number) => {
    setSpeed(nextSpeed);
    characterRef.current?.setSpeed(nextSpeed);
  };

  const handleLoopToggle = () => {
    const next = !loopOverride;
    setLoopOverride(next);
    characterRef.current?.setLoop(next ? true : null);
  };

  const handleAutoBlinkToggle = () => {
    const next = !autoBlink;
    setAutoBlink(next);
    characterRef.current?.setAutoBlink(next);
  };

  const handleTalkToggle = () => {
    const next = !talking;
    setTalking(next);
    characterRef.current?.talk(next);
    if (characterRef.current) setLabState(characterRef.current.getState());
  };

  const handlePauseToggle = () => {
    const char = characterRef.current;
    if (!char) return;
    if (paused) {
      char.resume();
      setPaused(false);
    } else {
      char.pause();
      setPaused(true);
    }
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerGaze || !stageMountRef.current || !characterRef.current) return;
    const rect = stageMountRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    characterRef.current.lookAt({ x: nx, y: ny });
  };

  const isActive = (channel: 'base' | 'locomotion' | 'head' | 'gesture', id: string) =>
    labState.channels[channel]?.id === id;

  const getMotionTooltipAndSupport = (motion: any) => {
    const support = characterRef.current?.getViewMotionSupport?.(motion.id, activeView) || {
      status: 'native',
    };
    const parts = [motion.description];
    if (motion.cutoutLimitation) parts.push(motion.cutoutLimitation);
    if (support.status !== 'native') {
      parts.push(`[${activeView} view: ${support.status}${support.reason ? ` — ${support.reason}` : ''}]`);
    }
    return { status: support.status, title: parts.join(' ') };
  };

  const activeViewMeta = availableViews.find((v) => v.id === activeView);
  const canMultiView = availableViews.length > 1;

  const btnBase =
    'px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors border text-left truncate cursor-pointer inline-flex items-center justify-between gap-1';
  const btnIdle = 'bg-[#1e222b] border-white/10 text-slate-200 hover:bg-[#272c38] hover:border-white/20';
  const btnActive = 'bg-sky-600/90 border-sky-400 text-white';

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-[#111318] text-slate-100 select-none">
      {/* Left/Center Studio Stage Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top Studio Toolbar */}
        <header className="h-12 shrink-0 px-3.5 border-b border-white/10 bg-[#14171e] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2.5 shrink-0">
            <h1 className="font-display text-sm font-bold tracking-tight text-white">
              PuppetKit Studio
            </h1>

            {/* 7-Workspace Studio Mode Switcher */}
            <nav aria-label="Studio workspaces" className="flex items-center rounded-md border border-white/10 bg-[#0e1118] p-0.5">
              {(
                [
                  { id: 'character', label: 'Character', icon: User },
                  { id: 'environments', label: 'Environments', icon: Mountain },
                  { id: 'graphics', label: 'Graphics', icon: Sparkles },
                  { id: 'camera', label: 'Camera', icon: Camera },
                  { id: 'story', label: 'Story', icon: Clapperboard },
                  { id: 'narrative', label: 'Narrative Lab', icon: BookOpen },
                  { id: 'sfx', label: 'SFX Studio', icon: AudioWaveform },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setWorkspace(id)}
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    workspace === id
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {workspace === 'character' && (
              <>
                <select
                  aria-label="Select character rig"
                  value={packId}
                  onChange={(e) => handlePackChange(e.target.value as CharacterPackId)}
                  className="bg-[#1e222b] border border-white/15 rounded-md px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                >
                  {Object.values(CHARACTER_PACKS).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>

                <ToolbarViewSwitcher
                  activeView={activeView}
                  availableViews={availableViews}
                  viewBusy={viewBusy}
                  onSelectView={(v) => {
                    if (viewMode !== 'stage') setViewMode('stage');
                    handleViewChange(v);
                  }}
                />
              </>
            )}
          </div>

          {workspace === 'character' ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleFramingToggle(framing === 'fullBody' ? 'faceCloseup' : 'fullBody')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                  framing === 'faceCloseup' ? btnActive : btnIdle
                }`}
                title="Toggle full-body and head/face close-up camera framing (independent of view direction)"
              >
                {framing === 'faceCloseup' ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                {framing === 'faceCloseup' ? 'Full Body' : activeView === 'front' ? 'Face Zoom' : 'Head Zoom'}
              </button>

              <button
                type="button"
                disabled={!canMultiView}
                onClick={handleToggleMultiView}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                  viewMode === 'multiview'
                    ? btnActive + ' cursor-pointer'
                    : canMultiView
                      ? btnIdle + ' cursor-pointer'
                      : 'bg-[#171a21] border-white/5 text-slate-500 cursor-not-allowed'
                }`}
                title={
                  canMultiView
                    ? 'Render all 4 views (Front, Back, Top, Bottom) synchronized at the exact same motion phase'
                    : 'Only available on multi-view character packs'
                }
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                {viewMode === 'multiview' ? 'Live Stage' : '4-View Sync'}
              </button>

              <button
                type="button"
                onClick={handleToggleSheet}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                  viewMode === 'sheet' ? btnActive : btnIdle
                }`}
                title="Render all 16 expressions side-by-side"
              >
                <Grid2x2 className="w-3.5 h-3.5" />
                {viewMode === 'sheet' ? 'Live Stage' : '16-Expr Sheet'}
              </button>

              <button
                type="button"
                onClick={() => setRigDebug((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                  rigDebug ? 'bg-rose-600/90 border-rose-400 text-white' : btnIdle
                }`}
                title="Show active view's rig pivots, bone links, and skeleton hierarchy"
              >
                <Layers className="w-3.5 h-3.5" />
                Rig Debug
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono-num text-slate-400">
              <span className="text-slate-300 font-semibold uppercase">{workspace}</span>
              <span>·</span>
              <span>
                {workspace === 'environments'
                  ? envState.templateId
                  : workspace === 'graphics'
                    ? mgConfig.template
                    : workspace === 'camera'
                      ? cameraLab.compareStatic
                        ? 'static-baseline'
                        : cameraLab.mode === 'combo'
                          ? cameraLab.comboId
                          : cameraLab.presetId
                      : workspace === 'narrative'
                        ? `beat-${narrativeSnapshot?.beatIndex ?? 1}/${narrativeStoryboard?.beatCount ?? 1}`
                        : workspace === 'sfx'
                          ? `${sfxPlan?.events?.length ?? 0}-cues`
                          : customNarrationBeat
                            ? 'custom-narration'
                            : `beat-${storyActiveBeat}/6`}
              </span>
            </div>
          )}
        </header>

        {/* Central Viewport (Three.js Stage + Motion Graphics Canvas Overlay + Optional Sheets) */}
        <main
          className="relative flex-1 min-h-0 bg-[#f4f1ec] overflow-hidden"
          onPointerMove={handleStagePointerMove}
        >
          {/* Dedicated empty Three.js canvas mount */}
          <div
            ref={stageMountRef}
            data-testid="puppet-stage"
            data-active-view={activeView}
            data-workspace={workspace}
            className="w-full h-full"
            style={{ visibility: viewMode === 'stage' ? 'visible' : 'hidden' }}
          />

          {/* High-DPI Deterministic Motion Graphics Canvas Overlay */}
          <canvas
            ref={mgCanvasRef}
            data-testid="motion-graphics-overlay"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ visibility: viewMode === 'stage' && workspace !== 'character' ? 'visible' : 'hidden' }}
          />

          {/* Loading or Error States */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f4f1ec] text-slate-700 text-sm font-medium">
              Loading character rig...
            </div>
          )}
          {viewBusy && !loading && viewMode === 'stage' && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#181c24] border border-slate-700 text-slate-100 text-xs font-medium shadow-sm">
              Loading view...
            </div>
          )}
          {(errorMsg || viewError) && (
            <div className="absolute inset-x-0 top-3 flex justify-center px-4 pointer-events-none">
              <div className="max-w-md rounded-lg border border-rose-300 bg-white p-3 text-rose-800 text-xs flex items-start gap-2 shadow-md pointer-events-auto">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg || viewError}</span>
              </div>
            </div>
          )}

          {/* Rig Debug DOM Labels & Active View Hierarchy Tree */}
          {viewMode === 'stage' && rigDebug && !loading && (
            <>
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {debugLabels.map((lbl) => {
                  const isLeft = lbl.x < (stageMountRef.current?.clientWidth || 640) * 0.5;
                  return (
                    <div
                      key={`${activeView}-${lbl.name}`}
                      style={{
                        left: `${isLeft ? lbl.x - 10 : lbl.x + 10}px`,
                        top: `${lbl.y - 9}px`,
                        transform: isLeft ? 'translateX(-100%)' : 'none',
                      }}
                      className="absolute px-1.5 py-0.5 rounded bg-slate-900/90 text-[10px] font-mono text-sky-200 border border-sky-400/40 whitespace-nowrap"
                    >
                      {lbl.name} ({lbl.rotationDeg}°)
                    </div>
                  );
                })}
              </div>
              <aside className="absolute top-3 left-3 w-52 max-h-[65%] overflow-y-auto lab-scroll rounded-lg bg-[#14171e] border border-white/15 p-3 shadow-lg">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-0.5">
                  Rig Hierarchy ({activeView.toUpperCase()})
                </div>
                <div className="text-[10px] font-mono text-slate-400 mb-2">
                  {characterRef.current?.skeleton?.parts?.size ?? 0} parts · face {activeViewMeta?.faceVisible ? 'visible' : 'hidden'}
                </div>
                <HierarchyTree nodes={hierarchy} />
              </aside>
            </>
          )}

          {/* Active View Direction Tag + Pointer Gaze Toggle (Character Lab only) */}
          {workspace === 'character' && viewMode === 'stage' && !loading && (
            <>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#181c24] border border-slate-700 text-[11px] font-mono text-slate-200 shadow-sm">
                View: <span className="text-sky-300 font-semibold uppercase">{activeView}</span>
                {activeView !== 'front' && (
                  <span className="text-slate-400"> · Face synced off-camera</span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={activeView !== 'front'}
                  onClick={() => {
                    const next = !pointerGaze;
                    setPointerGaze(next);
                    if (!next) characterRef.current?.lookAt(null);
                  }}
                  title={
                    activeView === 'front'
                      ? 'Have eyes follow pointer on stage'
                      : 'Eye pointer tracking is only visible in Front view'
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border shadow-sm ${
                    activeView !== 'front'
                      ? 'bg-[#181c24] border-slate-800 text-slate-500 cursor-not-allowed'
                      : pointerGaze
                        ? 'bg-sky-600 border-sky-500 text-white cursor-pointer'
                        : 'bg-[#181c24] border-slate-700 text-slate-200 hover:bg-[#232834] cursor-pointer'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  {pointerGaze ? 'Eye Follow: On' : 'Eye Follow: Off'}
                </button>
              </div>
            </>
          )}

          {/* Synchronized 4-View Sheet */}
          {viewMode === 'multiview' && (
            <MultiViewSheet
              characterLabel={CHARACTER_PACKS[packId].label}
              tiles={multiViewTiles}
              busy={multiViewBusy}
              scenarioId={multiViewScenario}
              phase={multiViewPhase}
              activeView={activeView}
              onScenarioChange={(nextScenario) => {
                setMultiViewScenario(nextScenario);
                generateMultiViewSheet(nextScenario, multiViewPhase);
              }}
              onPhaseChange={(nextPhase) => {
                setMultiViewPhase(nextPhase);
                generateMultiViewSheet(multiViewScenario, nextPhase);
              }}
              onRefresh={() => generateMultiViewSheet(multiViewScenario, multiViewPhase)}
              onPickView={(v) => {
                setViewMode('stage');
                handleViewChange(v);
              }}
            />
          )}

          {/* 16-Expression Live Contact Sheet View */}
          {viewMode === 'sheet' && (
            <div className="absolute inset-0 bg-[#14171e] p-3 flex flex-col overflow-y-auto lab-scroll">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <div>
                  <h2 className="text-xs font-semibold text-white">
                    16-Expression Contact Sheet — {CHARACTER_PACKS[packId].label}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Rendered live from the Front view Three.js rig. Click any expression to preview it on stage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => generateExpressionSheet()}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#1e222b] border border-white/15 text-slate-100 hover:bg-[#2a303c] cursor-pointer"
                >
                  {sheetBusy ? 'Rendering...' : 'Re-render Sheet'}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 min-h-0">
                {sheetTiles.map((tile) => (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => {
                      triggerExpression(tile.id);
                      setViewMode('stage');
                    }}
                    className={`group rounded-md overflow-hidden border text-left transition-colors cursor-pointer bg-[#f4f1ec] flex flex-col ${
                      labState.face.expression === tile.id
                        ? 'border-sky-400 ring-2 ring-sky-400/50'
                        : 'border-white/15 hover:border-sky-400/70'
                    }`}
                  >
                    <div className="flex-1 min-h-[82px] w-full overflow-hidden bg-[#f4f1ec]">
                      <img
                        src={tile.dataUrl}
                        alt={tile.label}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="px-2 py-1 bg-[#1b1f28] flex items-center justify-between shrink-0">
                      <span className="text-[11px] font-medium text-slate-100">{tile.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">{tile.id}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Bottom Transport & Channel Status Bar */}
        <footer className="shrink-0 px-4 py-2.5 border-t border-white/10 bg-[#14171e] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Channel & View Readout */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 font-mono text-[11px]">
            <div>
              <span className="text-slate-400">View: </span>
              <span className="text-sky-300 font-semibold uppercase" data-testid="status-view">
                {activeView}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Base: </span>
              <span className="text-slate-100" data-testid="status-base">
                {labState.channels.base?.label ?? 'None'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Body/Loco: </span>
              <span className="text-amber-300" data-testid="status-locomotion">
                {labState.channels.locomotion?.label ?? '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Head: </span>
              <span className="text-emerald-300" data-testid="status-head">
                {labState.channels.head?.label ?? '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Gesture: </span>
              <span className="text-sky-300" data-testid="status-gesture">
                {labState.channels.gesture?.label ?? '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Expr: </span>
              <span className="text-rose-300" data-testid="status-expression">
                {labState.face.expression}
              </span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 text-slate-300">
              <span>Speed</span>
              <input
                type="range"
                min={0.25}
                max={2}
                step={0.05}
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-20 accent-sky-500 cursor-pointer"
              />
              <span className="w-9 text-right font-mono text-slate-100">{speed.toFixed(2)}x</span>
            </label>

            <button
              type="button"
              onClick={handleLoopToggle}
              className={`px-2 py-1 rounded border text-xs font-medium cursor-pointer ${
                loopOverride ? btnActive : btnIdle
              }`}
              title="Force actions to loop continuously"
            >
              Loop: {loopOverride ? 'On' : 'Auto'}
            </button>

            <button
              type="button"
              onClick={handleAutoBlinkToggle}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium cursor-pointer ${
                autoBlink ? 'bg-[#1e293b] border-sky-500/50 text-sky-200' : btnIdle
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Blink
            </button>

            <button
              type="button"
              onClick={handleTalkToggle}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium cursor-pointer ${
                talking ? btnActive : btnIdle
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Talk
            </button>

            <button
              type="button"
              onClick={handlePauseToggle}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium cursor-pointer ${
                paused ? 'bg-amber-600 border-amber-400 text-white' : btnIdle
              }`}
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {paused ? 'Resume' : 'Pause'}
            </button>

            <button
              type="button"
              onClick={handleStopActions}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium cursor-pointer ${btnIdle}`}
              title="Stop active locomotion, head, gesture, and talking"
            >
              <Square className="w-3.5 h-3.5" />
              Stop
            </button>

            <button
              type="button"
              onClick={handleResetPose}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-white/15 bg-[#232834] hover:bg-[#2e3545] text-white text-xs font-medium cursor-pointer"
              title="Reset character to standing rest pose and neutral expression"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Pose
            </button>
          </div>
        </footer>
      </div>

      {/* Right Control Inspector (switches cleanly by Studio Workspace) */}
      <aside className="w-full lg:w-[396px] xl:w-[424px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#161921] flex flex-col max-h-[46vh] lg:max-h-none">
        {workspace === 'environments' && (
          <div className="flex-1 overflow-y-auto lab-scroll p-3.5">
            <EnvironmentPreviewLab
              state={envState}
              onChange={(patch) => setEnvState((prev) => ({ ...prev, ...patch }))}
              onQuickPose={(motion, expr) => {
                characterRef.current?.play(motion, { transition: 0.16, loop: true });
                characterRef.current?.expression(expr, { transition: 0.16 });
              }}
            />
          </div>
        )}

        {workspace === 'graphics' && (
          <div className="flex-1 overflow-y-auto lab-scroll p-3.5">
            <MotionGraphicsLab
              config={mgConfig}
              time={mgTime}
              playing={mgPlaying}
              speed={mgSpeed}
              soundEnabled={soundEnabled}
              onConfigChange={(next) => {
                setMgConfig(next);
                mgConfigRef.current = next;
              }}
              onTimeChange={(t) => {
                setMgPlaying(false);
                mgPlayingRef.current = false;
                setMgTime(t);
                mgTimeRef.current = t;
              }}
              onTogglePlay={() => {
                const next = !mgPlaying;
                setMgPlaying(next);
                mgPlayingRef.current = next;
              }}
              onReplay={() => {
                setMgTime(0);
                mgTimeRef.current = 0;
                setMgPlaying(true);
                mgPlayingRef.current = true;
              }}
              onSpeedChange={(s) => {
                setMgSpeed(s);
                mgSpeedRef.current = s;
              }}
              onPreviewSound={(cueId) => soundRef.current?.play(cueId)}
              onToggleSound={() => setSoundEnabled((v) => !v)}
            />
          </div>
        )}

        {workspace === 'camera' && (
          <div className="flex-1 overflow-y-auto lab-scroll p-3.5">
            <CameraPreviewLab
              state={cameraLab}
              time={cameraTime}
              playing={cameraPlaying}
              telemetry={cameraTelemetry}
              onChange={(patch) => {
                const next = { ...cameraLabRef.current, ...patch };
                setCameraLab(next);
                cameraLabRef.current = next;
                applyCameraLabFrame(cameraTimeRef.current);
                setCameraTelemetry({ ...cameraTelemetryRef.current });
                engineRef.current?.render();
              }}
              onTimeChange={(t) => {
                setCameraPlaying(false);
                cameraPlayingRef.current = false;
                setCameraTime(t);
                cameraTimeRef.current = t;
                applyCameraLabFrame(t);
                setCameraTelemetry({ ...cameraTelemetryRef.current });
                engineRef.current?.render();
              }}
              onTogglePlay={() => {
                const next = !cameraPlaying;
                setCameraPlaying(next);
                cameraPlayingRef.current = next;
              }}
              onReplay={() => {
                setCameraTime(0);
                cameraTimeRef.current = 0;
                setCameraPlaying(true);
                cameraPlayingRef.current = true;
                applyCameraLabFrame(0);
                setCameraTelemetry({ ...cameraTelemetryRef.current });
                engineRef.current?.render();
              }}
              onExportFrame={exportCompositeFrame}
            />
          </div>
        )}

        {workspace === 'story' && (
          <div className="flex-1 overflow-y-auto lab-scroll p-3.5">
            <StoryDirectorPanel
              storyTime={storyTime}
              playing={storyPlaying}
              activeBeatIndex={storyActiveBeat}
              soundEnabled={soundEnabled}
              customNarrationActive={Boolean(customNarrationBeat)}
              customNarrationLabel={customNarrationBeat?.label || ''}
              onSeek={(t) => {
                setCustomNarrationBeat(null);
                customNarrationRef.current = null;
                setStoryTime(t);
                storyTimeRef.current = t;
                const beatIdx = applyStoryFrame(t, false);
                if (beatIdx) setStoryActiveBeat(beatIdx);
                engineRef.current?.render();
              }}
              onTogglePlay={() => {
                const next = !storyPlaying;
                setStoryPlaying(next);
                storyPlayingRef.current = next;
              }}
              onRestart={() => {
                setCustomNarrationBeat(null);
                customNarrationRef.current = null;
                soundRef.current?.resetTimelineTriggers();
                activeStoryBeatIdRef.current = '';
                setStoryTime(0);
                storyTimeRef.current = 0;
                setStoryPlaying(true);
                storyPlayingRef.current = true;
              }}
              onToggleSound={() => setSoundEnabled((v) => !v)}
              onTestNarration={(sentence) => {
                const mapped = NarrationVisualMapper.map(sentence);
                setCustomNarrationBeat(mapped);
                customNarrationRef.current = mapped;
                customTimeRef.current = 0.2;
                activeStoryEnvKeyRef.current = '';
                activeStoryBeatIdRef.current = '';
                setStoryPlaying(true);
                storyPlayingRef.current = true;
                if (soundEnabled && mapped.soundCue) {
                  soundRef.current?.play(mapped.soundCue);
                }
                applyStoryFrame(0, false);
              }}
              onClearCustomNarration={() => {
                setCustomNarrationBeat(null);
                customNarrationRef.current = null;
                activeStoryEnvKeyRef.current = '';
                activeStoryBeatIdRef.current = '';
                applyStoryFrame(storyTimeRef.current, false);
              }}
              onExportFrame={exportCompositeFrame}
            />
          </div>
        )}

        {workspace === 'narrative' && (
          <div className="flex-1 overflow-y-auto lab-scroll p-3.5">
            <NarrativeLogicLab
              storyboard={narrativeStoryboard}
              sfxPlan={sfxPlan}
              activeSnapshot={narrativeSnapshot}
              time={narrativeTime}
              playing={narrativePlaying}
              soundEnabled={soundEnabled}
              layerToggles={narrativeLayers}
              scriptText={narrativeScriptText}
              onScriptTextChange={setNarrativeScriptText}
              onDirectScript={handleDirectNarrativeScript}
              onSeek={(t) => {
                setNarrativePlaying(false);
                narrativePlayingRef.current = false;
                setNarrativeTime(t);
                narrativeTimeRef.current = t;
                sfxPreviewRef.current?.scheduler?.reset();
                const snap = applyNarrativeFrame(t, false);
                if (snap) setNarrativeSnapshot(snap);
                engineRef.current?.render();
              }}
              onTogglePlay={() => {
                const next = !narrativePlaying;
                setNarrativePlaying(next);
                narrativePlayingRef.current = next;
              }}
              onReplay={() => {
                sfxPreviewRef.current?.scheduler?.reset();
                activeNarrativeBeatIdRef.current = '';
                setNarrativeTime(0);
                narrativeTimeRef.current = 0;
                setNarrativePlaying(true);
                narrativePlayingRef.current = true;
                const snap = applyNarrativeFrame(0, false);
                if (snap) setNarrativeSnapshot(snap);
              }}
              onToggleSound={() => setSoundEnabled((v) => !v)}
              onToggleLayer={(key) => {
                setNarrativeLayers((prev) => {
                  const next = { ...prev, [key]: !prev[key] };
                  narrativeLayersRef.current = next;
                  activeNarrativeEnvKeyRef.current = '';
                  const snap = applyNarrativeFrame(narrativeTimeRef.current, false);
                  if (snap) setNarrativeSnapshot(snap);
                  engineRef.current?.render();
                  return next;
                });
              }}
              onOverrideBeat={handleOverrideNarrativeBeat}
              onExportFrame={exportCompositeFrame}
            />
          </div>
        )}

        {workspace === 'sfx' && (
          <div className="flex-1 overflow-y-auto lab-scroll p-3.5" data-registry-rev={sfxRegistryRev}>
            <SFXStudioLab
              registry={sfxRegistryRef.current}
              sfxEvents={sfxPlan.events}
              ambienceTracks={sfxPlan.ambienceTracks}
              silenceCues={sfxPlan.silenceCues}
              omittedDecisions={sfxPlan.omittedDecisions}
              validation={sfxValidation}
              busState={sfxBusState}
              time={narrativeTime}
              totalDuration={sfxPlan.totalDuration}
              playing={narrativePlaying}
              soundEnabled={soundEnabled}
              onSeek={(t) => {
                setNarrativePlaying(false);
                narrativePlayingRef.current = false;
                setNarrativeTime(t);
                narrativeTimeRef.current = t;
                sfxPreviewRef.current?.scheduler?.reset();
                const snap = applyNarrativeFrame(t, false);
                if (snap) setNarrativeSnapshot(snap);
                engineRef.current?.render();
              }}
              onTogglePlay={() => {
                const next = !narrativePlaying;
                setNarrativePlaying(next);
                narrativePlayingRef.current = next;
              }}
              onReplay={() => {
                sfxPreviewRef.current?.scheduler?.reset();
                setNarrativeTime(0);
                narrativeTimeRef.current = 0;
                setNarrativePlaying(true);
                narrativePlayingRef.current = true;
              }}
              onToggleSound={() => setSoundEnabled((v) => !v)}
              onPreviewPreset={(presetId) => sfxPreviewRef.current?.playPreset(presetId)}
              onPreviewCombo={(combo) => sfxPreviewRef.current?.playCombination(combo)}
              onAddEventFromPreset={(presetId, startTime) => {
                const preset = sfxRegistryRef.current.get(presetId);
                if (!preset) return;
                const newEv = {
                  id: `sfx_user_${Date.now().toString(36)}`,
                  presetId: preset.id,
                  presetName: preset.name,
                  category: preset.category,
                  bus: preset.bus,
                  startTime: Number(startTime.toFixed(2)),
                  duration: preset.duration,
                  volume: preset.defaultVolume,
                  pitch: preset.pitch,
                  playbackRate: preset.playbackRate,
                  fadeIn: preset.fadeIn,
                  fadeOut: preset.fadeOut,
                  pan: 0,
                  loop: preset.loopable,
                  muted: false,
                  solo: false,
                  disabled: false,
                  sourceBeatId: narrativeSnapshotRef.current?.event?.id || 'manual',
                  sourceBeatIndex: narrativeSnapshotRef.current?.beatIndex || 1,
                  visualEventId: 'manual_editor_insert',
                  targetId: 'manual',
                  reason: 'Manually inserted from SFX Library',
                  importanceScore: 80,
                  manualOverride: true,
                };
                const nextEvents = [...sfxPlanRef.current.events, newEv].sort((a, b) => a.startTime - b.startTime);
                const nextPlan = { ...sfxPlanRef.current, events: nextEvents };
                setSfxPlan(nextPlan);
                sfxPlanRef.current = nextPlan;
                setSfxValidation(SFXValidator.validate(nextEvents, sfxRegistryRef.current));
              }}
              onAddComboToTimeline={(combo, startTime) => {
                const added = (combo.layers || [])
                  .filter((l: any) => l.enabled)
                  .map((l: any, idx: number) => {
                    const preset = sfxRegistryRef.current.get(l.presetId);
                    if (!preset) return null;
                    return {
                      id: `sfx_combo_${Date.now().toString(36)}_${idx}`,
                      presetId: preset.id,
                      presetName: preset.name,
                      category: preset.category,
                      bus: preset.bus,
                      startTime: Number((startTime + (l.offsetSec || 0)).toFixed(2)),
                      duration: preset.duration,
                      volume: l.volume ?? preset.defaultVolume,
                      pitch: preset.pitch,
                      playbackRate: preset.playbackRate,
                      fadeIn: preset.fadeIn,
                      fadeOut: preset.fadeOut,
                      pan: 0,
                      loop: preset.loopable,
                      muted: false,
                      solo: false,
                      disabled: false,
                      sourceBeatId: narrativeSnapshotRef.current?.event?.id || 'combo',
                      sourceBeatIndex: narrativeSnapshotRef.current?.beatIndex || 1,
                      visualEventId: `combo:${combo.id}`,
                      targetId: 'combo',
                      reason: `Added from combination "${combo.name}" (${l.role})`,
                      importanceScore: 80,
                      manualOverride: true,
                    };
                  })
                  .filter(Boolean);
                const nextEvents = [...sfxPlanRef.current.events, ...added].sort((a, b) => a.startTime - b.startTime);
                const nextPlan = { ...sfxPlanRef.current, events: nextEvents };
                setSfxPlan(nextPlan);
                sfxPlanRef.current = nextPlan;
                setSfxValidation(SFXValidator.validate(nextEvents, sfxRegistryRef.current));
              }}
              onUpdateEvent={(eventId, patch) => {
                const patchList = (list: any[]) =>
                  list.map((e) => (e.id === eventId ? { ...e, ...patch } : e));
                const nextEvents = patchList(sfxPlanRef.current.events).sort((a, b) => a.startTime - b.startTime);
                const nextAmb = patchList(sfxPlanRef.current.ambienceTracks);
                const nextPlan = { ...sfxPlanRef.current, events: nextEvents, ambienceTracks: nextAmb };
                setSfxPlan(nextPlan);
                sfxPlanRef.current = nextPlan;
                setSfxValidation(SFXValidator.validate(nextEvents, sfxRegistryRef.current));
              }}
              onDuplicateEvent={(eventId) => {
                const orig = sfxPlanRef.current.events.find((e: any) => e.id === eventId);
                if (!orig) return;
                const copy = {
                  ...orig,
                  id: `sfx_dup_${Date.now().toString(36)}`,
                  startTime: Number(Math.min(sfxPlanRef.current.totalDuration - 0.1, orig.startTime + 0.35).toFixed(2)),
                  manualOverride: true,
                };
                const nextEvents = [...sfxPlanRef.current.events, copy].sort((a, b) => a.startTime - b.startTime);
                const nextPlan = { ...sfxPlanRef.current, events: nextEvents };
                setSfxPlan(nextPlan);
                sfxPlanRef.current = nextPlan;
                setSfxValidation(SFXValidator.validate(nextEvents, sfxRegistryRef.current));
              }}
              onDeleteEvent={(eventId) => {
                const nextEvents = sfxPlanRef.current.events.filter((e: any) => e.id !== eventId);
                const nextAmb = sfxPlanRef.current.ambienceTracks.filter((e: any) => e.id !== eventId);
                const nextPlan = { ...sfxPlanRef.current, events: nextEvents, ambienceTracks: nextAmb };
                setSfxPlan(nextPlan);
                sfxPlanRef.current = nextPlan;
                setSfxValidation(SFXValidator.validate(nextEvents, sfxRegistryRef.current));
              }}
              onUpdateBus={(busId, patch) => {
                sfxBusManagerRef.current.setBus(busId, patch);
                setSfxBusState(sfxBusManagerRef.current.getState());
              }}
              onUpdateMaster={(patch) => {
                if (typeof patch.masterVolume === 'number') sfxBusManagerRef.current.masterVolume = patch.masterVolume;
                if (typeof patch.voiceDuckingEnabled === 'boolean') sfxBusManagerRef.current.voiceDuckingEnabled = patch.voiceDuckingEnabled;
                setSfxBusState(sfxBusManagerRef.current.getState());
              }}
              onUpdateComboLayer={(comboId, layerId, enabled) => {
                const combo = sfxRegistryRef.current.getCombination(comboId);
                if (!combo) return;
                const next = {
                  ...combo,
                  layers: combo.layers.map((l: any) => (l.id === layerId ? { ...l, enabled } : l)),
                };
                sfxRegistryRef.current.saveCombination(next);
                setSfxRegistryRev((r) => r + 1);
              }}
              onSaveCustomPreset={(spec) => {
                sfxRegistryRef.current.saveCustomPreset(spec);
                setSfxRegistryRev((r) => r + 1);
              }}
              onResetPreset={(presetId) => {
                sfxRegistryRef.current.resetPreset(presetId);
                setSfxRegistryRev((r) => r + 1);
              }}
              onExportWav={handleExportSfxWav}
            />
          </div>
        )}

        {workspace === 'character' && (
        <>
        {/* Inspector Section Filter Tabs */}
        <nav className="shrink-0 grid grid-cols-4 border-b border-white/10 bg-[#14171e] text-xs font-medium">
          {(
            [
              ['all', 'All Controls'],
              ['motions', 'Motions'],
              ['expressions', 'Expressions'],
              ['presets', 'Presets'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
                tab === id
                  ? 'border-sky-400 text-white bg-[#1b202a]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Scrollable Control Groups */}
        <div className="flex-1 overflow-y-auto lab-scroll p-3.5 space-y-5">
          {/* 0. View Presets (Always accessible at top of Inspector) */}
          <ViewPresetPanel
            activeView={activeView}
            availableViews={availableViews}
            viewBusy={viewBusy}
            transitionMs={viewTransitionMs}
            onSelectView={(v) => {
              if (viewMode !== 'stage') setViewMode('stage');
              handleViewChange(v);
            }}
            onTransitionMsChange={setViewTransitionMs}
            activeViewMeta={activeViewMeta}
          />

          {/* 1. Basic Controls */}
          {(tab === 'all' || tab === 'motions') && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Basic &amp; Base Channel
                </h2>
                <button
                  type="button"
                  onClick={() => characterRef.current?.blink()}
                  className="text-[11px] text-sky-400 hover:text-sky-300 cursor-pointer"
                >
                  Trigger Blink
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5">
                {BASIC_MOTIONS.map((m) => {
                  const meta = getMotionTooltipAndSupport(m);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      data-motion={m.id}
                      onClick={() => triggerMotion(m.id, 'base')}
                      className={`${btnBase} ${isActive('base', m.id) ? btnActive : btnIdle}`}
                      title={meta.title}
                    >
                      <span className="truncate">{m.label}</span>
                      <SupportDot status={meta.status} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => characterRef.current?.blink()}
                  className={`${btnBase} ${btnIdle}`}
                >
                  Blink Now
                </button>
                <button
                  type="button"
                  onClick={handleResetPose}
                  className={`${btnBase} ${btnIdle}`}
                >
                  Reset Rest Pose
                </button>
              </div>
            </section>
          )}

          {/* 2. Head Motions */}
          {(tab === 'all' || tab === 'motions') && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Head &amp; Gaze ({HEAD_MOTIONS.length})
                </h2>
                <button
                  type="button"
                  onClick={() => characterRef.current?.stop('head')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Clear Head
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {HEAD_MOTIONS.map((m) => {
                  const meta = getMotionTooltipAndSupport(m);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      data-motion={m.id}
                      onClick={() => triggerMotion(m.id, 'head')}
                      className={`${btnBase} ${isActive('head', m.id) ? btnActive : btnIdle}`}
                      title={meta.title}
                    >
                      <span className="truncate">{m.label}</span>
                      <SupportDot status={meta.status} />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. Gestures & Reactions */}
          {(tab === 'all' || tab === 'motions') && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Gestures &amp; Reactions ({GESTURE_MOTIONS.length + REACTION_MOTIONS.length})
                </h2>
                <button
                  type="button"
                  onClick={() => characterRef.current?.stop('gesture')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Clear Gesture
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {GESTURE_MOTIONS.map((m) => {
                  const meta = getMotionTooltipAndSupport(m);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      data-motion={m.id}
                      onClick={() => triggerMotion(m.id, 'gesture')}
                      className={`${btnBase} ${isActive('gesture', m.id) ? btnActive : btnIdle}`}
                      title={meta.title}
                    >
                      <span className="truncate">{m.label}</span>
                      <SupportDot status={meta.status} />
                    </button>
                  );
                })}
                {REACTION_MOTIONS.map((m) => {
                  const meta = getMotionTooltipAndSupport(m);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      data-motion={m.id}
                      onClick={() => triggerMotion(m.id, 'locomotion')}
                      className={`${btnBase} ${isActive('locomotion', m.id) ? btnActive : btnIdle}`}
                      title={meta.title}
                    >
                      <span className="truncate">{m.label}</span>
                      <SupportDot status={meta.status} />
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400 leading-snug">
                Note: <code className="text-slate-300">thumbsUp</code> is omitted — {UNSUPPORTED_MOTIONS.thumbsUp.reason}
              </p>
            </section>
          )}

          {/* 4. Locomotion */}
          {(tab === 'all' || tab === 'motions') && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Locomotion ({LOCOMOTION_MOTIONS.length})
                </h2>
                <button
                  type="button"
                  onClick={() => characterRef.current?.stop('locomotion')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Stop / Idle
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {LOCOMOTION_MOTIONS.map((m) => {
                  const meta = getMotionTooltipAndSupport(m);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      data-motion={m.id}
                      onClick={() => triggerMotion(m.id, 'locomotion')}
                      className={`${btnBase} ${isActive('locomotion', m.id) ? btnActive : btnIdle}`}
                      title={meta.title}
                    >
                      <span className="truncate">{m.label}</span>
                      <SupportDot status={meta.status} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => characterRef.current?.stop('locomotion')}
                  className={`${btnBase} ${btnIdle}`}
                >
                  Stop / Idle
                </button>
              </div>
              {activeView !== 'front' && (
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Adapted for {activeView}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Limited readability
                  </span>
                </div>
              )}
            </section>
          )}

          {/* 5. All 16 Facial Expressions */}
          {(tab === 'all' || tab === 'expressions') && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Facial Expressions ({EXPRESSIONS.length})
                  {activeView !== 'front' && (
                    <span className="ml-1.5 text-[10px] font-normal text-amber-300/90 normal-case">
                      (synced internally)
                    </span>
                  )}
                </h2>
                <button
                  type="button"
                  onClick={() => triggerExpression('neutral')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Reset Neutral
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {EXPRESSIONS.map((expr) => (
                  <button
                    key={expr.id}
                    type="button"
                    data-expression={expr.id}
                    onClick={() => triggerExpression(expr.id)}
                    className={`${btnBase} ${
                      labState.face.expression === expr.id
                        ? 'bg-rose-600/90 border-rose-400 text-white'
                        : btnIdle
                    }`}
                    title={
                      activeView === 'front'
                        ? expr.description
                        : `${expr.description} (State preserved while face is hidden in ${activeView} view.)`
                    }
                  >
                    <span className="truncate">{expr.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* 6. Combined Action Presets (7) */}
          {(tab === 'all' || tab === 'presets') && (
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Combined Presets ({PRESETS.length})
              </h2>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    data-preset={p.id}
                    onClick={() => triggerPreset(p.id)}
                    className={`px-3 py-2 rounded-md border text-left transition-colors cursor-pointer ${
                      activePreset === p.id
                        ? 'bg-emerald-700/80 border-emerald-400 text-white'
                        : 'bg-[#1e222b] border-white/10 text-slate-100 hover:bg-[#272c38]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{p.label}</span>
                      <span className="text-[10px] font-mono text-slate-300">
                        {p.expression}
                        {p.gesture ? ` + ${p.gesture}` : ''}
                        {p.locomotion ? ` + ${p.locomotion}` : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {p.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
        </>
        )}
      </aside>
    </div>
  );
}
