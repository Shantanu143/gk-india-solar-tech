import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { RemarkForm } from "@/features/leads/components/RemarkForm";
import { LEAD_SOURCE_LABEL, PROJECT_TYPE_LABEL, type Lead } from "@/features/leads/types/lead";
import { formatInr } from "@/lib/format";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium break-words text-navy">{value}</dd>
    </div>
  );
}

export function LeadOverviewTab({ lead }: { lead: Lead }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card className="p-5">
        <h3 className="text-sm font-bold text-navy">Customer Details</h3>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Customer" value={lead.customer.fullName} />
          <Field label="Mobile" value={lead.customer.mobile} />
          <Field label="Email" value={lead.customer.email ?? "—"} />
          <Field label="Location" value={lead.location.city} />
        </dl>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold text-navy">Lead Information</h3>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Project" value={PROJECT_TYPE_LABEL[lead.projectType]} />
          <Field label="Monthly Bill" value={formatInr(lead.monthlyBill)} />
          <Field label="Recommended Solar" value={`${lead.solarRecommendation.recommendedCapacity} kW`} />
          <Field label="Source" value={LEAD_SOURCE_LABEL[lead.source]} />
        </dl>
      </Card>

      <Card className="p-5 lg:col-span-2">
        <h3 className="text-sm font-bold text-navy">Add Remark</h3>
        <p className="mt-1 text-xs text-muted-foreground">Every remark is saved to this lead's activity history.</p>
        <div className="mt-4">
          <RemarkForm lead={lead} />
        </div>
      </Card>
    </div>
  );
}
