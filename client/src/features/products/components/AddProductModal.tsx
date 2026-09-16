import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useCreateProduct } from "@/features/products/hooks/useProductMutations";
import { createProductSchema, type CreateProductFormValues } from "@/features/products/schemas/product.schema";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABEL, PRODUCT_UNITS, PRODUCT_UNIT_LABEL } from "@/features/products/types/product";
import { ApiError } from "@/services/apiClient";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "add-product-form";

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const createProduct = useCreateProduct();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductFormValues>({ resolver: zodResolver(createProductSchema), defaultValues: { category: "PANEL", unit: "PIECE" } });

  function onSubmit(values: CreateProductFormValues) {
    createProduct.mutate(values, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Product"
      description="Adds an item to the catalog used when building quotations."
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={createProduct.isPending}>
            {createProduct.isPending ? "Creating…" : "Create Product"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" invalid={!!errors.sku} {...register("sku")} />
          {errors.sku && <p className="mt-1.5 text-xs text-error">{errors.sku.message}</p>}
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" invalid={!!errors.name} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="category">Category</Label>
            <select id="category" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("category")}>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {PRODUCT_CATEGORY_LABEL[category]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <select id="unit" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("unit")}>
              {PRODUCT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {PRODUCT_UNIT_LABEL[unit]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="unitPrice">Unit Price (₹)</Label>
          <Input id="unitPrice" type="number" step="1" invalid={!!errors.unitPrice} {...register("unitPrice", { valueAsNumber: true })} />
          {errors.unitPrice && <p className="mt-1.5 text-xs text-error">{errors.unitPrice.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Input id="description" {...register("description")} />
        </div>

        {createProduct.isError && (
          <p className="text-sm text-error">
            {createProduct.error instanceof ApiError ? createProduct.error.message : "Couldn't create this product. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
