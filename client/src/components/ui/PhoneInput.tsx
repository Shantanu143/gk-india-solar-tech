import { forwardRef } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Digits only, capped at the 10-digit national number — a pasted "+91 98765 43210" or "098765 43210" keeps just the number. */
function normaliseMobileDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "maxLength"> {
  invalid?: boolean;
}

/**
 * Indian mobile number field: a fixed +91 country code beside a 10-digit input. The input only ever
 * holds digits (the value stays the bare national number, matching how numbers are stored), so
 * react-hook-form's `register` works on it as on a plain `Input`.
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({ className, invalid, onChange, ...props }, ref) => {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    // Rewrite the DOM value first so react-hook-form's onChange reads the cleaned number.
    event.target.value = normaliseMobileDigits(event.target.value);
    onChange?.(event);
  }

  return (
    <div
      className={cn(
        "flex h-12 w-full overflow-hidden rounded-lg border bg-surface transition-colors duration-200 focus-within:border-orange",
        invalid ? "border-error" : "border-border",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center border-r border-border bg-surface-muted px-3.5 text-sm font-semibold text-navy select-none"
      >
        +91
      </span>
      <input
        ref={ref}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="10-digit mobile number"
        aria-invalid={invalid || undefined}
        className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        onChange={handleChange}
        {...props}
      />
    </div>
  );
});
PhoneInput.displayName = "PhoneInput";
