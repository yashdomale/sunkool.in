/* Shared presentational building blocks for the SUNKOOL Mumbai landing page. */

import { Icon, type IconName } from "@/components/cities/content/mumbai/components/landing-icons";
import GlowCard from "@/components/cities/content/mumbai/components/glow-card";

export function Eyebrow({
  children,
  color = "heat",
  className = "",
}: {
  children: React.ReactNode;
  color?: "heat" | "kool" | "white";
  className?: string;
}) {
  const colorClass =
    color === "heat" ? "text-heat" : color === "kool" ? "text-kool" : "text-white";
  return <p className={`reveal-fade-up eyebrow ${colorClass} ${className}`}>{children}</p>;
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`reveal-fade-up headline text-gradient-silver text-balance mt-3 text-[clamp(30px,10.5vw_-_4px,40px)] sm:mt-4 sm:text-[clamp(30px,5vw_+_14px,64px)] ${className}`}
    >
      {children}
    </h2>
  );
}

/** The one important word/phrase at the end of a heading — a sharp blue
 * gradient wordmark with a soft radial glow sitting behind it. */
export function HighlightGlow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`text-highlight-glow ${className}`}>
      <span aria-hidden="true" className="text-highlight-glow-orb" />
      {children}
    </span>
  );
}

export function SubHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-gradient-silver font-display text-xl font-bold sm:text-2xl ${className}`}>
      {children}
    </h3>
  );
}

export function Paragraph({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-[16px] leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] ${className}`}>
      {children}
    </p>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="reveal-stagger mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-kool"
          />
          <span className="text-base leading-relaxed text-silver-soft sm:text-lg">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CtaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="mt-6 inline-flex items-center text-base font-semibold text-kool transition-colors hover:text-glow"
    >
      {children}
    </a>
  );
}

export function IconBox({ icon, color }: { icon: IconName; color: "heat" | "kool" }) {
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] sm:h-16 sm:w-16 ${
        color === "heat" ? "text-heat" : "text-kool"
      }`}
    >
      <Icon name={icon} />
    </div>
  );
}

export function IconCard({
  icon,
  color = "heat",
  title,
  description,
}: {
  icon: IconName;
  color?: "heat" | "kool";
  title: string;
  description: string;
}) {
  return (
    <GlowCard
      cornerGlow
      className={`reveal-card rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] sm:p-6 ${
        color === "kool" ? "reveal-card-kool" : ""
      }`}
    >
      <span className={`reveal-card-icon ${color === "heat" ? "text-heat" : "text-kool"}`}>
        <Icon name={icon} />
      </span>
      <p className="text-gradient-silver mt-4 font-display text-lg font-semibold sm:text-xl">{title}</p>
      <p className="mt-2 text-[15px] font-bold leading-relaxed text-white/85 sm:text-base">{description}</p>
    </GlowCard>
  );
}
