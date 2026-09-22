import { MoneyWorldMapScreen } from "@/components/learning/world-v2/MoneyWorldExperience";

export default async function WorldMapPage({
  params
}: {
  params: Promise<{ childId: string; worldId: string }>;
}) {
  const { childId, worldId } = await params;
  return <MoneyWorldMapScreen childId={childId} worldId={worldId} />;
}
