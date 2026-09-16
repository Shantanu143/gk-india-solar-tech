import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      navy: "bg-navy/8 text-navy",
      orange: "bg-orange/10 text-orange-dark",
      green: "bg-green/10 text-green",
      neutral: "bg-surface-muted text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "navy",
  },
});

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
