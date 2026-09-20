"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { resolveActivityVisualTheme, type ResolvedActivityVisualTheme } from "@/lib/learning/activityVisualTheme";
import { getActivity } from "@/lib/learning/system";

const ActivityVisualThemeContext = createContext<ResolvedActivityVisualTheme | null>(null);

export function ActivityVisualThemeProvider({
  activityId,
  children
}: {
  activityId: string;
  children: ReactNode;
}) {
  const visualTheme = useMemo(
    () => resolveActivityVisualTheme(getActivity(activityId)),
    [activityId]
  );

  return (
    <ActivityVisualThemeContext.Provider value={visualTheme}>
      {children}
    </ActivityVisualThemeContext.Provider>
  );
}

export function useActivityVisualTheme(): ResolvedActivityVisualTheme | null {
  return useContext(ActivityVisualThemeContext);
}
