import { ParentMasteryReportsScreen } from "@/components/learning/ParentMasteryViews";

export default async function ParentReportsPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentMasteryReportsScreen childId={childId} />;
}
