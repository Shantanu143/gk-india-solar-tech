import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CheckList } from "./CheckList";

interface SolutionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  href: string;
}

export function SolutionCard({ icon: Icon, title, description, benefits, href }: SolutionCardProps) {
  return (
    <Card className="flex h-full flex-col p-7 hover:-translate-y-1 hover:shadow-soft-lg sm:p-8">
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-white">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-xl font-bold text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

      <CheckList items={benefits} className="mt-5" />

      <Link
        to={href}
        className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors hover:text-orange"
      >
        Explore Solution
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </Card>
  );
}
