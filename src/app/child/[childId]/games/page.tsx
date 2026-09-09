import { GamesScreen } from "@/components/learning/LearningPlatform";

export default async function ChildGamesPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <GamesScreen childId={childId} />;
}
