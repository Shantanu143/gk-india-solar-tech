import { Boxes, Building2, Factory, Home, Settings2, Sun, Zap, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/constant/routes";
import type { ProductCategory } from "@/types/product";
import type { SolarProjectType } from "@/types/solar";

export interface SolutionCardData {
  id: SolarProjectType;
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  href: string;
}

export const solutionCards: SolutionCardData[] = [
  {
    id: "residential",
    icon: Home,
    title: "Residential Solar",
    description: "Solar solutions designed for homes and rooftops.",
    benefits: ["Reduced electricity expenses", "Rooftop installation", "Subsidy assistance"],
    href: ROUTES.residentialSolar,
  },
  {
    id: "commercial",
    icon: Building2,
    title: "Commercial Solar",
    description: "Solar solutions for businesses and commercial buildings.",
    benefits: ["Lower operating costs", "Scalable system design", "Professional EPC support"],
    href: ROUTES.commercialSolar,
  },
  {
    id: "industrial",
    icon: Factory,
    title: "Industrial Solar",
    description: "Large-scale solar solutions for industrial requirements.",
    benefits: ["Large-scale capacity", "Dedicated project management", "Installation support"],
    href: ROUTES.industrialSolar,
  },
];

export const productCategories: ProductCategory[] = [
  { id: "solar-panels", name: "Solar Panels", description: "High-efficiency solar modules." },
  { id: "inverters", name: "Inverters", description: "Reliable solar inverter solutions." },
  { id: "mounting-structures", name: "Mounting Structures", description: "Durable rooftop mounting systems." },
  { id: "accessories", name: "Accessories", description: "Cables, connectors and balance-of-system components." },
];

export const productCategoryIcons: Record<string, LucideIcon> = {
  "solar-panels": Sun,
  inverters: Zap,
  "mounting-structures": Settings2,
  accessories: Boxes,
};
