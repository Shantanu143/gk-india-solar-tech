import { Boxes } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Seo } from "@/components/layout/Seo";
import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/marketing/CTASection";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/constant/routes";
import { productCategoryIcons } from "@/data/solutions";
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
      <section className="py-20 sm:py-28">
        <Container className="flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/8 text-navy">
            <Boxes className="h-7 w-7" aria-hidden="true" />
          </span>
          <SectionHeading
            className="mt-5"
            eyebrow="Products"
            title="Solar Panels, Inverters & More"
            description="Quality components sourced and installed as part of every GK India SolarTech project."
          />

          <div className="mt-14 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-44 animate-pulse rounded-xl border border-border bg-surface-muted" />
                ))
              : categories.map((category, i) => (
                  <Reveal key={category.id} delay={i * 0.06}>
                    <FeatureCard
                      icon={productCategoryIcons[category.id]}
                      title={category.name}
                      description={category.description}
                    />
                  </Reveal>
                ))}
          </div>

          <p className="mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            Exact panel, inverter and mounting specifications are confirmed as part of your project
            proposal, based on your site survey and system design.
          </p>
        </Container>
      </section>

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
