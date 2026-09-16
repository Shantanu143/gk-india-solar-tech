import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function ProjectTypeCard({ icon: Icon, title, description, selected, onSelect }: ProjectTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border-2 bg-surface p-5 text-left transition-colors duration-200 hover:border-navy/30",
        selected ? "border-orange bg-orange/5" : "border-border",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-orange text-white" : "bg-navy/8 text-navy",
        )}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-navy">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          selected ? "bg-orange text-white" : "text-muted-foreground/50",
        )}
      >
        {selected ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </span>
    </button>
  );
}
