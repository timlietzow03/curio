'use client';

import { useEffect, useState } from 'react';
import { ADS } from '@/data/ads';
import { AD_BONUS_POINTS, AD_SECONDS } from '@/lib/config';
import { Cross } from './Icons';

type Props = {
  mode?: 'round' | 'streak';
  onDone: () => void;
  onShown?: () => void;
  onCtaClick?: () => void;
  onCancel?: () => void;
};

/**
 * Mock ad break. Supports both standard post-quiz round breaks and rewarded ads
 * (e.g., watching an ad to protect/restore a broken daily streak).
 */
export default function AdBreak({ mode = 'round', onDone, onShown, onCtaClick, onCancel }: Props) {
  const [ad] = useState(() => ADS[Math.floor(Math.random() * ADS.length)]);
  const [left, setLeft] = useState(AD_SECONDS);
  const [note, setNote] = useState(false);

  useEffect(() => {
    onShown?.();
  }, [onShown]);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const handleCta = () => {
    if (!note) onCtaClick?.();
    setNote(true);
  };

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Advertisement">
      <div className="sheethead">
        <p className="eyebrow">
          {mode === 'streak' ? 'Rewarded ad · Streak Saver' : 'Ad break · Advertisement'}
        </p>
        {onCancel && (
          <button className="chip icon" onClick={onCancel} aria-label="Close">
            <Cross size={16} />
          </button>
        )}
      </div>
      <div className="ad">
        <div className="adart" style={{ background: `linear-gradient(135deg, hsl(${ad.hue} 65% 28%), hsl(${ad.hue} 70% 55%))` }}>
          <span>{ad.brand}</span>
        </div>
        <div className="adbody">
          <h3>{ad.headline}</h3>
          <p>{ad.body}</p>
          <button className="cta" onClick={handleCta}>
            {ad.cta}
          </button>
          {note && <p className="why">Demo ad. Engagement recorded in your validation metrics.</p>}
        </div>
      </div>
      <div className="timer">
        <i />
      </div>
      <p className="why">
        {mode === 'streak'
          ? 'Finish this short sponsor clip to protect your daily streak.'
          : 'Ads keep the app free for you.'}
      </p>
      <div className="spacer" />
      <button className="primary" disabled={left > 0} onClick={onDone}>
        {left > 0
          ? `Continue in ${left}s`
          : mode === 'streak'
            ? 'Restore streak & check in'
            : `Continue · +${AD_BONUS_POINTS} bonus points`}
      </button>
    </div>
  );
}
