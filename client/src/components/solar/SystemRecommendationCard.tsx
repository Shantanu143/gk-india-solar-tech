import { Grid2x2, Sun, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { SolarRecommendation } from "@/types/solarEstimate";

interface SystemRecommendationCardProps {
  recommendation: SolarRecommendation;
}

export function SystemRecommendationCard({ recommendation }: SystemRecommendationCardProps) {
  const stats = [
    { icon: Grid2x2, label: "Estimated Panels", value: `${recommendation.estimatedPanels}`, unit: "Panels" },
    { icon: Sun, label: "Panel Capacity", value: `${recommendation.panelCapacity}`, unit: "W" },
    { icon: Zap, label: "Recommended Inverter", value: `${recommendation.recommendedInverter}`, unit: "kW" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={i * 0.06}>
          <div className="flex h-full flex-col items-center rounded-xl border border-border bg-surface p-6 text-center shadow-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy/8 text-navy">
              <stat.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-xs font-semibold text-muted-foreground uppercase">{stat.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-navy">
              {stat.value} <span className="text-base font-semibold text-muted-foreground">{stat.unit}</span>
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
