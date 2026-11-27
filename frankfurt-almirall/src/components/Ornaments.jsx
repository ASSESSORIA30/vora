/**
 * Ornaments derived from the reference interior:
 * – the eight-point compass star of the hydraulic floor,
 * – the blue-and-ochre wall tiles,
 * – the bottle-green tile trim.
 */

export function Star({ className = '', title }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M20 1l3.2 12.2L35 6 27.4 16.8 39 20l-11.6 3.2L35 34l-11.8-7.2L20 39l-3.2-12.2L5 34l7.6-10.8L1 20l11.6-3.2L5 6l11.8 7.2z" fill="currentColor" />
      <path d="M20 9l2 9 9 2-9 2-2 9-2-9-9-2 9-2z" fill="var(--star-core, #C69A56)" />
    </svg>
  );
}

/** Repeating floor tile band (compass stars on cream). */
export function FloorBand({ className = '' }) {
  return (
    <div className={`floor-band ${className}`} aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="floor-tile" width="96" height="96" patternUnits="userSpaceOnUse">
            <rect width="96" height="96" fill="#F1E4CC" />
            <g fill="#C9B99E" opacity=".55">
              <path d="M0 0h10L0 10zM96 0H86l10 10zM0 96h10L0 86zM96 96H86l10-10z" />
            </g>
            <g transform="translate(48 48)">
              <path d="M0-34 5-12 24-24 12-5 34 0 12 5 24 24 5 12 0 34-5 12-24 24-12 5-34 0-12-5-24-24-5-12z" fill="#7F2928" />
              <path d="M0-34 5-12 0 0zM34 0 12 5 0 0zM0 34-5 12 0 0zM-34 0-12-5 0 0z" fill="#5C1D1C" />
              <path d="M0-22 3-3 22 0 3 3 0 22-3 3-22 0-3-3z" fill="#C69A56" />
              <circle r="3" fill="#F1E4CC" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#floor-tile)" />
      </svg>
    </div>
  );
}

/** Wall tile band: blue four-petal flowers on cream, ochre lattice, like the bar's wall tiles. */
export function WallBand({ className = '' }) {
  return (
    <div className={`wall-band ${className}`} aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="wall-tile" width="96" height="96" patternUnits="userSpaceOnUse">
            <rect width="96" height="96" fill="#F2E7D3" />
            <path d="M0 0L96 96M96 0L0 96" stroke="#D9B878" strokeWidth="6" opacity=".55" />
            <rect x=".5" y=".5" width="95" height="95" fill="none" stroke="#CDBB9A" strokeWidth="1" />
            <g fill="#2F5389" transform="translate(48 48)">
              <path d="M0-34C9-24 9-14 0-8-9-14-9-24 0-34zM0 34C9 24 9 14 0 8-9 14-9 24 0 34zM-34 0C-24 9-14 9-8 0-14-9-24-9-34 0zM34 0C24 9 14 9 8 0 14-9 24-9 34 0z" />
              <path d="M-15-15l6 2-2 4zM15-15l-6 2 2 4zM-15 15l6-2-2-4zM15 15l-6-2 2-4z" />
              <circle r="5" fill="#F2E7D3" stroke="#2F5389" strokeWidth="2.5" />
            </g>
            <g fill="#2F5389">
              <path d="M0 0h14C12 7 7 12 0 14zM96 0H82c2 7 7 12 14 14zM0 96V82c7 2 12 7 14 14zM96 96V82c-7 2-12 7-14 14z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wall-tile)" />
      </svg>
    </div>
  );
}

/** Rotating enamel badge: the floor star ringed by the campaign line. */
export function Badge({ text, className = '' }) {
  return (
    <div className={`badge-ring ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 300">
        <defs>
          <path id="ring-path" d="M150 150m-112 0a112 112 0 1 1 224 0a112 112 0 1 1-224 0" />
        </defs>
        <circle cx="150" cy="150" r="146" fill="#F4E8D4" />
        <circle cx="150" cy="150" r="138" fill="none" stroke="#252321" strokeWidth="3" />
        <circle cx="150" cy="150" r="88" fill="#1F3930" />
        <g className="badge-ring__text">
          <text fill="#7F2928" fontFamily="Barlow Condensed, sans-serif" fontWeight="700" fontSize="27" letterSpacing="5.2">
            <textPath href="#ring-path">{text}</textPath>
          </text>
        </g>
        <g transform="translate(150 150) scale(1.9)">
          <path d="M0-34 5-12 24-24 12-5 34 0 12 5 24 24 5 12 0 34-5 12-24 24-12 5-34 0-12-5-24-24-5-12z" fill="#7F2928" />
          <path d="M0-34 5-12 0 0zM34 0 12 5 0 0zM0 34-5 12 0 0zM-34 0-12-5 0 0z" fill="#5C1D1C" />
          <path d="M0-22 3-3 22 0 3 3 0 22-3 3-22 0-3-3z" fill="#C69A56" />
          <circle r="3" fill="#F4E8D4" />
        </g>
      </svg>
    </div>
  );
}

/** Thin bottle-green tile trim, like the line above the wall tiles. */
export function Trim({ className = '' }) {
  return <div className={`trim ${className}`} aria-hidden="true" />;
}
