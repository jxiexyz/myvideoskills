import React, { useMemo, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  Sparkles,
  Layers,
  Crosshair,
  SlidersHorizontal,
  Film,
  Maximize2,
  Download,
  Wand2,
} from 'lucide-react';
import {
  CAMERA_PRESET_CATEGORIES,
  CAMERA_PRESET_LIST,
  CAMERA_PRESETS,
} from '../camera/presets.js';
import {
  CAMERA_COMBINATION_LIST,
  CAMERA_TRANSITION_LIST,
} from '../camera/transitions-and-combos.js';
import {
  CAMERA_COMPOSITION_LIST,
  CAMERA_EASING_LIST,
  CAMERA_EFFECT_LIST,
} from '../camera/compositions-and-effects.js';
import {
  SHOWCASE_TARGET_LIST,
  CameraChoreographyDirector,
} from '../camera/subject-tracker.js';

export interface CameraLabState {
  mode: 'preset' | 'combo';
  presetId: string;
  comboId: string;
  targetId: string;
  compositionId: string;
  transitionId: string;
  easing: string;
  duration: number;
  intensity: number;
  compareStatic: boolean;
  showSafeFrame916: boolean;
  showDemoPopup: boolean;
  parallaxStrength: number;
  effectOverrides: Record<string, boolean>;
}

export interface CameraTelemetry {
  x: number;
  y: number;
  viewHeight: number;
  fov: number;
  orbitYaw: number;
  phaseLabel?: string;
}

interface Props {
  state: CameraLabState;
  time: number;
  playing: boolean;
  telemetry: CameraTelemetry;
  onChange: (patch: Partial<CameraLabState>) => void;
  onTimeChange: (t: number) => void;
  onTogglePlay: () => void;
  onReplay: () => void;
  onExportFrame: () => void;
}

const QUICK_NARRATIONS = [
  'Imagine this: everything starts right here.',
  'You buy a sports car in cash.',
  'A private jet waits on the tarmac.',
  'Look at your bank account on your smartphone.',
  'You hit $1,000,000 in net worth.',
  "But here's the problem nobody mentions.",
  'And suddenly everything changes.',
];

const directorInstance = new CameraChoreographyDirector();

