import { BadgeCheck, Building2, Clock, Wrench } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { SolutionDetailPage } from "@/components/marketing/SolutionDetailPage";

const BENEFITS = [
  "Reduced operating costs over time",
  "System design scaled to your business's actual usage",
  "Support through applicable commercial incentive processes",
  "Professional installation with minimal disruption to operations",
  "Ongoing AMC and performance support",
  "Potential accelerated depreciation benefits for eligible businesses — consult your tax advisor",
];

const HIGHLIGHTS = [
  {
    icon: Building2,
    title: "EPC Expertise",
    description: "End-to-end engineering, procurement and construction for your commercial site.",
  },
  {
    icon: BadgeCheck,
    title: "Scalable Design",
    description: "System sizing matched to your business's current and future energy usage.",
  },
  {
    icon: Clock,
    title: "Minimal Downtime",
    description: "Installation planned around your operating hours to reduce business disruption.",
  },
  {
    icon: Wrench,
    title: "Dedicated Support",
    description: "A single point of contact through installation and ongoing maintenance.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What size commercial systems do you install?",
    answer:
      "System size depends on your business's electricity usage and available site area — this is determined during your free estimate and confirmed at the site survey.",
  },
  {
    question: "How is a commercial system sized?",
    answer:
      "We size commercial systems based on your electricity bill or usage data, available roof or ground space, and your business's growth plans.",
  },
  {
    question: "Do you support businesses with multiple locations?",
    answer:
      "Yes, our team can work with you to plan solar installations across multiple business locations.",
  },
  {
    question: "What maintenance does a commercial system need?",
    answer:
      "We offer Annual Maintenance Contracts (AMC) to keep your commercial system performing after installation.",
  },
];

export function Commercial() {
  return (
    <>
      <Seo
        title="Commercial Solar | GK India SolarTech"
        description="Commercial solar solutions for businesses and commercial buildings from GK India SolarTech."
        path="/commercial-solar"
      />
      <SolutionDetailPage
        eyebrow="Commercial Solar"
        title="Smarter Energy For Your Business"
        description="Commercial solar can help your business reduce operating costs and move toward cleaner, more efficient energy usage — with system design and installation managed end-to-end by our EPC team."
        illustrationVariant="commercial"
        benefits={BENEFITS}
        highlights={HIGHLIGHTS}
        faqItems={FAQ_ITEMS}
        finalCtaHeading="Ready To Explore Commercial Solar?"
        finalCtaDescription="Start with a free estimate to see what solar could look like for your business."
      />
    </>
  );
}
