import { LocationForm } from "@/components/solar/LocationForm";
import { useAutoFocusHeading } from "@/hooks/useAutoFocusHeading";
import type { LocationData } from "@/types/solarEstimate";

interface LocationStepProps {
  defaultValues: LocationData | null;
  onBack: () => void;
  onSubmit: (data: LocationData) => void;
}

export function LocationStep({ defaultValues, onBack, onSubmit }: LocationStepProps) {
  const headingRef = useAutoFocusHeading<HTMLHeadingElement>();

  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-navy outline-none sm:text-2xl">
        Where do you want to install solar?
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">Tell us where your solar system will be installed.</p>

      <div className="mt-6">
        <LocationForm defaultValues={defaultValues} onBack={onBack} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
