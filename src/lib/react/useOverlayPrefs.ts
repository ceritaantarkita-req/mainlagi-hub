"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persisted on/off preferences for the camera overlay.
 *
 * Face mesh and skeleton are drawn on every game screen with no way to turn
 * them off, which matters for two real situations: a parent who finds the
 * mesh distracting while helping a five-year-old aim their hand, and a low-end
 * phone where two more layers of canvas drawing costs frames the game needs.
 * The choice is remembered across games and reloads (`localStorage`), not
 * re-asked on every screen.
 */
export interface OverlayPrefs {
  skeleton: boolean;
  face: boolean;
}

const STORAGE_KEY = "mlh:overlay-prefs:v1";
const DEFAULTS: OverlayPrefs = { skeleton: true, face: true };

function readStored(): OverlayPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<OverlayPrefs>;
    return {
      skeleton: typeof parsed.skeleton === "boolean" ? parsed.skeleton : DEFAULTS.skeleton,
      face: typeof parsed.face === "boolean" ? parsed.face : DEFAULTS.face
    };
  } catch {
    return DEFAULTS;
  }
}

/**
 * A tiny cross-component store rather than component-local state: the toggle
 * lives inside {@link CameraBackdrop}, which every game mounts fresh, so
 * plain `useState` would forget the choice the moment a player moved from one
 * game to the next.
 */
let cached: OverlayPrefs | null = null;
const listeners = new Set<(next: OverlayPrefs) => void>();

function getPrefs(): OverlayPrefs {
  if (!cached) cached = readStored();
  return cached;
}

function setPrefs(next: OverlayPrefs): void {
  cached = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing / storage disabled: the toggle still works for the
      // rest of this session, it just will not survive a reload.
    }
  }
  for (const listener of listeners) listener(next);
}

export function useOverlayPrefs(): {
  prefs: OverlayPrefs;
  toggle(key: keyof OverlayPrefs): void;
} {
  // Starts at the same defaults the server would render, then syncs to
  // whatever is actually stored once mounted on the client. Reading
  // localStorage during the initial render would make the first client
  // render disagree with the server-rendered markup and trip a hydration
  // mismatch.
  const [prefs, setLocal] = useState<OverlayPrefs>(DEFAULTS);

  /* eslint-disable react-hooks/set-state-in-effect -- this effect's whole job
     is a one-time sync from an external system (localStorage) that render
     cannot read without breaking hydration; see the comment above. */
  useEffect(() => {
    setLocal(getPrefs());
    listeners.add(setLocal);
    return () => {
      listeners.delete(setLocal);
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggle = useCallback((key: keyof OverlayPrefs) => {
    const current = getPrefs();
    setPrefs({ ...current, [key]: !current[key] });
  }, []);

  return { prefs, toggle };
}
