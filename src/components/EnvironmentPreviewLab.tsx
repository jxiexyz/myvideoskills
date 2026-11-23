import React, { useMemo, useState } from 'react';
import {
  Layers,
  Sun,
  Camera,
  Smartphone,
  Sparkles,
  User,
  Palette,
  Play,
  Pause,
} from 'lucide-react';
import {
  ENVIRONMENT_CATEGORIES,
  ENVIRONMENT_TEMPLATE_LIST,
} from '../environment/templates.js';
import { PALETTE_LIST } from '../environment/style-system.js';
import { COMPOSITION_PRESET_LIST } from '../environment/environment-composer.js';
import { DYNAMIC_ISLAND_STATES } from '../environment/props/smartphone.js';

export interface EnvironmentLabState {
  templateId: string;
  paletteId: string;
  detailLevel: 'low' | 'medium' | 'high';
  lightingMood: 'day' | 'warm' | 'cool' | 'dramatic' | 'night';
  cameraMode: 'perspective25d' | 'orthographic';
  compositionId: string;
  animateEnv: boolean;
  showCharacter: boolean;
  includeSmartphone: boolean;
  islandState: string;
  layers: {
    background: boolean;
    midground: boolean;
    interaction: boolean;
    foreground: boolean;
  };
}

interface Props {
  state: EnvironmentLabState;
  onChange: (patch: Partial<EnvironmentLabState>) => void;
  onQuickPose: (motion: string, expression: string) => void;
}

const LIGHTING_MOODS: Array<{ id: EnvironmentLabState['lightingMood']; label: string }> = [
  { id: 'day', label: 'Day' },
  { id: 'warm', label: 'Warm' },
  { id: 'cool', label: 'Cool' },
  { id: 'dramatic', label: 'Dramatic' },
  { id: 'night', label: 'Night' },
];

