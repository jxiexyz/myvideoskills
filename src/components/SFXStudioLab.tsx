import React, { useMemo, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  Plus,
  Copy,
  Trash2,
  AlertTriangle,
  Sliders,
  Download,
  Layers,
  Music,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  SFX_CATEGORIES,
} from '../audio/sfx-presets.js';
import { generatePresetWaveform } from '../audio/sfx-engine.js';

interface Props {
  registry: any;
  sfxEvents: any[];
  ambienceTracks: any[];
  silenceCues: any[];
  omittedDecisions: any[];
  validation: any;
  busState: any;
  time: number;
  totalDuration: number;
  playing: boolean;
  soundEnabled: boolean;
  onSeek: (t: number) => void;
  onTogglePlay: () => void;
  onReplay: () => void;
  onToggleSound: () => void;
  onPreviewPreset: (presetId: string) => void;
  onPreviewCombo: (combo: any) => void;
  onAddEventFromPreset: (presetId: string, startTime: number) => void;
  onAddComboToTimeline: (combo: any, startTime: number) => void;
  onUpdateEvent: (eventId: string, patch: Record<string, any>) => void;
  onDuplicateEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateBus: (busId: string, patch: Record<string, any>) => void;
  onUpdateMaster: (patch: { masterVolume?: number; voiceDuckingEnabled?: boolean }) => void;
  onUpdateComboLayer: (comboId: string, layerId: string, enabled: boolean) => void;
  onSaveCustomPreset: (spec: Record<string, any>) => void;
  onResetPreset: (presetId: string) => void;
  onExportWav: () => void;
}

