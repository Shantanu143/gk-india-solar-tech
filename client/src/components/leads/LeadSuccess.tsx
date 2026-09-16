import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { getWhatsAppLink } from "@/config/contact";
import { ROUTES } from "@/constant/routes";
import { formatInr } from "@/lib/format";
import type { ProjectType } from "@/types/solarEstimate";

interface LeadSuccessProps {
  firstName: string;
  leadId: string;
  projectType: ProjectType;
  city: string;
  recommendedCapacity: number;
  monthlySaving: number;
}

const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

const NEXT_STEPS = [
  { number: "01", text: "Our team reviews your request" },
  { number: "02", text: "A solar expert contacts you" },
  { number: "03", text: "We schedule a site survey" },
  { number: "04", text: "You receive a detailed proposal" },
];

export function LeadSuccess({ firstName, leadId, projectType, city, recommendedCapacity, monthlySaving }: LeadSuccessProps) {
  const whatsAppLink = getWhatsAppLink(`Hi, I just requested a solar estimate (Lead ID: ${leadId}).`);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green"
      >
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </motion.span>

      <h1 className="mt-6 text-3xl font-bold text-navy sm:text-4xl">Thank You, {firstName}!</h1>
      <p className="mt-2 text-base text-muted-foreground">Your Solar Request Has Been Received.</p>
      <p className="mt-1 text-sm text-muted-foreground">Our Solar Expert Will Contact You Soon.</p>

      <Reveal delay={0.1} className="mt-6 w-full">
        <Card className="p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Lead ID</p>
          <p className="mt-1 text-xl font-extrabold tracking-wide text-navy">{leadId}</p>
        </Card>
      </Reveal>

      <Reveal delay={0.15} className="mt-8 w-full">
        <h2 className="text-sm font-bold tracking-[0.1em] text-navy uppercase">What Happens Next?</h2>
        <ol className="mt-4 flex flex-col gap-4 text-left">
          {NEXT_STEPS.map((step) => (
            <li key={step.number} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/8 text-xs font-bold text-navy">
                {step.number}
              </span>
              <span className="pt-1.5 text-sm text-foreground/80">{step.text}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={0.2} className="mt-8 w-full">
        <Card className="p-5 text-left">
          <p className="text-xs font-bold tracking-[0.1em] text-orange uppercase">Your Estimate Summary</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Project Type</dt>
              <dd className="font-semibold text-navy">{PROJECT_TYPE_LABEL[projectType]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Location</dt>
              <dd className="font-semibold text-navy">{city}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Estimated System</dt>
              <dd className="font-semibold text-navy">{recommendedCapacity} kW</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Est. Monthly Saving</dt>
              <dd className="font-semibold text-green">{formatInr(monthlySaving)}</dd>
            </div>
          </dl>
        </Card>
      </Reveal>

      <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {whatsAppLink ? (
          <Button asChild size="lg">
            <a href={whatsAppLink} target="_blank" rel="noreferrer" className="gap-1.5">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat On WhatsApp
            </a>
          </Button>
        ) : (
          <Button size="lg" disabled className="gap-1.5" title="WhatsApp contact will be available soon">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat On WhatsApp
          </Button>
        )}
        <Button
          variant="secondary"
          size="lg"
          disabled
          className="gap-1.5"
          title="Your detailed proposal PDF will be available once our team prepares it"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download Estimate
        </Button>
        <Button asChild variant="tertiary" size="lg">
          <Link to={ROUTES.home} className="gap-1.5">
            <Home className="h-4 w-4" aria-hidden="true" />
            Back To Website
          </Link>
        </Button>
      </div>
    </div>
  );
}
