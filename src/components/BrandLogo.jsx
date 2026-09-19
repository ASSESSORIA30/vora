export default function BrandLogo({ light = false, compact = false, className = '' }) {
  const color = light ? '#F2F0EB' : '#24231F'
  const accent = light ? '#B6AA9D' : '#8B7D6F'
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="VORA Concrete Living">
      <svg viewBox="0 0 48 48" className={compact ? 'w-8 h-8' : 'w-9 h-9'} aria-hidden="true">
        <path d="M8 36V10l26 7v19" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="square" />
        <path d="M8 36h32" fill="none" stroke={accent} strokeWidth="1.7" />
        <path d="M8 10l8 6v20" fill={accent} fillOpacity=".28" stroke="none" />
      </svg>
      <span className="leading-none">
        <span className={`font-display uppercase tracking-[0.18em] ${compact ? 'text-xl' : 'text-2xl md:text-[27px]'}`} style={{ color }}>
          VORA
        </span>
        {!compact && (
          <span className="block mt-1 text-[8px] md:text-[9px] tracking-[0.34em] uppercase" style={{ color: accent }}>
            Concrete Living
          </span>
        )}
      </span>
    </span>
  )
}
