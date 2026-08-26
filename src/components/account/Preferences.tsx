"use client";

import { useContext } from "react";
import { Icon } from "@/components/Icon";
import { ThemeContext } from "@/components/ThemeProvider";

const THEMES = [
  { value: "system" as const, label: "Sistem", icon: "settings" as const },
  { value: "light" as const, label: "Terang", icon: "sun" as const },
  { value: "dark" as const, label: "Gelap", icon: "moon" as const }
];

export function Preferences() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;

  return (
    <div className="preferences">
      <div className="preferences__group">
        <h3>Tema</h3>
        <div className="preferences__options">
          {THEMES.map((option) => (
            <button
              key={option.value}
              type="button"
              className={ctx.theme === option.value ? "is-active" : ""}
              onClick={() => ctx.setTheme(option.value)}
            >
              <Icon name={option.icon} size={18} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="preferences__group">
        <h3>Bahasa</h3>
        <p className="preferences__note">
          Bahasa mengikuti sistem. Dukungan Bahasa Inggris menyusul pada fase
          berikutnya.
        </p>
      </div>
    </div>
  );
}
