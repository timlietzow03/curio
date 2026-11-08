'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { getScenesWithHook } from '@/data/hooks';
import type { Clip, VibeMode, Visual } from '@/lib/types';
import { estimateMs, preloadSpeech, speak, speechSupported } from '@/lib/speech';
import { Check } from './Icons';
import StageActor from './StageActor';

type Props = {
  clip: Clip;
  vibe: VibeMode;
  index: number;
  active: boolean;
  near?: boolean;
  started: boolean;
  muted: boolean;
  paused: boolean;
  review?: boolean;
};

function SceneVisual({ v, isHook }: { v: Visual; isHook: boolean }) {
  if (v.kind === 'formula') {
    return (
      <div className={`v-formula${isHook ? ' hook-card' : ''}`}>
        {isHook && <span className="hook-pill">WAIT FOR IT · HOOK</span>}
        <p className={v.main.length > 18 ? 'main long' : 'main'}>{v.main}</p>
        {v.sub && <p className="sub">{v.sub}</p>}
      </div>
    );
  }
  if (v.kind === 'points') {
    return (
      <ul className="v-points">
        {v.items.map((t, i) => (
          <li key={i} style={{ animationDelay: `${i * 180}ms` }}>{t}</li>
        ))}
      </ul>
    );
  }
  return (
    <ol className="v-timeline">
      {v.events.map((e, i) => (
        <li key={i} style={{ animationDelay: `${i * 180}ms` }}>
          <span>{e.year}</span>
          {e.label}
        </li>
      ))}
    </ol>
  );
}

export default function VideoCard({ clip, vibe, index, active, near = false, started, muted, paused, review = false }: Props) {
  const scenes = useMemo(() => getScenesWithHook(clip, vibe), [clip, vibe]);
  const [si, setSi] = useState(0);
  const [durMs, setDurMs] = useState(() => estimateMs(scenes[0]?.say ?? ''));
  const [vidOk, setVidOk] = useState(true);
  const [wordIdx, setWordIdx] = useState(0);
  const siRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playing = active && started && !paused;
  const safeSi = Math.min(si, scenes.length - 1);
  const isHook = safeSi === 0 && scenes.length > clip.scenes.length;
  const words = useMemo(() => scenes[safeSi].say.trim().split(/\s+/), [scenes, safeSi]);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const videoSrc = clip.videoUrl || `${basePath}/videos/vibe-${vibe}.mp4`;

  const go = (i: number) => {
    siRef.current = i;
    setSi(i);
    setWordIdx(0);
    setDurMs(estimateMs(scenes[i]?.say ?? ''));
  };

  // Preload neural audio for the active and next clip so playback starts instantly.
  useEffect(() => {
    if (muted || (!active && !near)) return;
    preloadSpeech(scenes.map((s) => s.say));
  }, [active, near, muted, scenes]);

  // A clip that scrolls out of view or switches vibe starts from the hook.
  useEffect(() => {
    setVidOk(true);
    if (!active) go(0);
  }, [active, vibe, videoSrc]);

  // Speak each scene (starting with the viral hook), then move on. Loops like a short video.
  // Works both with generated visual scenes AND over a background loop video (clip.videoUrl).
  useEffect(() => {
    if (!playing) return;
    let alive = true;
    let cancel: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = (i: number) => {
      if (!alive) return;
      go(i);
      const advance = () => {
        timer = setTimeout(() => run((i + 1) % scenes.length), i === scenes.length - 1 ? 900 : 250);
      };
      if (!muted && speechSupported()) {
        cancel = speak(scenes[i].say, advance, (ms) => {
          if (alive) setDurMs(ms);
        });
      } else {
        timer = setTimeout(advance, estimateMs(scenes[i].say));
      }
    };

    run(siRef.current < scenes.length ? siRef.current : 0);
    return () => {
      alive = false;
      cancel?.();
      if (timer) clearTimeout(timer);
    };
  }, [playing, muted, clip, scenes]);

  // Sync karaoke word highlight with the active scene's audio duration.
  useEffect(() => {
    if (!playing || words.length <= 1) return;
    setWordIdx(0);
    const stepMs = Math.max(120, Math.floor((durMs * 0.92) / words.length));
    const iv = setInterval(() => {
      setWordIdx((w) => (w < words.length - 1 ? w + 1 : w));
    }, stepMs);
    return () => clearInterval(iv);
  }, [playing, safeSi, durMs, words.length]);

  // Optional 8-10s AI background video loop (e.g. from GCP Veo): plays and pauses with the feed.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !vidOk) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, vidOk, videoSrc]);

  return (
    <article className={`card vibe-${vibe}`} data-i={index} style={{ '--h': clip.hue } as CSSProperties}>
      <div className="backdrop" />
      {vidOk && (
        <video
          ref={videoRef}
          className="media"
          src={videoSrc}
          loop
          playsInline
          muted
          preload={active ? 'metadata' : 'none'}
          onError={() => setVidOk(false)}
        />
      )}
      <div className="stagefx">
        <div key={`${vibe}-${safeSi}`} className="visual">
          <SceneVisual v={scenes[safeSi].visual} isHook={isHook} />
        </div>
      </div>
      <StageActor vibe={vibe} speaking={playing} isHook={isHook} />
      <div className="scrim" />
      <div className="info">
        <div className="chips">
          {review && <span className="tag review">Review</span>}
          <span className={`tag${isHook ? ' hooktag' : ''}`}>
            {isHook ? '⚡ Hook' : `Step ${safeSi} of ${scenes.length - 1}`}
          </span>
          <span className="tag">{clip.subject}</span>
          {clip.channel.verified && (
            <span className="src">
              <Check size={12} />
              Verified channel
            </span>
          )}
        </div>
        <h2>{clip.title}</h2>
        <p className="by">{clip.channel.name}</p>
        <p key={`${vibe}-${safeSi}`} className="caption">
          {words.map((w, k) => (
            <span key={k} className={k <= wordIdx ? 'w-lit' : 'w-dim'}>
              {w}{' '}
            </span>
          ))}
        </p>
      </div>
      <div className="clipbar" aria-hidden="true">
        {scenes.map((_, i) => (
          <i
            key={i}
            className={i < safeSi ? 'done' : i === safeSi ? 'cur' : ''}
            style={
              i === safeSi
                ? ({ '--dur': `${durMs}ms`, animationPlayState: playing ? 'running' : 'paused' } as CSSProperties)
                : undefined
            }
          />
        ))}
      </div>
    </article>
  );
}
