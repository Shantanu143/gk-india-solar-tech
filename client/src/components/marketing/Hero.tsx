import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { ROUTES } from "@/constant/routes";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const reviewers = [
  { initials: "AS", color: "#f59e0b" },
  { initials: "RK", color: "#0ea5e9" },
  { initials: "PM", color: "#10b981" },
  { initials: "SD", color: "#8b5cf6" },
  { initials: "VN", color: "#ef4444" },
];

const hours = [
  { days: "Monday - Saturday", time: "9:00 AM - 7:00 PM" },
  { days: "Sunday", time: "Closed" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-sky-deep text-white">
      <img
        src="/images/hero.jpg"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(20_75_170/0.55)_0%,rgb(30_100_200/0.2)_55%,transparent_100%),linear-gradient(0deg,rgb(8_40_110/0.55)_0%,transparent_40%)]"
      />

      <Container className="flex flex-col justify-between gap-16 pt-36 pb-8 sm:pt-44 lg:min-h-[820px] lg:pt-52 lg:pb-10">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
          className="flex max-w-2xl flex-col items-start"
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="font-serif text-5xl leading-[1.05] font-normal tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Cut Your Electric Bill With Solar
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-white/90"
          >
            Get a custom solar assessment based on your roof, energy usage, and local utility rates
            before you commit to installation.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Button asChild variant="white" size="lg">
              <Link to={ROUTES.solarEstimate}>Get My Free Solar Assessment</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.05fr_1.6fr]"
        >
          <a
            href="#how-it-works"
            className="glass group flex min-h-56 flex-col overflow-hidden rounded-3xl p-2.5"
          >
            <span className="relative block flex-1 overflow-hidden rounded-2xl">
              <img
                src="/images/installer.jpg"
                alt="Solar installer working on a rooftop"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-soft-lg">
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              </span>
            </span>
            <span className="py-2.5 text-center text-sm font-medium">Watch Video</span>
          </a>

          <div className="glass flex min-h-56 flex-col justify-between rounded-3xl p-5">
            <div className="flex -space-x-2">
              {reviewers.map((r) => (
                <span
                  key={r.initials}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/70 text-[11px] font-bold text-white"
                  style={{ backgroundColor: r.color }}
                >
                  {r.initials}
                </span>
              ))}
            </div>
            <div>
              <p className="flex items-center gap-2 text-xl font-semibold">
                4.9/5 Rating
                <Star className="h-4 w-4 fill-orange-light text-orange-light" aria-hidden="true" />
              </p>
              <p className="mt-1 text-sm text-white/80">From happy homeowners and businesses across India</p>
            </div>
          </div>

          <div className="glass relative flex min-h-56 flex-col overflow-hidden rounded-3xl p-2.5">
            <img
              src="/images/commercial.jpg"
              alt="Solar panels installed on a commercial building"
              className="absolute inset-2.5 h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)] rounded-2xl object-cover"
            />
            <span className="relative m-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy shadow-soft">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="glass-blue relative mt-auto rounded-full px-4 py-2.5 text-sm font-medium">
              Licensed &amp; insured installers
            </span>
          </div>

          <div className="glass flex min-h-56 flex-col rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-white">Working Hours</h2>
            <p className="mt-2 border-b border-white/15 pb-4 text-sm leading-relaxed text-white/80">
              Talk to our solar experts about your roof, load and savings — we&apos;re here whenever you
              are ready to switch.
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {hours.map((h) => (
                <div key={h.days}>
                  <dt className="font-semibold text-white">{h.days}</dt>
                  <dd className="mt-1 text-white/80">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
