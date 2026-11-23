import React, { useMemo, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Sliders } from 'lucide-react';
import {
  MOTION_GRAPHIC_CATEGORIES,
  MOTION_GRAPHIC_TEMPLATE_LIST,
  GRAPHIC_THEME_LIST,
  createMotionGraphicConfig,
} from '../motion-graphics/templates.js';
import {
  ENTRANCE_EFFECTS,
  IMPACT_EFFECTS,
  CONTINUOUS_EFFECTS,
  EXIT_EFFECTS,
  GRAPHIC_TRANSITIONS,
} from '../motion-graphics/effects.js';
import { SOUND_CUE_CATEGORIES } from '../audio/sound-events.js';

export interface MotionGraphicLabConfig {
  template: string;
  layout: string;
  category: string;
  content: string;
  subtitle: string;
  secondaryValue: string;
  colorTheme: string;
  outline: boolean;
  entrance: string;
  impact: string;
  continuous: string;
  exit: string;
  transition: string;
  duration: number;
  soundCue: string;
  anchorName: string | null;
  position: string;
}

interface Props {
  config: MotionGraphicLabConfig;
  time: number;
  playing: boolean;
  speed: number;
  soundEnabled: boolean;
  onConfigChange: (next: MotionGraphicLabConfig) => void;
  onTimeChange: (t: number) => void;
  onTogglePlay: () => void;
  onReplay: () => void;
  onSpeedChange: (s: number) => void;
  onPreviewSound: (cueId: string) => void;
  onToggleSound: () => void;
}

