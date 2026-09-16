import { Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const DISCLAIMER_TEXT = {
  calculation:
    "These figures are indicative estimates based on the information provided. Final system capacity, savings, pricing and eligibility will be confirmed after electricity bill verification and site survey.",
  subsidy: "Subsidy shown is an estimate and is subject to applicable government scheme rules and customer eligibility.",
  emi: "EMI shown is an estimate only and does not represent loan approval or financing eligibility.",
} as const;

interface EstimateDisclaimerProps {
  variant: keyof typeof DISCLAIMER_TEXT;
  className?: string;
}

export function EstimateDisclaimer({ variant, className }: EstimateDisclaimerProps) {
  return (
    <Card className={cn("flex gap-2.5 border-warning/30 bg-warning/8 p-4", className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <p className="text-xs leading-relaxed text-navy/80">{DISCLAIMER_TEXT[variant]}</p>
    </Card>
  );
}
