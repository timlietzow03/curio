'use client';

import { useState } from 'react';
import type { Clip, QuizItem } from '@/lib/types';
import { POINTS_PER_CORRECT, QUIZ_QUESTIONS } from '@/lib/config';
import { shuffle } from '@/lib/util';
import { Check, Cross } from './Icons';

type Question = { clipId: string; subject: string; title: string; item: QuizItem; options: { text: string; correct: boolean }[] };

function pickQuestions(clips: Clip[]): Question[] {
  return shuffle(clips)
    .slice(0, QUIZ_QUESTIONS)
    .map((c) => ({
      clipId: c.id,
      subject: c.subject,
      title: c.title,
      item: c.quiz,
      options: shuffle(c.quiz.options.map((text, k) => ({ text, correct: k === c.quiz.answer }))),
    }));
}

type Props = {
  clips: Clip[];
  onPoints: (n: number) => void;
  onAnswer: (clipId: string, subject: string, correct: boolean) => void;
  onDone: () => void;
};

export default function Quiz({ clips, onPoints, onAnswer, onDone }: Props) {
  const [qs] = useState(() => pickQuestions(clips));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const finished = results.length === qs.length && picked === null;

  const pick = (k: number) => {
    if (picked !== null) return;
    const ok = qs[i].options[k].correct;
    setPicked(k);
    setResults((r) => [...r, ok]);
    if (ok) onPoints(POINTS_PER_CORRECT);
    onAnswer(qs[i].clipId, qs[i].subject, ok);
  };

  const next = () => {
    setPicked(null);
    if (i < qs.length - 1) setI(i + 1);
  };

  if (finished) {
    const correct = results.filter(Boolean).length;
    return (
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Quiz result">
        <p className="eyebrow">Result</p>
        <div className="score">
          {correct}
          <small> of {qs.length} correct</small>
        </div>
        <p className="why">You earned {correct * POINTS_PER_CORRECT} points.</p>
        <div className="rows">
          {qs.map((q, k) => (
            <div key={k} className={`row ${results[k] ? 'good' : 'bad'}`}>
              {results[k] ? <Check size={16} /> : <Cross size={16} />}
              <span>{q.title}</span>
            </div>
          ))}
        </div>
        <div className="spacer" />
        <button className="primary" onClick={onDone} autoFocus>
          Continue
        </button>
      </div>
    );
  }

  const q = qs[i];
  const ok = picked !== null && q.options[picked].correct;
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Quiz">
      <p className="eyebrow">
        Quiz · Question {i + 1} of {qs.length}
      </p>
      <div className="qsegs">
        {qs.map((_, k) => (
          <i key={k} className={k < i || (k === i && picked !== null) ? 'done' : ''} />
        ))}
      </div>
      <h2 className="qtext">{q.item.q}</h2>
      <p className="from">From: {q.title}</p>
      <div className="opts">
        {q.options.map((o, k) => (
          <button
            key={k}
            className={`opt${picked !== null ? (o.correct ? ' good' : k === picked ? ' bad' : '') : ''}`}
            disabled={picked !== null}
            onClick={() => pick(k)}
          >
            <span className="key">{'ABC'[k]}</span>
            <span>{o.text}</span>
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="fb">
          <p className={`verdict ${ok ? 'good' : 'bad'}`}>{ok ? `Correct. +${POINTS_PER_CORRECT} points` : 'Not quite.'}</p>
          <p className="why">{q.item.explain}</p>
          <button className="primary" onClick={next} autoFocus>
            {i < qs.length - 1 ? 'Next question' : 'See results'}
          </button>
        </div>
      )}
    </div>
  );
}
