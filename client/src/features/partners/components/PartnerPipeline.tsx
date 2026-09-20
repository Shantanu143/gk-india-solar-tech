import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerPipelineStage } from "@/features/partners/utils/partnerPipeline";

interface PartnerPipelineProps {
  stages: PartnerPipelineStage[];
  className?: string;
}

/** A vertical timeline rather than a horizontal stepper — 12 stages don't fit a phone screen
 * horizontally, and a vertical list reads well at every breakpoint without a scroll wrapper. */
export function PartnerPipeline({ stages, className }: PartnerPipelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1;
        return (
          <li key={stage.key} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-6 left-[11px] h-full w-0.5 -translate-x-1/2",
                  stage.state === "done" ? "bg-green" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                stage.state === "done" && "border-green bg-green text-white",
                stage.state === "current" && "border-orange bg-orange/10 text-orange-dark",
                stage.state === "upcoming" && "border-border bg-surface text-muted-foreground",
              )}
            >
              {stage.state === "done" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
            </span>
            <div className="pt-0.5">
              <p className={cn("text-sm font-semibold", stage.state === "upcoming" ? "text-muted-foreground" : "text-navy")}>
                {stage.label}
              </p>
              {stage.state === "current" && <p className="text-xs font-medium text-orange-dark">In progress</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