export const MotionGraphicsLab: React.FC<Props> = ({
  config,
  time,
  playing,
  speed,
  soundEnabled,
  onConfigChange,
  onTimeChange,
  onTogglePlay,
  onReplay,
  onSpeedChange,
  onPreviewSound,
  onToggleSound,
}) => {
  const [category, setCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return MOTION_GRAPHIC_TEMPLATE_LIST;
    return MOTION_GRAPHIC_TEMPLATE_LIST.filter((t) => t.category === category);
  }, [category]);

  const selectTemplate = (templateId: string) => {
    const next = createMotionGraphicConfig(templateId, {
      transition: config.transition,
    }) as MotionGraphicLabConfig;
    onConfigChange(next);
    onReplay();
    if (soundEnabled && next.soundCue) {
      onPreviewSound(next.soundCue);
    }
  };

  const patch = (partial: Partial<MotionGraphicLabConfig>) => {
    onConfigChange({ ...config, ...partial });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold tracking-tight text-white">
            Motion Graphics & Effects Lab
          </h2>
          <span className="font-mono-num text-[11px] font-semibold text-amber-400">
            52 TEMPLATES
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Deterministic multi-layer editorial graphics synchronized over the 2.5D stage.
        </p>
      </div>

      {/* Deterministic Timeline Scrubber */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePlay}
              className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-950 hover:bg-amber-300"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-slate-200 hover:bg-white/15"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </button>
          </div>
          <span className="font-mono-num text-xs text-amber-300">
            {time.toFixed(2)}s / {config.duration.toFixed(1)}s
          </span>
        </div>
        <input
          type="range"
          aria-label="Motion graphic timeline scrubber"
          min={0}
          max={config.duration}
          step={0.02}
          value={Math.min(config.duration, time)}
          onChange={(e) => onTimeChange(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-amber-400"
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <span>Speed:</span>
            {[0.5, 1, 1.5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className={`rounded px-1.5 py-0.5 font-mono-num ${
                  speed === s ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/5 text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onToggleSound}
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${
              soundEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
            }`}
          >
            <Volume2 className="h-3 w-3" /> {soundEnabled ? 'SFX On' : 'SFX Off'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={`rounded-md px-2 py-1 text-[11px] font-medium ${
            category === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          All (52)
        </button>
        {MOTION_GRAPHIC_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`rounded-md px-2 py-1 text-[11px] font-medium ${
              category === c.id ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {c.label} ({c.count})
          </button>
        ))}
      </div>

      {/* 52-Template Browser */}
      <div className="lab-scroll grid max-h-44 grid-cols-2 gap-1.5 overflow-y-auto pr-1">
        {filtered.map((tpl) => {
          const active = tpl.id === config.template;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => selectTemplate(tpl.id)}
              className={`rounded-lg border px-2.5 py-2 text-left transition ${
                active
                  ? 'border-amber-400 bg-amber-400/15 text-white'
                  : 'border-white/8 bg-[#181d29] text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="truncate text-xs font-semibold">{tpl.name}</div>
              <div className="mt-0.5 truncate font-mono-num text-[10px] text-slate-400">
                {tpl.defaultContent}
              </div>
            </button>
          );
        })}
      </div>

      {/* Editable Content & Theme */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Content & Theme
        </div>
        <div className="flex flex-col gap-2">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Primary Headline / Value</span>
            <input
              type="text"
              value={config.content}
              onChange={(e) => patch({ content: e.target.value })}
              className="mt-0.5 w-full rounded-md border border-white/10 bg-[#0f131b] px-2.5 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Subtitle / Context</span>
            <input
              type="text"
              value={config.subtitle}
              onChange={(e) => patch({ subtitle: e.target.value })}
              className="mt-0.5 w-full rounded-md border border-white/10 bg-[#0f131b] px-2.5 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {GRAPHIC_THEME_LIST.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => patch({ colorTheme: th.id })}
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${
                  config.colorTheme === th.id
                    ? 'border-amber-400 bg-amber-400/15 text-white'
                    : 'border-white/8 bg-[#1a202e] text-slate-300'
                }`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: th.primary }} />
                <span className="truncate">{th.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Effects & Transitions Matrix */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          <Sliders className="h-3.5 w-3.5 text-amber-400" />
          Choreography & Effects
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[10px] uppercase text-slate-400">Entrance (12)</span>
            <select
              value={config.entrance}
              onChange={(e) => {
                patch({ entrance: e.target.value });
                onReplay();
              }}
              className="mt-0.5 w-full rounded-md border border-white/10 bg-[#0f131b] px-2 py-1.5 text-xs text-slate-100"
            >
              {ENTRANCE_EFFECTS.map((fx) => (
                <option key={fx.id} value={fx.id}>{fx.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase text-slate-400">Impact (10)</span>
            <select
              value={config.impact}
              onChange={(e) => {
                patch({ impact: e.target.value });
                onReplay();
              }}
              className="mt-0.5 w-full rounded-md border border-white/10 bg-[#0f131b] px-2 py-1.5 text-xs text-slate-100"
            >
              {IMPACT_EFFECTS.map((fx) => (
                <option key={fx.id} value={fx.id}>{fx.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase text-slate-400">Continuous (10)</span>
            <select
              value={config.continuous}
              onChange={(e) => patch({ continuous: e.target.value })}
              className="mt-0.5 w-full rounded-md border border-white/10 bg-[#0f131b] px-2 py-1.5 text-xs text-slate-100"
            >
              {CONTINUOUS_EFFECTS.map((fx) => (
                <option key={fx.id} value={fx.id}>{fx.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase text-slate-400">Exit (8)</span>
            <select
              value={config.exit}
              onChange={(e) => patch({ exit: e.target.value })}
              className="mt-0.5 w-full rounded-md border border-white/10 bg-[#0f131b] px-2 py-1.5 text-xs text-slate-100"
            >
              {EXIT_EFFECTS.map((fx) => (
                <option key={fx.id} value={fx.id}>{fx.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase text-slate-400">Transition (10)</span>
            <select
              value={config.transition}
              onChange={(e) => {
                patch({ transition: e.target.value });
                onReplay();
              }}
              className="mt-0.5 w-full rounded-md border border-white/10 bg-[#0f131b] px-2 py-1.5 text-xs text-slate-100"
            >
              {GRAPHIC_TRANSITIONS.map((tr) => (
                <option key={tr.id} value={tr.id}>{tr.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase text-slate-400">Sound Cue (10)</span>
            <div className="mt-0.5 flex gap-1">
              <select
                value={config.soundCue}
                onChange={(e) => {
                  patch({ soundCue: e.target.value });
                  onPreviewSound(e.target.value);
                }}
                className="w-full rounded-md border border-white/10 bg-[#0f131b] px-2 py-1.5 text-xs text-slate-100"
              >
                {SOUND_CUE_CATEGORIES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Test sound cue"
                onClick={() => onPreviewSound(config.soundCue)}
                className="rounded-md bg-white/10 px-2 text-amber-300 hover:bg-white/15"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
