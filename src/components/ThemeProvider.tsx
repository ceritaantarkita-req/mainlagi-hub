"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "mainlagi-theme";

interface ThemeContextValue {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme(theme: Theme): void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function store(): Storage | null {
  return typeof window !== "undefined" ? window.localStorage : null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Mainlagi uses a bright child/family palette. Only explicit dark opt-in enables dark mode.
  // Legacy "system" and missing preference resolve to light, independent of the OS setting.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  });
  const resolved: "light" | "dark" = theme;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  }, [resolved]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolved,
      setTheme(next) {
        setThemeState(next);
        store()?.setItem(STORAGE_KEY, next);
      }
    }),
    [theme, resolved]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeContext };
