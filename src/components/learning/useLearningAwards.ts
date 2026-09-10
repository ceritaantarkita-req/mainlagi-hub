"use client";

import { useEffect, useState } from "react";
import { readCloudLearningAwards, type PersistedLearningAwards } from "@/lib/learning/awardsCloud";

export function useLearningAwards(childId: string) {
  const [awards, setAwards] = useState<PersistedLearningAwards>({ achievements: [], certificates: [] });
  const [cloudAvailable, setCloudAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const result = await readCloudLearningAwards(childId);
      if (cancelled) return;
      if (result) {
        setAwards(result);
        setCloudAvailable(true);
      } else {
        setCloudAvailable(false);
      }
    };
    void refresh();
    const onCloud = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) void refresh();
    };
    window.addEventListener("mainlagi-learning-cloud", onCloud);
    return () => {
      cancelled = true;
      window.removeEventListener("mainlagi-learning-cloud", onCloud);
    };
  }, [childId]);

  return { ...awards, cloudAvailable };
}
