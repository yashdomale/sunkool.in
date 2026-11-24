"use client";

import { useRef } from "react";

export default function GlowCard({
  variant = "standard",
  className = "",
  style,
  active,
  cornerGlow = false,
  onHoverChange,
  children,
}: {
  variant?: "standard" | "minimal";
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  cornerGlow?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mouse-x", `${x}%`);
    el.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={`glow-card ${variant === "minimal" ? "glow-card-minimal" : ""} ${
        active ? "glow-card-active" : ""
      } ${cornerGlow ? "group relative overflow-hidden" : ""} ${className}`}
      style={style}
    >
      {cornerGlow && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgba(125,211,255,0.55)] opacity-40 blur-3xl transition-opacity duration-500 ease-out group-hover:opacity-80"
          style={{ position: "absolute" }}
        />
      )}
      {children}
    </div>
  );
}
