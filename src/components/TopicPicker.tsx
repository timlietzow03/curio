'use client';

import { SUBJECT_META } from '@/data/hooks';
import { SUBJECTS } from '@/lib/round';

type Props = { selected: string[]; onToggle: (topic: string) => void; showVibeTag?: boolean };

export default function TopicPicker({ selected, onToggle, showVibeTag = false }: Props) {
  return (
    <div className="topics" role="group" aria-label="Topics">
      {SUBJECTS.map((s) => {
        const meta = SUBJECT_META[s];
        return (
          <button key={s} type="button" className="topic" aria-pressed={selected.includes(s)} onClick={() => onToggle(s)}>
            {meta ? `${meta.icon} ` : ''}
            {s}
            {showVibeTag && meta && <small className="topic-vibe"> · {meta.vibeLabel}</small>}
          </button>
        );
      })}
    </div>
  );
}
