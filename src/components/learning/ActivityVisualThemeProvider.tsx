"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import type { ResolvedActivityVisualTheme } from "@/lib/learning/activityVisualTheme";
import {
  characterStateForBelajarMoment,
  resolveCharacterPresentation,
  type BelajarCharacterMoment,
  type ResolvedCharacterPresentation
} from "@/lib/learning/characterPresentation";
import {
  LEARNING_CHARACTER_PRESENTATION_EVENT,
  type LearningCharacterPresentationDetail
} from "@/lib/learning/characterPresentationFeedback";

const ENTRY_TO_WAITING_MS = 1200;
const TRANSIENT_MOMENT_MS = 1100;
const CORRECT_TO_COMPLETION_MS = 550;

const ActivityVisualThemeContext = createContext<ResolvedActivityVisualTheme | null>(null);

interface ActivityCharacterPresentationContextValue {
  moment: BelajarCharacterMoment;
  presentation: ResolvedCharacterPresentation | null;
  setMoment: (moment: BelajarCharacterMoment) => void;
}

const ActivityCharacterPresentationContext =
  createContext<ActivityCharacterPresentationContextValue | null>(null);

function isTransientMoment(moment: BelajarCharacterMoment): boolean {
  return moment === "guide" || moment === "correct" || moment === "retry";
}

export function ActivityVisualThemeProvider({
  visualTheme,
  childId,
  activityId,
  children
}: {
  visualTheme: ResolvedActivityVisualTheme | null;
  childId: string;
  activityId: string;
  children: ReactNode;
}) {
  const [moment, setMomentState] = useState<BelajarCharacterMoment>("entry");
  const momentRef = useRef<BelajarCharacterMoment>("entry");
  const resetTimerRef = useRef<number | null>(null);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const setMoment = useCallback((next: BelajarCharacterMoment) => {
    clearResetTimer();
    momentRef.current = next;
    setMomentState(next);
    if (isTransientMoment(next)) {
      resetTimerRef.current = window.setTimeout(() => {
        setMomentState((current) => {
          if (current !== next) return current;
          momentRef.current = "waiting";
          return "waiting";
        });
        resetTimerRef.current = null;
      }, TRANSIENT_MOMENT_MS);
    }
  }, [clearResetTimer]);

  useEffect(() => {
    clearResetTimer();
    momentRef.current = "entry";
    setMomentState("entry");
    resetTimerRef.current = window.setTimeout(() => {
      setMomentState((current) => {
        if (current !== "entry") return current;
        momentRef.current = "waiting";
        return "waiting";
      });
      resetTimerRef.current = null;
    }, ENTRY_TO_WAITING_MS);
    return clearResetTimer;
  }, [activityId, clearResetTimer]);

  useEffect(() => {
    const onPresentation = (event: Event) => {
      const detail = (event as CustomEvent<LearningCharacterPresentationDetail>).detail;
      if (!detail || detail.childId !== childId || detail.activityId !== activityId) return;
      if (detail.moment === "completion" && momentRef.current === "correct") {
        clearResetTimer();
        resetTimerRef.current = window.setTimeout(() => {
          momentRef.current = "completion";
          setMomentState("completion");
          resetTimerRef.current = null;
        }, CORRECT_TO_COMPLETION_MS);
        return;
      }
      setMoment(detail.moment);
    };
    window.addEventListener(LEARNING_CHARACTER_PRESENTATION_EVENT, onPresentation);
    return () => window.removeEventListener(LEARNING_CHARACTER_PRESENTATION_EVENT, onPresentation);
  }, [activityId, childId, clearResetTimer, setMoment]);

  const presentation = useMemo<ResolvedCharacterPresentation | null>(() => {
    if (!visualTheme) return null;
    return resolveCharacterPresentation({
      context: "activity",
      subjectId: visualTheme.subjectId,
      requestedState: characterStateForBelajarMoment(moment)
    });
  }, [moment, visualTheme]);

  const characterValue = useMemo<ActivityCharacterPresentationContextValue>(() => ({
    moment,
    presentation,
    setMoment
  }), [moment, presentation, setMoment]);

  return (
    <ActivityVisualThemeContext.Provider value={visualTheme}>
      <ActivityCharacterPresentationContext.Provider value={characterValue}>
        {children}
      </ActivityCharacterPresentationContext.Provider>
    </ActivityVisualThemeContext.Provider>
  );
}

export function useActivityVisualTheme(): ResolvedActivityVisualTheme | null {
  return useContext(ActivityVisualThemeContext);
}

export function useActivityCharacterPresentation(): ActivityCharacterPresentationContextValue {
  const value = useContext(ActivityCharacterPresentationContext);
  if (!value) {
    return {
      moment: "waiting",
      presentation: null,
      setMoment: () => {}
    };
  }
  return value;
}
