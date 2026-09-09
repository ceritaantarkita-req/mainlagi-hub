import { MainlagiWorldHome } from "@/components/learning/world/WorldExperience";

export default async function ChildHomePage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <MainlagiWorldHome childId={childId} />;
}
