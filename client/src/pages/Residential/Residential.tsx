import { Calculator, IndianRupee, Wrench, Zap } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { SolutionDetailPage } from "@/components/marketing/SolutionDetailPage";

const BENEFITS = [
  "Lower monthly electricity bills",
  "Rooftop solar designed around your home's layout",
  "Assistance with the government subsidy application",
  "Net metering support to connect your system to the grid",
  "Professional installation by our EPC team",
  "Post-installation AMC and support",
];

const HIGHLIGHTS = [
  {
    icon: Calculator,
    title: "Free Solar Estimate",
    description: "Understand your potential system size and savings before you commit to anything.",
  },
  {
    icon: IndianRupee,
    title: "Subsidy Assistance",
    description: "Guidance through the applicable residential rooftop subsidy scheme.",
  },
  {
    icon: Zap,
    title: "Net Metering Support",
    description: "We help you through the net-metering application required to connect to the grid.",
  },
  {
    icon: Wrench,
    title: "AMC & Support",
    description: "Ongoing maintenance after installation to keep your system performing.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How much roof space do I need for a home solar system?",
    answer:
      "Roof space requirements depend on your recommended system size and the panels used. Our team confirms exact requirements during your site survey.",
  },
  {
    question: "Will solar work with my roof type?",
    answer:
      "Most residential roof types can support a solar installation. Our team assesses your specific roof during the site survey to confirm feasibility and the right mounting approach.",
  },
  {
    question: "How long does a residential installation take?",
    answer:
      "Installation timelines vary with system size and site conditions, and are confirmed as part of your project proposal after the site survey.",
  },
  {
    question: "Can I finance my home solar system?",
    answer:
      "Our free solar estimate includes an illustrative EMI calculation to help you understand financing options for your system.",
  },
];

export function Residential() {
  return (
    <>
      <Seo
        title="Residential Solar | GK India SolarTech"
        description="Residential solar solutions for homes and rooftops from GK India SolarTech, including installation, subsidy assistance and net metering support."
        path="/residential-solar"
      />
      <SolutionDetailPage
        eyebrow="Residential Solar"
        title="Power Your Home With Solar"
        description="Reduce your monthly electricity expenses with a rooftop solar system designed for your home — backed by professional installation, subsidy assistance and ongoing support."
        illustrationVariant="residential"
        benefits={BENEFITS}
        highlights={HIGHLIGHTS}
        faqItems={FAQ_ITEMS}
        finalCtaHeading="Ready To Power Your Home With Solar?"
        finalCtaDescription="Start with a free estimate to see what solar could look like for your home."
      />
    </>
  );
}
