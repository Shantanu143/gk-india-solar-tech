import { Reveal } from "@/components/ui/Reveal";
import { formatInr } from "@/lib/format";

interface SavingsCardsProps {
  monthlySaving: number;
  annualSaving: number;
  lifetimeSaving: number;
}

export function SavingsCards({ monthlySaving, annualSaving, lifetimeSaving }: SavingsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Reveal className="sm:pt-4">
        <div className="flex h-full flex-col items-center rounded-xl border border-green/20 bg-green/5 p-5 text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Estimated Monthly Saving</p>
          <p className="mt-2 text-2xl font-extrabold text-green">{formatInr(monthlySaving)}</p>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="sm:pt-2">
        <div className="flex h-full flex-col items-center rounded-xl border border-green/20 bg-green/5 p-6 text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Estimated Annual Saving</p>
          <p className="mt-2 text-3xl font-extrabold text-green">{formatInr(annualSaving)}</p>
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="flex h-full flex-col items-center rounded-xl border-2 border-green/30 bg-green/10 p-7 text-center shadow-soft">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Estimated 25-Year Saving</p>
          <p className="mt-2 text-4xl font-extrabold text-green">{formatInr(lifetimeSaving)}</p>
        </div>
      </Reveal>
    </div>
  );
}
