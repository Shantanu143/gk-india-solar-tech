import { Info } from "lucide-react";
import { Section } from "@/components/marketing/kit/Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import {
  AREA_PER_KW_NOTE,
  capacityTable,
  coreComponents,
  coreComponentsNote,
  formatRupees,
  materialGroups,
  materialsIntro,
  systemPrices,
} from "@/data/solarSystems";

/**
 * Three stacked sections — capacity & required area, price range, and on-grid materials — covering
 * 1 kW to 10 kW systems. Drops into a page as a fragment so each section keeps its own background band.
 */
export function SolarSystemGuide() {
  return (
    <>
      <Section
        eyebrow="System Sizing"
        title="Solar System Capacity & Required Area"
        description="Approximate rooftop or ground area required for solar systems ranging from 1 kW to 10 kW."
      >
        <Reveal className="mx-auto w-full max-w-3xl">
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-sky/20 bg-sky/5 p-4 text-sm leading-relaxed text-navy/80">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
            <p>
              <strong className="font-semibold text-navy">Note:</strong> {AREA_PER_KW_NOTE}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-surface shadow-soft">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Approximate required area and number of 550W panels by solar system capacity</caption>
              <thead>
                <tr className="bg-sky-deep text-white">
                  <th scope="col" className="px-3 py-4 align-bottom font-semibold sm:px-6">
                    Solar System Capacity
                  </th>
                  <th scope="col" className="px-3 py-4 align-bottom font-semibold sm:px-6">
                    Approx. Required Area (Sq. Ft.)
                  </th>
                  <th scope="col" className="px-3 py-4 text-right align-bottom font-semibold sm:px-6">
                    Approx. No. of Panels (550W each)
                  </th>
                </tr>
              </thead>
              <tbody>
                {capacityTable.map((row) => (
                  <tr key={row.capacity} className="border-t border-border even:bg-surface-muted/50">
                    <th scope="row" className="px-3 py-3.5 font-semibold text-navy sm:px-6">
                      {row.capacity}
                    </th>
                    <td className="px-3 py-3.5 whitespace-nowrap text-foreground/80 sm:px-6">{row.area}</td>
                    <td className="px-3 py-3.5 text-right whitespace-nowrap text-foreground/80 sm:px-6">{row.panels}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      <Section
        tone="surface"
        eyebrow="Pricing"
        title="Solar System Price Range"
        description="Indicative prices for on-grid rooftop systems. The final quotation is confirmed after your site survey."
      >
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {systemPrices.map((item, i) => (
            <Reveal key={item.kw} delay={(i % 4) * 0.06} direction="scale">
              <Card className="flex h-full flex-col items-center gap-1.5 px-4 py-6 text-center hover:-translate-y-1 hover:shadow-soft-lg">
                <span className="text-xs font-bold tracking-[0.14em] text-sky uppercase">{item.kw} kW Solar System</span>
                <span className="text-2xl font-extrabold text-navy sm:text-3xl">{formatRupees(item.price)}</span>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="muted" eyebrow="What's Included" title="Materials Required For An On-Grid Solar System" description={materialsIntro}>
        <Reveal className="mx-auto w-full max-w-3xl">
          <Accordion
            type="single"
            collapsible
            defaultValue={materialGroups[0]?.id}
            className="rounded-3xl border border-border bg-surface px-6 shadow-soft sm:px-8"
          >
            {materialGroups.map((group) => (
              <AccordionItem key={group.id} value={group.id}>
                <AccordionTrigger>{group.title}</AccordionTrigger>
                <AccordionContent>
                  {group.intro && <p className="mb-4">{group.intro}</p>}
                  <dl className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <div key={item.label} className="grid grid-cols-1 gap-0.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-navy">{item.label}</dt>
                        <dd>{item.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal className="mx-auto mt-10 w-full max-w-3xl">
          <div className="rounded-3xl bg-sky-deep p-6 text-center text-white sm:p-8">
            <span className="text-xs font-bold tracking-[0.14em] text-orange-light uppercase">In Short</span>
            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm font-semibold sm:text-base">
              {coreComponents.map((name, i) => (
                <span key={name} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-white/50">
                      +
                    </span>
                  )}
                  <span className="rounded-full bg-white/10 px-3 py-1">{name}</span>
                </span>
              ))}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">{coreComponentsNote}</p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
