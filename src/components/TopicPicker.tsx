'use client';

import { SUBJECTS } from '@/lib/round';

type Props = { selected: string[]; onToggle: (topic: string) => void };

export default function TopicPicker({ selected, onToggle }: Props) {
  return (
    <div className="topics" role="group" aria-label="Topics">
      {SUBJECTS.map((s) => (
        <button key={s} type="button" className="topic" aria-pressed={selected.includes(s)} onClick={() => onToggle(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}
