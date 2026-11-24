"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 will-change-transform focus-ring";

const variants: Record<Variant, string> = {
  primary:
    "bg-electric text-black hover:bg-[#7dd3ff] shadow-[0_8px_30px_-8px_rgba(88,167,232,0.6)]",
  outline:
    "border border-silver/25 text-silver-soft hover:border-electric/60 hover:text-white",
  ghost: "text-silver-soft hover:text-white",
};

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  target?: string;
  rel?: string;
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
  target,
  rel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const tx = useTransform(sx, (v) => v * 0.35);
  const ty = useTransform(sy, (v) => v * 0.35);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set(e.clientX - (r.left + r.width / 2));
    y.set(e.clientY - (r.top + r.height / 2));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  );

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: tx, y: ty }}
      className={cn(base, variants[variant], className)}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute -inset-x-10 -top-10 h-20 rotate-12 bg-white/30 blur-md transition-transform duration-700 group-hover:translate-x-[200%]" />
        </span>
      )}
      {inner}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className="inline-block rounded-full">
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className="inline-block rounded-full">
      {content}
    </button>
  );
}
