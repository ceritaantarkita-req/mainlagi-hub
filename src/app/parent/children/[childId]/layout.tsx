import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { parentCanAccessChild } from "@/lib/auth/requireParent";

export default async function ParentChildLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  if (!await parentCanAccessChild(childId)) notFound();
  return children;
}
