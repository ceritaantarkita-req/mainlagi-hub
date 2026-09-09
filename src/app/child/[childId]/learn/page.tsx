import { WorldLearnEntry } from "@/components/learning/world/WorldExperience";

export default async function LearnPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <WorldLearnEntry childId={childId} />;
}
