"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "system" | "light" | "dark";

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
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "system";
  });
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const resolved: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

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
