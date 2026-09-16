import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { useAuth } from "@/features/crm/hooks/authContext";
import type { Lead } from "@/features/leads/types/lead";
import { useFinalConfiguration, usePrepareFinalConfiguration } from "@/features/surveys/hooks/useFinalConfiguration";
import {
  prepareFinalConfigurationSchema,
  type PrepareFinalConfigurationFormValues,
} from "@/features/surveys/schemas/survey.schema";
import { INSTALLATION_TYPE_LABEL, type InstallationType } from "@/features/surveys/types/finalSolarConfiguration";
import type { RoofType, Survey } from "@/features/surveys/types/survey";
import { formatDate } from "@/lib/format";

const ROOF_TYPE_TO_INSTALLATION_TYPE: Record<RoofType, InstallationType> = {
  RCC: "RCC_ROOFTOP",
  METAL: "METAL_ROOFTOP",
  TILE: "TILE_ROOFTOP",
  OTHER: "OTHER",
};

interface FinalConfigurationPanelProps {
  survey: Survey;
  lead: Lead;
}

/**
 * After a survey completes, the employee prepares a technical `FinalSolarConfiguration` — combining
 * the bill, roof area/type, photos and survey report — as its own record. It never overwrites
 * `lead.solarRecommendation` (the original customer-facing estimate), even though it starts from it.
 */
export function FinalConfigurationPanel({ survey, lead }: FinalConfigurationPanelProps) {
  const { user } = useAuth();
  const { data: config, isLoading } = useFinalConfiguration(survey.id);
  const prepare = usePrepareFinalConfiguration();

  const recommendation = lead.solarRecommendation;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrepareFinalConfigurationFormValues>({
    resolver: zodResolver(prepareFinalConfigurationSchema),
    defaultValues: {
      systemCapacityKw: recommendation.recommendedCapacity,
      panelModel: `${recommendation.panelCapacity}W Mono PERC`,
      panelWattage: recommendation.panelCapacity,
      numberOfPanels: recommendation.estimatedPanels,
      inverterCapacityKw: recommendation.recommendedInverter,
      structureType: "GK India SolarTech Structure",
      installationType: survey.roofAssessment ? ROOF_TYPE_TO_INSTALLATION_TYPE[survey.roofAssessment.roofType] : "RCC_ROOFTOP",
    },
  });

  if (isLoading) return <SkeletonRows rows={3} />;

  if (config) {
    return (
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-navy">Final Solar Configuration</h2>
          <span className="text-xs text-muted-foreground">
            Prepared by {config.preparedBy} · {formatDate(config.createdAt)}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">System Capacity</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{config.systemCapacityKw} kW</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Panel</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{config.panelModel}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Number of Panels</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{config.numberOfPanels}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Inverter</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{config.inverterCapacityKw} kW</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Structure</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{config.structureType}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Installation Type</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{INSTALLATION_TYPE_LABEL[config.installationType]}</p>
          </div>
        </div>
      </Card>
    );
  }

  function onSubmit(values: PrepareFinalConfigurationFormValues) {
    prepare.mutate({ surveyId: survey.id, ...values, preparedBy: user?.id ?? "" });
  }

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-bold text-navy">Prepare Final Solar Configuration</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Combines the electricity bill, roof area, roof type, site photos and survey report into a system design. Pre-filled from the
        original estimate — adjust it to match what the survey found.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="systemCapacityKw">System Capacity (kW)</Label>
          <Input id="systemCapacityKw" type="number" step="0.1" {...register("systemCapacityKw", { valueAsNumber: true })} />
          {errors.systemCapacityKw && <p className="mt-1.5 text-xs text-error">{errors.systemCapacityKw.message}</p>}
        </div>
        <div>
          <Label htmlFor="panelModel">Panel</Label>
          <Input id="panelModel" {...register("panelModel")} />
          {errors.panelModel && <p className="mt-1.5 text-xs text-error">{errors.panelModel.message}</p>}
        </div>
        <div>
          <Label htmlFor="panelWattage">Panel Wattage (W)</Label>
          <Input id="panelWattage" type="number" {...register("panelWattage", { valueAsNumber: true })} />
          {errors.panelWattage && <p className="mt-1.5 text-xs text-error">{errors.panelWattage.message}</p>}
        </div>
        <div>
          <Label htmlFor="numberOfPanels">Number of Panels</Label>
          <Input id="numberOfPanels" type="number" {...register("numberOfPanels", { valueAsNumber: true })} />
          {errors.numberOfPanels && <p className="mt-1.5 text-xs text-error">{errors.numberOfPanels.message}</p>}
        </div>
        <div>
          <Label htmlFor="inverterCapacityKw">Inverter Capacity (kW)</Label>
          <Input id="inverterCapacityKw" type="number" step="0.1" {...register("inverterCapacityKw", { valueAsNumber: true })} />
          {errors.inverterCapacityKw && <p className="mt-1.5 text-xs text-error">{errors.inverterCapacityKw.message}</p>}
        </div>
        <div>
          <Label htmlFor="structureType">Structure</Label>
          <Input id="structureType" {...register("structureType")} />
          {errors.structureType && <p className="mt-1.5 text-xs text-error">{errors.structureType.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="installationType">Installation Type</Label>
          <select
            id="installationType"
            className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
            {...register("installationType")}
          >
            <option value="RCC_ROOFTOP">RCC Rooftop</option>
            <option value="METAL_ROOFTOP">Metal Rooftop</option>
            <option value="TILE_ROOFTOP">Tile Rooftop</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {prepare.isError && <p className="text-sm text-error sm:col-span-2">Couldn't save this configuration. Please try again.</p>}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={prepare.isPending}>
            {prepare.isPending ? "Saving…" : "Save Final Configuration"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
