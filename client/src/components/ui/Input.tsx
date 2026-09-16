import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "h-12 w-full rounded-lg border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors duration-200 focus:border-orange",
      invalid ? "border-error" : "border-border",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
