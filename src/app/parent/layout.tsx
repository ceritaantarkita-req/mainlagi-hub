import type { ReactNode } from "react";
import { ParentShell } from "@/components/learning/LearningPlatform";

export default function ParentLayout({ children }: { children: ReactNode }) {
  return <ParentShell>{children}</ParentShell>;
}
