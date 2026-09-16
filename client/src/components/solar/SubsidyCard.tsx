import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, IndianRupee, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { EstimateDisclaimer } from "@/components/solar/EstimateDisclaimer";
import { formatInr } from "@/lib/format";
import type { SubsidyEstimate } from "@/types/solarEstimate";

interface SubsidyCardProps {
  subsidy: SubsidyEstimate;
}

export function SubsidyCard({ subsidy }: SubsidyCardProps) {
  const [open, setOpen] = useState(false);
  const hasSubsidy = subsidy.estimatedSubsidy > 0;

  return (
    <Reveal>
      <div className="rounded-xl border border-green/20 bg-green/5 p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green/15 text-green">
              <IndianRupee className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-bold text-navy">Government Subsidy Estimate</h3>
          </div>
          <Badge variant="green">Estimated</Badge>
        </div>

        {hasSubsidy ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Eligible Solar Capacity</p>
              <p className="mt-1 text-xl font-bold text-navy">{subsidy.eligibleCapacity} kW</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Estimated Subsidy</p>
              <p className="mt-1 text-xl font-bold text-green">{formatInr(subsidy.estimatedSubsidy)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Your Estimated Benefit</p>
              <p className="mt-1 text-xl font-bold text-green">{formatInr(subsidy.estimatedSubsidy)}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            This residential subsidy scheme doesn't apply to your selected project type. Our team
            can advise on any commercial/industrial incentives that may apply.
          </p>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Actual subsidy depends on applicable government scheme rules and eligibility.
        </p>

        <Button type="button" variant="secondary" size="sm" className="mt-5" onClick={() => setOpen(true)}>
          Check My Eligibility
        </Button>

        <EstimateDisclaimer variant="subsidy" className="mt-5" />
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-navy-dark/40 backdrop-blur-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 shadow-soft-lg"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Dialog.Title className="text-lg font-bold text-navy">Subsidy Eligibility</Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-navy/5"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                    Eligibility for the residential rooftop solar subsidy generally depends on a
                    few factors our team verifies during your application:
                  </Dialog.Description>

                  <ul className="mt-4 flex flex-col gap-3">
                    {[
                      "The property is a residential rooftop connection.",
                      "The installed system uses scheme-approved equipment.",
                      "Your application is submitted through the applicable government portal.",
                      "The connection is registered under an eligible electricity distribution company.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-xs text-muted-foreground">
                    Our team confirms your exact eligibility and subsidy amount during the site
                    survey and application process.
                  </p>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </Reveal>
  );
}
