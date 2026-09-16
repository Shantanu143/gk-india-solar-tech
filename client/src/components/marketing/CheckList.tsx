import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckListProps {
  items: string[];
  tone?: "default" | "light";
  className?: string;
}

export function CheckList({ items, tone = "default", className }: CheckListProps) {
  return (
    <ul className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn("flex items-start gap-2 text-sm", tone === "light" ? "text-white/80" : "text-foreground/80")}
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
