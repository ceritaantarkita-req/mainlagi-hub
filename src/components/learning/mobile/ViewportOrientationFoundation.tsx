"use client";

import { useEffect, useRef, type HTMLAttributes, type PropsWithChildren } from "react";

type MainlagiOrientation = "portrait" | "landscape";

function readViewport(): { width: number; height: number; orientation: MainlagiOrientation } {
  const viewport = window.visualViewport;
  const width = Math.max(1, Math.round(viewport?.width ?? window.innerWidth));
  const height = Math.max(1, Math.round(viewport?.height ?? window.innerHeight));
  return {
    width,
    height,
    orientation: width > height ? "landscape" : "portrait"
  };
}

/**
 * Layout-only viewport signal.
 *
 * Rotation must never become application state: child activities, World and
 * Main Gerak own progress/timers/dialogs locally and must keep their mounted
 * identity while the viewport changes. This boundary therefore updates only
 * DOM data/CSS variables and intentionally has no React state.
 */
export function ViewportOrientationFoundation({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const commitViewport = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;
      const { width, height, orientation } = readViewport();
      root.dataset.mainlagiOrientation = orientation;
      root.style.setProperty("--ml-viewport-width", `${width}px`);
      root.style.setProperty("--ml-viewport-height", `${height}px`);
    };

    const scheduleViewportCommit = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(commitViewport);
    };

    scheduleViewportCommit();
    window.addEventListener("resize", scheduleViewportCommit);
    window.addEventListener("orientationchange", scheduleViewportCommit);
    window.visualViewport?.addEventListener("resize", scheduleViewportCommit);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleViewportCommit);
      window.removeEventListener("orientationchange", scheduleViewportCommit);
      window.visualViewport?.removeEventListener("resize", scheduleViewportCommit);
    };
  }, []);

  return (
    <div ref={rootRef} {...props} data-mainlagi-orientation="pending">
      {children}
    </div>
  );
}
