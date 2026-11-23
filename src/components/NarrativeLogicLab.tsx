import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Wand2,
  Layers,
  AlertTriangle,
  Sliders,
  Eye,
  Film,
} from 'lucide-react';
import {
  SEMANTIC_CONTRAST_PRESETS,
} from '../narrative/narrative-director.js';
import { NARRATIVE_EMOTION_NAMES } from '../narrative/acting-popup-camera-directors.js';
import { CAMERA_PRESET_LIST } from '../camera/presets.js';
import { SHOWCASE_TARGET_LIST } from '../camera/subject-tracker.js';
import { ENVIRONMENT_TEMPLATE_LIST } from '../environment/templates.js';

export interface NarrativeLayerToggles {
  character: boolean;
  gaze: boolean;
  popups: boolean;
  camera: boolean;
  background: boolean;
  sfx: boolean;
}

interface Props {
  storyboard: any;
  sfxPlan: any;
  activeSnapshot: any;
  time: number;
  playing: boolean;
  soundEnabled: boolean;
  layerToggles: NarrativeLayerToggles;
  scriptText: string;
  onScriptTextChange: (text: string) => void;
  onDirectScript: (scriptInput: any, label?: string) => void;
  onSeek: (t: number) => void;
  onTogglePlay: () => void;
  onReplay: () => void;
  onToggleSound: () => void;
  onToggleLayer: (key: keyof NarrativeLayerToggles) => void;
  onOverrideBeat: (beatId: string, patch: Record<string, any>) => void;
  onExportFrame: () => void;
}

const GESTURE_OPTIONS = [
  'explain',
  'pointRight',
  'pointLeft',
  'point',
  'raiseRightHand',
  'raiseLeftHand',
  'raiseBothHands',
  'emphasisGesture',
  'talkingGesture',
  'shrug',
  'clap',
  'waveOnce',
];

const GAZE_TARGET_OPTIONS = [
  { id: 'audience', label: 'Direct to Audience' },
  { id: 'financial_popup', label: 'Financial Popup' },
  { id: 'smartphone', label: 'Smartphone' },
  { id: 'sports_car', label: 'Sports Car' },
  { id: 'private_jet', label: 'Private Jet' },
  { id: 'mansion', label: 'Hillside Mansion' },
];

