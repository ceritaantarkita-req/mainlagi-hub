import { AudioChoiceLearningActivity } from "@/components/learning/AudioChoiceLearningActivity";
import { CauseEffectActivity } from "@/components/learning/CauseEffectActivity";
import { ClozeSentenceChoiceActivity } from "@/components/learning/ClozeSentenceChoiceActivity";
import { ComparePropertiesActivity } from "@/components/learning/ComparePropertiesActivity";
import { CountAndSelectActivity } from "@/components/learning/CountAndSelectActivity";
import { CreativePracticeActivity } from "@/components/learning/CreativePracticeActivity";
import { DragTargetMatchActivity } from "@/components/learning/DragTargetMatchActivity";
import { EliminationBoardActivity } from "@/components/learning/EliminationBoardActivity";
import { EqualGroupsActivity } from "@/components/learning/EqualGroupsActivity";
import { FeatureFunctionLinkActivity } from "@/components/learning/FeatureFunctionLinkActivity";
import { GrowthStageTransitionActivity } from "@/components/learning/GrowthStageTransitionActivity";
import { HealthyHabitRoutineActivity } from "@/components/learning/HealthyHabitRoutineActivity";
import { InitialSoundActivity } from "@/components/learning/InitialSoundActivity";
import { InvestigationBoardActivity } from "@/components/learning/InvestigationBoardActivity";
import { MakeTotalActivity } from "@/components/learning/MakeTotalActivity";
import { MaterialLabActivity } from "@/components/learning/MaterialLabActivity";
import { MemoryMatchActivity } from "@/components/learning/MemoryMatchActivity";
import { MoreLessBalanceActivity } from "@/components/learning/MoreLessBalanceActivity";
import { NumberLineActivity } from "@/components/learning/NumberLineActivity";
import { OddOneOutActivity } from "@/components/learning/OddOneOutActivity";
import { PatternCompletionActivity } from "@/components/learning/PatternCompletionActivity";
import { PhraseSceneMatchActivity } from "@/components/learning/PhraseSceneMatchActivity";
import { PhenomenonRelationBoardActivity } from "@/components/learning/PhenomenonRelationBoardActivity";
import { ShapeAttributeBoardActivity } from "@/components/learning/ShapeAttributeBoardActivity";
import { PictureWordMatchActivity } from "@/components/learning/PictureWordMatchActivity";
import { ReadingPassageQuestionActivity } from "@/components/learning/ReadingPassageQuestionActivity";
import { RelativeOrderTrackActivity } from "@/components/learning/RelativeOrderTrackActivity";
import { RulePipelineActivity } from "@/components/learning/RulePipelineActivity";
import { SingleRuleApplyActivity } from "@/components/learning/SingleRuleApplyActivity";
import { SubitizingGlanceActivity } from "@/components/learning/SubitizingGlanceActivity";
import { SentenceOrderCardsActivity } from "@/components/learning/SentenceOrderCardsActivity";
import { SequenceSlotChoiceActivity } from "@/components/learning/SequenceSlotChoiceActivity";
import { SetReasoningActivity } from "@/components/learning/SetReasoningActivity";
import { SortingBucketsChoiceActivity } from "@/components/learning/SortingBucketsChoiceActivity";
import { SpatialRelationBoardActivity } from "@/components/learning/SpatialRelationBoardActivity";
import { SpatialTransformActivity } from "@/components/learning/SpatialTransformActivity";
import { SyllableAssemblyActivity } from "@/components/learning/SyllableAssemblyActivity";
import { SymbolHuntChoiceActivity } from "@/components/learning/SymbolHuntChoiceActivity";
import { TakeAwayActivity } from "@/components/learning/TakeAwayActivity";
import { TransitiveChainActivity } from "@/components/learning/TransitiveChainActivity";
import { VisualWordProblemActivity } from "@/components/learning/VisualWordProblemActivity";
import { MathTraceWorldActivity } from "@/components/learning/world/MathTraceWorldActivity";
import { WorldActivityScreen } from "@/components/learning/world/WorldExperience";
import { isClozeSentenceChoiceActivity } from "@/lib/learning/clozeSentenceChoiceConfig";
import {
  isCauseEffectActivity,
  isComparePropertiesActivity,
  isCountAndSelectActivity,
  isDragTargetActivity,
  isEqualGroupsActivity,
  isFeatureFunctionLinkActivity,
  isHealthyHabitRoutineActivity,
  isInitialSoundActivity,
  isInvestigationBoardActivity,
  isMakeTotalActivity,
  isMaterialLabActivity,
  isMemoryPairActivity,
  isMoreLessBalanceActivity,
  isNumberLineActivity,
  isOddOneOutActivity,
  isPatternCompletionActivity,
  isPictureWordMatchActivity,
  isRelativeOrderTrackActivity,
  isRulePipelineActivity,
  isSequenceSlotActivity,
  isSetReasoningActivity,
  isSortingBucketsActivity,
  isSpatialTransformActivity,
  isSyllableAssemblyActivity,
  isTakeAwayActivity,
  isTransitiveChainActivity
} from "@/lib/learning/gameplayPresentation";
import { isEliminationBoardActivity } from "@/lib/learning/eliminationBoardConfig";
import { isGrowthStageTransitionActivity } from "@/lib/learning/growthStageTransitionConfig";
import { isPhraseSceneMatchActivity } from "@/lib/learning/phraseSceneMatchConfig";
import { isPhenomenonRelationBoardActivity } from "@/lib/learning/phenomenonRelationBoardConfig";
import { isShapeAttributeBoardActivity } from "@/lib/learning/shapeAttributeBoardConfig";
import { isReadingPassageQuestionActivity } from "@/lib/learning/readingPassageQuestionConfig";
import { isSentenceOrderCardsActivity } from "@/lib/learning/sentenceOrderCardsConfig";
import { isSingleRuleApplyActivity } from "@/lib/learning/singleRuleApplyConfig";
import { isSubitizingGlanceActivity } from "@/lib/learning/subitizingGlanceConfig";
import { isSpatialRelationBoardActivity } from "@/lib/learning/spatialRelationBoardConfig";
import { getActivity } from "@/lib/learning/system";
import { isVisualWordProblemActivity } from "@/lib/learning/visualWordProblemConfig";
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
      ) : isSyllableAssemblyActivity(definition) ? (
        <SyllableAssemblyActivity childId={childId} activityId={activity} />
      ) : isInitialSoundActivity(definition) ? (
        <InitialSoundActivity childId={childId} activityId={activity} />
      ) : isPhraseSceneMatchActivity(definition) ? (
        <PhraseSceneMatchActivity childId={childId} activityId={activity} />
      ) : isGrowthStageTransitionActivity(definition) ? (
        <GrowthStageTransitionActivity childId={childId} activityId={activity} />
      ) : isSingleRuleApplyActivity(definition) ? (
        <SingleRuleApplyActivity childId={childId} activityId={activity} />
      ) : isSubitizingGlanceActivity(definition) ? (
        <SubitizingGlanceActivity childId={childId} activityId={activity} />
      ) : isEliminationBoardActivity(definition) ? (
        <EliminationBoardActivity childId={childId} activityId={activity} />
      ) : isPhenomenonRelationBoardActivity(definition) ? (
        <PhenomenonRelationBoardActivity childId={childId} activityId={activity} />
      ) : isShapeAttributeBoardActivity(definition) ? (
        <ShapeAttributeBoardActivity childId={childId} activityId={activity} />
      ) : isPictureWordMatchActivity(definition) ? (
        <PictureWordMatchActivity childId={childId} activityId={activity} />
      ) : isSentenceOrderCardsActivity(definition) ? (
        <SentenceOrderCardsActivity childId={childId} activityId={activity} />
      ) : isReadingPassageQuestionActivity(definition) ? (
        <ReadingPassageQuestionActivity childId={childId} activityId={activity} />
      ) : isClozeSentenceChoiceActivity(definition) ? (
        <ClozeSentenceChoiceActivity childId={childId} activityId={activity} />
      ) : isVisualWordProblemActivity(definition) ? (
        <VisualWordProblemActivity childId={childId} activityId={activity} />
      ) : isSpatialRelationBoardActivity(definition) ? (
        <SpatialRelationBoardActivity childId={childId} activityId={activity} />
      ) : isSortingBucketsActivity(definition) ? (
        <SortingBucketsChoiceActivity childId={childId} activityId={activity} />
      ) : isOddOneOutActivity(definition) ? (
        <OddOneOutActivity childId={childId} activityId={activity} />
      ) : isRulePipelineActivity(definition) ? (
        <RulePipelineActivity childId={childId} activityId={activity} />
      ) : isSetReasoningActivity(definition) ? (
        <SetReasoningActivity childId={childId} activityId={activity} />
      ) : isTransitiveChainActivity(definition) ? (
        <TransitiveChainActivity childId={childId} activityId={activity} />
      ) : isSpatialTransformActivity(definition) ? (
        <SpatialTransformActivity childId={childId} activityId={activity} />
      ) : isRelativeOrderTrackActivity(definition) ? (
        <RelativeOrderTrackActivity childId={childId} activityId={activity} />
      ) : isCountAndSelectActivity(definition) ? (
        <CountAndSelectActivity childId={childId} activityId={activity} />
      ) : isNumberLineActivity(definition) ? (
        <NumberLineActivity childId={childId} activityId={activity} />
      ) : isMoreLessBalanceActivity(definition) ? (
        <MoreLessBalanceActivity childId={childId} activityId={activity} />
      ) : isPatternCompletionActivity(definition) ? (
        <PatternCompletionActivity childId={childId} activityId={activity} />
      ) : isEqualGroupsActivity(definition) ? (
        <EqualGroupsActivity childId={childId} activityId={activity} />
      ) : isMakeTotalActivity(definition) ? (
        <MakeTotalActivity childId={childId} activityId={activity} />
      ) : isTakeAwayActivity(definition) ? (
        <TakeAwayActivity childId={childId} activityId={activity} />
      ) : isCauseEffectActivity(definition) ? (
        <CauseEffectActivity childId={childId} activityId={activity} />
      ) : isComparePropertiesActivity(definition) ? (
        <ComparePropertiesActivity childId={childId} activityId={activity} />
      ) : isHealthyHabitRoutineActivity(definition) ? (
        <HealthyHabitRoutineActivity childId={childId} activityId={activity} />
      ) : isMaterialLabActivity(definition) ? (
        <MaterialLabActivity childId={childId} activityId={activity} />
      ) : isFeatureFunctionLinkActivity(definition) ? (
        <FeatureFunctionLinkActivity childId={childId} activityId={activity} />
      ) : isInvestigationBoardActivity(definition) ? (
        <InvestigationBoardActivity childId={childId} activityId={activity} />
      ) : (
        <WorldActivityScreen childId={childId} activityId={activity} />
      )}
    </div>
  );
}
