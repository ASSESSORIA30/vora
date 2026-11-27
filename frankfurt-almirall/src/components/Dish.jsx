import { useId } from 'react';
import { media } from '../content/site.js';

/**
 * Enamel-plate illustrations for the four stations, printed in the
 * project palette. They stand in for the food close-ups until real or
 * generated footage exists (see media.dishes in content/site.js).
 */

const INK = '#252321';

function Plate({ children, uid }) {
  return (
    <>
      <defs>
        <pattern id={`dots-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="3" cy="3" r="1.15" fill={INK} opacity=".5" />
        </pattern>
        <radialGradient id={`plate-${uid}`} cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#FBF4E6" />
          <stop offset="1" stopColor="#E9DCC3" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="112" rx="92" ry="78" fill={INK} opacity=".12" />
      <circle cx="100" cy="100" r="90" fill={`url(#plate-${uid})`} stroke={INK} strokeWidth="2.5" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#1F3930" strokeWidth="3" />
      <circle cx="100" cy="100" r="66" fill="none" stroke={INK} strokeWidth="1" opacity=".25" />
      {children}
    </>
  );
}

function Truita({ uid }) {
  return (
    <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      {/* body of the omelette, a wedge removed */}
      <path d="M100 92 L150 74 A54 30 0 1 1 64 70 Z" fill="#E7B95E" />
      <path d="M46 92 v18 a54 30 0 0 0 108 0 V92" fill="#D69A3E" />
      <path d="M46 92 a54 30 0 0 0 108 0" fill="none" />
      <path d="M100 92 L150 74 A54 30 0 1 1 64 70 Z" fill="#EDC676" />
      <path d="M60 104 q8 4 16 2 M84 110 q10 3 20 0 M112 108 q10 2 18-3" fill="none" strokeWidth="1.4" opacity=".7" />
      {/* removed slice, lifted forward */}
      <g transform="translate(14 22)">
        <path d="M100 92 L150 74 A54 30 0 0 1 154 86 Z" fill="#F0CC80" />
        <path d="M100 92 v16 L154 102 V86 Z" fill="#F6E3A8" />
        <path d="M108 100 q6 2 10 0 M124 97 q6 2 12-1 M140 95 q4 1 8-1" fill="none" strokeWidth="1.2" />
        <circle cx="116" cy="104" r="2.2" fill="#E2B060" stroke="none" />
        <circle cx="134" cy="101" r="2" fill="#E2B060" stroke="none" />
      </g>
      <ellipse cx="78" cy="80" rx="10" ry="4" fill="#B97A2E" stroke="none" opacity=".35" />
      <ellipse cx="104" cy="70" rx="7" ry="3" fill="#B97A2E" stroke="none" opacity=".3" />
      <path d="M46 92 v18 a54 30 0 0 0 54 30" fill={`url(#dots-${uid})`} stroke="none" opacity=".6" />
    </g>
  );
}

function Pernil({ uid }) {
  return (
    <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      {/* bread */}
      <path d="M34 124 C30 98 60 82 100 80 C140 78 170 92 168 116 C166 134 132 140 100 140 C66 140 36 140 34 124Z" fill="#D9A55C" />
      <path d="M40 120 C40 102 66 92 100 90 C136 88 160 100 160 114 C158 128 130 132 100 132 C70 132 42 132 40 120Z" fill="#F2D7A4" />
      {/* tomato rubbed in */}
      <path d="M50 116 c10-14 30-18 50-18 c24 0 44 6 52 14 c-8 10-30 12-52 12 c-22 0-42-1-50-8z" fill="#C2433A" opacity=".55" stroke="none" />
      {/* ham folds */}
      <path d="M56 106 c10-16 28-18 34-6 c6-12 22-14 30-2 c8-10 24-8 28 6 c-6 10-18 12-28 6 c-8 10-22 10-30 2 c-10 8-28 8-34-6z" fill="#B8434B" />
      <path d="M62 104 c8-8 18-8 24 0 M96 100 c8-8 18-8 24 0 M126 102 c6-6 14-6 18 2" fill="none" stroke="#F4D3CF" strokeWidth="2.4" />
      {/* olive oil drop */}
      <path d="M150 56 c6 8 8 13 8 17 a8 8 0 0 1-16 0 c0-4 2-9 8-17z" fill="#C9B23C" />
      <circle cx="74" cy="122" r="2" fill={INK} stroke="none" opacity=".4" />
      <circle cx="120" cy="126" r="2" fill={INK} stroke="none" opacity=".4" />
      <path d="M34 124 C36 140 66 140 100 140 C132 140 166 134 168 116" fill={`url(#dots-${uid})`} stroke="none" opacity=".5" />
    </g>
  );
}

function Frankfurt({ uid }) {
  return (
    <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      {/* bun */}
      <path d="M28 112 c0-18 18-26 72-26 s72 8 72 26 c0 16-20 24-72 24 s-72-8-72-24z" fill="#D49B52" />
      <path d="M40 106 c4-10 24-14 60-14 s56 4 60 14 c-6 8-26 12-60 12 s-54-4-60-12z" fill="#F0D4A0" />
      {/* sausage */}
      <rect x="22" y="90" width="156" height="24" rx="12" fill="#9C3A26" />
      <path d="M30 96 c40-6 100-6 140 0" fill="none" stroke="#D9755B" strokeWidth="3" />
      <path d="M52 92 l-6 20 M80 92 l-6 20 M108 92 l-6 20 M136 92 l-6 20 M160 93 l-5 17" stroke="#5B1F14" strokeWidth="2.6" />
      {/* mustard */}
      <path d="M40 100 l10-6 10 8 10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8 10-6" fill="none" stroke="#E5B12E" strokeWidth="4" />
      <path d="M28 112 c0 16 20 24 72 24 s72-8 72-24" fill={`url(#dots-${uid})`} stroke="none" opacity=".5" />
    </g>
  );
}

function Burger({ uid }) {
  return (
    <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M44 128 h112 c0 12-10 18-24 18 H68 c-14 0-24-6-24-18z" fill="#D49B52" />
      <path d="M40 116 c0-6 4-10 10-10 h100 c6 0 10 4 10 10 s-4 12-10 12 H50 c-6 0-10-6-10-12z" fill="#5E2A1E" />
      <path d="M52 112 h96" stroke="#8B4430" strokeWidth="2" />
      {/* cheese */}
      <path d="M44 106 L156 106 L150 114 L140 108 L132 120 L122 108 L100 114 L84 108 L74 118 L66 108 Z" fill="#E9B83A" />
      <path d="M46 100 c10-6 18 2 28-2 s18 4 28-1 s18 4 28-1 s16 2 24 4 l-2 6 H48z" fill="#7C9A4A" />
      {/* top bun */}
      <path d="M44 100 c0-30 24-46 56-46 s56 16 56 46z" fill="#D9A55C" />
      <path d="M58 84 c6-14 20-22 34-24" fill="none" stroke="#F3D59E" strokeWidth="4" />
      <g fill="#FBF0D6" strokeWidth="1.2">
        <ellipse cx="80" cy="72" rx="3.6" ry="2" transform="rotate(-20 80 72)" />
        <ellipse cx="100" cy="66" rx="3.6" ry="2" />
        <ellipse cx="120" cy="72" rx="3.6" ry="2" transform="rotate(20 120 72)" />
        <ellipse cx="92" cy="82" rx="3.6" ry="2" transform="rotate(-8 92 82)" />
        <ellipse cx="112" cy="84" rx="3.6" ry="2" transform="rotate(12 112 84)" />
        <ellipse cx="136" cy="86" rx="3.6" ry="2" transform="rotate(30 136 86)" />
        <ellipse cx="66" cy="88" rx="3.6" ry="2" transform="rotate(-30 66 88)" />
      </g>
      <path d="M128 60 c16 8 26 22 28 40 h-20z" fill={`url(#dots-${uid})`} stroke="none" opacity=".55" />
    </g>
  );
}

const ART = { truita: Truita, pernil: Pernil, frankfurt: Frankfurt, burger: Burger };

export function DishArt({ id, className = '', label }) {
  const uid = useId().replace(/:/g, '');
  const Art = ART[id];
  if (!Art) return null;
  return (
    <svg className={`dish-art ${className}`} viewBox="0 0 200 200" role={label ? 'img' : undefined} aria-hidden={label ? undefined : true}>
      {label ? <title>{label}</title> : null}
      <Plate uid={uid}>
        <Art uid={uid} />
      </Plate>
    </svg>
  );
}

/**
 * Uses the real/generated close-up when configured in media.dishes,
 * otherwise the illustrated plate.
 */
export function DishMedia({ id, label, className = '' }) {
  const asset = media.dishes[id];
  if (asset?.video) {
    return (
      <video className={`dish-video ${className}`} src={asset.video} poster={asset.poster} muted loop playsInline autoPlay preload="none" aria-label={label} />
    );
  }
  if (asset?.poster) {
    return <img className={`dish-photo ${className}`} src={asset.poster} alt={label} loading="lazy" decoding="async" />;
  }
  return <DishArt id={id} className={className} label={label} />;
}
