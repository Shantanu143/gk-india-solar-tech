import { useState } from "react";
import { ArrowLeftRight, Package, Pencil, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Seo } from "@/components/layout/Seo";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { ConfirmDialog } from "@/features/crm/components/ConfirmDialog";
import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { AddMaterialModal } from "@/features/materials/components/AddMaterialModal";
import { EditMaterialModal } from "@/features/materials/components/EditMaterialModal";
import { RecordTransactionModal } from "@/features/materials/components/RecordTransactionModal";
import { useMaterials } from "@/features/materials/hooks/useMaterials";
import { useSetMaterialStatus } from "@/features/materials/hooks/useMaterialMutations";
import { MATERIAL_CATEGORY_LABEL, MATERIAL_UNIT_LABEL, type Material } from "@/features/materials/types/material";
import { formatInr } from "@/lib/format";

export function AdminMaterialsPage() {
  const { data: materials = [], isLoading, isError, refetch } = useMaterials();
  const setStatus = useSetMaterialStatus();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Material | null>(null);
  const [statusTarget, setStatusTarget] = useState<Material | null>(null);
  const [transactionTarget, setTransactionTarget] = useState<Material | null>(null);

  const lowStockCount = materials.filter((m) => m.lowStock).length;

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Materials | GK India SolarTech CRM" description="Internal material stock ledger." path={CRM_ROUTES.adminMaterials} noindex />
      <PageHeader
        title="Materials"
        description={lowStockCount > 0 ? `${lowStockCount} item${lowStockCount === 1 ? "" : "s"} at or below reorder level.` : "Stock levels across all tracked materials."}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Material
          </Button>
        }
      />

      <Card className="p-2 sm:p-4">
        {isLoading ? (
          <SkeletonRows rows={5} className="p-4" />
        ) : isError ? (
          <ErrorState title="Couldn't load materials." onRetry={() => refetch()} />
        ) : materials.length === 0 ? (
          <EmptyState icon={Package} title="No materials yet" description="Add panels, inverters, and other stock items to start tracking inventory." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["SKU", "Name", "Category", "In Stock", "Unit Cost", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{material.sku}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-navy">{material.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/80">{MATERIAL_CATEGORY_LABEL[material.category]}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground/80">
                          {material.quantityInStock} {MATERIAL_UNIT_LABEL[material.unit]}
                        </span>
                        {material.lowStock && <StatusBadge label="Low Stock" tone="red" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/80">{formatInr(material.unitCost)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={material.status === "ACTIVE" ? "Active" : "Inactive"}
                        tone={material.status === "ACTIVE" ? "green" : "neutral"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setTransactionTarget(material)}
                          className="flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                        >
                          <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
                          Stock
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditTarget(material)}
                          className="flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusTarget(material)}
                          className={`flex items-center gap-1 text-xs font-semibold hover:underline ${material.status === "ACTIVE" ? "text-error" : "text-green"}`}
                        >
                          <Power className="h-3.5 w-3.5" aria-hidden="true" />
                          {material.status === "ACTIVE" ? "Deactivate" : "Activate"}
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

      <AddMaterialModal open={addOpen} onOpenChange={setAddOpen} />

      {editTarget && <EditMaterialModal open onOpenChange={() => setEditTarget(null)} material={editTarget} />}

      {transactionTarget && <RecordTransactionModal open onOpenChange={() => setTransactionTarget(null)} material={transactionTarget} />}

      {statusTarget && (
        <ConfirmDialog
          open
          onOpenChange={() => setStatusTarget(null)}
          title={statusTarget.status === "ACTIVE" ? "Deactivate This Material?" : "Activate This Material?"}
          description={
            statusTarget.status === "ACTIVE"
              ? `${statusTarget.name} will no longer appear when recording new stock movements.`
              : `${statusTarget.name} will be available again for stock movements.`
          }
          confirmLabel={statusTarget.status === "ACTIVE" ? "Deactivate" : "Activate"}
          destructive={statusTarget.status === "ACTIVE"}
          isLoading={setStatus.isPending}
          onConfirm={() =>
            setStatus.mutate(
              { id: statusTarget.id, status: statusTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
              { onSuccess: () => setStatusTarget(null) },
            )
          }
        />
      )}
    </div>
  );
}
