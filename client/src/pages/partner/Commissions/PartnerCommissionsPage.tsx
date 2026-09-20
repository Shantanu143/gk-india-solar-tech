import { useState } from "react";
import { ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Seo } from "@/components/layout/Seo";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { CommissionStatusBadge } from "@/features/commissions/components/CommissionStatusBadge";
import { useMyCommissions } from "@/features/commissions/hooks/useMyCommissions";
import { formatDate } from "@/lib/format";

const PAGE_SIZE = 20;

export function PartnerCommissionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMyCommissions({ page, pageSize: PAGE_SIZE });

  const commissions = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-5">
      <Seo
        title="My Commissions | GK India SolarTech Partner Portal"
        description="Track commissions earned on your referred bookings."
        path={CRM_ROUTES.partnerCommissions}
        noindex
      />
      <PageHeader title="My Commissions" description="Every commission earned on your bookings, and where each one stands." />

      {isLoading ? (
        <Card className="p-2 sm:p-4">
          <SkeletonRows rows={5} className="p-4" />
        </Card>
      ) : isError ? (
        <Card className="p-2 sm:p-4">
          <ErrorState title="Couldn't load your commissions." onRetry={() => refetch()} />
        </Card>
      ) : commissions.length === 0 ? (
        <Card className="p-2 sm:p-4">
          <EmptyState
            icon={Wallet}
            title="No commissions yet"
            description="Commissions show up here once one of your referred leads is booked."
          />
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {commissions.map((commission) => (
              <Card key={commission.id} className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl font-bold text-navy">₹{commission.commissionAmount.toLocaleString("en-IN")}</span>
                  <CommissionStatusBadge status={commission.status} />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-foreground/80">
                  <div>
                    <p className="text-xs text-muted-foreground">Booking Amount</p>
                    <p className="font-medium">₹{commission.bookingAmount.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">System Capacity</p>
                    <p className="font-medium">{commission.systemCapacityKw} kW</p>
                  </div>
                  {commission.paymentDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Date</p>
                      <p className="font-medium">{formatDate(commission.paymentDate)}</p>
                    </div>
                  )}
                  {commission.paymentReference && (
                    <div>
                      <p className="text-xs text-muted-foreground">Reference</p>
                      <p className="font-mono text-xs font-medium">{commission.paymentReference}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages} · {total} total
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
