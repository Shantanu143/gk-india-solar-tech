import { Link } from "react-router-dom";
import { Sun } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";

export function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found | GK India SolarTech"
        description="The page you're looking for could not be found."
        path="/404"
      />
      <section className="py-24 sm:py-32">
        <Container className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/8 text-navy">
            <Sun className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-bold text-navy sm:text-4xl">Page Not Found</h1>
          <p className="mt-3 max-w-md text-base text-muted-foreground">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to={ROUTES.home}>Back To Home</Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
