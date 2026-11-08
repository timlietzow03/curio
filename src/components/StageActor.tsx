'use client';

import type { VibeMode } from '@/lib/types';

type Props = {
  vibe: VibeMode;
  speaking: boolean;
  isHook: boolean;
};

/**
 * Animated character stage (Talking Stickman, Makeup GRWM Vlog, Sport Focus, or Podcast Host)
 * that reacts to voice playback and highlights the opening hook.
 */
export default function StageActor({ vibe, speaking, isHook }: Props) {
  return (
    <div className={`actor actor-${vibe}${speaking ? ' talking' : ''}${isHook ? ' hook-beat' : ''}`} aria-hidden="true">
      <div className="actor-badge">
        {vibe === 'stickman' && (isHook ? '⚡ Hook' : '✏️ Stickman')}
        {vibe === 'makeup' && (isHook ? '💄 GRWM Hook' : '💄 GRWM Vlog')}
        {vibe === 'sport' && (isHook ? '🏋️ Sport Hook' : '🏋️ Pro Rep')}
        {vibe === 'podcast' && (isHook ? '🎙️ Cold Open' : '🎙️ Live Pod')}
      </div>
      <svg className="actor-svg" viewBox="0 0 120 130" fill="none">
        {/* Subtle studio glow */}
        <circle cx="60" cy="66" r="46" fill="rgba(130, 165, 255, 0.10)" />

        {/* Vibe-specific background props */}
        {vibe === 'makeup' && (
          <g className="prop-ringlight" opacity="0.45">
            <circle cx="60" cy="40" r="30" stroke="#f9a8d4" strokeWidth="2" strokeDasharray="4 4" />
          </g>
        )}
        {vibe === 'podcast' && (
          <g className="prop-Headphones">
            <path d="M40 36 A20 20 0 0 1 80 36" stroke="#82a5ff" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="36" y="32" width="6" height="13" rx="3" fill="#82a5ff" />
            <rect x="78" y="32" width="6" height="13" rx="3" fill="#82a5ff" />
          </g>
        )}
        {vibe === 'sport' && (
          <path d="M43 29 H77" stroke="#4cc38a" strokeWidth="4" strokeLinecap="round" />
        )}

        {/* Stickman Head */}
        <circle cx="60" cy="38" r="16" fill="#0f1726" stroke="#eef2f8" strokeWidth="3.2" />

        {/* Eyes */}
        <circle className="eye" cx="54" cy="35" r="2" fill="#eef2f8" />
        <circle className="eye" cx="66" cy="35" r="2" fill="#eef2f8" />

        {/* Animated talking mouth */}
        <rect className="mouth" x="55" y="42" width="10" height="3.5" rx="1.75" fill="#82a5ff" />

        {/* Torso */}
        <line x1="60" y1="54" x2="60" y2="92" stroke="#eef2f8" strokeWidth="3.5" strokeLinecap="round" />

        {/* Legs */}
        <line x1="60" y1="92" x2="46" y2="118" stroke="#eef2f8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="60" y1="92" x2="74" y2="118" stroke="#eef2f8" strokeWidth="3.5" strokeLinecap="round" />

        {/* Left Arm */}
        <g className="arm-left">
          <path d="M60 64 L38 78" stroke="#eef2f8" strokeWidth="3.4" strokeLinecap="round" />
        </g>

        {/* Right Arm + Vibe Prop */}
        <g className="arm-right">
          {vibe === 'stickman' && (
            <>
              <path d="M60 64 L86 52" stroke="#eef2f8" strokeWidth="3.4" strokeLinecap="round" />
              {/* Pointer wand */}
              <line x1="86" y1="52" x2="104" y2="34" stroke="#82a5ff" strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="104" cy="34" r="3" fill="#82a5ff" />
            </>
          )}

          {vibe === 'makeup' && (
            <>
              <path d="M60 64 L82 46" stroke="#eef2f8" strokeWidth="3.4" strokeLinecap="round" />
              {/* Makeup brush */}
              <line x1="82" y1="46" x2="72" y2="38" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
              <circle cx="70" cy="36" r="4.5" fill="#f9a8d4" />
            </>
          )}

          {vibe === 'sport' && (
            <>
              <path d="M60 64 L88 54" stroke="#eef2f8" strokeWidth="3.4" strokeLinecap="round" />
              {/* Dumbbell */}
              <line x1="80" y1="46" x2="96" y2="62" stroke="#95a2b7" strokeWidth="3" strokeLinecap="round" />
              <rect x="76" y="42" width="7" height="7" rx="1.5" fill="#4cc38a" />
              <rect x="93" y="59" width="7" height="7" rx="1.5" fill="#4cc38a" />
            </>
          )}

          {vibe === 'podcast' && (
            <>
              <path d="M60 64 L84 68" stroke="#eef2f8" strokeWidth="3.4" strokeLinecap="round" />
              {/* Studio boom mic */}
              <path d="M98 96 L82 60" stroke="#95a2b7" strokeWidth="3" strokeLinecap="round" />
              <rect x="75" y="48" width="10" height="15" rx="5" fill="#82a5ff" stroke="#eef2f8" strokeWidth="1.5" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
