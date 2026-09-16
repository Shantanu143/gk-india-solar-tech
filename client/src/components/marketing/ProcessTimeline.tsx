import type { ProcessStep } from "@/types/common";
import { Reveal } from "@/components/ui/Reveal";

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

function StepMarker({ number }: { number: string }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
      {number}
    </span>
  );
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const rows = [steps.slice(0, 4), steps.slice(4, 8)];

  return (
    <div>
      {/* Mobile & tablet: vertical timeline */}
      <ol className="relative flex flex-col gap-8 lg:hidden">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-6 w-px bg-border" />
        {steps.map((step, i) => (
          <Reveal key={step.number} delay={i * 0.04}>
            <li className="relative flex gap-5">
              <StepMarker number={step.number} />
              <div className="pt-2.5">
                <h3 className="text-base font-bold text-navy">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      {/* Desktop: horizontal timeline, two connected rows of four */}
      <ol className="hidden flex-col gap-14 lg:flex">
        {rows.map((row, rowIndex) => (
          <li key={rowIndex} className="flex items-start">
            {row.map((step, i) => (
              <div key={step.number} className="flex flex-1 items-start last:flex-none">
                <Reveal delay={i * 0.06} className="flex w-40 flex-col items-center gap-3 text-center xl:w-48">
                  <StepMarker number={step.number} />
                  <div>
                    <h3 className="text-sm font-bold text-navy">{step.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </Reveal>
                {i < row.length - 1 && <span aria-hidden="true" className="mt-6 h-0.5 flex-1 bg-orange/25" />}
              </div>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
