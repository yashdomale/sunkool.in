"use client";

import { MouseEvent, ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "glow-card" | "reveal-card";
  kool?: boolean;
};

export default function GlowCard({ children, className = "", variant = "glow-card", kool = false }: GlowCardProps) {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    event.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group ${variant} ${kool ? "reveal-card-kool" : ""} relative overflow-hidden ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgba(125,211,255,0.55)] opacity-40 blur-3xl transition-opacity duration-500 ease-out group-hover:opacity-80"
      />
      {children}
    </div>
  );
}
