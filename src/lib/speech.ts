import { WORDS_PER_SECOND } from './config';

export type VoiceOption = {
  uri: string;
  name: string;
  lang: string;
  natural: boolean;
};

/** Studio-grade Neural English voices. 'en-US-AvaMultilingualNeural' is pre-bundled in /audio/ for offline/static hosting. */
export const NEURAL_VOICES: VoiceOption[] = [
  { uri: 'en-US-AvaMultilingualNeural', name: 'Ava · Warm & Conversational (Bundled)', lang: 'en-US', natural: true },
  { uri: 'en-US-AndrewMultilingualNeural', name: 'Andrew · Clear & Engaging', lang: 'en-US', natural: true },
  { uri: 'en-US-EmmaMultilingualNeural', name: 'Emma · Friendly Storyteller', lang: 'en-US', natural: true },
  { uri: 'en-US-BrianMultilingualNeural', name: 'Brian · Calm Explainer', lang: 'en-US', natural: true },
  { uri: 'en-GB-SoniaNeural', name: 'Sonia · British Studio', lang: 'en-GB', natural: true },
  { uri: 'en-GB-RyanNeural', name: 'Ryan · British Documentary', lang: 'en-GB', natural: true },
];

const BUNDLED_VOICE = 'en-US-AvaMultilingualNeural';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

let preferredVoiceURI = BUNDLED_VOICE;
let fallbackVoice: SpeechSynthesisVoice | null = null;
let sharedAudio: HTMLAudioElement | null = null;
const blobUrlCache = new Map<string, Promise<string>>();
const listeners = new Set<() => void>();

export const speechSupported = () => typeof window !== 'undefined';

export function estimateMs(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(2500, (words / WORDS_PER_SECOND) * 1000);
}

/** Normalizes scientific symbols & formulas so TTS pronounces them like a human teacher. */
export function humanizeTextForSpeech(text: string): string {
  return text
    .replace(/CO₂/g, 'carbon dioxide')
    .replace(/H₂O/g, 'water')
    .replace(/O₂/g, 'oxygen')
    .replace(/C₆H₁₂O₆/g, 'glucose')
    .replace(/a²\s*\+\s*b²\s*=\s*c²/gi, 'a squared plus b squared equals c squared')
    .replace(/²/g, ' squared')
    .replace(/³/g, ' cubed')
    .replace(/√(\d+)/g, 'the square root of $1')
    .replace(/→/g, ' yields ')
    .replace(/\s+—\s+/g, ', ')
    .replace(/\s+–\s+/g, ', ');
}

/** Deterministic FNV-1a 32-bit hex hash matching scripts/generate-audio.mjs. */
export function hashText(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function getAudioElement(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = 'auto';
  }
  return sharedAudio;
}

function pickFallbackBrowserVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
  fallbackVoice =
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang === 'en-GB') ??
    voices[0] ??
    null;
}

export function initVoices(savedVoiceURI?: string) {
  if (savedVoiceURI && NEURAL_VOICES.some((v) => v.uri === savedVoiceURI)) {
    preferredVoiceURI = savedVoiceURI;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    pickFallbackBrowserVoice();
    window.speechSynthesis.onvoiceschanged = pickFallbackBrowserVoice;
  }
  listeners.forEach((fn) => fn());
}

export function getEnglishVoices(): VoiceOption[] {
  return NEURAL_VOICES;
}

export function setPreferredVoice(uri: string) {
  if (NEURAL_VOICES.some((v) => v.uri === uri)) {
    preferredVoiceURI = uri;
    listeners.forEach((fn) => fn());
  }
}

export function getActiveVoiceURI(): string {
  return preferredVoiceURI;
}

