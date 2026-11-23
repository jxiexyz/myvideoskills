import React from 'react';

export type ViewId = 'front' | 'back' | 'top' | 'bottom';

export interface ViewOptionMeta {
  id: string;
  label: string;
  shortLabel: string;
  facing: string;
  faceVisible: boolean;
  showGround: boolean;
  framingConvention: string;
  description: string;
  partCount: number;
  loaded: boolean;
}

const VIEW_ORDER: Array<{ id: ViewId; label: string; hint: string }> = [
  { id: 'front', label: 'Front', hint: 'Face & front rig' },
  { id: 'back', label: 'Back', hint: 'Rear silhouette' },
  { id: 'top', label: 'Top', hint: 'Bird\'s-eye crown' },
  { id: 'bottom', label: 'Bottom', hint: 'Underside soles' },
];

function ViewDirectionIcon({ viewId }: { viewId: ViewId }) {
  if (viewId === 'front') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="7" r="3.2" />
        <circle cx="10.9" cy="6.8" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="13.1" cy="6.8" r="0.5" fill="currentColor" stroke="none" />
        <path d="M8.5 11.5h7l1 5.5H7.5l1-5.5Z" />
        <path d="M10 17v4M14 17v4" />
      </svg>
    );
  }
  if (viewId === 'back') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8.5 7.5a3.5 3.5 0 0 1 7 0v2.5c0 .8-.5 1.4-1.2 1.5h-4.6c-.7-.1-1.2-.7-1.2-1.5V7.5Z" fill="currentColor" fillOpacity="0.22" />
        <path d="M8.5 11.5h7l1 5.5H7.5l1-5.5Z" />
        <path d="M10 17v4M14 17v4" />
      </svg>
    );
  }
  if (viewId === 'top') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
        <ellipse cx="12" cy="12" rx="8.5" ry="4.2" />
        <circle cx="12" cy="12" r="3.4" fill="currentColor" fillOpacity="0.22" />
        <path d="M12 8.8v6.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="8.5" cy="16.5" rx="2.3" ry="4" fill="currentColor" fillOpacity="0.22" />
      <ellipse cx="15.5" cy="16.5" rx="2.3" ry="4" fill="currentColor" fillOpacity="0.22" />
      <path d="M6.5 10.5c1.8 1.4 9.2 1.4 11 0" />
      <circle cx="12" cy="6.2" r="2.3" />
    </svg>
  );
}

interface ViewPresetBarProps {
  activeView: string;
  availableViews: ViewOptionMeta[];
  viewBusy: boolean;
  onSelectView: (viewId: ViewId) => void;
}

/** Compact segmented view selector placed in the top studio toolbar. */
export function ToolbarViewSwitcher({
  activeView,
  availableViews,
  viewBusy,
  onSelectView,
}: ViewPresetBarProps) {
  const availableSet = new Set(availableViews.map((v) => v.id));

  return (
    <div
      role="group"
      aria-label="Character view direction"
      className="inline-flex items-center rounded-md border border-white/15 bg-[#1b1f28] p-0.5"
    >
      {VIEW_ORDER.map((item) => {
        const enabled = availableSet.has(item.id);
        const selected = activeView === item.id;
        return (
          <button
            key={item.id}
            type="button"
            disabled={!enabled || viewBusy}
            aria-pressed={selected}
            data-view-btn={item.id}
            onClick={() => onSelectView(item.id)}
            title={enabled ? `Switch to ${item.label} view (${item.hint})` : `${item.label} view not included in this character pack`}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              selected
                ? 'bg-sky-600 text-white shadow-xs cursor-pointer'
                : enabled
                  ? 'text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer'
                  : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

interface ViewPresetPanelProps extends ViewPresetBarProps {
  transitionMs: number;
  onTransitionMsChange: (ms: number) => void;
  activeViewMeta?: ViewOptionMeta;
}

/** Detailed View Presets section placed at the top of the inspector panel. */
export function ViewPresetPanel({
  activeView,
  availableViews,
  viewBusy,
  transitionMs,
  onSelectView,
  onTransitionMsChange,
  activeViewMeta,
}: ViewPresetPanelProps) {
  const availableMap = new Map(availableViews.map((v) => [v.id, v]));

  return (
    <section aria-label="View Presets">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          View Presets (4-Direction)
        </h2>
        <div className="inline-flex items-center gap-1 text-[10px] text-slate-400">
          <span>Blend:</span>
          {[0, 250, 400].map((ms) => (
            <button
              key={ms}
              type="button"
              onClick={() => onTransitionMsChange(ms)}
              className={`px-1.5 py-0.5 rounded border font-mono cursor-pointer ${
                transitionMs === ms
                  ? 'bg-sky-600/80 border-sky-400 text-white'
                  : 'bg-[#1e222b] border-white/10 text-slate-300 hover:bg-[#272c38]'
              }`}
              title={ms === 0 ? 'Instant view switch' : `Smooth ${ms}ms view crossfade`}
            >
              {ms === 0 ? '0ms' : `${ms}ms`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {VIEW_ORDER.map((item) => {
          const meta = availableMap.get(item.id);
          const enabled = Boolean(meta);
          const selected = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={!enabled || viewBusy}
              aria-pressed={selected}
              data-view-card={item.id}
              onClick={() => onSelectView(item.id)}
              title={meta?.description || `${item.label} view not included in this character pack`}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-md border text-left transition-colors ${
                selected
                  ? 'bg-sky-600/90 border-sky-400 text-white cursor-pointer'
                  : enabled
                    ? 'bg-[#1e222b] border-white/10 text-slate-200 hover:bg-[#272c38] hover:border-white/20 cursor-pointer'
                    : 'bg-[#171a21] border-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ViewDirectionIcon viewId={item.id} />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold leading-tight">{item.label}</div>
                <div className={`text-[10px] truncate ${selected ? 'text-sky-100' : 'text-slate-400'}`}>
                  {enabled ? item.hint : 'Unavailable'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {activeViewMeta && (
        <div className="mt-2 px-2.5 py-1.5 rounded bg-[#1b1f28] border border-white/10 text-[11px] text-slate-300 leading-snug">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
            <span>{activeViewMeta.label} · {activeViewMeta.partCount} parts</span>
            <span>{activeViewMeta.faceVisible ? 'Face visible' : 'Face occluded (state synced)'}</span>
          </div>
          <p className="text-[11px] text-slate-300">{activeViewMeta.framingConvention}</p>
        </div>
      )}
    </section>
  );
}
