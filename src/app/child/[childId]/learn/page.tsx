import { redirect } from "next/navigation";

export default async function LearnPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  redirect(`/child/${childId}/home#choose-subject`);
}
