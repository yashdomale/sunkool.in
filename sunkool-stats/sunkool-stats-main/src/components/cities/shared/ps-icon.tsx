"use client";

import { ReactNode } from "react";
import { useInView } from "./use-in-view";

export default function PSIcon({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);

  return (
    <span
      ref={ref}
      className={`ps-icon flex h-16 w-16 shrink-0 items-center justify-center text-kool ${inView ? "in-view" : ""}`}
    >
      {children}
    </span>
  );
}
