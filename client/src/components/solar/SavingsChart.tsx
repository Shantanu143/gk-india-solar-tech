import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { formatInr } from "@/lib/format";

interface SavingsChartProps {
  monthlySaving: number;
  annualSaving: number;
  lifetimeSaving: number;
}

/**
 * Monthly, annual and 25-year savings differ by ~300x, so a single shared-axis bar chart would
 * render the smaller two as invisible slivers next to the 25-year bar — more misleading precision
 * than insight. This shows the multiplier relationship instead (Monthly ×12 → Annual ×25 → Lifetime).
 */
export function SavingsChart({ monthlySaving, annualSaving, lifetimeSaving }: SavingsChartProps) {
  const steps = [
    { label: "Monthly", value: monthlySaving, multiplier: null },
    { label: "Annual", value: annualSaving, multiplier: "× 12" },
    { label: "25-Year", value: lifetimeSaving, multiplier: "× 25" },
  ];

  return (
    <Reveal>
      <div
        className="flex flex-col items-stretch gap-3 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
        title="Estimated"
      >
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3 sm:contents">
            <div className="flex-1 text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase">{step.label}</p>
              <p className="mt-1 text-lg font-bold text-green">{formatInr(step.value)}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex shrink-0 flex-col items-center gap-0.5 text-muted-foreground">
                <ArrowRight className="h-4 w-4 rotate-90 sm:rotate-0" aria-hidden="true" />
                <span className="text-[10px] font-semibold">{steps[i + 1].multiplier}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-1 h-0.5 origin-left rounded-full bg-green/30"
      />
    </Reveal>
  );
}
