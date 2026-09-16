import { ArrowLeftRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { formatInr } from "@/lib/format";

interface BillVsEMICardProps {
  currentBill: number;
  emi: number;
}

export function BillVsEMICard({ currentBill, emi }: BillVsEMICardProps) {
  return (
    <Reveal>
      <div className="grid grid-cols-1 items-center gap-3 rounded-xl border border-border bg-surface p-6 sm:grid-cols-[1fr_auto_1fr]">
        <div className="text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Current</p>
          <p className="mt-1 text-sm text-muted-foreground">Electricity Bill</p>
          <p className="mt-1 text-2xl font-extrabold text-navy">{formatInr(currentBill)}</p>
          <p className="text-xs text-muted-foreground">/ month</p>
        </div>

        <div className="flex justify-center text-muted-foreground">
          <ArrowLeftRight className="h-5 w-5 rotate-90 sm:rotate-0" aria-hidden="true" />
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase">With Solar</p>
          <p className="mt-1 text-sm text-muted-foreground">Estimated EMI</p>
          <p className="mt-1 text-2xl font-extrabold text-orange">{formatInr(emi)}</p>
          <p className="text-xs text-muted-foreground">/ month</p>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Your EMI may be higher or lower than your current bill depending on usage, tenure and
        financing terms — this is not a guaranteed saving.
      </p>
    </Reveal>
  );
}
