"use client";

import { useEffect, useState } from "react";

export type ImmersiveChrome = {
  navVisible: boolean;
  hudVisible: boolean;
  badgeVisible: boolean;
};

const defaultChrome: ImmersiveChrome = {
  navVisible: true,
  hudVisible: true,
  badgeVisible: true,
};

let chrome: ImmersiveChrome = { ...defaultChrome };
const listeners = new Set<() => void>();

export function setImmersiveChrome(next: Partial<ImmersiveChrome>) {
  const merged = { ...chrome, ...next };
  if (
    merged.navVisible === chrome.navVisible &&
    merged.hudVisible === chrome.hudVisible &&
    merged.badgeVisible === chrome.badgeVisible
  ) {
    return;
  }
  chrome = merged;
  listeners.forEach((l) => l());
}

export function resetImmersiveChrome() {
  chrome = { ...defaultChrome };
  listeners.forEach((l) => l());
}

export function useImmersiveChrome(): ImmersiveChrome {
  const [, tick] = useState(0);
  useEffect(() => {
    const listener = () => tick((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return chrome;
}
