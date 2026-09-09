import { ParentWeeklyReportV2Screen } from "@/components/learning/ParentAwardsReportV2";

export default async function ParentReportsPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentWeeklyReportV2Screen childId={childId} />;
}
