import { ParentBatch15ReportScreen } from "@/components/learning/ParentBatch15Report";

export default async function ParentReportsPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentBatch15ReportScreen childId={childId} />;
}
