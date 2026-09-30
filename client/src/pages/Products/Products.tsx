import { Boxes, ShieldCheck, Sun, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";

import { PageHero } from "@/components/marketing/kit/PageHero";
import { PhotoTile } from "@/components/marketing/kit/PhotoTile";
import { Section } from "@/components/marketing/kit/Section";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";

import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";
import { productCategoryIcons } from "@/data/solutions";
import { productImages } from "@/data/media";
import { getProductCategories } from "@/services/productService";

export function Products() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getProductCategories,
  });

  return (
    <>
      <Seo
        title="Solar Products | GK India SolarTech"
        description="Explore solar panels, inverters, mounting structures and accessories offered by GK India SolarTech."
        path="/products"
      />
      <PageHero
        eyebrow="Products"
        title="Solar Panels, Inverters & More"
        description="Quality components sourced and installed as part of every GK India SolarTech project."
        image="/images/panels-grass.jpg"
        chips={[
          { icon: Sun, label: "Panels" },
          { icon: Zap, label: "Inverters" },
          { icon: Boxes, label: "Structures" },
          { icon: ShieldCheck, label: "Quality checked" },
        ]}
      />

      <Section tone="surface" eyebrow="Categories" title="Components For Every System">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-h-[22rem] animate-pulse rounded-[2rem] bg-surface-muted" />
              ))
            : categories.map((category, i) => (
                <Reveal key={category.id} delay={i * 0.07} direction="scale">
                  <PhotoTile
                    image={productImages[category.id] ?? "/images/panels-grass.jpg"}
                    icon={productCategoryIcons[category.id]}
                    title={category.name}
                    description={category.description}
                  />
                </Reveal>
              ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Exact panel, inverter and mounting specifications are confirmed as part of your project
          proposal, based on your site survey and system design.
        </p>
      </Section>

      <SplitFeature
        eyebrow="Solar Panels"
        title="High-Efficiency Modules Built To Last"
        description="Panels are selected to suit your roof, load and budget, and installed on structures engineered for long-term durability."
        bullets={["Mono & bifacial options where suitable", "Tested for Indian weather conditions", "Warranty support through our team"]}
        image="/images/closeup.jpg"
        imageAlt="Close-up of solar modules"
        badge={{ icon: Sun, value: "Selected", label: "For your site" }}
      />

      <SplitFeature
        reverse
        tone="muted"
        eyebrow="Inverters & Structures"
        title="The Hardware Behind Every kWh"
        description="Reliable inverters convert your solar output into usable power, while custom mounting structures keep everything secure across rooftops, ground-mounts and industrial sheds."
        bullets={["Grid-tied inverter solutions", "Rooftop & ground mounting structures", "Cables, connectors and protection gear"]}
        image="/images/field-sky.jpg"
        imageAlt="Ground-mounted solar structures"
        badge={{ icon: Zap, value: "Reliable", label: "Power conversion" }}
      />

      <CTASection
        heading="Have Questions About Components?"
        description="Our team can walk you through the components recommended for your project."
        primaryLabel="Get Free Solar Estimate"
        primaryHref={ROUTES.solarEstimate}
        secondaryLabel="Talk To Our Team"
        secondaryHref={ROUTES.contact}
      />
    </>
  );
}
