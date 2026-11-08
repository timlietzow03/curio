import { CLIPS } from '@/data/clips';
import type { Clip } from './types';
import { shuffle } from './util';

export const SUBJECTS = Array.from(new Set(CLIPS.map((c) => c.subject)));

type Args = { topics: string[]; missed: string[]; seen: string[]; size: number };

/**
 * Picks the clips for one round.
 * - only the chosen topics (none chosen = everything)
 * - clips whose quiz question was answered wrong come back first, marked "Review" (at most 2)
 * - clips the user has not seen yet come before clips they have seen
 */
export function buildRound({ topics, missed, seen, size }: Args): { clips: Clip[]; review: string[] } {
  const pool = CLIPS.filter((c) => topics.length === 0 || topics.includes(c.subject));
  const n = Math.min(size, pool.length);
  const review = pool.filter((c) => missed.includes(c.id)).slice(0, Math.min(2, Math.floor(n / 3)));
  const rest = pool.filter((c) => !review.includes(c));
  const fresh = shuffle(rest.filter((c) => !seen.includes(c.id)));
  const old = shuffle(rest.filter((c) => seen.includes(c.id)));
  return { clips: [...review, ...fresh, ...old].slice(0, n), review: review.map((c) => c.id) };
}
