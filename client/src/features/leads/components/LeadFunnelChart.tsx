import { motion } from "framer-motion";
import { LEAD_STATUS_CONFIG } from "@/features/leads/utils/leadStatusConfig";
import type { FunnelStageCount } from "@/features/crm/types/dashboard";

export function LeadFunnelChart({ stages }: { stages: FunnelStageCount[] }) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-2.5">
      {stages.map((stage, i) => {
        const isLost = stage.status === "LOST";
        return (
          <div key={stage.status} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-xs font-semibold text-muted-foreground">
              {LEAD_STATUS_CONFIG[stage.status].label}
            </span>
            <div className="h-6 flex-1 overflow-hidden rounded-md bg-surface-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((stage.count / maxCount) * 100, stage.count > 0 ? 4 : 0)}%` }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
                className={isLost ? "h-full rounded-md bg-error/60" : "h-full rounded-md bg-navy"}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-xs font-semibold text-navy">
              {stage.count} <span className="text-muted-foreground">({stage.percentOfTotal}%)</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
