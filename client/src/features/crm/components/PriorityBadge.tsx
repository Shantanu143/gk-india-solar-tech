import { AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { PRIORITY_CONFIG, type Priority } from "@/features/crm/utils/priorityConfig";

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <StatusBadge
      label={
        priority === "HIGH" ? (
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {config.label}
          </span>
        ) : (
          config.label
        )
      }
      tone={config.tone}
      className={className}
    />
  );
}
