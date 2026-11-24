"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useInView, type HTMLMotionProps, type TargetAndTransition } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function useVisibleLoop<T extends HTMLElement>(target: TargetAndTransition) {
  const ref = useRef<T>(null);
  const latest = useRef(target);
  useEffect(() => { latest.current = target; });
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const controls = useAnimationControls();

  useEffect(() => {
    const sync = () => {
      if (visible && !document.hidden && !reduced) void controls.start(latest.current);
      else controls.stop();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      controls.stop();
    };
  }, [visible, reduced, controls]);
  return { ref, controls };
}

export function VisibleLoop({ animate, transition, ...props }: Omit<HTMLMotionProps<"div">, "animate"> & { animate: TargetAndTransition }) {
  const { ref, controls } = useVisibleLoop<HTMLDivElement>({ ...animate, transition });
  return <motion.div {...props} ref={ref} animate={controls} />;
}

export function VisibleLoopSpan({ animate, transition, ...props }: Omit<HTMLMotionProps<"span">, "animate"> & { animate: TargetAndTransition }) {
  const { ref, controls } = useVisibleLoop<HTMLSpanElement>({ ...animate, transition });
  return <motion.span {...props} ref={ref} animate={controls} />;
}
