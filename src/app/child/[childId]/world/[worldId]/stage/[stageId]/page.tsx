import { MoneyWorldStageScreen } from "@/components/learning/world-v2/MoneyWorldExperience";

export default async function WorldStagePage({
  params
}: {
  params: Promise<{ childId: string; worldId: string; stageId: string }>;
}) {
  const { childId, worldId, stageId } = await params;
  return <MoneyWorldStageScreen childId={childId} worldId={worldId} stageId={stageId} />;
}
