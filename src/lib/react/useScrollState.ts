"use client";

import { useEffect, useState } from "react";

/**
 * Reports whether the window has scrolled past a small threshold.
 *
 * One hook for the whole shell so the navbar reads a single source of truth
 * rather than reasoning about scroll in every consumer.
 */
export function useScrollState(threshold = 16): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
