/* Shared icon set for the SUNKOOL Mumbai landing page. */

export type IconName =
  | "heat"
  | "glare"
  | "uv"
  | "sun"
  | "road"
  | "traffic"
  | "pin"
  | "thermometer"
  | "eye"
  | "windshield"
  | "seat"
  | "shield"
  | "signal"
  | "hex"
  | "smile"
  | "gmapPin"
  | "phone";

export function SunRays({
  cx,
  cy,
  r = 4,
  rayLen = 3,
  rayCount = 8,
  gap = 1.5,
}: {
  cx: number;
  cy: number;
  r?: number;
  rayLen?: number;
  rayCount?: number;
  gap?: number;
}) {
  const rays = Array.from({ length: rayCount }, (_, i) => (360 / rayCount) * i);
  return (
    <>
      <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="2" />
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (r + gap);
        const y1 = cy + Math.sin(rad) * (r + gap);
        const x2 = cx + Math.cos(rad) * (r + gap + rayLen);
        const y2 = cy + Math.sin(rad) * (r + gap + rayLen);
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

export const SHIELD_PATH = "M12 2.5l8 3.2v6.3c0 5.1-3.4 8.7-8 10.5-4.6-1.8-8-5.4-8-10.5V5.7l8-3.2z";

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none" } as const;
  switch (name) {
    case "heat":
      return (
        <svg {...common} className={className}>
          <SunRays cx={8} cy={7.5} r={2.6} rayLen={2} gap={1.2} />
          <g transform="translate(9.5,7) scale(0.62)">
            <path
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              d="M10 3v10.55a3.5 3.5 0 1 0 4 0V3M8.5 3h7"
            />
            <circle cx="12" cy="16.6" r="2" fill="currentColor" />
          </g>
        </svg>
      );
    case "glare":
      return (
        <svg {...common} className={className}>
          <SunRays cx={12} cy={12} r={4.5} rayLen={3} />
          <line
            x1="4.5"
            y1="4.5"
            x2="19.5"
            y2="19.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "uv":
      return (
        <svg {...common} className={className}>
          <path stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" d={SHIELD_PATH} />
          <text
            x="12"
            y="15"
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="800"
            fill="currentColor"
            stroke="none"
          >
            UV
          </text>
        </svg>
      );
    case "sun":
      return (
        <svg {...common} className={className}>
          <SunRays cx={12} cy={12} r={4} rayLen={3.2} />
        </svg>
      );
    case "road":
      return (
        <svg {...common} className={className}>
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 3L4 21M16 3l4 18"
          />
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="3 3"
            d="M12 3v18"
          />
        </svg>
      );
    case "traffic":
      return (
        <svg {...common} className={className}>
          <rect x="7" y="2.5" width="10" height="19" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="12" cy="7.2" r="1.3" fill="currentColor" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" />
          <circle cx="12" cy="16.8" r="1.3" fill="currentColor" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common} className={className}>
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z"
          />
          <circle cx="12" cy="9.5" r="2.4" fill="currentColor" />
        </svg>
      );
    case "thermometer":
      return (
        <svg {...common} className={className}>
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            d="M10 3v10.55a3.5 3.5 0 1 0 4 0V3M8.5 3h7"
          />
          <circle cx="12" cy="16.6" r="2" fill="currentColor" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common} className={className}>
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
          />
          <circle cx="12" cy="12" r="2.6" fill="currentColor" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} className={className}>
          <path stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" d={SHIELD_PATH} />
        </svg>
      );
    case "signal":
      return (
        <svg {...common} className={className}>
          <rect x="4" y="14" width="3.4" height="6.5" rx="1" fill="currentColor" />
          <rect x="10.3" y="9.5" width="3.4" height="11" rx="1" fill="currentColor" />
          <rect x="16.6" y="4.5" width="3.4" height="16" rx="1" fill="currentColor" />
        </svg>
      );
    case "hex":
      return (
        <svg {...common} className={className}>
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill="none"
            d="M8.5 3.5h7l3.5 6-3.5 6h-7L5 9.5z"
          />
        </svg>
      );
    case "windshield":
      return (
        <svg {...common} className={className}>
          <circle cx="12" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="2" />
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M12 2.6v1.3M7.9 4.7l.9 1M16.1 4.7l-.9 1M4.6 7.5h1.5M19.4 7.5h-1.5"
          />
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            d="M4 18.5a10 4.5 0 0 1 16 0"
          />
        </svg>
      );
    case "seat":
      return (
        <svg {...common} className={className}>
          <rect x="9.5" y="3" width="5" height="4" rx="1.4" stroke="currentColor" strokeWidth="2.2" />
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            d="M7.5 20v-6.2A4.5 4.5 0 0 1 12 9.3a4.5 4.5 0 0 1 4.5 4.5V20"
          />
          <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M5.5 20h13" />
        </svg>
      );
    case "gmapPin":
      return (
        <svg {...common} className={className}>
          <defs>
            <clipPath id="gmap-pin-clip">
              <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z" />
            </clipPath>
          </defs>
          <g clipPath="url(#gmap-pin-clip)">
            <path d="M12,9.5 L27,9.5 A15,15 0 0,1 12,24.5 Z" fill="#34A853" />
            <path d="M12,9.5 L12,24.5 A15,15 0 0,1 -3,9.5 Z" fill="#FBBC05" />
            <path d="M12,9.5 L-3,9.5 A15,15 0 0,1 12,-5.5 Z" fill="#EA4335" />
            <path d="M12,9.5 L12,-5.5 A15,15 0 0,1 27,9.5 Z" fill="#4285F4" />
          </g>
          <circle cx="12" cy="9.5" r="2.6" fill="#fff" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common} className={className}>
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2 17 17 0 0 1-14.3-14.3 2 2 0 0 1 2-2.2z"
          />
        </svg>
      );
    case "smile":
      return (
        <svg {...common} className={className}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            d="M8 14c1 1.5 2.5 2.3 4 2.3S15 15.5 16 14"
          />
          <circle cx="9" cy="9.5" r="1.1" fill="currentColor" />
          <circle cx="15" cy="9.5" r="1.1" fill="currentColor" />
        </svg>
      );
  }
}
