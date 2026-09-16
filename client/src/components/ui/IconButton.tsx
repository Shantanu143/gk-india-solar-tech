import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full text-navy transition-colors duration-200 hover:bg-navy/5",
        className,
      )}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
