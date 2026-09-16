import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useCreateMaterial } from "@/features/materials/hooks/useMaterialMutations";
import { createMaterialSchema, type CreateMaterialFormValues } from "@/features/materials/schemas/material.schema";
import { MATERIAL_CATEGORIES, MATERIAL_CATEGORY_LABEL, MATERIAL_UNITS, MATERIAL_UNIT_LABEL } from "@/features/materials/types/material";
import { ApiError } from "@/services/apiClient";

interface AddMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "add-material-form";

export function AddMaterialModal({ open, onOpenChange }: AddMaterialModalProps) {
  const createMaterial = useCreateMaterial();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMaterialFormValues>({ resolver: zodResolver(createMaterialSchema), defaultValues: { category: "PANEL", unit: "PIECE" } });

  function onSubmit(values: CreateMaterialFormValues) {
    createMaterial.mutate(values, {
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
      title="Add Material"
      description="Adds an item to the stock ledger."
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={createMaterial.isPending}>
            {createMaterial.isPending ? "Creating…" : "Create Material"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="material-sku">SKU</Label>
          <Input id="material-sku" invalid={!!errors.sku} {...register("sku")} />
          {errors.sku && <p className="mt-1.5 text-xs text-error">{errors.sku.message}</p>}
        </div>

        <div>
          <Label htmlFor="material-name">Name</Label>
          <Input id="material-name" invalid={!!errors.name} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="material-category">Category</Label>
            <select id="material-category" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("category")}>
              {MATERIAL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {MATERIAL_CATEGORY_LABEL[category]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="material-unit">Unit</Label>
            <select id="material-unit" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("unit")}>
              {MATERIAL_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {MATERIAL_UNIT_LABEL[unit]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="material-cost">Unit Cost (₹)</Label>
            <Input id="material-cost" type="number" step="1" invalid={!!errors.unitCost} {...register("unitCost", { valueAsNumber: true })} />
            {errors.unitCost && <p className="mt-1.5 text-xs text-error">{errors.unitCost.message}</p>}
          </div>
          <div>
            <Label htmlFor="material-reorder">Reorder Level</Label>
            <Input id="material-reorder" type="number" step="1" invalid={!!errors.reorderLevel} {...register("reorderLevel", { valueAsNumber: true })} />
            {errors.reorderLevel && <p className="mt-1.5 text-xs text-error">{errors.reorderLevel.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="material-quantity">Opening Stock</Label>
          <Input id="material-quantity" type="number" step="1" {...register("quantityInStock", { valueAsNumber: true })} />
        </div>

        {createMaterial.isError && (
          <p className="text-sm text-error">
            {createMaterial.error instanceof ApiError ? createMaterial.error.message : "Couldn't create this material. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
