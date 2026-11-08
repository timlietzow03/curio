'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CLIPS } from '@/data/clips';
import { CHECKIN_POINTS, DAILY_GOAL, DAILY_GOAL_POINTS, ROUND_SIZE, STORAGE_KEY } from '@/lib/config';
import { buildRound } from '@/lib/round';
import { initVoices, preloadSpeech, setPreferredVoice, speechSupported, unlockSpeech } from '@/lib/speech';
import type { Clip, Metrics, Stats } from '@/lib/types';
import AdBreak from './AdBreak';
import { Bookmark, Check, ChevronDown, CurioLogo, Flame, Pause, Volume, VolumeOff } from './Icons';
import Profile from './Profile';
import Quiz from './Quiz';
import TopicPicker from './TopicPicker';
import VideoCard from './VideoCard';

type Phase = 'feed' | 'quiz' | 'ad' | 'streak-ad' | 'profile';

const day = (offset = 0) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);

const EMPTY_METRICS: Metrics = {
  watchSec: 0,
  quizRight: 0,
  quizTotal: 0,
  adsShown: 0,
  adsFinished: 0,
  adClicks: 0,
};

export default function Feed() {
  const [size, setSize] = useState(ROUND_SIZE);
  const [clips, setClips] = useState<Clip[]>(() => CLIPS.slice(0, ROUND_SIZE));
  const [review, setReview] = useState<string[]>([]);
  const [batch, setBatch] = useState(1); // changes whenever the clip list is rebuilt, so cards start fresh
  const [round, setRound] = useState(1);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<Phase>('feed');
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [onboarded, setOnboarded] = useState(false);
  const [missed, setMissed] = useState<string[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [watched, setWatched] = useState(0);
  const [dailyDate, setDailyDate] = useState(() => day());
  const [dailyWatched, setDailyWatched] = useState(0);
  const [dailyGoalClaimed, setDailyGoalClaimed] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS);
  const [voiceURI, setVoiceURI] = useState('');
  const [rounds, setRounds] = useState(0);
  const [toast, setToast] = useState('');
  const [speech, setSpeech] = useState(true); // assume support until the browser says otherwise (keeps hydration identical)
  const feedRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false); // true once saved progress has been applied
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const seenThisRound = useRef(new Set<string>());
  const topicsAtOpen = useRef('');

  const atEnd = active === clips.length;
  const today = day();
  const checkedIn = lastCheckIn === today;
  const streakBroken = Boolean(lastCheckIn && lastCheckIn < day(-1) && streak > 0);
  const todayWatched = dailyDate === today ? dailyWatched : 0;

  const showToast = useCallback((m: string) => {
    setToast(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }, []);

  const rebuild = (o: { topics?: string[]; missed?: string[]; seen?: string[] } = {}) => {
    const r = buildRound({ topics: o.topics ?? topics, missed: o.missed ?? missed, seen: o.seen ?? seen, size });
    setClips(r.clips);
    setReview(r.review);
    setBatch((b) => b + 1);
    setActive(0);
    setPaused(false);
    feedRef.current?.scrollTo({ top: 0 });
  };

  // Restore saved progress and the optional ?round=N demo shortcut.
  useEffect(() => {
    setSpeech(speechSupported());
    const n = Number(new URLSearchParams(window.location.search).get('round'));
    const roundSize = n >= 1 ? Math.floor(n) : ROUND_SIZE;
    setSize(roundSize);
    let savedVoice = '';
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const t = list(s.topics);
        const m = list(s.missed);
        const sn = list(s.seen);
        setPoints(s.points ?? 0);
        setStreak(s.streak ?? 0);
        setLastCheckIn(s.lastCheckIn ?? '');
        setSaved(list(s.saved));
        setTopics(t);
        setOnboarded(Boolean(s.onboarded));
        setMissed(m);
        setSeen(sn);
        setStats(s.stats && typeof s.stats === 'object' ? s.stats : {});
        setWatched(s.watched ?? 0);
        setRounds(s.rounds ?? 0);
        const curDay = day();
        if (s.dailyDate === curDay) {
          setDailyDate(curDay);
          setDailyWatched(s.dailyWatched ?? 0);
          setDailyGoalClaimed(Boolean(s.dailyGoalClaimed));
        } else {
          setDailyDate(curDay);
          setDailyWatched(0);
          setDailyGoalClaimed(false);
        }
        if (s.metrics && typeof s.metrics === 'object') {
          setMetrics({
            watchSec: Number(s.metrics.watchSec) || 0,
            quizRight: Number(s.metrics.quizRight) || 0,
            quizTotal: Number(s.metrics.quizTotal) || 0,
            adsShown: Number(s.metrics.adsShown) || 0,
            adsFinished: Number(s.metrics.adsFinished) || 0,
            adClicks: Number(s.metrics.adClicks) || 0,
          });
        }
        if (typeof s.voiceURI === 'string') {
          savedVoice = s.voiceURI;
          setVoiceURI(s.voiceURI);
        }
        const r = buildRound({ topics: t, missed: m, seen: sn, size: roundSize });
        setClips(r.clips);
        setReview(r.review);
      } else if (n >= 1) {
        setClips(CLIPS.slice(0, roundSize));
      }
    } catch {}
    initVoices(savedVoice);
    setHydrated(true);
  }, []);

  // Preload the first clip's neural audio while the user is on the start screen.
  useEffect(() => {
    const first = clips[0];
    if (first && !first.videoUrl) {
      preloadSpeech(first.scenes.map((s) => s.say));
    }
  }, [clips, voiceURI]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          points,
          streak,
          lastCheckIn,
          saved,
          topics,
          onboarded,
          missed,
          seen,
          stats,
          watched,
          rounds,
          dailyDate,
          dailyWatched,
          dailyGoalClaimed,
          metrics,
          voiceURI,
        }),
      );
    } catch {}
  }, [
    hydrated,
    points,
    streak,
    lastCheckIn,
    saved,
    topics,
    onboarded,
    missed,
    seen,
    stats,
    watched,
    rounds,
    dailyDate,
    dailyWatched,
    dailyGoalClaimed,
    metrics,
    voiceURI,
  ]);

  // Track active watch time in seconds for validation metrics.
  useEffect(() => {
    if (!started || paused || phase !== 'feed' || atEnd) return;
    const iv = setInterval(() => {
      setMetrics((m) => ({ ...m, watchSec: m.watchSec + 1 }));
    }, 1000);
    return () => clearInterval(iv);
  }, [started, paused, phase, atEnd]);

  // Which clip is on screen.
  useEffect(() => {
    const root = feedRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setActive(Number((e.target as HTMLElement).dataset.i));
          setPaused(false);
        }),
      { root, threshold: 0.6 },
    );
    root.querySelectorAll('[data-i]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [clips]);

  // Count each clip once per round as watched, and update daily goal progress.
  useEffect(() => {
    seenThisRound.current = new Set();
  }, [clips]);
  useEffect(() => {
    if (!started || phase !== 'feed' || atEnd) return;
    const c = clips[active];
    if (!c || seenThisRound.current.has(c.id)) return;
    seenThisRound.current.add(c.id);
    setWatched((w) => w + 1);
    setSeen((s) => (s.includes(c.id) ? s : [...s, c.id]));

    const curDay = day();
    const nextDaily = (dailyDate === curDay ? dailyWatched : 0) + 1;
    const alreadyClaimed = dailyDate === curDay ? dailyGoalClaimed : false;
    setDailyDate(curDay);
    setDailyWatched(nextDaily);
    if (nextDaily >= DAILY_GOAL && !alreadyClaimed) {
      setDailyGoalClaimed(true);
      setPoints((p) => p + DAILY_GOAL_POINTS);
      showToast(`Daily goal reached! +${DAILY_GOAL_POINTS} bonus points`);
    }
  }, [active, started, phase, atEnd, clips, dailyDate, dailyWatched, dailyGoalClaimed, showToast]);

  // Reaching the end of a round opens the pop quiz.
  useEffect(() => {
    if (!atEnd || phase !== 'feed') return;
    const t = setTimeout(() => setPhase('quiz'), 1000);
    return () => clearTimeout(t);
  }, [atEnd, phase]);

  const scrollBy = useCallback((dir: number) => {
    const el = feedRef.current;
    if (el) el.scrollBy({ top: dir * el.clientHeight, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'feed' || !started) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollBy(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollBy(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [phase, started, scrollBy]);

  const start = (withSound: boolean) => {
    if (withSound) unlockSpeech();
    setMuted(!withSound);
    setStarted(true);
    if (!onboarded) {
      setOnboarded(true);
      if (topics.length) rebuild();
    }
  };

  const toggleMute = () => {
    if (muted) unlockSpeech();
    setMuted((m) => !m);
  };

  const checkIn = () => {
    if (checkedIn) return;
    if (streakBroken) {
      setPhase('streak-ad');
      return;
    }
    const next = lastCheckIn === day(-1) ? streak + 1 : 1;
    setStreak(next);
    setLastCheckIn(day());
    setPoints((p) => p + CHECKIN_POINTS);
    showToast(`Day ${next} in a row. +${CHECKIN_POINTS} points`);
  };

  const completeStreakRescue = () => {
    setMetrics((m) => ({ ...m, adsFinished: m.adsFinished + 1 }));
    const next = streak + 1;
    setStreak(next);
    setLastCheckIn(day());
    setPoints((p) => p + CHECKIN_POINTS);
    setPhase('feed');
    showToast(`Streak saved! Day ${next} in a row. +${CHECKIN_POINTS} points`);
  };

  const toggleSave = () => {
    const clip = clips[active];
    if (!clip) return;
    const on = !saved.includes(clip.id);
    setSaved((s) => (on ? [...s, clip.id] : s.filter((x) => x !== clip.id)));
    showToast(on ? 'Saved' : 'Removed');
  };

  const onFeedClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || atEnd) return;
    setPaused((p) => !p);
  };

  const onAnswer = (id: string, subject: string, ok: boolean) => {
    setStats((s) => {
      const cur = s[subject] ?? { right: 0, total: 0 };
      return { ...s, [subject]: { right: cur.right + (ok ? 1 : 0), total: cur.total + 1 } };
    });
    setMetrics((m) => ({
      ...m,
      quizRight: m.quizRight + (ok ? 1 : 0),
      quizTotal: m.quizTotal + 1,
    }));
    setMissed((m) => (ok ? m.filter((x) => x !== id) : m.includes(id) ? m : [...m, id]));
  };

  const nextRound = () => {
    setMetrics((m) => ({ ...m, adsFinished: m.adsFinished + 1 }));
    setPoints((p) => p + 20);
    setRound((r) => r + 1);
    setRounds((r) => r + 1);
    setPhase('feed');
    rebuild();
    showToast('New round. Keep scrolling!');
  };

  const recordAdShown = useCallback(() => {
    setMetrics((m) => ({ ...m, adsShown: m.adsShown + 1 }));
  }, []);

  const recordAdClick = useCallback(() => {
    setMetrics((m) => ({ ...m, adClicks: m.adClicks + 1 }));
  }, []);

  const selectVoice = (uri: string) => {
    setVoiceURI(uri);
    setPreferredVoice(uri);
  };

  const toggleTopic = (t: string) => setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const openProfile = () => {
    topicsAtOpen.current = topics.join('|');
    setPhase('profile');
  };

  const closeProfile = () => {
    setPhase('feed');
    if (topics.join('|') !== topicsAtOpen.current) {
      setRound(1);
      rebuild();
      showToast('Topics updated');
    }
  };

  const resetAll = () => {
    setPoints(0);
    setStreak(0);
    setLastCheckIn('');
    setSaved([]);
    setTopics([]);
    setMissed([]);
    setSeen([]);
    setStats({});
    setWatched(0);
    setDailyDate(day());
    setDailyWatched(0);
    setDailyGoalClaimed(false);
    setMetrics(EMPTY_METRICS);
    setRounds(0);
    setRound(1);
    setPhase('feed');
    rebuild({ topics: [], missed: [], seen: [] });
    showToast('Progress erased');
  };

  const current = clips[active];

  return (
    <section className="phone" aria-label="curio">
      <header className="top">
        <div className="brand">
          <CurioLogo size={26} />
          <span className="brandname">curio</span>
        </div>
        <div className="stats">
          <button className="chip icon" onClick={toggleMute} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
            {muted ? <VolumeOff /> : <Volume />}
          </button>
          <span className="chip" title="Days in a row">
            <span className="flame"><Flame size={14} /></span>
            {streak}
          </span>
          <button className="chip" onClick={openProfile} aria-label="Open your progress" title={`Daily goal: ${Math.min(todayWatched, DAILY_GOAL)}/${DAILY_GOAL} videos`}>
            {points} pts
          </button>
          <button className="chip go" onClick={checkIn} disabled={checkedIn}>
            {checkedIn ? (
              <>
                <Check size={13} /> Checked in
              </>
            ) : streakBroken ? (
              'Save streak'
            ) : (
              `Check-in +${CHECKIN_POINTS}`
            )}
          </button>
        </div>
      </header>

      <div className="viewport">
        <div className="feed" ref={feedRef} tabIndex={0} onClick={onFeedClick} aria-label="Learning videos">
          {clips.map((c, i) => (
            <VideoCard
              key={`${batch}-${c.id}`}
              clip={c}
              index={i}
              active={i === active}
              near={i === active + 1}
              started={started}
              muted={muted}
              paused={paused || phase !== 'feed'}
              review={review.includes(c.id)}
            />
          ))}
          <article className="card end" data-i={clips.length}>
            <div className="backdrop" />
            <div className="endbox">
              <p className="eyebrow">Round {round} complete</p>
              <h2>Quiz time</h2>
              <p>Three quick questions about what you just watched.</p>
              <button className="primary" onClick={() => setPhase('quiz')}>
                Start quiz
              </button>
            </div>
          </article>
        </div>

        <div className="rounds" aria-hidden="true">
          <div className="segs">
            {clips.map((_, i) => (
              <i key={i} className={i < active || atEnd ? 'done' : i === active ? 'cur' : ''} />
            ))}
          </div>
          <div className="rlabel">
            {atEnd
              ? `Round ${round} · Quiz time`
              : `Round ${round} · Video ${active + 1} of ${clips.length} · Goal ${Math.min(todayWatched, DAILY_GOAL)}/${DAILY_GOAL}`}
          </div>
        </div>

        {!atEnd && current && (
          <div className="rail">
            <button className={`rb${saved.includes(current.id) ? ' on' : ''}`} onClick={toggleSave} aria-label="Save">
              <Bookmark />
            </button>
            <button className="rb" onClick={() => scrollBy(1)} aria-label="Next video">
              <ChevronDown />
            </button>
          </div>
        )}

        {paused && started && !atEnd && (
          <div className="pause" aria-hidden="true">
            <Pause />
          </div>
        )}

        {!started && (
          <div className="gate">
            <div className="gatebrand">
              <CurioLogo size={48} />
              <span>curio</span>
            </div>
            <p className="eyebrow">Learn for free</p>
            <h1>Scrolling that gets you somewhere</h1>
            <p>Short learning videos. A quick quiz after every {clips.length} videos.</p>
            {!onboarded && (
              <>
                <p className="small">What do you want to learn? Pick some, or skip to see everything.</p>
                <TopicPicker selected={topics} onToggle={toggleTopic} />
              </>
            )}
            <button className="primary" onClick={() => start(true)}>
              Start with sound
            </button>
            <button className="ghost" onClick={() => start(false)}>
              Start without sound
            </button>
            {!speech && <p className="small">Your browser can’t speak text out loud. Videos play with captions only.</p>}
          </div>
        )}
      </div>

      {phase === 'quiz' && (
        <Quiz
          key={batch}
          clips={clips}
          onPoints={(n) => setPoints((p) => p + n)}
          onAnswer={onAnswer}
          onDone={() => setPhase('ad')}
        />
      )}
      {phase === 'ad' && <AdBreak mode="round" onShown={recordAdShown} onCtaClick={recordAdClick} onDone={nextRound} />}
      {phase === 'streak-ad' && (
        <AdBreak
          mode="streak"
          onShown={recordAdShown}
          onCtaClick={recordAdClick}
          onDone={completeStreakRescue}
          onCancel={() => setPhase('feed')}
        />
      )}
      {phase === 'profile' && (
        <Profile
          points={points}
          streak={streak}
          watched={watched}
          dailyWatched={todayWatched}
          rounds={rounds}
          stats={stats}
          metrics={metrics}
          streakBroken={streakBroken}
          voiceURI={voiceURI}
          onSelectVoice={selectVoice}
          onProtectStreak={() => setPhase('streak-ad')}
          saved={CLIPS.filter((c) => saved.includes(c.id))}
          topics={topics}
          onToggleTopic={toggleTopic}
          onUnsave={(id) => setSaved((s) => s.filter((x) => x !== id))}
          onReset={resetAll}
          onClose={closeProfile}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </section>
  );
}
