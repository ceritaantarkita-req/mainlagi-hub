import { MathTraceWorldActivity } from "@/components/learning/world/MathTraceWorldActivity";
import { WorldActivityScreen } from "@/components/learning/world/WorldExperience";
import styles from "./ActivityPage.module.css";

export default async function ActivityPage({ params }: { params: Promise<{ childId: string; activity: string }> }) {
  const { childId, activity } = await params;
  return (
    <div className={styles.immersive}>
      {activity === "math-trace-5-touch" ? <MathTraceWorldActivity childId={childId} /> : <WorldActivityScreen childId={childId} activityId={activity} />}
    </div>
  );
}
