import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-orange text-white shadow-soft hover:bg-orange-dark hover:shadow-glow-orange hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "border border-navy/25 text-navy bg-transparent hover:bg-navy/5 hover:-translate-y-0.5 active:translate-y-0",
        "outline-light":
          "border border-white/35 text-white bg-transparent hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0",
        tertiary: "text-navy underline-offset-4 hover:text-orange hover:underline",
        ghost: "text-navy hover:bg-navy/5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    compoundVariants: [
      { variant: "tertiary", size: ["sm", "md", "lg"], class: "h-auto px-0 py-1" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";
