import type { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

interface BillInputProps {
  register: UseFormRegisterReturn;
  error?: string;
}

export function BillInput({ register, error }: BillInputProps) {
  return (
    <div>
      <Label htmlFor="monthlyBill">Monthly Electricity Bill</Label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base font-semibold text-muted-foreground">
          ₹
        </span>
        <input
          id="monthlyBill"
          type="number"
          inputMode="decimal"
          placeholder="5000"
          aria-invalid={!!error || undefined}
          aria-describedby={error ? "monthlyBill-error" : undefined}
          className={cn(
            "h-14 w-full rounded-lg border bg-surface pr-4 pl-9 text-lg font-semibold text-foreground transition-colors duration-200 focus:border-orange",
            error ? "border-error" : "border-border",
          )}
          {...register}
        />
      </div>
      {error ? (
        <p id="monthlyBill-error" className="mt-1.5 text-xs text-error">
          {error}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Enter your approximate average monthly electricity bill.
        </p>
      )}
    </div>
  );
}
