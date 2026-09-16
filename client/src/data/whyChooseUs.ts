import { BadgeCheck, Factory, IndianRupee, Wrench, Zap, type LucideIcon } from "lucide-react";

export interface TrustItem {
  icon: LucideIcon;
  label: string;
}

export const trustItems: TrustItem[] = [
  { icon: BadgeCheck, label: "Solar EPC Experts" },
  { icon: IndianRupee, label: "Government Subsidy Assistance" },
  { icon: Zap, label: "Net Metering Support" },
  { icon: Wrench, label: "Professional Installation" },
  { icon: Factory, label: "AMC & Support" },
];

export interface WhyChooseUsItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const whyChooseUsItems: WhyChooseUsItem[] = [
  {
    icon: BadgeCheck,
    title: "Solar EPC Experts",
    description:
      "End-to-end engineering, procurement and construction handled by one accountable team, from design to commissioning.",
  },
  {
    icon: Factory,
    title: "Solar Structure Manufacturing",
    description:
      "Mounting structures built for durability, engineered to hold up across rooftops, ground-mounts and industrial sheds.",
  },
  {
    icon: IndianRupee,
    title: "Government Subsidy Assistance",
    description:
      "Guidance through the applicable government solar subsidy process, with eligibility explained clearly at every step.",
  },
  {
    icon: Zap,
    title: "Net Metering Support",
    description:
      "Support through the net-metering application and approval process required to connect your system to the grid.",
  },
  {
    icon: Wrench,
    title: "Installation & AMC",
    description:
      "Professional installation followed by ongoing annual maintenance so your system keeps performing long after commissioning.",
  },
];
