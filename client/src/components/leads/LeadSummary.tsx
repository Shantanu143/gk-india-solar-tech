import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatInr } from "@/lib/format";
import type { LocationData, ProjectType } from "@/types/solarEstimate";

interface LeadSummaryProps {
  projectType: ProjectType;
  location: LocationData;
  monthlyBill: number;
  recommendedCapacity: number;
  onEdit: () => void;
}

const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

export function LeadSummary({ projectType, location, monthlyBill, recommendedCapacity, onEdit }: LeadSummaryProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Your Solar Estimate</span>
        <button type="button" onClick={onEdit} className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-orange">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit Estimate
        </button>
      </div>
      <dl className="mt-3 flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Project Type</dt>
          <dd className="font-semibold text-navy">{PROJECT_TYPE_LABEL[projectType]}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Location</dt>
          <dd className="font-semibold text-navy">{location.city}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Monthly Bill</dt>
          <dd className="font-semibold text-navy">{formatInr(monthlyBill)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Estimated System</dt>
          <dd className="font-semibold text-navy">{recommendedCapacity} kW</dd>
        </div>
      </dl>
    </Card>
  );
}
