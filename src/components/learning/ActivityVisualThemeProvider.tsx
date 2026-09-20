"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ResolvedActivityVisualTheme } from "@/lib/learning/activityVisualTheme";

const ActivityVisualThemeContext = createContext<ResolvedActivityVisualTheme | null>(null);

export function ActivityVisualThemeProvider({
  visualTheme,
  children
}: {
  visualTheme: ResolvedActivityVisualTheme | null;
  children: ReactNode;
}) {
  return (
    <ActivityVisualThemeContext.Provider value={visualTheme}>
      {children}
    </ActivityVisualThemeContext.Provider>
  );
}

export function useActivityVisualTheme(): ResolvedActivityVisualTheme | null {
  return useContext(ActivityVisualThemeContext);
}
