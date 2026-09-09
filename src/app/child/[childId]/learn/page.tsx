import { LearnLibraryScreen } from "@/components/learning/ChildLearningPathViews";

export default async function LearnPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <LearnLibraryScreen childId={childId} />;
}
