import { ParentReportsScreen } from "@/components/learning/LearningPlatform";

export default async function ParentReportsPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentReportsScreen childId={childId} />;
}
