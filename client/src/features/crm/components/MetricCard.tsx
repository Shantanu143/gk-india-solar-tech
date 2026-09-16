import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  /** Omit entirely when no comparison data exists — never invent a percentage. */
  trend?: { direction: "up" | "down"; label: string };
  tone?: "navy" | "orange" | "green";
  className?: string;
}

const TONE_ICON_CLASSES = {
  navy: "bg-navy/8 text-navy",
  orange: "bg-orange/10 text-orange-dark",
  green: "bg-green/10 text-green",
};

export function MetricCard({ icon: Icon, label, value, trend, tone = "navy", className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/55 p-4 shadow-[0_8px_32px_-12px_rgba(0,22,63,0.12)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5 sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", TONE_ICON_CLASSES[tone])}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">{value}</p>
      {trend ? (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs font-semibold",
            trend.direction === "up" ? "text-success" : "text-error",
          )}
        >
          {trend.direction === "up" ? (
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {trend.label}
        </p>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">Current period</p>
      )}
    </div>
  );
}
