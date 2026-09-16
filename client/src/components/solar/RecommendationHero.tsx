import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

interface RecommendationHeroProps {
  capacityKw: number;
}

export function RecommendationHero({ capacityKw }: RecommendationHeroProps) {
  return (
    <Reveal className="flex flex-col items-center text-center">
      <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Your Solar Recommendation</span>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        Based on the information you provided, here's an estimated solar configuration for your
        property.
      </p>

      <div className="mt-8 flex flex-col items-center rounded-2xl border border-border bg-surface px-10 py-8 shadow-soft">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Recommended Solar System
        </span>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-2 text-5xl font-extrabold text-navy sm:text-6xl"
        >
          {capacityKw} <span className="text-orange">kW</span>
        </motion.span>
        <span className="mt-2 text-xs text-muted-foreground">Estimated system capacity</span>
      </div>
    </Reveal>
  );
}
