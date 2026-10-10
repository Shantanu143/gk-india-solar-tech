import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PhotoUploader } from "@/features/surveys/components/PhotoUploader";
import { useSaveSurveyProgress } from "@/features/surveys/hooks/useSurveyMutations";
import type { Survey, SurveyPhoto } from "@/features/surveys/types/survey";
import { ApiError } from "@/services/apiClient";

const signature = (roof: SurveyPhoto[], meter?: SurveyPhoto) =>
  `${roof.map((photo) => `${photo.id}:${photo.url.length}`).join(",")}|${meter ? `${meter.id}:${meter.url.length}` : ""}`;

interface SurveyPhotosPanelProps {
  survey: Survey;
}

/**
 * Lets the site engineer (or an admin) add, replace or remove the survey photos after the survey has
 * been completed. One explicit Save — not an autosave per photo — so the saved set is always exactly
 * what's on screen. These photos are what the sales team's quotation PDF carries.
 */
export function SurveyPhotosPanel({ survey }: SurveyPhotosPanelProps) {
  const save = useSaveSurveyProgress();
  const [roofPhotos, setRoofPhotos] = useState<SurveyPhoto[]>(survey.roofPhotos);
  const [meterPhoto, setMeterPhoto] = useState<SurveyPhoto | undefined>(survey.meterPhoto);

  const dirty = signature(roofPhotos, meterPhoto) !== signature(survey.roofPhotos, survey.meterPhoto);
  const hasPhotos = roofPhotos.length > 0 || !!meterPhoto;

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-bold text-navy">Survey Photos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add or replace the roof and meter photos. They go into the customer's quotation PDF — the sales team can generate the
        quotation once the photos are here.
      </p>

      <div className="mt-4 flex flex-col gap-5">
        <PhotoUploader label="Roof Photos" photos={roofPhotos} onChange={setRoofPhotos} maxPhotos={8} />
        <PhotoUploader
          label="Meter Photo"
          photos={meterPhoto ? [meterPhoto] : []}
          onChange={(photos) => setMeterPhoto(photos[0])}
          maxPhotos={1}
        />
      </div>

      {!hasPhotos && !dirty && <p className="mt-4 text-sm text-warning">No photos uploaded yet — a quotation can't be generated without them.</p>}
      {save.isError && (
        <p className="mt-4 text-sm text-error">
          {save.error instanceof ApiError ? save.error.message : "Couldn't save the photos. Please try again."}
        </p>
      )}
      {save.isSuccess && !dirty && hasPhotos && (
        <p className="mt-4 text-sm text-green">Photos saved — they'll appear in the quotation.</p>
      )}

      <Button
        type="button"
        size="lg"
        className="mt-4 w-full"
        disabled={!dirty || save.isPending}
        onClick={() => save.mutate({ id: survey.id, roofPhotos, meterPhoto: meterPhoto ?? null })}
      >
        {save.isPending ? "Saving…" : "Save Photos"}
      </Button>
    </Card>
  );
}
