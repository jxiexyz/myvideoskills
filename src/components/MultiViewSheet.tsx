import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { ViewId } from './MultiViewControls';

export interface MultiViewTile {
  viewId: ViewId;
  label: string;
  framingConvention: string;
  supportStatus: string;
  supportReason?: string;
  dataUrl: string;
}

export interface MultiViewScenarioOption {
  id: string;
  label: string;
  description: string;
}

export const MULTI_VIEW_SCENARIOS: MultiViewScenarioOption[] = [
  { id: 'current', label: 'Current Live State', description: 'Capture whatever motions & expression are active on stage right now.' },
  { id: 'walk', label: 'Walk Cycle', description: 'Synchronized stride across front, back, overhead stepping toes, and underside shoe soles.' },
  { id: 'walkWaveHappy', label: 'Walk + Wave + Happy', description: 'Multi-channel combo proving arm waving, walking legs, and expression state stay synced.' },
  { id: 'run', label: 'Run Cycle', description: 'Energetic forward lean, arm pump, and high knee/sole lift.' },
  { id: 'wave', label: 'Wave + Happy', description: 'Anatomically mirrored waving arm across front, back, top, and bottom views.' },
  { id: 'jump', label: 'Jump Apex', description: 'Mid-air jump showing upward lift on front/back, scale-up on top, and scale-down on bottom.' },
  { id: 'crouch', label: 'Crouch Stance', description: 'Planted crouch showing knee bend on front/back and depth compression on top/bottom.' },
  { id: 'clap', label: 'Clap', description: 'Two-hand applause meeting cleanly in front across all four directions.' },
];

interface MultiViewSheetProps {
  characterLabel: string;
  tiles: MultiViewTile[];
  busy: boolean;
  scenarioId: string;
  phase: number;
  activeView: string;
  onScenarioChange: (scenarioId: string) => void;
  onPhaseChange: (phase: number) => void;
  onRefresh: () => void;
  onPickView: (viewId: ViewId) => void;
}

function statusColorClass(status: string) {
  switch (status) {
    case 'native':
      return 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40';
    case 'adapted':
      return 'text-sky-300 bg-sky-950/80 border-sky-500/40';
    case 'limited':
      return 'text-amber-300 bg-amber-950/80 border-amber-500/40';
    default:
      return 'text-slate-300 bg-slate-800 border-white/10';
  }
}

export function MultiViewSheet({
  characterLabel,
  tiles,
  busy,
  scenarioId,
  phase,
  activeView,
  onScenarioChange,
  onPhaseChange,
  onRefresh,
  onPickView,
}: MultiViewSheetProps) {
  return (
    <div
      data-testid="multi-view-sheet"
      className="absolute inset-0 bg-[#14171e] p-3 flex flex-col overflow-y-auto lab-scroll"
    >
      {/* Header & Synchronized Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 shrink-0">
        <div>
          <h2 className="text-xs font-semibold text-white">
            Synchronized 4-View Sheet — {characterLabel}
          </h2>
          <p className="text-[11px] text-slate-400">
            All four views evaluated at the exact same motion phase ({Math.round(phase * 100)}%). Click any tile to inspect live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Multi-view sync motion scenario"
            value={scenarioId}
            onChange={(e) => onScenarioChange(e.target.value)}
            className="bg-[#1e222b] border border-white/15 rounded-md px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
          >
            {MULTI_VIEW_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-[#1b1f28] border border-white/10 rounded-md px-2 py-1">
            <span>Phase</span>
            <input
              type="range"
              aria-label="Synchronized animation phase"
              min={0}
              max={0.99}
              step={0.01}
              value={phase}
              onChange={(e) => onPhaseChange(parseFloat(e.target.value))}
              className="w-24 accent-sky-500 cursor-pointer"
            />
            <span className="w-8 text-right font-mono text-slate-100">{Math.round(phase * 100)}%</span>
          </label>

          <div className="inline-flex items-center gap-1">
            {[0, 0.25, 0.5, 0.75].map((snap) => (
              <button
                key={snap}
                type="button"
                onClick={() => onPhaseChange(snap)}
                className={`px-1.5 py-1 rounded text-[10px] font-mono border cursor-pointer ${
                  Math.abs(phase - snap) < 0.02
                    ? 'bg-sky-600 border-sky-400 text-white'
                    : 'bg-[#1e222b] border-white/10 text-slate-300 hover:bg-[#272c38]'
                }`}
              >
                {Math.round(snap * 100)}%
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={busy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#1e222b] border border-white/15 text-slate-100 hover:bg-[#2a303c] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
            {busy ? 'Rendering...' : 'Re-capture'}
          </button>
        </div>
      </div>

      {/* 2x2 Synchronized View Grid */}
      {tiles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          {busy ? 'Rendering all four synchronized views...' : 'Select a motion scenario to capture all four views.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-h-0">
          {tiles.map((tile) => (
            <button
              key={tile.viewId}
              type="button"
              data-multiview-tile={tile.viewId}
              onClick={() => onPickView(tile.viewId)}
              className={`group rounded-lg overflow-hidden border text-left transition-colors cursor-pointer bg-[#f4f1ec] flex flex-col min-h-[220px] ${
                activeView === tile.viewId
                  ? 'border-sky-400 ring-2 ring-sky-400/50'
                  : 'border-white/15 hover:border-sky-400/70'
              }`}
            >
              <div className="flex-1 min-h-[160px] w-full overflow-hidden bg-[#f4f1ec] flex items-center justify-center">
                <img
                  src={tile.dataUrl}
                  alt={`${tile.label} view synchronized frame`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="px-2.5 py-1.5 bg-[#1b1f28] border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white">{tile.label} View</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {tile.supportReason || tile.framingConvention}
                  </div>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded border text-[10px] font-mono uppercase shrink-0 ${statusColorClass(
                    tile.supportStatus
                  )}`}
                >
                  {tile.supportStatus}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
