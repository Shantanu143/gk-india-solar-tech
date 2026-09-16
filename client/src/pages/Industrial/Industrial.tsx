import { Factory, HardHat, ShieldCheck, Users } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { SolutionDetailPage } from "@/components/marketing/SolutionDetailPage";

const BENEFITS = [
  "Large-scale capacity built for high energy demand",
  "Dedicated project management from design to commissioning",
  "Professional EPC delivery built for industrial environments",
  "Installation support that minimizes operational disruption",
  "Ongoing AMC for large-scale systems",
  "Support through applicable net metering and grid connection processes",
];

const HIGHLIGHTS = [
  {
    icon: Factory,
    title: "Scalable Engineering",
    description: "System design engineered for industrial-scale capacity requirements.",
  },
  {
    icon: Users,
    title: "Dedicated Project Management",
    description: "A dedicated team manages your project from design through commissioning.",
  },
  {
    icon: HardHat,
    title: "Safety-First Installation",
    description: "Installation carried out with industrial site safety standards in mind.",
  },
  {
    icon: ShieldCheck,
    title: "Long-Term Support",
    description: "AMC and ongoing support to keep large-scale systems performing.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What industrial facilities is solar suitable for?",
    answer:
      "Solar can be a fit for a wide range of industrial facilities, depending on available roof or land area and electricity usage. Our team assesses suitability during your free estimate and site survey.",
  },
  {
    question: "How is an industrial system designed?",
    answer:
      "Industrial systems are designed around your facility's electricity usage, available space, and load requirements, with a dedicated project team managing design and delivery.",
  },
  {
    question: "Do you handle grid connection and compliance?",
    answer:
      "Yes, our team assists with the net-metering and grid connection process associated with your installation.",
  },
  {
    question: "What ongoing support is available for industrial systems?",
    answer:
      "We offer Annual Maintenance Contracts (AMC) for industrial-scale systems to support long-term performance.",
  },
];

export function Industrial() {
  return (
    <>
      <Seo
        title="Industrial Solar | GK India SolarTech"
        description="Large-scale industrial solar solutions from GK India SolarTech, engineered for industrial requirements."
        path="/industrial-solar"
      />
      <SolutionDetailPage
        eyebrow="Industrial Solar"
        title="Powering Industrial Growth With Solar"
        description="Large-scale solar solutions engineered for industrial requirements — from initial design through installation, with dedicated project management at every stage."
        illustrationVariant="industrial"
        benefits={BENEFITS}
        highlights={HIGHLIGHTS}
        faqItems={FAQ_ITEMS}
        finalCtaHeading="Ready To Power Your Facility With Solar?"
        finalCtaDescription="Start with a free estimate to see what solar could look like for your facility."
      />
    </>
  );
}
