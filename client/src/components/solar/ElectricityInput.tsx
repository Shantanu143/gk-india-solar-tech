import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BillInput } from "@/components/solar/BillInput";
import { BillUpload } from "@/components/solar/BillUpload";
import { EstimateNavigation } from "@/components/solar/EstimateNavigation";
import { cn } from "@/lib/utils";
import { monthlyBillSchema, type MonthlyBillFormValues } from "@/schemas/electricity.schema";
import type { ElectricityData, ElectricityInputMode, UploadedBillMeta } from "@/types/solarEstimate";

interface ElectricityInputProps {
  initialMode: ElectricityInputMode;
  initialMonthlyBill: number | null;
  initialBillMeta: UploadedBillMeta | null;
  onBack: () => void;
  onContinue: (data: ElectricityData) => void;
}

export function ElectricityInput({
  initialMode,
  initialMonthlyBill,
  initialBillMeta,
  onBack,
  onContinue,
}: ElectricityInputProps) {
  const [mode, setMode] = useState<ElectricityInputMode>(initialMode);
  const [billMeta, setBillMeta] = useState<UploadedBillMeta | null>(initialBillMeta);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MonthlyBillFormValues>({
    resolver: zodResolver(monthlyBillSchema),
    defaultValues: { monthlyBill: initialMonthlyBill ?? undefined },
  });

  function submitBillAmount(values: MonthlyBillFormValues) {
    onContinue({ mode: "BILL", monthlyBill: values.monthlyBill, billMeta });
  }

  function submitUpload() {
    onContinue({ mode: "UPLOAD", monthlyBill: null, billMeta });
  }

  return (
    <div>
      <div className="flex gap-1 rounded-full bg-surface-muted p-1">
        <button
          type="button"
          onClick={() => setMode("BILL")}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
            mode === "BILL" ? "bg-surface text-navy shadow-soft" : "text-muted-foreground",
          )}
        >
          Enter Bill Amount
        </button>
        <button
          type="button"
          onClick={() => setMode("UPLOAD")}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
            mode === "UPLOAD" ? "bg-surface text-navy shadow-soft" : "text-muted-foreground",
          )}
        >
          Upload Bill
        </button>
      </div>

      {mode === "BILL" ? (
        <form onSubmit={handleSubmit(submitBillAmount)} noValidate className="mt-6">
          <BillInput
            register={register("monthlyBill", { valueAsNumber: true })}
            error={errors.monthlyBill?.message}
          />
          <EstimateNavigation onBack={onBack} nextLabel="Calculate My Solar Requirement" submitType />
        </form>
      ) : (
        <div className="mt-6">
          <p className="mb-3 text-sm text-muted-foreground">
            Upload a recent electricity bill to help us estimate your solar requirement.
          </p>
          <BillUpload
            value={billMeta}
            onUploaded={(meta) => setBillMeta(meta)}
            onRemove={() => setBillMeta(null)}
          />
          <EstimateNavigation
            onBack={onBack}
            nextLabel="Calculate My Solar Requirement"
            nextDisabled={!billMeta}
            onNext={submitUpload}
          />
        </div>
      )}
    </div>
  );
}
