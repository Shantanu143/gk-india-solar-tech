import { useState } from "react";
import { Pencil, Percent, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Seo } from "@/components/layout/Seo";
import { ConfirmDialog } from "@/features/crm/components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { FilterSelect } from "@/features/crm/components/FilterSelect";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { SearchInput } from "@/features/crm/components/SearchInput";
import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { CommissionRuleModal } from "@/features/commissions/components/CommissionRuleModal";
import { CommissionStatusBadge } from "@/features/commissions/components/CommissionStatusBadge";
import { UpdateCommissionStatusModal } from "@/features/commissions/components/UpdateCommissionStatusModal";
import { useUpdateCommissionRule } from "@/features/commissions/hooks/useCommissionRuleMutations";
import { useCommissionRules } from "@/features/commissions/hooks/useCommissionRules";
import { useCommissions } from "@/features/commissions/hooks/useCommissions";
import {
  COMMISSION_STATUSES,
  COMMISSION_STATUS_LABEL,
  PAYMENT_TRIGGER_LABEL,
  type Commission,
  type CommissionRule,
  type CommissionStatus,
} from "@/features/commissions/types/commission";
import { PROJECT_TYPE_LABEL } from "@/features/leads/types/lead";
import { PARTNER_TYPE_LABEL } from "@/features/partners/types/partner";
import { formatDate, formatInr } from "@/lib/format";

const PAGE_SIZE = 20;

const TABS = [
  { key: "rules", label: "Commission Rules" },
  { key: "ledger", label: "Commission Ledger" },
] as const;

type Tab = (typeof TABS)[number]["key"];

export function AdminCommissionsPage() {
  const [tab, setTab] = useState<Tab>("rules");

  return (
    <div className="flex flex-col gap-5">
      <Seo
        title="Commissions | GK India SolarTech CRM"
        description="Configure partner commission rules and track the commission payout ledger."
        path={CRM_ROUTES.adminCommissions}
        noindex
      />
      <PageHeader title="Commissions" description="Commission rules that drive partner payouts, and every commission earned." />

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap ${
              tab === t.key ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "rules" ? <CommissionRulesSection /> : <CommissionLedgerSection />}
    </div>
  );
}

