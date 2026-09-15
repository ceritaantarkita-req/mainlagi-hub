import { AudioChoiceLearningActivity } from "@/components/learning/AudioChoiceLearningActivity";
import { CauseEffectActivity } from "@/components/learning/CauseEffectActivity";
import { ComparePropertiesActivity } from "@/components/learning/ComparePropertiesActivity";
import { CountAndSelectActivity } from "@/components/learning/CountAndSelectActivity";
import { CreativePracticeActivity } from "@/components/learning/CreativePracticeActivity";
import { DragTargetMatchActivity } from "@/components/learning/DragTargetMatchActivity";
import { MemoryMatchActivity } from "@/components/learning/MemoryMatchActivity";
import { MoreLessBalanceActivity } from "@/components/learning/MoreLessBalanceActivity";
import { NumberLineActivity } from "@/components/learning/NumberLineActivity";
import { PatternCompletionActivity } from "@/components/learning/PatternCompletionActivity";
import { SequenceSlotChoiceActivity } from "@/components/learning/SequenceSlotChoiceActivity";
import { SortingBucketsChoiceActivity } from "@/components/learning/SortingBucketsChoiceActivity";
import { SymbolHuntChoiceActivity } from "@/components/learning/SymbolHuntChoiceActivity";
import { MathTraceWorldActivity } from "@/components/learning/world/MathTraceWorldActivity";
import { WorldActivityScreen } from "@/components/learning/world/WorldExperience";
import {
  isCauseEffectActivity,
  isComparePropertiesActivity,
  isCountAndSelectActivity,
  isDragTargetActivity,
  isMemoryPairActivity,
  isMoreLessBalanceActivity,
  isNumberLineActivity,
  isPatternCompletionActivity,
  isSequenceSlotActivity,
  isSortingBucketsActivity
} from "@/lib/learning/gameplayPresentation";
import { getActivity } from "@/lib/learning/system";
import styles from "./ActivityPage.module.css";

export default async function ActivityPage({ params }: { params: Promise<{ childId: string; activity: string }> }) {
  const { childId, activity } = await params;
  const definition = getActivity(activity);
  const runtime = String(definition?.runtime ?? "");

  return (
    <div className={styles.immersive}>
      {activity === "math-trace-5-touch" ? (
        <MathTraceWorldActivity childId={childId} />
      ) : runtime === "drawing" || runtime === "coloring" ? (
        <CreativePracticeActivity childId={childId} activityId={activity} />
      ) : runtime === "listen_and_choose" ? (
        <AudioChoiceLearningActivity childId={childId} activityId={activity} />
      ) : definition?.choicePresentation === "symbol_hunt" ? (
        <SymbolHuntChoiceActivity childId={childId} activityId={activity} />
      ) : isMemoryPairActivity(definition) ? (
        <MemoryMatchActivity childId={childId} activityId={activity} />
      ) : isDragTargetActivity(definition) ? (
        <DragTargetMatchActivity childId={childId} activityId={activity} />
      ) : isSequenceSlotActivity(definition) ? (
        <SequenceSlotChoiceActivity childId={childId} activityId={activity} />
      ) : isSortingBucketsActivity(definition) ? (
        <SortingBucketsChoiceActivity childId={childId} activityId={activity} />
      ) : isCountAndSelectActivity(definition) ? (
        <CountAndSelectActivity childId={childId} activityId={activity} />
      ) : isNumberLineActivity(definition) ? (
        <NumberLineActivity childId={childId} activityId={activity} />
      ) : isMoreLessBalanceActivity(definition) ? (
        <MoreLessBalanceActivity childId={childId} activityId={activity} />
      ) : isPatternCompletionActivity(definition) ? (
        <PatternCompletionActivity childId={childId} activityId={activity} />
      ) : isCauseEffectActivity(definition) ? (
        <CauseEffectActivity childId={childId} activityId={activity} />
      ) : isComparePropertiesActivity(definition) ? (
        <ComparePropertiesActivity childId={childId} activityId={activity} />
      ) : (
        <WorldActivityScreen childId={childId} activityId={activity} />
      )}
    </div>
  );
}