export const CameraPreviewLab: React.FC<Props> = ({
  state,
  time,
  playing,
  telemetry,
  onChange,
  onTimeChange,
  onTogglePlay,
  onReplay,
  onExportFrame,
}) => {
  const [subTab, setSubTab] = useState<'presets' | 'combos' | 'compose'>(
    state.mode === 'combo' ? 'combos' : 'presets'
  );
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [narrationText, setNarrationText] = useState<string>('You buy a sports car in cash.');
  const [lastDirectedNote, setLastDirectedNote] = useState<string>('');

  const filteredPresets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CAMERA_PRESET_LIST.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.purpose.toLowerCase().includes(q)
      );
    });
  }, [category, search]);

  const activePresetMeta =
    CAMERA_PRESETS[state.presetId as keyof typeof CAMERA_PRESETS] || CAMERA_PRESETS.cinematic_push_in;

  const handleSelectPreset = (preset: any) => {
    onChange({
      mode: 'preset',
      presetId: preset.id,
      targetId: preset.recommendedTarget || state.targetId,
      easing: preset.defaultEasing || 'easeInOutCubic',
      duration: preset.defaultDuration || 3.0,
      compareStatic: false,
    });
    onReplay();
  };

  const handleSelectCombo = (combo: any) => {
    onChange({
      mode: 'combo',
      comboId: combo.id,
      targetId: combo.recommendedTarget || state.targetId,
      duration: combo.defaultDuration || 4.8,
      compareStatic: false,
      showDemoPopup: combo.id === 'combo_million_dollar_reveal' ? true : state.showDemoPopup,
    });
    onReplay();
  };

  const handleAutoDirect = (sentence: string) => {
    setNarrationText(sentence);
    const plan = directorInstance.directShot({ narration: sentence });
    setLastDirectedNote(`${plan.label} → ${plan.combination || plan.preset}`);
    if (plan.combination) {
      onChange({
        mode: 'combo',
        comboId: plan.combination,
        presetId: plan.preset,
        targetId: plan.target,
        compositionId: plan.composition,
        transitionId: plan.transition,
        duration: plan.duration,
        compareStatic: false,
        showDemoPopup: plan.target === 'financial_popup',
      });
    } else {
      onChange({
        mode: 'preset',
        presetId: plan.preset,
        targetId: plan.target,
        compositionId: plan.composition,
        transitionId: plan.transition,
        duration: plan.duration,
        compareStatic: false,
      });
    }
    onReplay();
  };

  const toggleEffect = (effectId: string) => {
    const next = { ...state.effectOverrides };
    next[effectId] = !next[effectId];
    onChange({ effectOverrides: next });
  };

  return (
    <div className="space-y-4 text-xs text-slate-200">
      {/* Header & Live Telemetry */}
      <div className="rounded-lg border border-white/10 bg-[#141821] p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-amber-400" />
              Cinematic Camera Lab
            </h2>
            <p className="text-[11px] text-slate-400">
              66 Presets · 5 Combos · 22 Compositions · 14 Transitions · 16 FX
            </p>
          </div>
          <button
            type="button"
            onClick={onExportFrame}
            aria-label="Export camera preview snapshot"
            className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-[#1e2430] px-2 py-1 text-[11px] font-medium text-slate-100 hover:bg-[#283040] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            PNG
          </button>
        </div>

        {/* Before/After Comparison + 9:16 Safe Frame + $1M Popup Toggles */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ compareStatic: !state.compareStatic })}
            className={`rounded-md border px-2 py-1.5 text-[11px] font-semibold transition cursor-pointer ${
              state.compareStatic
                ? 'border-rose-400 bg-rose-600/90 text-white'
                : 'border-amber-400/60 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25'
            }`}
            title="Compare static baseline framing vs active cinematic camera preset"
          >
            {state.compareStatic ? 'Static: ON' : 'Cinematic: ON'}
          </button>

          <button
            type="button"
            onClick={() => onChange({ showSafeFrame916: !state.showSafeFrame916 })}
            className={`inline-flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-[11px] font-medium transition cursor-pointer ${
              state.showSafeFrame916
                ? 'border-teal-400 bg-teal-600/80 text-white'
                : 'border-white/10 bg-[#1c212c] text-slate-300 hover:border-white/25'
            }`}
          >
            <Maximize2 className="h-3 w-3" />
            9:16 Guide
          </button>

          <button
            type="button"
            onClick={() => onChange({ showDemoPopup: !state.showDemoPopup })}
            className={`inline-flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-[11px] font-medium transition cursor-pointer ${
              state.showDemoPopup
                ? 'border-amber-400 bg-amber-500/85 text-slate-950 font-semibold'
                : 'border-white/10 bg-[#1c212c] text-slate-300 hover:border-white/25'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            $1M Popup
          </button>
        </div>

        {/* Transport & Deterministic Timeline Scrubber */}
        <div className="space-y-1.5 pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePlay}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
                playing
                  ? 'border-amber-400 bg-amber-400 text-slate-950'
                  : 'border-white/15 bg-[#1e2430] text-white hover:bg-[#272f3e]'
              }`}
            >
              {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-[#1e2430] px-2 py-1 text-[11px] font-medium text-slate-200 hover:bg-[#272f3e] cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Replay
            </button>
            <span className="ml-auto font-mono text-[11px] text-amber-300" data-testid="camera-time-readout">
              {time.toFixed(2)}s / {state.duration.toFixed(2)}s
            </span>
          </div>

          <input
            type="range"
            aria-label="Camera timeline scrubber"
            min={0}
            max={state.duration}
            step={0.02}
            value={Math.min(state.duration, time)}
            onChange={(e) => onTimeChange(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />

          <div
            className="grid grid-cols-5 gap-1 rounded bg-[#0e1118] px-2 py-1.5 font-mono text-[10px] text-slate-300"
            data-testid="camera-telemetry"
          >
            <div>
              <span className="text-slate-500">X </span>
              {telemetry.x.toFixed(2)}
            </div>
            <div>
              <span className="text-slate-500">Y </span>
              {telemetry.y.toFixed(2)}
            </div>
            <div>
              <span className="text-slate-500">VH </span>
              {telemetry.viewHeight.toFixed(2)}
            </div>
            <div>
              <span className="text-slate-500">FOV </span>
              {telemetry.fov.toFixed(0)}°
            </div>
            <div>
              <span className="text-slate-500">YAW </span>
              {((telemetry.orbitYaw * 180) / Math.PI).toFixed(0)}°
            </div>
          </div>
          {telemetry.phaseLabel && state.mode === 'combo' && !state.compareStatic && (
            <div className="text-[10px] font-mono text-amber-300/90">
              Active Phase: {telemetry.phaseLabel}
            </div>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="grid grid-cols-3 rounded-md border border-white/10 bg-[#0e1118] p-0.5 text-[11px] font-semibold">
        {(
          [
            ['presets', 'Presets (66)', Film],
            ['combos', 'Combos (5)', Layers],
            ['compose', 'Frame & FX', SlidersHorizontal],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSubTab(id)}
            className={`inline-flex items-center justify-center gap-1 rounded py-1.5 transition cursor-pointer ${
              subTab === id ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: ALL 66 PRESETS GALLERY */}
      {subTab === 'presets' && (
        <div className="space-y-3">
          {/* Quick Parameter Controls */}
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-[#141821] p-2.5">
            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Crosshair className="h-3 w-3" /> Target Subject
              </span>
              <select
                aria-label="Camera target subject"
                value={state.targetId}
                onChange={(e) => onChange({ targetId: e.target.value })}
                className="w-full rounded border border-white/15 bg-[#1b202b] px-2 py-1 text-xs text-slate-100"
              >
                {SHOWCASE_TARGET_LIST.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Easing Curve</span>
              <select
                aria-label="Camera easing curve"
                value={state.easing}
                onChange={(e) => onChange({ easing: e.target.value })}
                className="w-full rounded border border-white/15 bg-[#1b202b] px-2 py-1 text-xs text-slate-100"
              >
                {CAMERA_EASING_LIST.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Duration</span>
                <span className="font-mono text-slate-200">{state.duration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                aria-label="Camera duration seconds"
                min={0.8}
                max={6.0}
                step={0.1}
                value={state.duration}
                onChange={(e) => onChange({ duration: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </label>

            <label className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Intensity</span>
                <span className="font-mono text-slate-200">{state.intensity.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                aria-label="Camera movement intensity"
                min={0.3}
                max={1.8}
                step={0.05}
                value={state.intensity}
                onChange={(e) => onChange({ intensity: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </label>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-2">
            <input
              type="text"
              aria-label="Search 66 camera presets"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter 66 presets (e.g. dolly, whip, smartphone, orbit)..."
              className="w-full rounded-md border border-white/15 bg-[#0f131b] px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />

            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`rounded px-2 py-1 text-[11px] font-medium border cursor-pointer ${
                  category === 'all'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                    : 'border-white/10 bg-[#1a1f29] text-slate-300 hover:border-white/20'
                }`}
              >
                All (66)
              </button>
              {CAMERA_PRESET_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`rounded px-2 py-1 text-[11px] font-medium border cursor-pointer ${
                    category === c.id
                      ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                      : 'border-white/10 bg-[#1a1f29] text-slate-300 hover:border-white/20'
                  }`}
                >
                  {c.label} ({c.count})
                </button>
              ))}
            </div>
          </div>

          {/* Preset Purpose Note */}
          {state.mode === 'preset' && (
            <div className="rounded-md border border-amber-400/25 bg-amber-400/5 px-2.5 py-2 text-[11px] text-slate-200">
              <div className="font-semibold text-amber-300">{activePresetMeta.name}</div>
              <div className="text-slate-300 mt-0.5 leading-snug">{activePresetMeta.purpose}</div>
            </div>
          )}

          {/* 66-Preset Interactive Grid */}
          <div className="grid grid-cols-2 gap-1.5 max-h-[340px] overflow-y-auto lab-scroll pr-0.5">
            {filteredPresets.map((preset) => {
              const active = state.mode === 'preset' && state.presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  data-camera-preset={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  title={preset.purpose}
                  className={`rounded-md border px-2.5 py-2 text-left transition cursor-pointer ${
                    active
                      ? 'border-amber-400 bg-amber-400/20 text-white'
                      : 'border-white/10 bg-[#1b202a] text-slate-200 hover:border-white/25 hover:bg-[#232937]'
                  }`}
                >
                  <div className="font-semibold text-[11px] truncate">{preset.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {preset.category} · {preset.defaultDuration}s
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 5 ADVANCED MULTI-LAYER COMBINATIONS + NARRATION DIRECTOR */}
      {subTab === 'combos' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              5 Reusable Multi-Layer Combinations
            </h3>
            {CAMERA_COMBINATION_LIST.map((combo) => {
              const active = state.mode === 'combo' && state.comboId === combo.id;
              return (
                <button
                  key={combo.id}
                  type="button"
                  data-camera-combo={combo.id}
                  onClick={() => handleSelectCombo(combo)}
                  className={`w-full rounded-lg border p-2.5 text-left transition cursor-pointer ${
                    active
                      ? 'border-amber-400 bg-amber-400/15 text-white'
                      : 'border-white/10 bg-[#1b202a] text-slate-200 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-white">{combo.name}</span>
                    <span className="font-mono text-[10px] text-amber-300">{combo.defaultDuration}s</span>
                  </div>
                  <div className="text-[10px] font-mono text-sky-300 mt-0.5">{combo.subtitle}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{combo.description}</p>
                </button>
              );
            })}
          </div>

          {/* Intelligent Narration-Driven Camera Choreography Director */}
          <div className="rounded-lg border border-white/10 bg-[#141821] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5" />
                Narration Camera Director
              </h3>
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                aria-label="Narration line for camera direction"
                value={narrationText}
                onChange={(e) => setNarrationText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAutoDirect(narrationText);
                }}
                className="flex-1 rounded border border-white/15 bg-[#0e1118] px-2 py-1.5 text-xs text-slate-100"
                placeholder="Type a narration line..."
              />
              <button
                type="button"
                onClick={() => handleAutoDirect(narrationText)}
                className="rounded border border-amber-400 bg-amber-400 px-2.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                Direct
              </button>
            </div>
            {lastDirectedNote && (
              <div className="text-[11px] font-mono text-emerald-300">{lastDirectedNote}</div>
            )}
            <div className="flex flex-wrap gap-1 pt-1">
              {QUICK_NARRATIONS.map((line) => (
                <button
                  key={line}
                  type="button"
                  onClick={() => handleAutoDirect(line)}
                  className="rounded border border-white/10 bg-[#1d222d] px-2 py-1 text-[10px] text-slate-300 hover:border-amber-400/50 hover:text-white cursor-pointer text-left"
                >
                  {line}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 22 COMPOSITIONS, 14 TRANSITIONS, 16 CAMERA FX & PARALLAX */}
      {subTab === 'compose' && (
        <div className="space-y-3.5">
          {/* 22 Camera Composition Presets */}
          <div className="rounded-lg border border-white/10 bg-[#141821] p-2.5 space-y-2">
            <label className="block space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Camera Composition Library (22 Presets)
              </span>
              <select
                aria-label="Select camera composition preset"
                value={state.compositionId}
                onChange={(e) => onChange({ compositionId: e.target.value })}
                className="w-full rounded border border-white/15 bg-[#1b202b] px-2 py-1.5 text-xs text-slate-100"
              >
                {CAMERA_COMPOSITION_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.category.toUpperCase()}] {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Entry Camera Transition (14 Presets)
              </span>
              <select
                aria-label="Select camera transition"
                value={state.transitionId}
                onChange={(e) => {
                  onChange({ transitionId: e.target.value });
                  onReplay();
                }}
                className="w-full rounded border border-white/15 bg-[#1b202b] px-2 py-1.5 text-xs text-slate-100"
              >
                {CAMERA_TRANSITION_LIST.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-0.5 pt-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>2.5D Layer Parallax Depth</span>
                <span className="font-mono text-slate-200">{state.parallaxStrength.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                aria-label="2.5D parallax depth strength"
                min={0}
                max={2}
                step={0.05}
                value={state.parallaxStrength}
                onChange={(e) => onChange({ parallaxStrength: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </label>
          </div>

          {/* 16 Stylized Camera Effects (9 Movement + 7 Visual) */}
          <div className="rounded-lg border border-white/10 bg-[#141821] p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Stylized Camera Effects (16)
              </span>
              <button
                type="button"
                onClick={() => onChange({ effectOverrides: {} })}
                className="text-[10px] text-slate-400 hover:text-amber-300 cursor-pointer"
              >
                Reset FX
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {CAMERA_EFFECT_LIST.map((fx) => {
                const enabled = Boolean(state.effectOverrides[fx.id]);
                return (
                  <button
                    key={fx.id}
                    type="button"
                    onClick={() => toggleEffect(fx.id)}
                    title={fx.description}
                    className={`rounded border px-2 py-1.5 text-left text-[11px] transition cursor-pointer ${
                      enabled
                        ? 'border-amber-400 bg-amber-400/20 text-amber-100 font-semibold'
                        : 'border-white/10 bg-[#1b202a] text-slate-300 hover:border-white/25'
                    }`}
                  >
                    <div className="truncate">{fx.name}</div>
                    <div className="text-[9px] font-mono uppercase text-slate-400">{fx.group}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
