// Small building blocks used across the Pune page's sections.
import Link from "next/link";
import { Icon, type IconName } from "@/components/cities/content/pune/components/landing-icons";

export function Eyebrow({
  children,
  color = "heat",
  bold = false,
}: {
  children: React.ReactNode;
  color?: "heat" | "kool" | "white";
  bold?: boolean;
}) {
  const colorClass =
    color === "heat" ? "text-gradient-sun" : color === "kool" ? "text-kool" : "text-white";
  return (
    <p className={`reveal-fade-up eyebrow ${bold ? "font-bold " : ""}${colorClass}`}>
      {children}
    </p>
  );
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
      className={`reveal-fade-up headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)] ${className}`}
    >
      {children}
    </h2>
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
    <p className={`text-[17px] leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] ${className}`}>
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

export function CtaLink({
  href,
  children,
  external = false,
  className = "mt-6",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${className} inline-flex items-center rounded-sm text-base font-semibold text-kool transition-colors hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
    >
      {children}
    </Link>
  );
}

export function IconCard({
  icon,
  color = "heat",
  title,
  description,
  bold = false,
}: {
  icon: IconName;
  color?: "heat" | "kool";
  title: string;
  description: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`group reveal-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] sm:p-6 ${
        color === "kool" ? "reveal-card-kool" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgba(125,211,255,0.55)] opacity-40 blur-3xl transition-opacity duration-500 ease-out group-hover:opacity-80"
      />
      <span className={`reveal-card-icon ${color === "heat" ? "text-heat" : "text-kool"}`}>
        <Icon name={icon} />
      </span>
      <p className="text-gradient-silver mt-4 font-display text-lg font-semibold sm:text-xl">{title}</p>
      <p
        className={`mt-2 text-[15px] leading-relaxed text-white/85 sm:text-base ${bold ? "font-bold" : ""}`}
      >
        {description}
      </p>
    </div>
  );
}
