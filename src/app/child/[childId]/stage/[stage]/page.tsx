import { WorldStageScreen } from "@/components/learning/world/WorldExperience";

export default async function StagePage({ params }: { params: Promise<{ childId: string; stage: string }> }) {
  const { childId, stage } = await params;
  return <WorldStageScreen childId={childId} stageId={stage} />;
}
