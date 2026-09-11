import type { Metadata } from "next";
import { DeviceQaHarness } from "@/components/DeviceQaHarness";

export const metadata: Metadata = {
  title: "Physical Device QA",
  robots: {
    index: false,
    follow: false
  }
};

export default function DeviceQaPage() {
  return <DeviceQaHarness />;
}