export const NarrativeLogicLab: React.FC<Props> = ({
  storyboard,
  sfxPlan,
  activeSnapshot,
  time,
  playing,
  soundEnabled,
  layerToggles,
  scriptText,
  onScriptTextChange,
  onDirectScript,
  onSeek,
  onTogglePlay,
  onReplay,
  onToggleSound,
  onToggleLayer,
  onOverrideBeat,
  onExportFrame,
}) => {
  const [subtab, setSubtab] = useState<'storyboard' | 'timeline' | 'inspector'>('storyboard');
  const [editingBeatId, setEditingBeatId] = useState<string | null>(null);

  const totalDur = Math.max(0.5, storyboard?.totalDuration || 1);
  const events: any[] = storyboard?.events || [];
  const conflicts: any[] = storyboard?.conflictResolutions || [];
  const activeEv = activeSnapshot?.event || events[0] || null;

  return (
    <div className="flex flex-col gap-3.5">
      {/* Header */}
      <div className="border-b border-white/10 pb-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold tracking-tight text-white">
            Narrative-to-Visual Director
          </h2>
          <span className="font-mono-num text-[11px] text-amber-400">
            {events.length} beats · {totalDur.toFixed(1)}s
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Narration drives character acting, gaze, semantic popups, 2.5D backdrops, camera targeting, and SFX.
        </p>
      </div>

      {/* Synchronized Transport & Layer Controls */}
      <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePlay}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 cursor-pointer whitespace-nowrap"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={onReplay}
              aria-label="Replay narrative storyboard"
              className="inline-flex items-center rounded-md bg-white/10 px-2 py-1.5 text-xs text-slate-200 hover:bg-white/15 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute synchronized SFX' : 'Unmute synchronized SFX'}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium cursor-pointer ${
                soundEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              SFX
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono-num text-xs font-semibold text-amber-300">
              {time.toFixed(2)}s / {totalDur.toFixed(1)}s
            </span>
            <button
              type="button"
              onClick={onExportFrame}
              aria-label="Export current directed frame PNG"
              className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-[#1b2232] px-2 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10 cursor-pointer"
            >
              <Download className="h-3 w-3 text-amber-400" />
              PNG
            </button>
          </div>
        </div>

        <input
          type="range"
          aria-label="Narrative timeline scrubber"
          min={0}
          max={totalDur}
          step={0.05}
          value={Math.min(totalDur, time)}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-amber-400"
        />

        {/* Debug Layer Toggles */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1">
          {(
            [
              ['character', 'Character'],
              ['gaze', 'Gaze'],
              ['popups', 'Popups'],
              ['camera', 'Camera'],
              ['background', 'Backdrop'],
              ['sfx', 'SFX'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onToggleLayer(key)}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                layerToggles[key]
                  ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                  : 'bg-white/5 text-slate-500 border border-white/5 line-through'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Script Input & 1-Click Semantic Disambiguation Presets */}
      <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Wand2 className="h-3.5 w-3.5 text-amber-400" />
            Narration Script & Semantic Tests
          </span>
          <button
            type="button"
            onClick={() => onDirectScript(scriptText, 'Custom Directed Script')}
            className="rounded-md bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-400/30 cursor-pointer"
          >
            Generate Storyboard
          </button>
        </div>

        <textarea
          aria-label="Narration script input"
          rows={3}
          value={scriptText}
          onChange={(e) => onScriptTextChange(e.target.value)}
          placeholder="Enter narration script (e.g. 'Imagine making just $2,000 a month, but dreaming of becoming a millionaire.')"
          className="w-full rounded-md border border-white/10 bg-[#0f131b] p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none select-text"
        />

        <div className="mt-2 flex flex-wrap gap-1">
          {SEMANTIC_CONTRAST_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                if (typeof preset.script === 'string') {
                  onScriptTextChange(preset.script);
                }
                onDirectScript(preset.script, preset.label);
              }}
              className="rounded border border-white/10 bg-[#1b2232] px-2 py-1 text-[11px] text-slate-200 hover:border-amber-400/60 hover:text-white cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="grid grid-cols-3 rounded-md border border-white/10 bg-[#0f131b] p-0.5 text-xs font-medium">
        {(
          [
            ['storyboard', `Storyboard (${events.length})`, Film],
            ['timeline', `Timeline & Rules`, Layers],
            ['inspector', `Active Beat`, Eye],
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

      {/* SUBTAB 1: EDITABLE STORYBOARD */}
      {subtab === 'storyboard' && (
        <div className="flex flex-col gap-2">
          {events.map((ev) => {
            const isActive = activeEv?.id === ev.id;
            const isEditing = editingBeatId === ev.id;
            return (
              <div
                key={ev.id}
                className={`rounded-lg border p-2.5 transition ${
                  isActive
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-white/10 bg-[#151a24]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSeek(ev.timing.emphasisTime)}
                    className="flex-1 text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">
                        {ev.index}. {ev.meaning}
                      </span>
                      <span className="font-mono-num text-[11px] text-amber-300 shrink-0">
                        {ev.timing.startTime.toFixed(1)}s–{ev.timing.endTime.toFixed(1)}s
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-snug text-slate-300">
                      “{ev.narration}”
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBeatId(isEditing ? null : ev.id)}
                    aria-label={`Edit beat ${ev.index} overrides`}
                    className={`shrink-0 rounded border px-2 py-1 text-[11px] cursor-pointer ${
                      isEditing
                        ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Sliders className="h-3 w-3 inline mr-1" />
                    Edit
                  </button>
                </div>

                {/* Clean unboxed typographic metadata */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 font-mono-num">
                  <span className="text-sky-300">{ev.beatType}</span>
                  <span>·</span>
                  <span className="text-rose-300">{ev.character.expressionLabel}</span>
                  <span>·</span>
                  <span>{ev.character.gesture || ev.character.locomotion || 'idle'}</span>
                  <span>·</span>
                  <span>gaze: {ev.character.gaze.targetId}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 font-mono-num">
                  <span>cam: {ev.camera.presetId} -&gt; {ev.camera.targetId}</span>
                  <span>·</span>
                  <span>popup: {ev.visual ? ev.visual.templateId : 'none (restraint)'}</span>
                  <span>·</span>
                  <span>env: {ev.background.environmentId}</span>
                </div>

                {/* Inline Manual Override Editor */}
                {isEditing && (
                  <div className="mt-2.5 border-t border-white/10 pt-2.5 grid grid-cols-2 gap-2 text-xs">
                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400">Expression</span>
                      <select
                        aria-label={`Beat ${ev.index} expression override`}
                        value={ev.emotionalTone}
                        onChange={(e) => onOverrideBeat(ev.id, { expression: e.target.value })}
                        className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
                      >
                        {NARRATIVE_EMOTION_NAMES.map((em) => (
                          <option key={em} value={em}>{em}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400">Gesture</span>
                      <select
                        aria-label={`Beat ${ev.index} gesture override`}
                        value={ev.character.gesture}
                        onChange={(e) => onOverrideBeat(ev.id, { gesture: e.target.value })}
                        className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
                      >
                        {GESTURE_OPTIONS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400">Character Gaze</span>
                      <select
                        aria-label={`Beat ${ev.index} gaze override`}
                        value={ev.character.gaze.targetId}
                        onChange={(e) => onOverrideBeat(ev.id, { gazeTarget: e.target.value })}
                        className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
                      >
                        {GAZE_TARGET_OPTIONS.map((g) => (
                          <option key={g.id} value={g.id}>{g.label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400">Camera Target</span>
                      <select
                        aria-label={`Beat ${ev.index} camera target override`}
                        value={ev.camera.targetId}
                        onChange={(e) => onOverrideBeat(ev.id, { cameraTarget: e.target.value })}
                        className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
                      >
                        {SHOWCASE_TARGET_LIST.map((t) => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400">Camera Preset</span>
                      <select
                        aria-label={`Beat ${ev.index} camera preset override`}
                        value={ev.camera.presetId}
                        onChange={(e) => onOverrideBeat(ev.id, { cameraPreset: e.target.value })}
                        className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
                      >
                        {CAMERA_PRESET_LIST.slice(0, 30).map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400">Environment</span>
                      <select
                        aria-label={`Beat ${ev.index} environment override`}
                        value={ev.background.environmentId}
                        onChange={(e) => onOverrideBeat(ev.id, { environmentId: e.target.value })}
                        className="rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white"
                      >
                        {ENVIRONMENT_TEMPLATE_LIST.map((env) => (
                          <option key={env.id} value={env.id}>{env.name}</option>
                        ))}
                      </select>
                    </label>

                    {ev.visual && (
                      <div className="col-span-2 flex items-center gap-2">
                        <input
                          type="text"
                          aria-label={`Beat ${ev.index} popup text`}
                          value={ev.visual.config.content}
                          onChange={(e) => onOverrideBeat(ev.id, { popupContent: e.target.value })}
                          className="flex-1 rounded border border-white/15 bg-[#0f131b] px-2 py-1 text-xs text-white select-text"
                        />
                        <button
                          type="button"
                          onClick={() => onOverrideBeat(ev.id, { popupEnabled: false })}
                          className="rounded border border-rose-400/40 bg-rose-500/15 px-2 py-1 text-[11px] text-rose-200 hover:bg-rose-500/25 cursor-pointer"
                        >
                          Hide Popup
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: MULTI-TRACK TIMELINE & CONFLICT RESOLUTION */}
      {subtab === 'timeline' && (
        <div className="flex flex-col gap-3">
          {/* Synchronized Multi-Layer Timeline Visualization */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white">
              <span>Unified Story Event Timeline</span>
              <span className="font-mono-num text-[11px] text-slate-400">{totalDur.toFixed(1)}s</span>
            </div>

            {(
              [
                {
                  label: 'Narration',
                  color: 'bg-sky-500/70',
                  items: events.map((e) => ({
                    id: e.id,
                    start: e.timing.startTime,
                    dur: e.timing.duration,
                    text: `B${e.index} ${e.beatType}`,
                  })),
                },
                {
                  label: 'Acting',
                  color: 'bg-rose-500/70',
                  items: events.map((e) => ({
                    id: e.id,
                    start: e.timing.startTime,
                    dur: e.timing.duration,
                    text: `${e.character.expression}/${e.character.gesture}`,
                  })),
                },
                {
                  label: 'Popups',
                  color: 'bg-emerald-500/70',
                  items: events
                    .filter((e) => e.visual)
                    .map((e) => ({
                      id: e.id,
                      start: e.timing.startTime + e.visual.lifecycle.enter,
                      dur: Math.max(0.4, e.visual.lifecycle.exit - e.visual.lifecycle.enter),
                      text: e.visual.config.content,
                    })),
                },
                {
                  label: 'Camera',
                  color: 'bg-amber-500/75',
                  items: events.map((e) => ({
                    id: e.id,
                    start: e.timing.startTime,
                    dur: e.timing.duration,
                    text: `${e.camera.targetId} (${e.camera.priority})`,
                  })),
                },
                {
                  label: 'SFX',
                  color: 'bg-violet-500/75',
                  items: (sfxPlan?.events || []).map((s: any) => ({
                    id: s.id,
                    start: s.startTime,
                    dur: Math.max(0.35, s.duration),
                    text: s.presetName,
                  })),
                },
              ]
            ).map((lane) => (
              <div key={lane.label} className="mb-2 last:mb-0">
                <div className="mb-0.5 text-[10px] font-medium text-slate-400">{lane.label}</div>
                <div className="relative h-6 w-full rounded bg-[#0c0f16] border border-white/5 overflow-hidden">
                  {lane.items.map((item: { id: string; start: number; dur: number; text: string }) => {
                    const leftPct = (item.start / totalDur) * 100;
                    const widthPct = Math.max(2.5, (item.dur / totalDur) * 100);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSeek(item.start + 0.1)}
                        title={`${item.text} @ ${item.start.toFixed(2)}s`}
                        style={{ left: `${leftPct}%`, width: `${Math.min(100 - leftPct, widthPct)}%` }}
                        className={`absolute top-0.5 bottom-0.5 rounded px-1 text-[9px] font-mono text-white truncate text-left cursor-pointer ${lane.color}`}
                      >
                        {item.text}
                      </button>
                    );
                  })}
                  {/* Playhead */}
                  <div
                    style={{ left: `${(time / totalDur) * 100}%` }}
                    className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-amber-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Priority & Conflict Resolution Inspector */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white">
              <span className="inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                Priority & Conflict Resolutions
              </span>
              <span className="font-mono-num text-[11px] text-slate-400">{conflicts.length} rules applied</span>
            </div>
            {conflicts.length === 0 ? (
              <p className="text-xs text-slate-400">No layer conflicts detected in the current storyboard.</p>
            ) : (
              <ul className="space-y-1.5">
                {conflicts.map((c, idx) => (
                  <li key={`${c.beatId}-${idx}`} className="border-b border-white/5 pb-1.5 last:border-0 text-xs">
                    <div className="flex items-center justify-between font-mono-num text-[10px] text-amber-300">
                      <span>{c.rule}</span>
                      <span className="text-slate-400">{c.beatId}</span>
                    </div>
                    <p className="mt-0.5 text-slate-300 leading-snug">{c.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: ACTIVE BEAT & ATTENTION HIERARCHY INSPECTOR */}
      {subtab === 'inspector' && activeEv && (
        <div className="flex flex-col gap-3">
          {/* Attention Hierarchy */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
            <h3 className="text-xs font-semibold text-white mb-2">
              Visual Attention Hierarchy — Beat {activeEv.index}
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-[11px] text-slate-400">1. Primary Subject</dt>
                <dd className="font-semibold text-amber-300">{activeEv.hierarchy.primary}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-slate-400">2. Secondary Subject</dt>
                <dd className="text-slate-100">{activeEv.hierarchy.secondary}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-slate-400">3. Supporting Graphic</dt>
                <dd className="text-slate-200">{activeEv.hierarchy.supporting}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-slate-400">4. Environment</dt>
                <dd className="text-slate-300 font-mono-num">{activeEv.hierarchy.environment}</dd>
              </div>
            </dl>
          </div>

          {/* Synchronized Phrase & Emphasis Timing */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-semibold text-white">Voice & Phrase Synchronization</h3>
              <span className="font-mono-num text-[10px] text-sky-300">
                {activeEv.timing.timingSource}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs leading-relaxed">
              {(activeEv.timing.words || []).map((w: any, i: number) => {
                const isSpoken = time >= w.start && time <= w.end;
                const isEmphasis = w.word === activeEv.timing.emphasisWord;
                return (
                  <span
                    key={`${w.word}-${i}`}
                    className={
                      isSpoken
                        ? 'text-amber-300 font-semibold underline decoration-amber-400'
                        : isEmphasis
                          ? 'text-emerald-300 font-medium'
                          : 'text-slate-300'
                    }
                  >
                    {w.word}
                  </span>
                );
              })}
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-x-3 gap-y-1 font-mono-num text-[11px] text-slate-400">
              <span>Emphasis: <strong className="text-emerald-300">{activeEv.timing.emphasisWord}</strong> @ {activeEv.timing.emphasisTime.toFixed(2)}s</span>
              <span>Mouth sync: {activeSnapshot?.characterState?.talking ? 'Talking (speech-driven)' : 'Breath pause'}</span>
            </div>
          </div>

          {/* Camera & Background Rationale */}
          <div className="rounded-lg border border-white/10 bg-[#151a24] p-3 text-xs space-y-1.5">
            <div>
              <span className="text-slate-400">Acting Note: </span>
              <span className="text-slate-100">{activeEv.character.notes}</span>
            </div>
            <div>
              <span className="text-slate-400">Camera Rationale: </span>
              <span className="text-slate-100">{activeEv.camera.rationale}</span>
            </div>
            <div>
              <span className="text-slate-400">Backdrop Reason: </span>
              <span className="text-slate-100">{activeEv.background.changedReason}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
