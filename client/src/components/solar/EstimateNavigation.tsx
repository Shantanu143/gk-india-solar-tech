import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EstimateNavigationProps {
  onBack?: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  submitType?: boolean;
  onNext?: () => void;
  className?: string;
}

/** Sticky on mobile so the primary action is always reachable without scrolling; inline on desktop. */
export function EstimateNavigation({
  onBack,
  nextLabel,
  nextDisabled,
  submitType = false,
  onNext,
  className,
}: EstimateNavigationProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 -mx-6 mt-8 flex items-center gap-3 border-t border-border bg-surface px-6 py-4 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0",
        className,
      )}
    >
      {onBack && (
        <Button type="button" variant="secondary" size="lg" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
      )}
      <Button
        type={submitType ? "submit" : "button"}
        size="lg"
        disabled={nextDisabled}
        onClick={submitType ? undefined : onNext}
        className="flex-1 sm:flex-none"
      >
        {nextLabel}
      </Button>
    </div>
  );
}
