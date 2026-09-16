import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Camera, CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { uploadElectricityBill } from "@/services/billUploadService";
import type { BillUploadStatus, UploadedBillMeta } from "@/types/solarEstimate";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "This file type isn't supported. Please upload a PDF, JPG, JPEG or PNG.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "This file is too large. Please upload a file under 10 MB.";
  }
  return null;
}

interface BillUploadProps {
  value: UploadedBillMeta | null;
  onUploaded: (meta: UploadedBillMeta) => void;
  onRemove: () => void;
}

export function BillUpload({ value, onUploaded, onRemove }: BillUploadProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [status, setStatus] = useState<BillUploadStatus>(value ? "uploaded" : "idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: uploadElectricityBill,
    onMutate: () => setStatus("uploading"),
    onSuccess: (meta) => {
      setStatus("uploaded");
      onUploaded(meta);
    },
    onError: () => {
      setStatus("error");
      setErrorMessage("We couldn't upload this file. Please try again.");
    },
  });

  function handleFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      setPendingFile(null);
      return;
    }
    setPendingFile(file);
    setErrorMessage(null);
    mutation.mutate(file);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPendingFile(null);
    setStatus("idle");
    setErrorMessage(null);
    onRemove();
  }

  const activeFileName = value?.fileName ?? pendingFile?.name;
  const activeFileSize = value?.fileSizeBytes ?? pendingFile?.size;

  if (status === "idle") {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed bg-surface-muted/50 px-6 py-10 text-center transition-colors duration-200",
          isDragging ? "border-orange bg-orange/5" : "border-border",
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/8 text-navy">
          <Upload className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-navy">Drag & drop your electricity bill here</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, JPEG or PNG — up to 10 MB</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            Choose File
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-1.5 sm:hidden"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            Take Photo
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          className="sr-only"
          onChange={onInputChange}
          aria-label="Choose electricity bill file"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={onInputChange}
          aria-label="Take a photo of your electricity bill"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-surface p-4",
        status === "error" ? "border-error/40 bg-error/5" : "border-border",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
          status === "error" ? "bg-error/10 text-error" : "bg-navy/8 text-navy",
        )}
      >
        {status === "error" ? (
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
        ) : status === "uploaded" ? (
          <CheckCircle2 className="h-5 w-5 text-green" aria-hidden="true" />
        ) : (
          <FileText className="h-5 w-5" aria-hidden="true" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">{activeFileName ?? "Electricity bill"}</p>
        {status === "error" ? (
          <p className="text-xs text-error">{errorMessage}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {activeFileSize !== undefined && formatFileSize(activeFileSize)}
            {status === "uploading" && " · Uploading…"}
            {status === "uploaded" && " · Uploaded"}
          </p>
        )}
      </div>

      {status === "uploading" ? (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-orange" aria-hidden="true" />
      ) : (
        <div className="flex shrink-0 items-center gap-2">
          {status === "error" && (
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Try Again
            </Button>
          )}
          <button
            type="button"
            aria-label="Remove file"
            onClick={handleRemove}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-navy/5 hover:text-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="sr-only"
        onChange={onInputChange}
        aria-label="Choose electricity bill file"
      />
    </div>
  );
}
