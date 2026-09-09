import { WorldSubjectScreen } from "@/components/learning/world/WorldExperience";

export default async function SubjectPage({ params }: { params: Promise<{ childId: string; subject: string }> }) {
  const { childId, subject } = await params;
  return <WorldSubjectScreen childId={childId} subjectId={subject} />;
}
