import { Batch14WorldHome } from "@/components/learning/Batch14WorldHome";

export default async function ChildHomePage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <Batch14WorldHome childId={childId} />;
}
