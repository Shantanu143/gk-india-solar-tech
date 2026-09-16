import { Building2, Factory, Home, type LucideIcon } from "lucide-react";
import type { ProjectType } from "@/types/solarEstimate";

export interface ProjectTypeOption {
  id: ProjectType;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const projectTypeOptions: ProjectTypeOption[] = [
  { id: "RESIDENTIAL", icon: Home, title: "Residential", description: "For homes and residential rooftops." },
  {
    id: "COMMERCIAL",
    icon: Building2,
    title: "Commercial",
    description: "For offices, shops and commercial buildings.",
  },
  {
    id: "INDUSTRIAL",
    icon: Factory,
    title: "Industrial",
    description: "For industrial and larger-scale requirements.",
  },
];
