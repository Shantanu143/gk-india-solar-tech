import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Home, LogIn } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";

const NEXT_STEPS = [
  { number: "01", text: "Our team reviews your partner application" },
  { number: "02", text: "You'll be notified once your account is approved" },
  { number: "03", text: "Sign in with your email and password to get started" },
  { number: "04", text: "Submit leads or projects and track your commission" },
];

export function PartnerApplySuccessPage() {
  return (
    <section className="py-14 sm:py-20">
      <Seo
        title="Partner Application Submitted | GK India SolarTech"
        description="Your GK India SolarTech partner application has been submitted and is under review."
        path={ROUTES.partnerApplySuccess}
        noindex
      />
      <Container className="max-w-2xl">
        <div className="mx-auto flex flex-col items-center text-center">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green"
          >
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </motion.span>

          <h1 className="mt-6 text-3xl font-bold text-navy sm:text-4xl">Application Submitted</h1>
          <p className="mt-2 max-w-md text-base text-muted-foreground">
            Thank you for applying to the GK India SolarTech Partner Program. Your application is now
            under review.
          </p>

          <Reveal delay={0.1} className="mt-8 w-full">
            <Card className="p-5 text-left">
              <h2 className="text-sm font-bold tracking-[0.1em] text-navy uppercase">What Happens Next?</h2>
              <ol className="mt-4 flex flex-col gap-4">
                {NEXT_STEPS.map((step) => (
                  <li key={step.number} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/8 text-xs font-bold text-navy">
                      {step.number}
                    </span>
                    <span className="pt-1.5 text-sm text-foreground/80">{step.text}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>

          <p className="mt-6 text-sm text-muted-foreground">
            No login is issued right away — once approved, you'll sign in from the same login page
            used across GK India SolarTech.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="gap-1.5">
              <Link to={ROUTES.login}>
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Go To Sign In
              </Link>
            </Button>
            <Button asChild variant="tertiary" size="lg" className="gap-1.5">
              <Link to={ROUTES.home}>
                <Home className="h-4 w-4" aria-hidden="true" />
                Back To Website
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
