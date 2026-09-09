import { ParentCertificatesScreen } from "@/components/learning/LearningPlatform";

export default async function ParentCertificatesPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ParentCertificatesScreen childId={childId} />;
}
