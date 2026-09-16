import { useRef, useState } from "react";
import { AlertCircle, Camera, Image as ImageIcon, Loader2, X } from "lucide-react";
import { compressImage } from "@/features/surveys/utils/imageCompression";
import type { SurveyPhoto } from "@/features/surveys/types/survey";

interface PendingPhoto {
  id: string;
  fileName: string;
  status: "processing" | "error";
}

interface PhotoUploaderProps {
  label: string;
  photos: SurveyPhoto[];
  onChange: (photos: SurveyPhoto[]) => void;
  maxPhotos?: number;
}

let localCounter = 0;
function localId(): string {
  localCounter += 1;
  return `local-${localCounter}`;
}

/** Large touch targets, camera + gallery entry points, thumbnails with remove — built mobile-first. */
export function PhotoUploader({ label, photos, onChange, maxPhotos = 8 }: PhotoUploaderProps) {
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const atLimit = photos.length >= maxPhotos;

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, Math.max(0, maxPhotos - photos.length));

    for (const file of files) {
      const id = localId();
      setPending((prev) => [...prev, { id, fileName: file.name, status: "processing" }]);
      try {
        const dataUrl = await compressImage(file);
        const photo: SurveyPhoto = { id, url: dataUrl, fileName: file.name };
        onChange([...photos, photo]);
        setPending((prev) => prev.filter((p) => p.id !== id));
      } catch {
        setPending((prev) => prev.map((p) => (p.id === id ? { ...p, status: "error" } : p)));
      }
    }
  }

  function removePhoto(id: string) {
    onChange(photos.filter((p) => p.id !== id));
  }

  function dismissError(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <p className="text-sm font-semibold text-navy">{label}</p>

      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-muted">
            <img src={photo.url} alt={photo.fileName} className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label={`Remove ${photo.fileName}`}
              onClick={() => removePhoto(photo.id)}
              className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-navy-dark/70 text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}

        {pending.map((p) => (
          <div
            key={p.id}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-surface-muted p-1 text-center"
          >
            {p.status === "processing" ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-error" aria-hidden="true" />
                <button type="button" onClick={() => dismissError(p.id)} className="text-[10px] font-semibold text-error underline">
                  Dismiss
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {!atLimit && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-navy/20 text-sm font-semibold text-navy hover:bg-navy/5"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            Camera
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-navy/20 text-sm font-semibold text-navy hover:bg-navy/5"
          >
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
            Gallery / File
          </button>
        </div>
      )}

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple={maxPhotos > 1}
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
