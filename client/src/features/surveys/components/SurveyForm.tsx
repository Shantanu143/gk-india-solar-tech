import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { ConfirmDialog } from "@/features/crm/components/ConfirmDialog";
import { useAuth } from "@/features/crm/hooks/authContext";
import { BillDocumentUploader } from "@/features/surveys/components/BillDocumentUploader";
import { LocationCapture } from "@/features/surveys/components/LocationCapture";
import { PhotoUploader } from "@/features/surveys/components/PhotoUploader";
import { useCompleteSurvey, useSaveSurveyProgress } from "@/features/surveys/hooks/useSurveyMutations";
import { roofAssessmentSchema, type RoofAssessmentFormValues } from "@/features/surveys/schemas/survey.schema";
import type { GpsLocation, Survey, SurveyDocument, SurveyPhoto } from "@/features/surveys/types/survey";

interface SurveyFormProps {
  survey: Survey;
}

export function SurveyForm({ survey }: SurveyFormProps) {
  const { user } = useAuth();
  const saveProgress = useSaveSurveyProgress();
  const completeSurvey = useCompleteSurvey();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [gpsLocation, setGpsLocation] = useState<GpsLocation | undefined>(survey.gpsLocation);
  const [roofPhotos, setRoofPhotos] = useState<SurveyPhoto[]>(survey.roofPhotos);
  const [meterPhoto, setMeterPhoto] = useState<SurveyPhoto | undefined>(survey.meterPhoto);
  const [billDocument, setBillDocument] = useState<SurveyDocument | undefined>(survey.electricityBillDocument);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RoofAssessmentFormValues>({
    resolver: zodResolver(roofAssessmentSchema),
    defaultValues: {
      roofType: survey.roofAssessment?.roofType ?? "RCC",
      roofAreaSqft: survey.roofAssessment?.roofAreaSqft ?? undefined,
      roofCondition: survey.roofAssessment?.roofCondition ?? "GOOD",
      shadowLevel: survey.roofAssessment?.shadowLevel ?? "LOW",
      meterType: survey.roofAssessment?.meterType ?? "SINGLE_PHASE",
      notes: survey.notes ?? "",
    },
  });

  function handleGpsCapture(location: GpsLocation) {
    setGpsLocation(location);
    saveProgress.mutate({ id: survey.id, gpsLocation: location });
  }

  function handleRoofPhotosChange(photos: SurveyPhoto[]) {
    setRoofPhotos(photos);
    saveProgress.mutate({ id: survey.id, roofPhotos: photos });
  }

  function handleMeterPhotoChange(photos: SurveyPhoto[]) {
    const photo = photos[0];
    setMeterPhoto(photo);
    saveProgress.mutate({ id: survey.id, meterPhoto: photo });
  }

  function handleBillChange(doc: SurveyDocument | undefined) {
    setBillDocument(doc);
    saveProgress.mutate({ id: survey.id, electricityBillDocument: doc });
  }

  function onSubmitClick() {
    handleSubmit(() => setConfirmOpen(true))();
  }

  function handleConfirmComplete() {
    const values = getValues();
    completeSurvey.mutate(
      {
        id: survey.id,
        roofAssessment: {
          roofType: values.roofType,
          roofAreaSqft: Number(values.roofAreaSqft),
          roofCondition: values.roofCondition,
          shadowLevel: values.shadowLevel,
          meterType: values.meterType,
        },
        gpsLocation,
        roofPhotos,
        meterPhoto,
        electricityBillDocument: billDocument,
        notes: values.notes,
        actorName: user?.name ?? "System",
      },
      { onSuccess: () => setConfirmOpen(false) },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 sm:p-5">
        <h2 className="text-base font-bold text-navy">Roof & Meter Details</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <Label htmlFor="roofType">Roof Type</Label>
            <select id="roofType" className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("roofType")}>
              <option value="RCC">RCC</option>
              <option value="METAL">Metal</option>
              <option value="TILE">Tile</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="roofAreaSqft">Roof Area (sq.ft)</Label>
            <input
              id="roofAreaSqft"
              type="number"
              inputMode="decimal"
              className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("roofAreaSqft", { valueAsNumber: true })}
            />
            {errors.roofAreaSqft && <p className="mt-1.5 text-xs text-error">{errors.roofAreaSqft.message}</p>}
          </div>

          <div>
            <Label htmlFor="roofCondition">Roof Condition</Label>
            <select id="roofCondition" className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("roofCondition")}>
              <option value="GOOD">Good</option>
              <option value="AVERAGE">Average</option>
              <option value="POOR">Poor</option>
            </select>
          </div>

          <div>
            <Label htmlFor="shadowLevel">Shadow</Label>
            <select id="shadowLevel" className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("shadowLevel")}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <Label htmlFor="meterType">Meter Type</Label>
            <select id="meterType" className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("meterType")}>
              <option value="SINGLE_PHASE">Single Phase</option>
              <option value="THREE_PHASE">Three Phase</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <LocationCapture value={gpsLocation} onCapture={handleGpsCapture} />
      </Card>

      <Card className="p-4 sm:p-5">
        <PhotoUploader label="Roof Photos" photos={roofPhotos} onChange={handleRoofPhotosChange} maxPhotos={8} />
      </Card>

      <Card className="p-4 sm:p-5">
        <PhotoUploader label="Meter Photo" photos={meterPhoto ? [meterPhoto] : []} onChange={handleMeterPhotoChange} maxPhotos={1} />
      </Card>

      <Card className="p-4 sm:p-5">
        <BillDocumentUploader document={billDocument} onChange={handleBillChange} />
      </Card>

      <Card className="p-4 sm:p-5">
        <Label htmlFor="notes">Additional Site Notes</Label>
        <Textarea id="notes" rows={4} placeholder="e.g. Roof has low afternoon shadow." {...register("notes")} />
      </Card>

      {completeSurvey.isError && <p className="text-sm text-error">Couldn't complete this survey. Please try again.</p>}

      <Button type="button" size="lg" className="w-full" onClick={onSubmitClick} disabled={completeSurvey.isPending}>
        Complete Survey
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Complete This Survey?"
        description="Are you sure you want to complete this survey? The lead will move to Survey Completed."
        confirmLabel="Complete Survey"
        isLoading={completeSurvey.isPending}
        onConfirm={handleConfirmComplete}
      />
    </div>
  );
}
