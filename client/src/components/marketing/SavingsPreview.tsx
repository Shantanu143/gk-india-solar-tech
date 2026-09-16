import { ArrowDown, ArrowRight, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "green";
}) {
  return (
    <Card
      className={
        tone === "green"
          ? "flex-1 border-green/20 bg-green/5 p-6 text-center sm:p-8"
          : "flex-1 p-6 text-center sm:p-8"
      }
    >
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className={tone === "green" ? "mt-2 text-3xl font-extrabold text-green sm:text-4xl" : "mt-2 text-3xl font-extrabold text-navy sm:text-4xl"}>
        {value}
        <span className="ml-1 text-base font-semibold text-muted-foreground">/month</span>
      </p>
    </Card>
  );
}

export function SavingsPreview() {
  return (
    <Reveal className="mx-auto w-full max-w-3xl">
      <div className="flex justify-center">
        <Badge variant="orange">Example estimate</Badge>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        <StatCard label="Current Electricity Bill" value="₹5,000" tone="neutral" />

        <div className="flex flex-col items-center justify-center gap-1 px-2 text-orange">
          <ArrowDown className="h-5 w-5 sm:hidden" aria-hidden="true" />
          <ArrowRight className="hidden h-5 w-5 sm:block" aria-hidden="true" />
          <span className="flex items-center gap-1 text-xs font-bold tracking-wide uppercase">
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            Solar
          </span>
        </div>

        <StatCard label="Estimated Savings" value="₹4,200" tone="green" />
      </div>

      <div className="mt-8 space-y-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Before solar</p>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full w-full rounded-full bg-orange/70" />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">After solar (estimated)</p>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <motion.div
              className="h-full rounded-full bg-green"
              initial={{ width: "0%" }}
              whileInView={{ width: "16%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        Illustrative example only, not a quote. Actual savings depend on your location, electricity usage,
        roof/site conditions and system size.
      </p>
    </Reveal>
  );
}