export const SFXStudioLab: React.FC<Props> = ({
  registry,
  sfxEvents,
  ambienceTracks,
  silenceCues,
  omittedDecisions,
  validation,
  busState,
  time,
  totalDuration,
  playing,
  soundEnabled,
  onSeek,
  onTogglePlay,
  onReplay,
  onToggleSound,
  onPreviewPreset,
  onPreviewCombo,
  onAddEventFromPreset,
  onAddComboToTimeline,
  onUpdateEvent,
  onDuplicateEvent,
  onDeleteEvent,
  onUpdateBus,
  onUpdateMaster,
  onUpdateComboLayer,
  onSaveCustomPreset,
  onResetPreset,
  onExportWav,
}) => {
  const [subtab, setSubtab] = useState<'timeline' | 'library' | 'mixer'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [intensityFilter, setIntensityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(sfxEvents[0]?.id || null);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('ui');
  const [customPitch, setCustomPitch] = useState(1.1);

  const allEvents = useMemo(() => [...sfxEvents, ...ambienceTracks], [sfxEvents, ambienceTracks]);
  const selectedEvent = useMemo(
    () => allEvents.find((e) => e.id === selectedEventId) || sfxEvents[0] || null,
    [allEvents, selectedEventId, sfxEvents]
  );

  const filteredPresets = useMemo(
    () =>
      registry.search({
        query: searchQuery,
        category: categoryFilter,
        intensity: intensityFilter,
        assetStatus: statusFilter,
      }),
    [registry, searchQuery, categoryFilter, intensityFilter, statusFilter]
  );

  const combinations = registry.listCombinations();
  const missingReport = validation?.missingAssetsReport || registry.getMissingAssetsReport();
  const warnings: any[] = validation?.warnings || [];

  const lanes = [
    { id: 'voice', label: 'Voice (Ref)', color: 'bg-sky-500/40', items: [] as any[], isVoiceRef: true },
    { id: 'sfx_primary', label: 'Primary SFX', color: 'bg-amber-500/80', items: sfxEvents.filter((e) => e.bus === 'sfx_primary') },
    { id: 'sfx_secondary', label: 'Secondary / UI', color: 'bg-emerald-500/75', items: sfxEvents.filter((e) => e.bus === 'sfx_secondary') },
    { id: 'transition', label: 'Transitions', color: 'bg-rose-500/75', items: sfxEvents.filter((e) => e.bus === 'transition') },
    { id: 'ambience', label: 'Ambience Beds', color: 'bg-slate-500/70', items: ambienceTracks },
  ];

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSaveCustomPreset({
      name: customName.trim(),
      category: customCategory,
      pitch: customPitch,
      tags: ['custom', customCategory],
      description: `Custom ${customCategory} preset saved from SFX Studio.`,
      synthRecipe: customCategory === 'camera' ? 'whoosh_soft' : customCategory === 'finance' ? 'balance_reveal' : 'ui_pop_modern',
    });
    setCustomName('');
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Header */}
      <div className="border-b border-white/10 pb-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold tracking-tight text-white">
            SFX Preset Library & Sound Director
          </h2>
          <span className="font-mono-num text-[11px] text-amber-400">
            {missingReport.readyProceduralCount} ready · {missingReport.missingFileCount} missing
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Restrained semantic sound design synchronized to narration, character actions, popups, and camera moves.
        </p>
      </div>

      {/* Synchronized Audio Transport */}
      <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePlay}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 cursor-pointer whitespace-nowrap"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? 'Pause' : 'Play Mix'}
            </button>
            <button
              type="button"
              onClick={onReplay}
              aria-label="Replay SFX timeline"
              className="inline-flex items-center rounded-md bg-white/10 px-2 py-1.5 text-xs text-slate-200 hover:bg-white/15 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute audio output' : 'Unmute audio output'}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium cursor-pointer ${
                soundEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              {soundEnabled ? 'On' : 'Muted'}
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono-num text-xs font-semibold text-amber-300">
              {time.toFixed(2)}s
            </span>
            <button
              type="button"
              onClick={onExportWav}
              className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-[#1b2232] px-2 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10 cursor-pointer whitespace-nowrap"
            >
              <Download className="h-3 w-3 text-amber-400" />
              Export WAV
            </button>
          </div>
        </div>

        <input
          type="range"
          aria-label="SFX timeline scrubber"
          min={0}
          max={Math.max(1, totalDuration)}
          step={0.05}
          value={Math.min(totalDuration, time)}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-amber-400"
        />

        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-mono-num text-slate-400">
          <span className="truncate whitespace-nowrap">
            {sfxEvents.length} SFX · {ambienceTracks.length} beds · {silenceCues.length} silence
          </span>
          <span className={`shrink-0 whitespace-nowrap font-semibold ${warnings.length > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
            {warnings.length > 0 ? `${warnings.length} warnings` : 'Mix Clean'}
          </span>
        </div>
      </div>

      {/* Subtab Bar */}
      <div className="grid grid-cols-3 rounded-md border border-white/10 bg-[#0f131b] p-0.5 text-xs font-medium">
        {(
          [
            ['timeline', 'Timeline & Edit', Layers],
            ['library', `Library (${missingReport.totalPresets})`, Music],
            ['mixer', 'Mixer & Combos', Sliders],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSubtab(id)}
            className={`inline-flex items-center justify-center gap-1 rounded py-1.5 transition cursor-pointer whitespace-nowrap ${
              subtab === id
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* SUBTAB 1: MULTI-LANE TIMELINE & EVENT INSPECTOR */}
      {subtab === 'timeline' && (
        <div className="flex flex-col gap-3">
          {/* Multi-Lane Audio Timeline */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white">
              <span>Multi-Lane Audio Timeline</span>
              <span className="font-mono-num text-[11px] text-slate-400">Click event to edit</span>
            </div>

            {lanes.map((lane) => (
              <div key={lane.id} className="mb-2 last:mb-0">
                <div className="mb-0.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{lane.label}</span>
                  <span className="font-mono-num">{lane.isVoiceRef ? 'Primary Reference' : `${lane.items.length}`}</span>
                </div>
                <div className="relative h-6 w-full rounded bg-[#0c0f16] border border-white/5 overflow-hidden">
                  {lane.isVoiceRef ? (
                    <div className="absolute inset-y-1 left-[1%] right-[2%] rounded bg-sky-500/25 border border-sky-400/30 flex items-center px-2 text-[9px] font-mono text-sky-200">
                      Narration Voice Track (Dominant Reference — Auto-Duck Active)
                    </div>
                  ) : (
                    lane.items.map((ev) => {
                      const leftPct = (ev.startTime / Math.max(0.5, totalDuration)) * 100;
                      const widthPct = Math.max(ev.loop ? 8 : 3.2, (ev.duration / Math.max(0.5, totalDuration)) * 100);
                      const isSel = selectedEvent?.id === ev.id;
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => {
                            setSelectedEventId(ev.id);
                            onSeek(ev.startTime);
                            onPreviewPreset(ev.presetId);
                          }}
                          title={`${ev.presetName} @ ${ev.startTime.toFixed(2)}s (${ev.reason})`}
                          style={{ left: `${leftPct}%`, width: `${Math.min(100 - leftPct, widthPct)}%` }}
                          className={`absolute top-0.5 bottom-0.5 rounded px-1 text-[9px] font-mono text-white truncate text-left cursor-pointer transition ${
                            ev.muted || ev.disabled
                              ? 'bg-slate-700/50 text-slate-400 line-through'
                              : lane.color
                          } ${isSel ? 'ring-1 ring-white' : ''}`}
                        >
                          {ev.presetName}
                        </button>
                      );
                    })
                  )}
                  <div
                    style={{ left: `${(time / Math.max(0.5, totalDuration)) * 100}%` }}
                    className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-amber-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Selected SFX Event Editor */}
          {selectedEvent && (
            <div className="rounded-lg border border-white/10 bg-[#151a24] p-3 text-xs">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div>
                  <div className="font-semibold text-white">{selectedEvent.presetName}</div>
                  <div className="font-mono-num text-[10px] text-slate-400">
                    {selectedEvent.visualEventId} · score {selectedEvent.importanceScore}/100 · target {selectedEvent.targetId}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onPreviewPreset(selectedEvent.presetId)}
                    aria-label="Audition selected SFX event"
                    className="rounded bg-amber-400/20 border border-amber-400/40 px-2 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-400/30 cursor-pointer"
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicateEvent(selectedEvent.id)}
                    aria-label="Duplicate SFX event"
                    className="rounded bg-white/10 p-1 text-slate-200 hover:bg-white/15 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(selectedEvent.id)}
                    aria-label="Delete SFX event"
                    className="rounded bg-rose-500/15 p-1 text-rose-300 hover:bg-rose-500/25 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-[11px] text-slate-300 leading-snug">
                Reason: {selectedEvent.reason}
              </p>

              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400">Replace Preset</span>
                  <select
                    aria-label="Replace SFX preset"
                    value={selectedEvent.presetId}
                    onChange={(e) => {
                      const p = registry.get(e.target.value);
                      if (p) {
                        onUpdateEvent(selectedEvent.id, {
                          presetId: p.id,
                          presetName: p.name,
                          category: p.category,
                          duration: p.duration,
                          manualOverride: true,
                        });
                      }
                    }}
                    className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
                  >
                    {registry.list().map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.assetStatus === 'missing_file' ? '(Missing WAV)' : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400">Audio Bus</span>
                  <select
                    aria-label="Assign audio bus"
                    value={selectedEvent.bus}
                    onChange={(e) => onUpdateEvent(selectedEvent.id, { bus: e.target.value, manualOverride: true })}
                    className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
                  >
                    <option value="sfx_primary">Primary SFX</option>
                    <option value="sfx_secondary">Secondary / UI</option>
                    <option value="transition">Transitions</option>
                    <option value="ambience">Ambience</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="flex justify-between text-[11px] text-slate-400">
                    <span>Start Time</span>
                    <span className="font-mono-num text-slate-200">{selectedEvent.startTime.toFixed(2)}s</span>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, totalDuration)}
                    step={0.02}
                    value={selectedEvent.startTime}
                    onChange={(e) => onUpdateEvent(selectedEvent.id, { startTime: parseFloat(e.target.value), manualOverride: true })}
                    className="accent-amber-400 cursor-pointer"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="flex justify-between text-[11px] text-slate-400">
                    <span>Volume</span>
                    <span className="font-mono-num text-slate-200">{Math.round(selectedEvent.volume * 100)}%</span>
                  </span>
                  <input
                    type="range"
                    min={0.05}
                    max={1}
                    step={0.02}
                    value={selectedEvent.volume}
                    onChange={(e) => onUpdateEvent(selectedEvent.id, { volume: parseFloat(e.target.value), manualOverride: true })}
                    className="accent-amber-400 cursor-pointer"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="flex justify-between text-[11px] text-slate-400">
                    <span>Pitch</span>
                    <span className="font-mono-num text-slate-200">{selectedEvent.pitch.toFixed(2)}x</span>
                  </span>
                  <input
                    type="range"
                    min={0.6}
                    max={1.6}
                    step={0.05}
                    value={selectedEvent.pitch}
                    onChange={(e) => onUpdateEvent(selectedEvent.id, { pitch: parseFloat(e.target.value), manualOverride: true })}
                    className="accent-sky-400 cursor-pointer"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="flex justify-between text-[11px] text-slate-400">
                    <span>Playback Rate</span>
                    <span className="font-mono-num text-slate-200">{selectedEvent.playbackRate.toFixed(2)}x</span>
                  </span>
                  <input
                    type="range"
                    min={0.6}
                    max={1.6}
                    step={0.05}
                    value={selectedEvent.playbackRate}
                    onChange={(e) => onUpdateEvent(selectedEvent.id, { playbackRate: parseFloat(e.target.value), manualOverride: true })}
                    className="accent-sky-400 cursor-pointer"
                  />
                </label>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateEvent(selectedEvent.id, { muted: !selectedEvent.muted })}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                    selectedEvent.muted ? 'bg-rose-500/25 text-rose-200' : 'bg-white/10 text-slate-200'
                  }`}
                >
                  {selectedEvent.muted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateEvent(selectedEvent.id, { solo: !selectedEvent.solo })}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                    selectedEvent.solo ? 'bg-amber-400 text-slate-950 font-semibold' : 'bg-white/10 text-slate-200'
                  }`}
                >
                  Solo
                </button>
              </div>
            </div>
          )}

          {/* Warnings, Intentional Silence & Omitted Clutter Log */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3 text-xs">
            <div className="mb-1.5 flex items-center justify-between font-semibold text-white">
              <span className="inline-flex items-center gap-1.5">
                {warnings.length > 0 ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                )}
                Sound Design Audit & Restraint Log
              </span>
            </div>

            {warnings.length > 0 && (
              <ul className="mb-2 space-y-1">
                {warnings.map((w) => (
                  <li key={w.id} className="text-[11px] text-amber-300">
                    [{w.type}] {w.message}
                  </li>
                ))}
              </ul>
            )}

            {silenceCues.length > 0 && (
              <div className="mt-1.5 space-y-1">
                <div className="text-[11px] font-medium text-sky-300">Intentional Silence & Ducking ({silenceCues.length})</div>
                {silenceCues.map((s) => (
                  <div key={s.id} className="text-[11px] text-slate-300 font-mono-num">
                    {s.startTime.toFixed(1)}s–{s.endTime.toFixed(1)}s · {s.reason}
                  </div>
                ))}
              </div>
            )}

            {omittedDecisions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                <div className="text-[11px] font-medium text-slate-400">Omitted to Avoid Clutter ({omittedDecisions.length})</div>
                {omittedDecisions.slice(0, 4).map((o, idx) => (
                  <div key={`${o.beatId}-${idx}`} className="text-[11px] text-slate-400">
                    · {o.reason}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SEARCHABLE SFX PRESET LIBRARY */}
      {subtab === 'library' && (
        <div className="flex flex-col gap-2.5">
          {/* Search & Filters */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-2.5 space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                aria-label="Search SFX presets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search presets by name, tag, or use case..."
                className="w-full rounded-md border border-white/10 bg-[#0f131b] pl-8 pr-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none select-text"
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <select
                aria-label="Filter by SFX category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded border border-white/15 bg-[#0f131b] px-1.5 py-1 text-[11px] text-white"
              >
                <option value="all">All Categories (8)</option>
                {SFX_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              <select
                aria-label="Filter by SFX intensity"
                value={intensityFilter}
                onChange={(e) => setIntensityFilter(e.target.value)}
                className="rounded border border-white/15 bg-[#0f131b] px-1.5 py-1 text-[11px] text-white"
              >
                <option value="all">Any Intensity</option>
                <option value="subtle">Subtle</option>
                <option value="medium">Medium</option>
                <option value="strong">Strong</option>
              </select>

              <select
                aria-label="Filter by asset status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded border border-white/15 bg-[#0f131b] px-1.5 py-1 text-[11px] text-white"
              >
                <option value="all">All Status</option>
                <option value="ready_procedural">Ready (Synth)</option>
                <option value="missing_file">Missing WAV</option>
              </select>
            </div>
          </div>

          {/* Preset List with Waveform Representation */}
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto lab-scroll pr-0.5">
            {filteredPresets.map((preset: any) => {
              const bars = generatePresetWaveform(preset, 22);
              const isMissing = preset.assetStatus === 'missing_file';
              return (
                <div
                  key={preset.id}
                  className={`rounded-lg border p-2.5 ${
                    isMissing
                      ? 'border-amber-500/40 bg-amber-950/20'
                      : 'border-white/10 bg-[#151a24]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-white">
                        {preset.name}
                      </div>
                      <div className="font-mono-num text-[10px] text-slate-400">
                        {preset.category} · {preset.duration.toFixed(2)}s · {preset.intensity} · {preset.bus}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={isMissing}
                        onClick={() => onPreviewPreset(preset.id)}
                        aria-label={`Preview ${preset.name}`}
                        className={`rounded px-2 py-1 text-[11px] font-medium ${
                          isMissing
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                            : 'bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 cursor-pointer'
                        }`}
                      >
                        <Play className="h-3 w-3 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddEventFromPreset(preset.id, time)}
                        aria-label={`Add ${preset.name} to timeline`}
                        className="rounded bg-white/10 px-2 py-1 text-[11px] text-slate-200 hover:bg-white/15 cursor-pointer"
                      >
                        <Plus className="h-3 w-3 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onResetPreset(preset.id)}
                        aria-label={`Reset ${preset.name} defaults`}
                        className="rounded bg-white/5 p-1 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Deterministic Waveform Strip */}
                  <div className="mt-1.5 flex h-5 items-end gap-0.5" aria-hidden="true">
                    {bars.map((amp, i) => (
                      <div
                        key={i}
                        style={{ height: `${Math.round(amp * 100)}%` }}
                        className={`flex-1 rounded-xs ${isMissing ? 'bg-amber-500/40' : 'bg-sky-400/65'}`}
                      />
                    ))}
                  </div>

                  <p className="mt-1 text-[11px] text-slate-300 leading-snug">
                    {preset.description}
                  </p>
                  {isMissing && (
                    <div className="mt-1 text-[10px] font-mono text-amber-300">
                      Missing file: {preset.asset.path}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Save Custom Preset */}
          <form onSubmit={handleSaveCustom} className="rounded-lg border border-white/10 bg-[#151a24] p-2.5">
            <div className="text-xs font-semibold text-white mb-1.5">Save Custom Preset</div>
            <div className="flex gap-1.5">
              <input
                type="text"
                aria-label="Custom preset name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Custom preset name..."
                className="flex-1 rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white select-text"
              />
              <select
                aria-label="Custom preset category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
              >
                {SFX_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.id}</option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded bg-amber-400 px-2.5 py-1 text-xs font-semibold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                Save
              </button>
            </div>
            <label className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Pitch Multiplier: {customPitch.toFixed(2)}x</span>
              <input
                type="range"
                min={0.7}
                max={1.5}
                step={0.05}
                value={customPitch}
                onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                className="w-28 accent-sky-400 cursor-pointer"
              />
            </label>
          </form>
        </div>
      )}

      {/* SUBTAB 3: 6-BUS MIXER, EDITABLE COMBINATIONS & MISSING ASSETS AUDIT */}
      {subtab === 'mixer' && (
        <div className="flex flex-col gap-3">
          {/* 6-Bus Audio Mixer */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white">6-Bus Audio Mixer</h3>
              <button
                type="button"
                onClick={() => onUpdateMaster({ voiceDuckingEnabled: !busState.voiceDuckingEnabled })}
                className={`rounded px-2 py-0.5 text-[11px] font-medium cursor-pointer ${
                  busState.voiceDuckingEnabled
                    ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                    : 'bg-white/5 text-slate-400'
                }`}
              >
                Voice Duck: {busState.voiceDuckingEnabled ? 'Auto' : 'Off'}
              </button>
            </div>

            <div className="space-y-2">
              {(busState.buses || []).map((bus: any) => (
                <div key={bus.id} className="flex items-center gap-2 text-xs">
                  <span className="w-24 truncate text-slate-200">{bus.label}</span>
                  <input
                    type="range"
                    aria-label={`${bus.label} volume`}
                    min={0}
                    max={1}
                    step={0.02}
                    value={bus.volume}
                    onChange={(e) => onUpdateBus(bus.id, { volume: parseFloat(e.target.value) })}
                    className="flex-1 accent-amber-400 cursor-pointer"
                  />
                  <span className="w-9 text-right font-mono-num text-[11px] text-slate-300">
                    {Math.round(bus.volume * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateBus(bus.id, { muted: !bus.muted })}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold cursor-pointer ${
                      bus.muted ? 'bg-rose-500/30 text-rose-200' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    M
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBus(bus.id, { solo: !bus.solo })}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold cursor-pointer ${
                      bus.solo ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    S
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 7 Editable SFX Combinations */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
            <h3 className="text-xs font-semibold text-white mb-2">
              Reusable SFX Combinations ({combinations.length})
            </h3>
            <div className="space-y-2">
              {combinations.map((combo: any) => (
                <div key={combo.id} className="rounded border border-white/10 bg-[#0f131b] p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white">{combo.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPreviewCombo(combo)}
                        className="rounded bg-amber-400/20 px-2 py-0.5 text-[11px] font-medium text-amber-200 hover:bg-amber-400/30 cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddComboToTimeline(combo, time)}
                        className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-slate-200 hover:bg-white/15 cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">{combo.description}</p>
                  <div className="mt-1.5 space-y-1">
                    {combo.layers.map((layer: any) => (
                      <label key={layer.id} className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                        <span className="inline-flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={layer.enabled}
                            onChange={(e) => onUpdateComboLayer(combo.id, layer.id, e.target.checked)}
                            className="accent-amber-400"
                          />
                          <span>{layer.presetId}</span>
                        </span>
                        <span className="font-mono-num text-[10px] text-slate-400">
                          +{layer.offsetSec.toFixed(2)}s · {layer.role}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Honest Missing-Assets Audit Report */}
          <div className="rounded-lg border border-amber-500/30 bg-[#151a24] p-3 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-amber-300">Missing External Audio Assets ({missingReport.missingFileCount})</span>
              <span className="font-mono-num text-[10px] text-slate-400">
                {missingReport.readyProceduralCount}/{missingReport.totalPresets} procedural ready
              </span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300 font-mono-num">
              {missingReport.missingPresets.map((m: any) => (
                <li key={m.id}>
                  · <span className="text-white">{m.id}</span> -&gt; {m.expectedPath}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
