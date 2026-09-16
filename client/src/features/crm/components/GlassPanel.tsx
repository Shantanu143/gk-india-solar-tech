import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * The CRM's frosted-glass surface — deliberately separate from the public site's `ui/Card`, which
 * stays solid/opaque by design. Only used behind the CrmBackground gradient mesh; on a flat
 * background a translucent panel has nothing to show through and just looks like a dim solid one.
 */
export function GlassPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/55 shadow-[0_8px_32px_-8px_rgba(0,22,63,0.12)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
