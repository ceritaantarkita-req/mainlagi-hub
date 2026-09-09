import { WorldActivityScreen } from "@/components/learning/world/WorldExperience";

export default async function ActivityPage({ params }: { params: Promise<{ childId: string; activity: string }> }) {
  const { childId, activity } = await params;
  return <WorldActivityScreen childId={childId} activityId={activity} />;
}
