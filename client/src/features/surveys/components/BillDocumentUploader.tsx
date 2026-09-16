import { useRef, useState } from "react";
import { AlertCircle, FileText, Loader2, Upload, X } from "lucide-react";
import type { SurveyDocument } from "@/features/surveys/types/survey";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

interface BillDocumentUploaderProps {
  document?: SurveyDocument;
  onChange: (document: SurveyDocument | undefined) => void;
}

export function BillDocumentUploader({ document, onChange }: BillDocumentUploaderProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setStatus("error");
      return;
    }
    setStatus("uploading");
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ id: `bill-${Date.now()}`, fileName: file.name, fileType: file.type, url: String(reader.result) });
      setStatus("idle");
    };
    reader.onerror = () => setStatus("error");
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <p className="text-sm font-semibold text-navy">Electricity Bill</p>
      <p className="mt-0.5 text-xs text-muted-foreground">PDF, JPG or PNG — upload if the customer hasn't already provided one.</p>

      {document ? (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-border bg-surface p-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
            <span className="truncate text-sm text-foreground/80">{document.fileName}</span>
          </div>
          <button
            type="button"
            aria-label="Remove electricity bill"
            onClick={() => onChange(undefined)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-navy/5"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy/25 text-sm font-semibold text-navy hover:bg-navy/5"
        >
          {status === "uploading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
          {status === "uploading" ? "Uploading…" : "Upload Electricity Bill"}
        </button>
      )}

      {status === "error" && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-error">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Please upload a PDF, JPG or PNG file.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
