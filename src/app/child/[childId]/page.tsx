import { redirect } from "next/navigation";

export default async function ChildIndexPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  redirect(`/child/${childId}/home`);
}
