import { ParentChildScreen } from "@/components/learning/LearningPlatform";

export default async function ParentChildPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentChildScreen childId={childId} />;
}
