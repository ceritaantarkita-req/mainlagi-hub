"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getNextActivityInStage, type LearningActivity } from "@/lib/learning/system";
import { CanonicalCompletion } from "@/components/CanonicalCompletion";
import { CanonicalShareDialog } from "@/components/CanonicalShare";

const PRAISE = ["Great job!", "Excellent!", "Hebat!", "Keren!"];

function deterministicPraise(activityId: string) {
  let total = 0;
  for (const char of activityId) total += char.charCodeAt(0);
  return PRAISE[total % PRAISE.length];
}

export function ActivityCompletion({
  childId,
  activity,
  onTryAgain
}: {
  childId: string;
  activity: LearningActivity;
  onTryAgain?: () => void;
}) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const praise = useMemo(() => deterministicPraise(activity.id), [activity.id]);
  const next = getNextActivityInStage(activity.id);
  const subjectHref = `/child/${childId}/subject/${activity.subjectId}`;
  const nextHref = next ? `/child/${childId}/activity/${next.id}` : subjectHref;

  const goBack = () => {
    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (referrer?.origin === window.location.origin) {
        router.back();
        return;
      }
    } catch {}
    router.push(subjectHref);
  };

  const retry = () => {
    if (onTryAgain) {
      onTryAgain();
      return;
    }
    window.location.reload();
  };

  return (
    <>
      <CanonicalCompletion
        data-activity-completion
        context="belajar"
        surface="overlay"
        praise={praise}
        message="Permainan selesai. Mau lanjut ke mana?"
        back={{ onClick: goBack }}
        again={{ onClick: retry }}
        next={{ href: nextHref, ariaLabel: "Next" }}
        onShare={() => setShareOpen(true)}
      />

      <CanonicalShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        input={{ context: "belajar" }}
      />
    </>
  );
}
