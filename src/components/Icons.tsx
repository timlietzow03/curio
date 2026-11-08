type P = { size?: number };
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true as const });
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const CurioLogo = ({ size = 24 }: P) => (
  <svg {...base(size)} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="15" fill="#132544" />
    <path
      d="M42.5 22.2A14.5 14.5 0 1 0 42.5 41.8"
      stroke="#E8EEF6"
      strokeWidth={6.5}
      strokeLinecap="round"
    />
    <path
      d="M32 23.5L34.2 29.8L40.5 32L34.2 34.2L32 40.5L29.8 34.2L23.5 32L29.8 29.8L32 23.5Z"
      fill="#82A8DE"
    />
  </svg>
);

export const Check = ({ size = 14 }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2.4}><path d="M5 12.5l4.2 4L19 7" /></svg>
);
export const Cross = ({ size = 16 }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2.4}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Flame = ({ size = 16 }: P) => (
  <svg {...base(size)} fill="currentColor"><path d="M12 2c.6 4 5 5.6 5 10.5a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.1 2 .9 3 2 3.3C10.3 7.6 10.4 5 12 2z" /></svg>
);
export const Bookmark = ({ size = 22 }: P) => (
  <svg {...base(size)} {...stroke}><path d="M6 3h12v18l-6-4.5L6 21z" /></svg>
);
export const ChevronDown = ({ size = 22 }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2.2}><path d="M5 9l7 7 7-7" /></svg>
);
export const Pause = ({ size = 28 }: P) => (
  <svg {...base(size)} fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
);
export const Volume = ({ size = 18 }: P) => (
  <svg {...base(size)} {...stroke}><path d="M4 9.5v5h4l5 4v-13l-5 4H4z" /><path d="M16.5 9a4 4 0 0 1 0 6M18.8 6.5a7.5 7.5 0 0 1 0 11" /></svg>
);
export const VolumeOff = ({ size = 18 }: P) => (
  <svg {...base(size)} {...stroke}><path d="M4 9.5v5h4l5 4v-13l-5 4H4z" /><path d="M17 9.5l4 5M21 9.5l-4 5" /></svg>
);
