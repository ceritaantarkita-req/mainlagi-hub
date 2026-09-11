import { DrawingStageScreen } from "@/components/learning/CreativeTrackViews";
import { StageScreen } from "@/components/learning/ChildLearningPathViews";
import { getStage } from "@/lib/learning/system";

export default async function StagePage({ params }: { params: Promise<{ childId: string; stage: string }> }) {
  const { childId, stage } = await params;
  const definition = getStage(stage);
  return definition?.subjectId === "drawing"
    ? <DrawingStageScreen childId={childId} stageId={stage} />
    : <StageScreen childId={childId} stageId={stage} />;
}
