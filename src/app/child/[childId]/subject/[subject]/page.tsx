import { SubjectScreen } from "@/components/learning/ChildLearningPathViews";

export default async function SubjectPage({
  params,
  searchParams
}: {
  params: Promise<{ childId: string; subject: string }>;
  searchParams: Promise<{ qa?: string | string[] }>;
}) {
  const [{ childId, subject }, query] = await Promise.all([params, searchParams]);
  const qaRequested = query.qa === "unlock-all";
  const qaUnlockAll =
    childId === "demo-gian" &&
    qaRequested &&
    process.env.MAINLAGI_QA_UNLOCK_ALL === "1";

  return <SubjectScreen childId={childId} subjectId={subject} qaUnlockAll={qaUnlockAll} />;
}