export const EnvironmentPreviewLab: React.FC<Props> = ({ state, onChange, onQuickPose }) => {
  const [category, setCategory] = useState<string>('all');

  const filteredTemplates = useMemo(() => {
    if (category === 'all') return ENVIRONMENT_TEMPLATE_LIST;
    return ENVIRONMENT_TEMPLATE_LIST.filter((t) => t.category === category);
  }, [category]);

  const activeTemplate = useMemo(
    () => ENVIRONMENT_TEMPLATE_LIST.find((t) => t.id === state.templateId) || ENVIRONMENT_TEMPLATE_LIST[0],
    [state.templateId]
  );

  const toggleLayer = (key: keyof EnvironmentLabState['layers']) => {
    onChange({
      layers: {
        ...state.layers,
        [key]: !state.layers[key],
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold tracking-tight text-white">
            2.5D Environment Library
          </h2>
          <span className="font-mono-num text-[11px] font-semibold text-amber-400">
            37 TEMPLATES
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {activeTemplate.description}
        </p>
      </div>

      {/* Category Filter */}
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Category
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              category === 'all'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            All (37)
          </button>
          {ENVIRONMENT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                category === c.id
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {c.label} ({c.count})
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Environment Scene</span>
          <span className="font-mono-num text-slate-500">{filteredTemplates.length} shown</span>
        </div>
        <div className="lab-scroll grid max-h-48 grid-cols-2 gap-1.5 overflow-y-auto pr-1">
          {filteredTemplates.map((tpl) => {
            const active = tpl.id === state.templateId;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() =>
                  onChange({
                    templateId: tpl.id,
                    paletteId: tpl.defaultPalette,
                    compositionId: tpl.recommendedComposition || state.compositionId,
                  })
                }
                className={`rounded-lg border px-2.5 py-2 text-left transition ${
                  active
                    ? 'border-amber-400 bg-amber-400/15 text-white'
                    : 'border-white/8 bg-[#181d29] text-slate-300 hover:border-white/20 hover:bg-[#1e2433]'
                }`}
              >
                <div className="truncate text-xs font-semibold">{tpl.name}</div>
                <div className="mt-0.5 truncate text-[10px] uppercase tracking-wide text-slate-400">
                  {tpl.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera & Composition */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            <Camera className="h-3.5 w-3.5 text-amber-400" />
            Camera & Framing
          </span>
          <div className="flex overflow-hidden rounded-md border border-white/10">
            <button
              type="button"
              onClick={() => onChange({ cameraMode: 'perspective25d' })}
              className={`px-2 py-0.5 text-[11px] font-semibold transition ${
                state.cameraMode === 'perspective25d'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              2.5D Persp
            </button>
            <button
              type="button"
              onClick={() => onChange({ cameraMode: 'orthographic' })}
              className={`px-2 py-0.5 text-[11px] font-semibold transition ${
                state.cameraMode === 'orthographic'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              Ortho
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {COMPOSITION_PRESET_LIST.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange({ compositionId: preset.id })}
              className={`rounded-md border px-2 py-1.5 text-left text-[11px] font-medium transition ${
                state.compositionId === preset.id
                  ? 'border-amber-400/80 bg-amber-400/15 text-amber-200'
                  : 'border-white/8 bg-[#1a202e] text-slate-300 hover:border-white/20'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Palette & Lighting */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          <Palette className="h-3.5 w-3.5 text-amber-400" />
          Color Palette
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PALETTE_LIST.map((pal) => (
            <button
              key={pal.id}
              type="button"
              onClick={() => onChange({ paletteId: pal.id })}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-left text-[11px] font-medium transition ${
                state.paletteId === pal.id
                  ? 'border-amber-400 bg-amber-400/15 text-white'
                  : 'border-white/8 bg-[#1a202e] text-slate-300 hover:border-white/20'
              }`}
            >
              <span className="flex shrink-0 gap-0.5">
                <span className="h-3 w-2 rounded-sm" style={{ background: pal.primary }} />
                <span className="h-3 w-2 rounded-sm" style={{ background: pal.secondary }} />
                <span className="h-3 w-2 rounded-sm" style={{ background: pal.wall }} />
              </span>
              <span className="truncate">{pal.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            Lighting Mood
          </span>
          <div className="flex gap-1">
            {(['low', 'medium', 'high'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChange({ detailLevel: lvl })}
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                  state.detailLevel === lvl
                    ? 'bg-slate-200 text-slate-950'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {LIGHTING_MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange({ lightingMood: m.id })}
              className={`rounded-md py-1 text-[11px] font-medium transition ${
                state.lightingMood === m.id
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-[#1a202e] text-slate-300 hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Depth Layers & Motion */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            2.5D Depth Layers
          </span>
          <button
            type="button"
            onClick={() => onChange({ animateEnv: !state.animateEnv })}
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold transition ${
              state.animateEnv
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-white/5 text-slate-400'
            }`}
          >
            {state.animateEnv ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {state.animateEnv ? 'Live Motion' : 'Static'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(['background', 'midground', 'interaction', 'foreground'] as const).map((layerKey) => {
            const on = state.layers[layerKey];
            return (
              <button
                key={layerKey}
                type="button"
                onClick={() => toggleLayer(layerKey)}
                className={`rounded-md border px-2.5 py-1.5 text-left text-xs font-medium capitalize transition ${
                  on
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                    : 'border-white/8 bg-[#1a202e] text-slate-500'
                }`}
              >
                {on ? '● ' : '○ '}
                {layerKey}
              </button>
            );
          })}
        </div>
      </div>

      {/* Smartphone Prop & Dynamic Island Tester */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            <Smartphone className="h-3.5 w-3.5 text-amber-400" />
            2.5D Smartphone & Dynamic Island
          </span>
          <button
            type="button"
            onClick={() => onChange({ includeSmartphone: !state.includeSmartphone })}
            className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
              state.includeSmartphone || state.templateId === 'smartphone_hero_stage'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            {state.includeSmartphone || state.templateId === 'smartphone_hero_stage'
              ? 'Active'
              : 'Show Prop'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {DYNAMIC_ISLAND_STATES.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => onChange({ includeSmartphone: true, islandState: st.id })}
              className={`rounded-md border px-2 py-1.5 text-left text-[11px] font-medium transition ${
                state.islandState === st.id
                  ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                  : 'border-white/8 bg-[#1a202e] text-slate-300 hover:border-white/20'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grounded Heroine Integration Controls */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            <User className="h-3.5 w-3.5 text-amber-400" />
            Heroine Placement
          </span>
          <button
            type="button"
            onClick={() => onChange({ showCharacter: !state.showCharacter })}
            className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
              state.showCharacter ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'
            }`}
          >
            {state.showCharacter ? 'Visible' : 'Hidden'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onQuickPose('explain', 'happy')}
            className="rounded-md bg-[#1a202e] px-2 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-white/10"
          >
            Explain
          </button>
          <button
            type="button"
            onClick={() => onQuickPose('point', 'excited')}
            className="rounded-md bg-[#1a202e] px-2 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-white/10"
          >
            Point Prop
          </button>
          <button
            type="button"
            onClick={() => onQuickPose('raiseBothHands', 'excited')}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-[#1a202e] px-2 py-1.5 text-[11px] font-medium text-amber-300 hover:bg-white/10"
          >
            <Sparkles className="h-3 w-3" /> Celebrate
          </button>
        </div>
      </div>
    </div>
  );
};
