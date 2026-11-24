import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { SOCIAL_ICONS } from "@/components/ui/social-icons";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: {
    button: "h-9 w-9",
    icon: "h-4 w-4",
    gap: "gap-2",
    label: "text-[11px]",
  },
  md: {
    button: "h-10 w-10",
    icon: "h-[1.125rem] w-[1.125rem]",
    gap: "gap-2.5",
    label: "text-xs",
  },
  lg: {
    button: "h-11 w-11",
    icon: "h-5 w-5",
    gap: "gap-3",
    label: "text-sm",
  },
} as const;

type SocialLinksProps = {
  className?: string;
  size?: keyof typeof sizeStyles;
  showLabels?: boolean;
};

export function SocialLinks({
  className,
  size = "md",
  showLabels = false,
}: SocialLinksProps) {
  const s = sizeStyles[size];

  return (
    <ul
      className={cn("flex flex-wrap items-center", s.gap, className)}
      aria-label="SUNKOOL social media"
    >
      {SOCIAL_LINKS.map((item) => {
        const Icon = SOCIAL_ICONS[item.id];
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label} — ${item.handle}`}
              title={item.label}
              className={cn(
                "group inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] text-silver-soft backdrop-blur-sm transition-all duration-300 hover:border-electric/45 hover:bg-electric/10 hover:text-white focus-ring",
                showLabels ? "gap-2.5 px-4 py-2" : cn("justify-center", s.button)
              )}
            >
              <Icon
                className={cn(
                  s.icon,
                  "shrink-0 transition-transform duration-300 group-hover:scale-110"
                )}
                aria-hidden
              />
              {showLabels && (
                <span className={cn("font-medium tracking-wide", s.label)}>
                  {item.label}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