export function subscribeVoices(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function fetchNeuralAudioUrl(text: string, voiceURI: string): Promise<string> {
  const cleaned = humanizeTextForSpeech(text.trim());
  const key = `${voiceURI}::${cleaned}`;
  const existing = blobUrlCache.get(key);
  if (existing) return existing;

  const staticUrl = `${BASE_PATH}/audio/${hashText(cleaned)}.mp3`;

  const promise = (async () => {
    // 1. If using the default bundled Ava voice, load the pre-generated static MP3 first (0ms server latency & works on GitHub Pages)
    if (voiceURI === BUNDLED_VOICE) {
      const staticRes = await fetch(staticUrl);
      if (staticRes.ok) {
        const blob = await staticRes.blob();
        return URL.createObjectURL(blob);
      }
    }

    // 2. Try dynamic /api/tts endpoint (works in local dev and on Vercel)
    try {
      const params = new URLSearchParams({ text: cleaned, voice: voiceURI });
      const apiRes = await fetch(`${BASE_PATH}/api/tts?${params.toString()}`);
      if (apiRes.ok) {
        const blob = await apiRes.blob();
        return URL.createObjectURL(blob);
      }
    } catch {}

    // 3. On static hosts (like GitHub Pages) where /api/tts is unavailable, fall back to the bundled static neural MP3
    const fallbackStatic = await fetch(staticUrl);
    if (fallbackStatic.ok) {
      const blob = await fallbackStatic.blob();
      return URL.createObjectURL(blob);
    }

    throw new Error('Neural audio unavailable');
  })();

  promise.catch(() => blobUrlCache.delete(key));
  blobUrlCache.set(key, promise);
  return promise;
}

/** Preloads all scenes for a clip in the background so scene transitions have zero latency. */
export function preloadSpeech(texts: string[]) {
  if (typeof window === 'undefined') return;
  for (const t of texts) {
    fetchNeuralAudioUrl(t, preferredVoiceURI).catch(() => {});
  }
}

/** Call from a tap handler: browsers only allow audio playback after a user gesture. */
export function unlockSpeech() {
  if (typeof window === 'undefined') return;
  const audio = getAudioElement();
  if (audio) {
    // Only prime if nothing is currently playing
    if (audio.paused && !audio.src) {
      audio.muted = true;
      audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      audio
        .play()
        .then(() => {
          if (audio.src.startsWith('data:audio/wav')) {
            audio.pause();
            audio.muted = false;
          }
        })
        .catch(() => {
          audio.muted = false;
        });
    } else {
      audio.muted = false;
    }
  }
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  }
}

function speakBrowserFallback(text: string, onEnd: () => void, isCancelled: () => boolean): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    const t = setTimeout(() => {
      if (!isCancelled()) onEnd();
    }, estimateMs(text));
    return () => clearTimeout(t);
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(humanizeTextForSpeech(text));
  u.lang = 'en-US';
  if (fallbackVoice) u.voice = fallbackVoice;
  let finished = false;
  const done = () => {
    if (finished || isCancelled()) return;
    finished = true;
    clearTimeout(guard);
    onEnd();
  };
  const guard = setTimeout(done, estimateMs(text) * 1.8 + 2000);
  u.onend = done;
  u.onerror = done;
  synth.speak(u);
  return () => {
    finished = true;
    clearTimeout(guard);
    synth.cancel();
  };
}

/**
 * Speaks the text using pre-bundled or live Neural TTS (with automatic fallback)
 * and calls onEnd afterwards. Returns a cleanup function that cancels playback.
 */
export function speak(text: string, onEnd: () => void, onDurationMs?: (ms: number) => void): () => void {
  let cancelled = false;
  let cancelFallback: (() => void) | undefined;
  let guard: ReturnType<typeof setTimeout> | undefined;

  const audio = getAudioElement();
  if (audio) {
    audio.pause();
    audio.onended = null;
    audio.onerror = null;
    audio.onloadedmetadata = null;
  }

  const finish = () => {
    if (cancelled) return;
    cancelled = true;
    clearTimeout(guard);
    onEnd();
  };

  fetchNeuralAudioUrl(text, preferredVoiceURI)
    .then((blobUrl) => {
      if (cancelled || !audio) return;
      audio.muted = false;
      audio.src = blobUrl;
      audio.onloadedmetadata = () => {
        if (!cancelled && Number.isFinite(audio.duration) && audio.duration > 0) {
          onDurationMs?.(Math.round(audio.duration * 1000));
          clearTimeout(guard);
          guard = setTimeout(finish, audio.duration * 1000 + 1500);
        }
      };
      audio.onended = finish;
      audio.onerror = () => {
        if (cancelled) return;
        cancelFallback = speakBrowserFallback(text, finish, () => cancelled);
      };
      guard = setTimeout(finish, estimateMs(text) * 2.2 + 3000);
      audio.play().catch(() => {
        if (cancelled) return;
        cancelFallback = speakBrowserFallback(text, finish, () => cancelled);
      });
    })
    .catch(() => {
      if (cancelled) return;
      cancelFallback = speakBrowserFallback(text, finish, () => cancelled);
    });

  return () => {
    cancelled = true;
    clearTimeout(guard);
    cancelFallback?.();
    if (audio) {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
      audio.onloadedmetadata = null;
    }
  };
}
