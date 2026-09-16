import { CheckCircle2, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import {
  METER_TYPE_LABEL,
  ROOF_CONDITION_LABEL,
  ROOF_TYPE_LABEL,
  SHADOW_LEVEL_LABEL,
  type Survey,
} from "@/features/surveys/types/survey";
import { getEmployeeById } from "@/features/employees/utils/employeeCache";
import { formatDate } from "@/lib/format";

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-0.5 text-sm text-foreground/90">{value}</p>
    </div>
  );
}

interface SurveyReportProps {
  survey: Survey;
}

/** Read-only summary matching the "SITE SURVEY REPORT" section from the requirements document. */
export function SurveyReport({ survey }: SurveyReportProps) {
  const engineer = getEmployeeById(survey.engineerId);
  const assessment = survey.roofAssessment;

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-bold text-navy">Site Survey Report</h2>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label="Customer" value={survey.customerName} />
        <Field label="Location" value={survey.location.city} />
        <Field label="Engineer" value={engineer?.name ?? "—"} />
        <Field label="Date" value={formatDate(`${survey.date}T00:00:00`)} />
      </div>

      {assessment && (
        <>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-semibold text-navy">Roof</p>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Type" value={ROOF_TYPE_LABEL[assessment.roofType]} />
              <Field label="Area" value={`${assessment.roofAreaSqft} sq.ft`} />
              <Field label="Condition" value={ROOF_CONDITION_LABEL[assessment.roofCondition]} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Shadow Level" value={SHADOW_LEVEL_LABEL[assessment.shadowLevel]} />
            <Field label="Meter Type" value={METER_TYPE_LABEL[assessment.meterType]} />
            <Field
              label="GPS"
              value={
                survey.gpsLocation ? (
                  <span className="flex items-center gap-1 text-green">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Captured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <XCircle className="h-3.5 w-3.5" aria-hidden="true" /> Not captured
                  </span>
                )
              }
            />
          </div>
        </>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label="Roof Photos" value={`${survey.roofPhotos.length} photo${survey.roofPhotos.length === 1 ? "" : "s"}`} />
        <Field label="Meter Photo" value={survey.meterPhoto ? "Uploaded" : "Not uploaded"} />
        <Field label="Electricity Bill" value={survey.electricityBillDocument ? survey.electricityBillDocument.fileName : "Not uploaded"} />
      </div>

      {survey.notes && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Notes</p>
          <p className="mt-1 text-sm text-foreground/90">{survey.notes}</p>
        </div>
      )}

      {(survey.roofPhotos.length > 0 || survey.meterPhoto) && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {survey.roofPhotos.map((photo) => (
            <div key={photo.id} className="aspect-square overflow-hidden rounded-xl border border-border bg-surface-muted">
              <img src={photo.url} alt={photo.fileName} className="h-full w-full object-cover" />
            </div>
          ))}
          {survey.meterPhoto && (
            <div className="aspect-square overflow-hidden rounded-xl border border-border bg-surface-muted">
              <img src={survey.meterPhoto.url} alt={survey.meterPhoto.fileName} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
