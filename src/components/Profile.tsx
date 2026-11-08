'use client';

import { useEffect, useState } from 'react';
import { VIBE_OPTIONS } from '@/data/hooks';
import { DAILY_GOAL, DAILY_GOAL_POINTS } from '@/lib/config';
import { getEnglishVoices, speak, subscribeVoices, type VoiceOption } from '@/lib/speech';
import type { Clip, Metrics, Stats, VibeSetting } from '@/lib/types';
import { Check, Cross, Flame, Volume } from './Icons';
import TopicPicker from './TopicPicker';

type Props = {
  points: number;
  streak: number;
  watched: number;
  dailyWatched: number;
  rounds: number;
  stats: Stats;
  metrics: Metrics;
  streakBroken: boolean;
  vibe: VibeSetting;
  onSelectVibe: (vibe: VibeSetting) => void;
  voiceURI: string;
  onSelectVoice: (uri: string) => void;
  onProtectStreak: () => void;
  saved: Clip[];
  topics: string[];
  onToggleTopic: (topic: string) => void;
  onUnsave: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
};

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function Profile({
  points,
  streak,
  watched,
  dailyWatched,
  rounds,
  stats,
  metrics,
  streakBroken,
  vibe,
  onSelectVibe,
  voiceURI,
  onSelectVoice,
  onProtectStreak,
  saved,
  topics,
  onToggleTopic,
  onUnsave,
  onReset,
  onClose,
}: Props) {
  const [sure, setSure] = useState(false);
  const [voices, setVoices] = useState<VoiceOption[]>([]);

  useEffect(() => {
    const sync = () => setVoices(getEnglishVoices());
    sync();
    return subscribeVoices(sync);
  }, []);

  const subjects = Object.entries(stats).filter(([, s]) => s.total > 0);
  const tiles: [string, number][] = [
    ['Points', points],
    ['Days in a row', streak],
    ['Videos watched', watched],
    ['Rounds finished', rounds],
  ];

  const goalDone = dailyWatched >= DAILY_GOAL;
  const goalPct = Math.min(100, (dailyWatched / DAILY_GOAL) * 100);
  const adRate = metrics.adsShown > 0 ? Math.round((metrics.adsFinished / metrics.adsShown) * 100) : 0;
  const quizRate = metrics.quizTotal > 0 ? Math.round((metrics.quizRight / metrics.quizTotal) * 100) : 0;

  const previewVoice = (uri: string) => {
    onSelectVoice(uri);
    speak('Welcome to curio! Let’s learn something new today.', () => {});
  };

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Your progress">
      <div className="sheethead">
        <h2 className="qtext">Your progress</h2>
        <button className="chip icon" onClick={onClose} aria-label="Close">
          <Cross size={16} />
        </button>
      </div>

      <div className="tiles">
        {tiles.map(([label, value]) => (
          <div key={label} className="tile">
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <p className="eyebrow">Daily goal</p>
      <div className="goalbox">
        <div className="acclabel">
          <span>
            {goalDone ? (
              <strong className="good-ink">
                <Check size={13} /> Goal reached (+{DAILY_GOAL_POINTS} pts)
              </strong>
            ) : (
              `Watch ${DAILY_GOAL} videos today`
            )}
          </span>
          <span>
            {Math.min(dailyWatched, DAILY_GOAL)} of {DAILY_GOAL}
          </span>
        </div>
        <div className="meter" aria-hidden="true">
          <i style={{ width: `${goalPct}%` }} />
        </div>
        {streakBroken && (
          <div className="streak-callout">
            <div className="grow">
              <strong>
                <Flame size={14} /> {streak}-day streak at risk!
              </strong>
              <p className="why small">You missed a day. Watch a short sponsor clip to protect your streak.</p>
            </div>
            <button type="button" className="chip go" onClick={onProtectStreak}>
              Watch ad
            </button>
          </div>
        )}
      </div>

      <p className="eyebrow">Topics & video themes</p>
      <TopicPicker selected={topics} onToggle={onToggleTopic} showVibeTag />
      <p className="why small">Pick what appears in your feed (none selected = all topics). Each topic comes with its matched video vibe.</p>

      <p className="eyebrow">Video style & hook</p>
      <div className="topics" role="group" aria-label="Video style">
        {VIBE_OPTIONS.map((v) => (
          <button
            key={v.id}
            type="button"
            className="topic"
            aria-pressed={vibe === v.id}
            onClick={() => onSelectVibe(v.id)}
          >
            {v.badge}
          </button>
        ))}
      </div>
      <p className="why small">
        {VIBE_OPTIONS.find((x) => x.id === vibe)?.desc}
      </p>

      {voices.length > 0 && (
        <>
          <p className="eyebrow">Narrator voice</p>
          <div className="voicebox">
            <select
              className="voiceselect"
              aria-label="Narrator voice"
              value={voiceURI || voices[0]?.uri || ''}
              onChange={(e) => previewVoice(e.target.value)}
            >
              {voices.map((v) => (
                <option key={v.uri} value={v.uri}>
                  {v.natural ? '★ ' : ''}
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="chip icon"
              onClick={() => previewVoice(voiceURI || voices[0]?.uri || '')}
              aria-label="Test voice"
              title="Test voice"
            >
              <Volume size={16} />
            </button>
          </div>
          <p className="why small">Studio-quality Microsoft Neural voices streamed directly via /api/tts.</p>
        </>
      )}

      <p className="eyebrow">Quiz accuracy</p>
      {subjects.length === 0 ? (
        <p className="why">Finish a round to see how you do in each subject.</p>
      ) : (
        <div className="acc">
          {subjects.map(([name, s]) => (
            <div key={name} className="accrow">
              <div className="acclabel">
                <span>{name}</span>
                <span>
                  {s.right} of {s.total}
                </span>
              </div>
              <div className="meter" aria-hidden="true">
                <i style={{ width: `${(s.right / s.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="eyebrow">Validation metrics</p>
      <div className="tiles">
        <div className="tile">
          <b>{formatDuration(metrics.watchSec)}</b>
          <span>Watch time</span>
        </div>
        <div className="tile">
          <b>{metrics.quizTotal > 0 ? `${quizRate}%` : '—'}</b>
          <span>Quiz recall ({metrics.quizRight}/{metrics.quizTotal})</span>
        </div>
        <div className="tile">
          <b>{metrics.adsShown > 0 ? `${adRate}%` : '—'}</b>
          <span>Ads finished ({metrics.adsFinished}/{metrics.adsShown})</span>
        </div>
        <div className="tile">
          <b>{metrics.adClicks}</b>
          <span>Sponsor CTA taps</span>
        </div>
      </div>

      <p className="eyebrow">Saved</p>
      {saved.length === 0 ? (
        <p className="why">Tap the bookmark on a video to keep it here.</p>
      ) : (
        <div className="rows">
          {saved.map((c) => (
            <div key={c.id} className="row">
              <span className="grow">
                {c.title} <small className="muted">· {c.subject}</small>
              </span>
              <button className="chip icon" onClick={() => onUnsave(c.id)} aria-label={`Remove ${c.title}`}>
                <Cross size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="spacer" />
      <button className="primary" onClick={onClose}>
        Done
      </button>
      {sure ? (
        <button className="ghost danger" onClick={onReset}>
          Tap again to erase all progress
        </button>
      ) : (
        <button className="ghost" onClick={() => setSure(true)}>
          Reset progress
        </button>
      )}
    </div>
  );
}
