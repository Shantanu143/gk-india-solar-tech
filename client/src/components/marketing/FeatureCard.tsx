import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group h-full p-6 hover:-translate-y-1 hover:shadow-soft-lg sm:p-7">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange/10 text-orange transition-transform duration-300 group-hover:scale-110 group-hover:bg-orange group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </Card>
  );
}
