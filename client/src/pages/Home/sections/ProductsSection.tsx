import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/constant/routes";
import { productCategories, productCategoryIcons } from "@/data/solutions";

export function ProductsSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Products"
          title="Solar Panels, Inverters & More"
          description="Quality components sourced and installed as part of every GK India SolarTech project."
        />

        <div className="mt-14 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((category, i) => (
            <Reveal key={category.id} delay={i * 0.06}>
              <FeatureCard
                icon={productCategoryIcons[category.id]}
                title={category.name}
                description={category.description}
              />
            </Reveal>
          ))}
        </div>

        <Button asChild variant="secondary" size="lg" className="mt-10">
          <Link to={ROUTES.products}>View Products</Link>
        </Button>
      </Container>
    </section>
  );
}
