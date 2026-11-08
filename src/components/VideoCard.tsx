'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Clip, Visual } from '@/lib/types';
import { estimateMs, preloadSpeech, speak, speechSupported } from '@/lib/speech';
import { Check } from './Icons';

type Props = {
  clip: Clip;
  index: number;
  active: boolean;
  near?: boolean;
  started: boolean;
  muted: boolean;
  paused: boolean;
  review?: boolean;
};

function SceneVisual({ v }: { v: Visual }) {
  if (v.kind === 'formula') {
    return (
      <div className="v-formula">
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

export default function VideoCard({ clip, index, active, near = false, started, muted, paused, review = false }: Props) {
  const scenes = clip.scenes;
  const [si, setSi] = useState(0);
  const [durMs, setDurMs] = useState(() => estimateMs(scenes[0]?.say ?? ''));
  const siRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playing = active && started && !paused;

  const go = (i: number) => {
    siRef.current = i;
    setSi(i);
    setDurMs(estimateMs(scenes[i]?.say ?? ''));
  };

  // Preload neural audio for the active and next clip so playback starts instantly.
  useEffect(() => {
    if (clip.videoUrl || muted || (!active && !near)) return;
    preloadSpeech(scenes.map((s) => s.say));
  }, [active, near, muted, clip.videoUrl, scenes]);

  // A clip that scrolls out of view starts from the beginning next time.
  useEffect(() => {
    if (!active) go(0);
  }, [active]);

  // Generated lesson: speak each scene, then move on. Loops like a short video.
  useEffect(() => {
    if (clip.videoUrl || !playing) return;
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

    run(siRef.current);
    return () => {
      alive = false;
      cancel?.();
      if (timer) clearTimeout(timer);
    };
  }, [playing, muted, clip, scenes]);

  // Real video file: play and pause with the feed.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  return (
    <article className="card" data-i={index} style={{ '--h': clip.hue } as CSSProperties}>
      <div className="backdrop" />
      {clip.videoUrl ? (
        <video ref={videoRef} className="media" src={clip.videoUrl} loop playsInline muted={muted} preload="metadata" />
      ) : (
        <div className="stagefx">
          <div key={si} className="visual">
            <SceneVisual v={scenes[si].visual} />
          </div>
        </div>
      )}
      <div className="scrim" />
      <div className="info">
        <div className="chips">
          {review && <span className="tag review">Review</span>}
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
        {!clip.videoUrl && (
          <p key={si} className="caption">
            {scenes[si].say}
          </p>
        )}
      </div>
      {!clip.videoUrl && (
        <div className="clipbar" aria-hidden="true">
          {scenes.map((_, i) => (
            <i
              key={i}
              className={i < si ? 'done' : i === si ? 'cur' : ''}
              style={
                i === si
                  ? ({ '--dur': `${durMs}ms`, animationPlayState: playing ? 'running' : 'paused' } as CSSProperties)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </article>
  );
}
