import { MathTraceWorldActivity } from "@/components/learning/world/MathTraceWorldActivity";
import { WorldActivityScreen } from "@/components/learning/world/WorldExperience";

export default async function ActivityPage({ params }: { params: Promise<{ childId: string; activity: string }> }) {
  const { childId, activity } = await params;
  if (activity === "math-trace-5-touch") return <MathTraceWorldActivity childId={childId} />;
  return <WorldActivityScreen childId={childId} activityId={activity} />;
}
