import { Quote, User } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface TestimonialCardProps {
  /** When omitted, renders neutral placeholder copy — real testimonials will populate this via API later. */
  quote?: string;
  name?: string;
  role?: string;
}

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <Card className="flex h-full flex-col p-7">
      <Quote className="h-7 w-7 text-orange/40" aria-hidden="true" />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground italic">
        {quote ?? "Customer testimonial will appear here."}
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
          <User className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-navy">{name ?? "Customer name"}</p>
          <p className="text-xs text-muted-foreground">{role ?? "Location"}</p>
        </div>
      </div>
    </Card>
  );
}
