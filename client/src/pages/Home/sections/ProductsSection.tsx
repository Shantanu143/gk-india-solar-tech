import { Link } from "react-router-dom";
import { Section } from "@/components/marketing/kit/Section";
import { PhotoTile } from "@/components/marketing/kit/PhotoTile";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";
import { productCategories, productCategoryIcons } from "@/data/solutions";
import { productImages } from "@/data/media";

export function ProductsSection() {
  return (
    <Section
      tone="surface"
      eyebrow="Products"
      title="Solar Panels, Inverters & More"
      description="Quality components sourced and installed as part of every GK India SolarTech project."
    >
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {productCategories.map((category, i) => (
          <Reveal key={category.id} delay={i * 0.07} direction="scale">
            <PhotoTile
              image={productImages[category.id]}
              icon={productCategoryIcons[category.id]}
              title={category.name}
              description={category.description}
              href={ROUTES.products}
            />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex justify-center">
        <Button asChild variant="secondary" size="lg">
          <Link to={ROUTES.products}>View All Products</Link>
        </Button>
      </Reveal>
    </Section>
  );
}
