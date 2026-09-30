import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
}

/** Infinite horizontal ticker; content is duplicated so the loop is seamless. Pauses on hover. */
export function Marquee({ children, reverse = false, className }: MarqueeProps) {
  return (
    <div className={cn("group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]", className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            "flex min-w-full shrink-0 items-center justify-around gap-10 pr-10 group-hover:[animation-play-state:paused]",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
