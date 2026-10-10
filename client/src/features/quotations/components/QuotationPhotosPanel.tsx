import { Images } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/features/crm/components/GlassPanel";
import { PhotoUploader } from "@/features/surveys/components/PhotoUploader";
import type { SurveyPhoto } from "@/features/surveys/types/survey";
import { MAX_QUOTATION_IMAGES, type QuotationImage } from "@/features/quotations/types/quotation";

// Photos print about 8 cm wide in the PDF, so 1280px is plenty and keeps the save request small.
const PHOTO_MAX_DIMENSION = 1280;
// Mirrors the server's per-photo rules — anything else would be rejected on save, so it's never offered.
const MAX_PHOTO_DATA_URL_LENGTH = 1_500_000;
const PHOTO_DATA_URL_PREFIX = /^data:image\/(?:jpeg|png);base64,/;

function isSendablePhoto(photo: SurveyPhoto): boolean {
  return PHOTO_DATA_URL_PREFIX.test(photo.url.slice(0, 40)) && photo.url.length <= MAX_PHOTO_DATA_URL_LENGTH;
}

let importCounter = 0;
function importedId(): string {
  importCounter += 1;
  return `survey-${Date.now().toString(36)}-${importCounter}`;
}

interface QuotationPhotosPanelProps {
  /** The photos saved on the quotation. */
  images: QuotationImage[];
  /** Admin on a draft: upload, remove, import. Everyone else sees the photos but can't change them. */
  editable: boolean;
  /** A draft that isn't editable by this user still picks up the engineer's photos when it is sent. */
  isDraft: boolean;
  onChange: (images: QuotationImage[]) => void;
  /** Photos currently on the lead's site survey (uploaded by the site engineer). */
  surveyPhotos: SurveyPhoto[];
}

/** The photos printed on the "Site survey photos" pages of the quotation PDF. */
export function QuotationPhotosPanel({ images, editable, isDraft, onChange, surveyPhotos }: QuotationPhotosPanelProps) {
  const notOnQuotation = surveyPhotos.filter((photo) => isSendablePhoto(photo) && !images.some((image) => image.url === photo.url));
  const room = MAX_QUOTATION_IMAGES - images.length;

  // A sales draft is read-only here, but anything the engineer has uploaded is added the moment it's sent — show it now.
  const incoming = !editable && isDraft ? notOnQuotation.slice(0, Math.max(0, room)) : [];
  const shown: QuotationImage[] = [...images, ...incoming.map((photo) => ({ id: photo.id, url: photo.url, fileName: photo.fileName }))];

  if (!editable && shown.length === 0 && !isDraft) return null;

  function importFromSurvey() {
    const added = notOnQuotation.slice(0, room).map((photo) => ({ id: importedId(), url: photo.url, fileName: photo.fileName }));
    onChange([...images, ...added]);
  }

  const importCount = Math.min(notOnQuotation.length, room);

  return (
    <GlassPanel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-navy">
            <Images className="h-4 w-4" aria-hidden="true" />
            Site Survey Photos
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {editable
              ? `Photos from the site survey are added automatically. You can also upload photos here or remove any of them (up to ${MAX_QUOTATION_IMAGES}). Saved with Save Draft or when you send.`
              : isDraft
                ? "Photos uploaded by the site engineer are included in the quotation PDF automatically."
                : "These photos are printed in the quotation PDF."}
          </p>
        </div>
        {editable && importCount > 0 && (
          <Button type="button" size="sm" variant="secondary" onClick={importFromSurvey}>
            Add {importCount} photo{importCount === 1 ? "" : "s"} from site survey
          </Button>
        )}
      </div>

      <div className="mt-3">
        {editable ? (
          <PhotoUploader
            label={`Photos (${images.length}/${MAX_QUOTATION_IMAGES})`}
            photos={images}
            onChange={onChange}
            maxPhotos={MAX_QUOTATION_IMAGES}
            maxDimension={PHOTO_MAX_DIMENSION}
          />
        ) : shown.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No survey photos yet — the site engineer needs to upload them from the survey.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {shown.map((image, index) => (
              <div key={`${image.id}-${index}`} className="aspect-square overflow-hidden rounded-xl border border-border bg-surface-muted">
                <img src={image.url} alt={image.fileName} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
