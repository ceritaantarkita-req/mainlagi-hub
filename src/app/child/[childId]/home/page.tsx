import { ChildHomeScreen } from "@/components/learning/LearningPlatform";

export default async function ChildHomePage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ChildHomeScreen childId={childId} />;
}
