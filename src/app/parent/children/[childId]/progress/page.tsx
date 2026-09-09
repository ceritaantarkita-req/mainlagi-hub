import { ParentProgressScreen } from "@/components/learning/LearningPlatform";

export default async function ParentProgressPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentProgressScreen childId={childId} />;
}
