import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Project", "Location", "Electricity", "Result"];
const INPUT_STEP_COUNT = 3;

interface EstimateProgressProps {
  currentIndex: number;
}

export function EstimateProgress({ currentIndex }: EstimateProgressProps) {
  const isResult = currentIndex >= INPUT_STEP_COUNT;

  return (
    <div>
      {/* Mobile: compact fraction + bar */}
      <div className="sm:hidden">
        {isResult ? (
          <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Your Result</span>
        ) : (
          <>
            <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">
              Step {currentIndex + 1} of {INPUT_STEP_COUNT}
            </span>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <motion.div
                className="h-full rounded-full bg-orange"
                animate={{ width: `${((currentIndex + 1) / INPUT_STEP_COUNT) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </>
        )}
      </div>

      {/* Desktop: labeled step track */}
      <ol className="hidden items-center justify-center gap-3 sm:flex">
        {STEP_LABELS.map((label, i) => {
          const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
          return (
            <li key={label} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <motion.span
                  animate={{ scale: state === "current" ? 1.12 : 1 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold",
                    state === "current" && "bg-orange text-white",
                    state === "done" && "bg-navy text-white",
                    state === "upcoming" && "bg-surface-muted text-muted-foreground",
                  )}
                >
                  {state === "done" ? <Check className="h-4 w-4" /> : i + 1}
                </motion.span>
                <span
                  className={cn(
                    "text-xs font-semibold whitespace-nowrap",
                    state === "upcoming" ? "text-muted-foreground" : "text-navy",
                  )}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <span aria-hidden="true" className={cn("h-px w-10 lg:w-14", i < currentIndex ? "bg-navy" : "bg-border")} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
