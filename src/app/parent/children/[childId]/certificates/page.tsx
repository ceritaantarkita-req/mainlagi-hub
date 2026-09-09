import { ParentMasteryCertificatesScreen } from "@/components/learning/ParentMasteryViews";

export default async function ParentCertificatesPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentMasteryCertificatesScreen childId={childId} />;
}
