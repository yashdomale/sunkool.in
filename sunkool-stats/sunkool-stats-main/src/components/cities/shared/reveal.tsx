"use client";

import { createElement, ElementType, ReactNode } from "react";
import { useInView } from "./use-in-view";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: boolean;
};

export default function Reveal({ children, className = "", as: Tag = "div", stagger = false }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const base = stagger ? "reveal-stagger" : "reveal-fade-up";
  return createElement(Tag, { ref, className: `${base} ${inView ? "is-visible" : ""} ${className}`.trim() }, children);
}
