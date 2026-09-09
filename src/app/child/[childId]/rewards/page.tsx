import { WorldRewardsScreen } from "@/components/learning/world/WorldExperience";

export default async function RewardsPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <WorldRewardsScreen childId={childId} />;
}
