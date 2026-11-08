import type { Ad } from '@/lib/types';

/** Mock sponsors (fictional brands). A real ad network replaces this list, see components/AdBreak.tsx. */
export const ADS: Ad[] = [
  {
    id: 'lumo',
    brand: 'Lumo Languages',
    headline: 'Learn Spanish in 10 minutes a day',
    body: 'Short lessons for school and travel. Try free for 7 days.',
    cta: 'Try free',
    hue: 222,
  },
  {
    id: 'campus',
    brand: 'Campus Account',
    headline: 'The bank account for students',
    body: 'Free until 25. No fees, with card and app.',
    cta: 'Learn more',
    hue: 208,
  },
  {
    id: 'pageturn',
    brand: 'Pageturn Press',
    headline: 'Exam prep books for every subject',
    body: 'Clear explanations with practice questions.',
    cta: 'Shop now',
    hue: 236,
  },
];
