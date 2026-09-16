import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Factory, Home as HomeIcon, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { billUploadHref, ROUTES } from "@/constant/routes";
import { SolarScene } from "@/components/marketing/illustrations/SolarScene";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-14 sm:py-20 lg:py-0 lg:min-h-[700px] lg:flex lg:items-center">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
          className="flex flex-col items-start text-left"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.18em] text-orange uppercase"
          >
            GK India SolarTech
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-4 text-4xl leading-[1.08] font-extrabold text-navy sm:text-5xl lg:text-[3.4rem]"
          >
            Power Your Future With <span className="text-orange">Solar Energy</span>
          </motion.h1>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-navy/70 sm:text-base"
          >
            <span className="inline-flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4 text-orange" aria-hidden="true" /> Residential
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-orange" aria-hidden="true" /> Commercial
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Factory className="h-4 w-4 text-orange" aria-hidden="true" /> Industrial Solar
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            End-to-end solar EPC solutions — from your free estimate through installation, net
            metering and ongoing support.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Button asChild size="lg">
              <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to={billUploadHref}>Upload Electricity Bill</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <SolarScene variant="hero" className="w-full rounded-2xl shadow-soft-lg" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute -top-4 left-4 flex items-center gap-2 rounded-xl border border-border bg-surface/95 px-3.5 py-2.5 shadow-soft backdrop-blur sm:left-6"
          >
            <Leaf className="h-4 w-4 text-green" aria-hidden="true" />
            <span className="text-xs font-semibold text-navy">Clean, Renewable Energy</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute -bottom-4 right-4 flex items-center gap-2 rounded-xl border border-border bg-surface/95 px-3.5 py-2.5 shadow-soft backdrop-blur sm:right-6"
          >
            <Zap className="h-4 w-4 text-orange" aria-hidden="true" />
            <span className="text-xs font-semibold text-navy">Grid-Tied System</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
