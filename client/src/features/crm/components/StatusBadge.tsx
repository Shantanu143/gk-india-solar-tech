import type { ReactNode } from "react";
import { TONE_CLASSES, type StatusTone } from "@/features/leads/utils/leadStatusConfig";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: ReactNode;
  tone: StatusTone;
  className?: string;
}

/** Generic tone-driven pill used by LeadStatusBadge, FollowUpStatusBadge, PriorityBadge, etc. */
export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  const classes = TONE_CLASSES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        classes.bg,
        classes.text,
        className,
      )}
    >
      {label}
    </span>
  );
}
