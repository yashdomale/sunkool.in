/* Ported verbatim from the Nagpur reference implementation (src/components/Icons.tsx)
   so the Bangalore landing page draws from the same icon set/geometry as the
   design-system master. Kept as a separate module (not the shared
   components/LandingIcons.tsx) so it doesn't affect the leftover app/pune/page.tsx,
   which still depends on the original shared icon set. */

type IconProps = { className?: string; size?: number };

const base = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none" };

export function IconHeatThermo({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <circle cx="8" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="2" />
      <line x1="11.8" y1="7.5" x2="13.8" y2="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="10.7" y1="10.2" x2="12.1" y2="11.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="11.3" x2="8" y2="13.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5.3" y1="10.2" x2="3.9" y2="11.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.2" y1="7.5" x2="2.2" y2="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5.3" y1="4.8" x2="3.9" y2="3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="3.7" x2="8" y2="1.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="10.7" y1="4.8" x2="12.1" y2="3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(9.5,7) scale(0.62)">
        <path stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M10 3v10.55a3.5 3.5 0 1 0 4 0V3M8.5 3h7" />
        <circle cx="12" cy="16.6" r="2" fill="currentColor" />
      </g>
    </svg>
  );
}

export function IconGlare({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <line x1="18" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="16.24" y1="16.24" x2="18.36" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="7.76" y1="16.24" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="7.76" y1="7.76" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="6" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="16.24" y1="7.76" x2="18.36" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.5" y1="4.5" x2="19.5" y2="19.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconSun({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <line x1="17.5" y1="12" x2="20.7" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="15.89" y1="15.89" x2="18.15" y2="18.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="17.5" x2="12" y2="20.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="8.11" y1="15.89" x2="5.85" y2="18.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6.5" y1="12" x2="3.3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="8.11" y1="8.11" x2="5.85" y2="5.85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="6.5" x2="12" y2="3.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="15.89" y1="8.11" x2="18.15" y2="5.85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconUVShield({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" d="M12 2.5l8 3.2v6.3c0 5.1-3.4 8.7-8 10.5-4.6-1.8-8-5.4-8-10.5V5.7l8-3.2z" />
      <text x="12" y="15" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="currentColor" stroke="none">
        UV
      </text>
    </svg>
  );
}

export function IconShield({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" d="M12 2.5l8 3.2v6.3c0 5.1-3.4 8.7-8 10.5-4.6-1.8-8-5.4-8-10.5V5.7l8-3.2z" />
    </svg>
  );
}

export function IconBaby({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <circle cx="12" cy="10" r="7" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="9" cy="9.5" r="1.1" fill="currentColor" />
      <circle cx="15" cy="9.5" r="1.1" fill="currentColor" />
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" d="M9 13.2c1 1 5 1 6 0" />
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" d="M12 3v-.8" />
      <circle cx="12" cy="1.6" r="1.1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconSeat({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <rect x="9.5" y="3" width="5" height="4" rx="1.4" stroke="currentColor" strokeWidth="2.2" />
      <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M7.5 20v-6.2A4.5 4.5 0 0 1 12 9.3a4.5 4.5 0 0 1 4.5 4.5V20" />
      <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M5.5 20h13" />
    </svg>
  );
}

export function IconSignalBars({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <rect x="4" y="14" width="3.4" height="6.5" rx="1" fill="currentColor" />
      <rect x="10.3" y="9.5" width="3.4" height="11" rx="1" fill="currentColor" />
      <rect x="16.6" y="4.5" width="3.4" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}

export function IconEye({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function IconRoad({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M8 3L4 21M16 3l4 18" />
      <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 3" d="M12 3v18" />
    </svg>
  );
}

export function IconTrafficLight({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <rect x="7" y="2.5" width="10" height="19" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="7.2" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      <circle cx="12" cy="16.8" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function IconPin({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function IconHexagon({ className = "", size = 28 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="none" d="M8.5 3.5h7l3.5 6-3.5 6h-7L5 9.5z" />
    </svg>
  );
}

export function IconDragHandle({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
    </svg>
  );
}

export function IconGoogleMapsPin({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <clipPath id="gmap-pin-clip-bangalore">
          <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z" />
        </clipPath>
      </defs>
      <g clipPath="url(#gmap-pin-clip-bangalore)">
        <path d="M12,9.5 L27,9.5 A15,15 0 0,1 12,24.5 Z" fill="#34A853" />
        <path d="M12,9.5 L12,24.5 A15,15 0 0,1 -3,9.5 Z" fill="#FBBC05" />
        <path d="M12,9.5 L-3,9.5 A15,15 0 0,1 12,-5.5 Z" fill="#EA4335" />
        <path d="M12,9.5 L12,-5.5 A15,15 0 0,1 27,9.5 Z" fill="#4285F4" />
      </g>
      <circle cx="12" cy="9.5" r="2.6" fill="#fff" />
    </svg>
  );
}

export function IconPhone({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className}>
      <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2 17 17 0 0 1-14.3-14.3 2 2 0 0 1 2-2.2z" />
    </svg>
  );
}
