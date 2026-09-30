import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";

export function NotFound() {
  return (
    <>
      <Seo title="Page Not Found | GK India SolarTech" description="The page you're looking for could not be found." path="/404" />
      <section className="relative isolate overflow-hidden bg-sky-deep py-40 text-white sm:py-52">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sky-deep/70" />
        <Container className="flex flex-col items-center text-center">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="text-orange-light"
          >
            <Sun className="h-16 w-16" aria-hidden="true" />
          </motion.span>
          <h1 className="mt-6 font-serif text-7xl text-white sm:text-9xl">404</h1>
          <p className="mt-2 font-serif text-3xl text-white">This page is off the grid</p>
          <p className="mt-3 max-w-md text-base text-white/80">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <Button asChild variant="white" size="lg" className="mt-8">
            <Link to={ROUTES.home}>Back To Home</Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
