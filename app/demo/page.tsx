import type { Metadata } from "next";
import { Planner } from "@/components/planner/planner";

export const metadata: Metadata = {
  title: "Workspace demo",
  description: "Explore the Calio content planning workspace.",
};

export default function DemoPage() {
  return <Planner />;
}
