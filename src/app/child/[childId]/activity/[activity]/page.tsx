import { AudioChoiceLearningActivity } from "@/components/learning/AudioChoiceLearningActivity";
import { MathTraceWorldActivity } from "@/components/learning/world/MathTraceWorldActivity";
import { WorldActivityScreen } from "@/components/learning/world/WorldExperience";
import { getActivity } from "@/lib/learning/system";
import styles from "./ActivityPage.module.css";

export default async function ActivityPage({ params }: { params: Promise<{ childId: string; activity: string }> }) {
  const { childId, activity } = await params;
  const definition = getActivity(activity);

  return (
    <div className={styles.immersive}>
      {activity === "math-trace-5-touch" ? (
        <MathTraceWorldActivity childId={childId} />
      ) : definition?.runtime === "listen_and_choose" ? (
        <AudioChoiceLearningActivity childId={childId} activityId={activity} />
      ) : (
        <WorldActivityScreen childId={childId} activityId={activity} />
      )}
    </div>
  );
}