function CommissionRulesSection() {
  const { data: rules = [], isLoading, isError, refetch } = useCommissionRules();
  const updateRule = useUpdateCommissionRule();

  const [ruleModal, setRuleModal] = useState<{ mode: "create" } | { mode: "edit"; rule: CommissionRule } | null>(null);
  const [toggleTarget, setToggleTarget] = useState<CommissionRule | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-1.5" onClick={() => setRuleModal({ mode: "create" })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Rule
        </Button>
      </div>

      <Card className="p-2 sm:p-4">
        {isLoading ? (
          <SkeletonRows rows={4} className="p-4" />
        ) : isError ? (
          <ErrorState title="Couldn't load commission rules." onRetry={() => refetch()} />
        ) : rules.length === 0 ? (
          <EmptyState icon={Percent} title="No commission rules yet" description="Create a rule to start calculating partner commissions on bookings." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Partner Type", "Commission", "Project Type", "Min. Capacity", "Payment Trigger", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                    <td className="px-4 py-3 font-semibold text-navy">{PARTNER_TYPE_LABEL[rule.partnerType]}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-navy">
                          {rule.commissionType === "PERCENTAGE" ? `${rule.percent}%` : formatInr(rule.fixedAmount ?? 0)}
                        </span>
                        <span className="text-xs text-muted-foreground">{rule.commissionType === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/80">
                      {rule.applicableProjectType ? PROJECT_TYPE_LABEL[rule.applicableProjectType] : "All"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/80">
                      {rule.minSystemCapacityKw != null ? `${rule.minSystemCapacityKw} kW` : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/80">{PAYMENT_TRIGGER_LABEL[rule.paymentTrigger]}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={rule.active ? "Active" : "Inactive"} tone={rule.active ? "green" : "neutral"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setRuleModal({ mode: "edit", rule })}
                          className="flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setToggleTarget(rule)}
                          className={`flex items-center gap-1 text-xs font-semibold hover:underline ${rule.active ? "text-error" : "text-green"}`}
                        >
                          <Power className="h-3.5 w-3.5" aria-hidden="true" />
                          {rule.active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {ruleModal && (
        <CommissionRuleModal
          open
          onOpenChange={() => setRuleModal(null)}
          rule={ruleModal.mode === "edit" ? ruleModal.rule : undefined}
        />
      )}

      {toggleTarget && (
        <ConfirmDialog
          open
          onOpenChange={() => setToggleTarget(null)}
          title={toggleTarget.active ? "Deactivate This Rule?" : "Activate This Rule?"}
          description={
            toggleTarget.active
              ? "New commissions will no longer be calculated using this rule."
              : "This rule will be used again when calculating new commissions."
          }
          confirmLabel={toggleTarget.active ? "Deactivate" : "Activate"}
          destructive={toggleTarget.active}
          isLoading={updateRule.isPending}
          onConfirm={() =>
            updateRule.mutate({ id: toggleTarget.id, active: !toggleTarget.active }, { onSuccess: () => setToggleTarget(null) })
          }
        />
      )}
    </div>
  );
}

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...COMMISSION_STATUSES.map((status) => ({ value: status, label: COMMISSION_STATUS_LABEL[status] })),
];

function CommissionLedgerSection() {
  const [status, setStatus] = useState<CommissionStatus | "">("");
  const [partnerId, setPartnerId] = useState("");
  const [page, setPage] = useState(1);
  const [statusTarget, setStatusTarget] = useState<Commission | null>(null);

  const { data, isLoading, isError, refetch } = useCommissions({
    page,
    pageSize: PAGE_SIZE,
    status: status || undefined,
    partnerId: partnerId || undefined,
  });
  const commissions = data?.items ?? [];

  function updateStatusFilter(next: string) {
    setStatus(next as CommissionStatus | "");
    setPage(1);
  }

  function updatePartnerIdFilter(next: string) {
    setPartnerId(next);
    setPage(1);
  }

  const columns: DataTableColumn<Commission>[] = [
    { key: "partnerId", header: "Partner", render: (c) => <span className="font-mono text-xs text-muted-foreground">{c.partnerId}</span> },
    { key: "leadId", header: "Lead", render: (c) => <span className="font-mono text-xs text-muted-foreground">{c.leadId}</span> },
    { key: "capacity", header: "Capacity", render: (c) => <span className="text-sm text-foreground/80">{c.systemCapacityKw} kW</span> },
    { key: "booking", header: "Booking Amount", render: (c) => <span className="text-sm text-foreground/80">{formatInr(c.bookingAmount)}</span> },
    { key: "commission", header: "Commission", render: (c) => <span className="text-sm font-semibold text-navy">{formatInr(c.commissionAmount)}</span> },
    { key: "status", header: "Status", render: (c) => <CommissionStatusBadge status={c.status} /> },
    {
      key: "payment",
      header: "Payment",
      render: (c) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>{c.paymentDate ? formatDate(c.paymentDate) : "—"}</span>
          {c.paymentReference && <span className="font-mono">{c.paymentReference}</span>}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (c) => (
        <button type="button" onClick={() => setStatusTarget(c)} className="text-xs font-semibold text-navy hover:underline">
          Update Status
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <FilterSelect label="Status" value={status} options={STATUS_FILTER_OPTIONS} onChange={updateStatusFilter} className="sm:w-56" />
        <SearchInput value={partnerId} onChange={updatePartnerIdFilter} placeholder="Filter by partner ID…" className="sm:max-w-xs" />
      </Card>

      <Card className="p-2 sm:p-4">
        <DataTable
          columns={columns}
          rows={commissions}
          rowKey={(c) => c.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          emptyTitle="No commissions found"
          emptyDescription="Commissions appear here once a partner's lead is booked or completed."
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
          renderMobileCard={(c) => (
            <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{c.partnerId}</span>
                <CommissionStatusBadge status={c.status} />
              </div>
              <span className="text-lg font-bold text-navy">{formatInr(c.commissionAmount)}</span>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                <span>Booking {formatInr(c.bookingAmount)}</span>
                <span>{c.systemCapacityKw} kW</span>
                {c.paymentDate && <span>Paid {formatDate(c.paymentDate)}</span>}
              </div>
              <button type="button" onClick={() => setStatusTarget(c)} className="mt-1 self-start text-xs font-semibold text-navy hover:underline">
                Update Status
              </button>
            </div>
          )}
        />
      </Card>

      {statusTarget && (
        <UpdateCommissionStatusModal open onOpenChange={() => setStatusTarget(null)} commission={statusTarget} />
      )}
    </div>
  );
}

