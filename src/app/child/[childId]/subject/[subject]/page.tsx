import { SubjectScreen } from "@/components/learning/ChildLearningPathViews";

export default async function SubjectPage({ params }: { params: Promise<{ childId: string; subject: string }> }) {
  const { childId, subject } = await params;
  return <SubjectScreen childId={childId} subjectId={subject} />;
}
