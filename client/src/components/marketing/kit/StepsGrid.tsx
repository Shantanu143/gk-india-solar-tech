import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export interface Step {
  title: string;
  description: string;
  number?: string;
  icon?: LucideIcon;
}

interface StepsGridProps {
  steps: Step[];
  columns?: 3 | 4 | 5;
}

const cols = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" } as const;

/** Numbered step cards; each card draws its top accent line in as it enters. */
export function StepsGrid({ steps, columns = 4 }: StepsGridProps) {
  return (
    <ol className={cn("grid w-full grid-cols-1 gap-4 sm:grid-cols-2", cols[columns])}>
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <Reveal key={step.title} delay={(i % columns) * 0.07}>
            <li className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg">
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left bg-gradient-to-r from-sky to-orange"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.05 }}
              />
              <div className="flex items-start justify-between">
                <span className="font-serif text-5xl leading-none text-sky/25 transition-colors duration-300 group-hover:text-sky">
                  {step.number ?? String(i + 1).padStart(2, "0")}
                </span>
                {Icon && (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky/10 text-sky transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-base font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          </Reveal>
        );
      })}
    </ol>
  );
}
