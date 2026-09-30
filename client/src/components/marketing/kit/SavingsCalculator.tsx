import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IndianRupee, Leaf, PiggyBank, Sun } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CountUp } from "@/components/motion/CountUp";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/constant/routes";

// Illustrative assumptions only — the real figures come from a site survey and proposal.
const TARIFF_PER_UNIT = 8; // ₹/kWh
const UNITS_PER_KW_MONTH = 120;
const SAVINGS_SHARE = 0.84; // matches the example on the home page

function subsidyFor(kw: number) {
  if (kw >= 3) return 78000;
  return Math.floor(kw) * 30000;
}

const formatINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Interactive bill slider that shows an illustrative system size, savings and subsidy. */
export function SavingsCalculator() {
  const [bill, setBill] = useState(5000);
  const units = bill / TARIFF_PER_UNIT;
  const kw = Math.max(1, Math.ceil(units / UNITS_PER_KW_MONTH));
  const monthly = bill * SAVINGS_SHARE;
  const pct = ((bill - 500) / (50000 - 500)) * 100;

  const results = [
    { icon: Sun, label: "Suggested system", node: <CountUp key={kw} to={kw} suffix=" kW" /> },
    { icon: PiggyBank, label: "Monthly savings", node: <span>{formatINR(monthly)}</span> },
    { icon: Leaf, label: "Yearly savings", node: <span>{formatINR(monthly * 12)}</span> },
    { icon: IndianRupee, label: "Est. subsidy*", node: <span>{formatINR(subsidyFor(kw))}</span> },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-sky-deep py-14 text-white sm:py-20">
      <img src="/images/field.jpg" alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sky-deep/80" />
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal direction="left">
          <SectionHeading
            align="left"
            tone="light"
            eyebrow="Savings Calculator"
            title="See What Solar Could Save You"
            description="Slide to your monthly electricity bill for an instant, illustrative idea of system size, savings and subsidy."
          />
          <Button asChild variant="white" size="lg" className="mt-8">
            <Link to={ROUTES.solarEstimate}>Get My Exact Estimate</Link>
          </Button>
        </Reveal>

        <Reveal direction="right">
          <div className="glass rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-baseline justify-between">
              <label htmlFor="bill" className="text-sm font-medium text-white/80">
                Monthly electricity bill
              </label>
              <span className="font-serif text-4xl">{formatINR(bill)}</span>
            </div>
            <input
              id="bill"
              type="range"
              min={500}
              max={50000}
              step={500}
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              style={{ background: `linear-gradient(90deg,#fff ${pct}%,rgb(255 255 255 / 0.25) ${pct}%)` }}
              className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full accent-orange [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-orange [&::-webkit-slider-thumb]:shadow-glow-orange"
            />
            <div className="mt-1 flex justify-between text-xs text-white/60">
              <span>₹500</span>
              <span>₹50,000</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {results.map(({ icon: Icon, label, node }) => (
                <motion.div
                  key={label}
                  layout
                  className="rounded-2xl bg-white/12 p-4 backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-orange-light" aria-hidden="true" />
                  <p className="mt-2 font-serif text-2xl sm:text-3xl">{node}</p>
                  <p className="mt-1 text-xs text-white/70">{label}</p>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/60">
              Illustrative only, not a quote. Assumes ~₹{TARIFF_PER_UNIT}/unit tariff and ~{UNITS_PER_KW_MONTH} units/kW/month.
              *Residential rooftop subsidy is estimated and subject to eligibility under applicable scheme rules.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
