import { ParentCoreProgressScreen } from "@/components/learning/ParentCoreProgress";

export default async function ParentProgressPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentCoreProgressScreen childId={childId} />;
}
