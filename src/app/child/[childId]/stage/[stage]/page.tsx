import { StageScreen } from "@/components/learning/LearningPlatform";

export default async function StagePage({ params }: { params: Promise<{ childId: string; stage: string }> }) {
  const { childId, stage } = await params;
  return <StageScreen childId={childId} stageId={stage} />;
}
