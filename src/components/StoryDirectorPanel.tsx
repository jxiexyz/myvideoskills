import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Film,
  Volume2,
  Camera,
  Wand2,
  Download,
} from 'lucide-react';
import {
  DEMO_STORY_BEATS,
  DEMO_STORY_TOTAL_DURATION,
} from '../director/story-director.js';

interface Props {
  storyTime: number;
  playing: boolean;
  activeBeatIndex: number;
  soundEnabled: boolean;
  customNarrationActive: boolean;
  customNarrationLabel: string;
  onSeek: (t: number) => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onTestNarration: (sentence: string) => void;
  onClearCustomNarration: () => void;
  onExportFrame: () => void;
}

export const StoryDirectorPanel: React.FC<Props> = ({
  storyTime,
  playing,
  activeBeatIndex,
  soundEnabled,
  customNarrationActive,
  customNarrationLabel,
  onSeek,
  onTogglePlay,
  onRestart,
  onToggleSound,
  onTestNarration,
  onClearCustomNarration,
  onExportFrame,
}) => {
  const [narrationInput, setNarrationInput] = useState(
    'Open your smartphone and see nine zeros in your bank account'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!narrationInput.trim()) return;
    onTestNarration(narrationInput.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold tracking-tight text-white">
            Story Visual Director
          </h2>
          <span className="font-mono-num text-[11px] font-semibold text-amber-400">
            6 BEATS · {DEMO_STORY_TOTAL_DURATION.toFixed(1)}s
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Synchronized 2.5D environments, camera choreography, Heroine acting, callouts & sound cues.
        </p>
      </div>

      {/* Master Playback Controls */}
      <div className="rounded-xl border border-white/10 bg-[#151a24] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePlay}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? 'Pause Story' : 'Play Story'}
            </button>
            <button
              type="button"
              onClick={onRestart}
              aria-label="Restart story"
              className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/15"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="font-mono-num text-xs font-semibold text-amber-300">
            {storyTime.toFixed(2)}s / {DEMO_STORY_TOTAL_DURATION.toFixed(1)}s
          </span>
        </div>

        <input
          type="range"
          aria-label="Story timeline scrubber"
          min={0}
          max={DEMO_STORY_TOTAL_DURATION}
          step={0.05}
          value={Math.min(DEMO_STORY_TOTAL_DURATION, storyTime)}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-amber-400"
        />

        <div className="mt-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onToggleSound}
            className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold ${
              soundEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
            {soundEnabled ? 'Sound Cues On' : 'Muted'}
          </button>
          <button
            type="button"
            onClick={onExportFrame}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-[#1b2232] px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            Export Frame PNG
          </button>
        </div>
      </div>

      {/* 6 Demo Story Beats */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5">
            <Film className="h-3.5 w-3.5 text-amber-400" />
            Demo Story: “From $2,000/mo to Nine Zeros”
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {DEMO_STORY_BEATS.map((beat) => {
            const active = !customNarrationActive && activeBeatIndex === beat.index;
            return (
              <button
                key={beat.id}
                type="button"
                onClick={() => {
                  onClearCustomNarration();
                  onSeek(beat.startTime + 0.85);
                }}
                className={`rounded-lg border p-2.5 text-left transition ${
                  active
                    ? 'border-amber-400 bg-amber-400/15'
                    : 'border-white/8 bg-[#181d29] hover:border-white/20 hover:bg-[#1e2433]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {beat.index}. {beat.title}
                  </span>
                  <span className="font-mono-num text-[10px] text-amber-300">
                    {beat.startTime.toFixed(1)}s
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-300">
                  {beat.narration}
                </p>
                <div className="mt-1.5 flex items-center gap-2 font-mono-num text-[10px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Camera className="h-3 w-3 text-slate-500" />
                    {beat.environmentId}
                  </span>
                  <span>·</span>
                  <span>{beat.graphic?.template}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Semantic Narration-to-Visual Mapper Tester */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/10 bg-[#151a24] p-3"
      >
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            <Wand2 className="h-3.5 w-3.5 text-amber-400" />
            Narration-to-Visual Mapper
          </span>
          {customNarrationActive && (
            <button
              type="button"
              onClick={onClearCustomNarration}
              className="text-[10px] font-semibold text-amber-300 hover:underline"
            >
              Return to Story
            </button>
          )}
        </div>
        <textarea
          aria-label="Custom narration line"
          rows={2}
          value={narrationInput}
          onChange={(e) => setNarrationInput(e.target.value)}
          placeholder="Type any story line (e.g. 'sports car', '$1,000,000', 'private jet', 'nine zeros')..."
          className="w-full rounded-md border border-white/10 bg-[#0f131b] p-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate text-[11px] text-slate-400">
            {customNarrationActive ? `Mapped: ${customNarrationLabel}` : 'Maps scene, camera, graphic & SFX'}
          </span>
          <button
            type="submit"
            className="shrink-0 rounded-md bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
          >
            Direct Scene
          </button>
        </div>
      </form>
    </div>
  );
};
