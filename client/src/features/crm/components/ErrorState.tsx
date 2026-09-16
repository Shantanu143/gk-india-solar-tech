import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, description, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-14 text-center", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-2 text-sm font-semibold text-navy">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
      {onRetry && (
        <Button size="sm" className="mt-3" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
