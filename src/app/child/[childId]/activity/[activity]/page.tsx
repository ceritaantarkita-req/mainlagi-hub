import { ActivityScreen } from "@/components/learning/LearningPlatform";

export default async function ActivityPage({ params }: { params: Promise<{ childId: string; activity: string }> }) {
  const { childId, activity } = await params;
  return <ActivityScreen childId={childId} activityId={activity} />;
}
