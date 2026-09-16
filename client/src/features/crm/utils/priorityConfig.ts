import type { StatusTone } from "@/features/leads/utils/leadStatusConfig";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export const PRIORITY_CONFIG: Record<Priority, { label: string; tone: StatusTone }> = {
  LOW: { label: "Low", tone: "neutral" },
  MEDIUM: { label: "Medium", tone: "amber" },
  HIGH: { label: "High", tone: "red" },
};
