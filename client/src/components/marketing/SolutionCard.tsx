import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CheckList } from "./CheckList";

interface SolutionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  href: string;
  image: string;
}

export function SolutionCard({ icon: Icon, title, description, benefits, href, image }: SolutionCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="glass-blue absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-full text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-serif text-2xl font-medium text-navy">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <CheckList items={benefits} className="mt-5 mb-7" />
        <Link
          to={href}
          className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-dark"
        >
          Explore Solution
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
