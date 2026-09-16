import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useUpdateProduct } from "@/features/products/hooks/useProductMutations";
import { editProductSchema, type EditProductFormValues } from "@/features/products/schemas/product.schema";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABEL, PRODUCT_UNITS, PRODUCT_UNIT_LABEL, type Product } from "@/features/products/types/product";
import { ApiError } from "@/services/apiClient";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

const FORM_ID = "edit-product-form";

export function EditProductModal({ open, onOpenChange, product }: EditProductModalProps) {
  const updateProduct = useUpdateProduct();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      sku: product.sku,
      name: product.name,
      category: product.category,
      unitPrice: product.unitPrice,
      unit: product.unit,
      description: product.description,
    },
  });

  function onSubmit(values: EditProductFormValues) {
    updateProduct.mutate({ id: product.id, ...values }, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Product"
      description={product.sku}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={updateProduct.isPending}>
            {updateProduct.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="edit-sku">SKU</Label>
          <Input id="edit-sku" invalid={!!errors.sku} {...register("sku")} />
          {errors.sku && <p className="mt-1.5 text-xs text-error">{errors.sku.message}</p>}
        </div>

        <div>
          <Label htmlFor="edit-name">Name</Label>
          <Input id="edit-name" invalid={!!errors.name} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-category">Category</Label>
            <select id="edit-category" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("category")}>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {PRODUCT_CATEGORY_LABEL[category]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="edit-unit">Unit</Label>
            <select id="edit-unit" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("unit")}>
              {PRODUCT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {PRODUCT_UNIT_LABEL[unit]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="edit-unitPrice">Unit Price (₹)</Label>
          <Input id="edit-unitPrice" type="number" step="1" invalid={!!errors.unitPrice} {...register("unitPrice", { valueAsNumber: true })} />
          {errors.unitPrice && <p className="mt-1.5 text-xs text-error">{errors.unitPrice.message}</p>}
        </div>

        <div>
          <Label htmlFor="edit-description">Description (optional)</Label>
          <Input id="edit-description" {...register("description")} />
        </div>

        {updateProduct.isError && (
          <p className="text-sm text-error">
            {updateProduct.error instanceof ApiError ? updateProduct.error.message : "Couldn't save these changes. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
