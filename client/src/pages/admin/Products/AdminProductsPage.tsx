import { useState } from "react";
import { Boxes, Pencil, Power, Plus } from "lucide-react";
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
import { AddProductModal } from "@/features/products/components/AddProductModal";
import { EditProductModal } from "@/features/products/components/EditProductModal";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useSetProductStatus } from "@/features/products/hooks/useProductMutations";
import { PRODUCT_CATEGORY_LABEL, PRODUCT_UNIT_LABEL, type Product } from "@/features/products/types/product";
import { formatInr } from "@/lib/format";

export function AdminProductsPage() {
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const setStatus = useSetProductStatus();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [statusTarget, setStatusTarget] = useState<Product | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Products | GK India SolarTech CRM" description="Internal product catalog." path={CRM_ROUTES.adminProducts} noindex />
      <PageHeader
        title="Products"
        description="The catalog quotations draw their line items from."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Product
          </Button>
        }
      />

      <Card className="p-2 sm:p-4">
        {isLoading ? (
          <SkeletonRows rows={5} className="p-4" />
        ) : isError ? (
          <ErrorState title="Couldn't load products." onRetry={() => refetch()} />
        ) : products.length === 0 ? (
          <EmptyState icon={Boxes} title="No products yet" description="Add panels, inverters, and structures to build quotations from." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["SKU", "Name", "Category", "Unit Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{product.sku}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-navy">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/80">{PRODUCT_CATEGORY_LABEL[product.category]}</td>
                    <td className="px-4 py-3 text-sm text-foreground/80">
                      {formatInr(product.unitPrice)} / {PRODUCT_UNIT_LABEL[product.unit]}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={product.status === "ACTIVE" ? "Active" : "Inactive"}
                        tone={product.status === "ACTIVE" ? "green" : "neutral"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditTarget(product)}
                          className="flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusTarget(product)}
                          className={`flex items-center gap-1 text-xs font-semibold hover:underline ${product.status === "ACTIVE" ? "text-error" : "text-green"}`}
                        >
                          <Power className="h-3.5 w-3.5" aria-hidden="true" />
                          {product.status === "ACTIVE" ? "Deactivate" : "Activate"}
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

      <AddProductModal open={addOpen} onOpenChange={setAddOpen} />

      {editTarget && <EditProductModal open onOpenChange={() => setEditTarget(null)} product={editTarget} />}

      {statusTarget && (
        <ConfirmDialog
          open
          onOpenChange={() => setStatusTarget(null)}
          title={statusTarget.status === "ACTIVE" ? "Deactivate This Product?" : "Activate This Product?"}
          description={
            statusTarget.status === "ACTIVE"
              ? `${statusTarget.name} will no longer appear when building new quotations.`
              : `${statusTarget.name} will be available again when building quotations.`
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
