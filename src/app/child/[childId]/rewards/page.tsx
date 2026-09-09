import { RewardsScreen } from "@/components/learning/LearningPlatform";

export default async function RewardsPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <RewardsScreen childId={childId} />;
}
