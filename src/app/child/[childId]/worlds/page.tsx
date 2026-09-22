import { WorldCatalogScreen } from "@/components/learning/world-v2/MoneyWorldExperience";

export default async function WorldsPage({
  params
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  return <WorldCatalogScreen childId={childId} />;
}
