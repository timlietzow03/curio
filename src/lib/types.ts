export type Visual =
  | { kind: 'formula'; main: string; sub?: string }
  | { kind: 'points'; items: string[] }
  | { kind: 'timeline'; events: { year: string; label: string }[] };

/** One beat of a clip: the narrated sentence plus what is shown while it is spoken. */
export type Scene = { say: string; visual: Visual };

export type QuizItem = { q: string; options: string[]; answer: number; explain: string };

export type Clip = {
  id: string;
  subject: string;
  hue: number;
  title: string;
  channel: { name: string; verified: boolean };
  scenes: Scene[];
  quiz: QuizItem;
  /** Real video file (e.g. in /public/videos or Vercel Blob). When set, it replaces the generated lesson. */
  videoUrl?: string;
};

/** Quiz accuracy per subject. */
export type Stats = Record<string, { right: number; total: number }>;

/** Client-side validation metrics for the pilot plan. */
export type Metrics = {
  watchSec: number;
  quizRight: number;
  quizTotal: number;
  adsShown: number;
  adsFinished: number;
  adClicks: number;
};

export type Ad = { id: string; brand: string; headline: string; body: string; cta: string; hue: number };
