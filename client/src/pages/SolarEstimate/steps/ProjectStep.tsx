import { EstimateNavigation } from "@/components/solar/EstimateNavigation";
import { ProjectTypeCard } from "@/components/solar/ProjectTypeCard";
import { useAutoFocusHeading } from "@/hooks/useAutoFocusHeading";
import { projectTypeOptions } from "@/data/projectTypeOptions";
import type { ProjectType } from "@/types/solarEstimate";

interface ProjectStepProps {
  selected: ProjectType | null;
  onSelect: (type: ProjectType) => void;
  onContinue: () => void;
}

export function ProjectStep({ selected, onSelect, onContinue }: ProjectStepProps) {
  const headingRef = useAutoFocusHeading<HTMLHeadingElement>();

  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-navy outline-none sm:text-2xl">
        What type of solar project do you need?
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">Choose the option that best matches your property.</p>

      <div className="mt-6 flex flex-col gap-3">
        {projectTypeOptions.map((option) => (
          <ProjectTypeCard
            key={option.id}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={selected === option.id}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>

      <EstimateNavigation nextLabel="Continue" nextDisabled={!selected} onNext={onContinue} />
    </div>
  );
}
