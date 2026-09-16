import { ElectricityInput } from "@/components/solar/ElectricityInput";
import { useAutoFocusHeading } from "@/hooks/useAutoFocusHeading";
import type { ElectricityData, ElectricityInputMode, UploadedBillMeta } from "@/types/solarEstimate";

interface ElectricityStepProps {
  initialMode: ElectricityInputMode;
  initialMonthlyBill: number | null;
  initialBillMeta: UploadedBillMeta | null;
  onBack: () => void;
  onCalculate: (data: ElectricityData) => void;
}

export function ElectricityStep({
  initialMode,
  initialMonthlyBill,
  initialBillMeta,
  onBack,
  onCalculate,
}: ElectricityStepProps) {
  const headingRef = useAutoFocusHeading<HTMLHeadingElement>();

  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-navy outline-none sm:text-2xl">
        Tell us about your electricity usage
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Use your monthly electricity bill or upload a copy of your bill.
      </p>

      <div className="mt-6">
        <ElectricityInput
          initialMode={initialMode}
          initialMonthlyBill={initialMonthlyBill}
          initialBillMeta={initialBillMeta}
          onBack={onBack}
          onContinue={onCalculate}
        />
      </div>
    </div>
  );
}
