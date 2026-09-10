import { ParentIssuedCertificatesScreen } from "@/components/learning/ParentAwardsReportV2";

export default async function ParentCertificatesPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentIssuedCertificatesScreen childId={childId} />;
}
