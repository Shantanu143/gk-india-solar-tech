import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useUpdateMaterial } from "@/features/materials/hooks/useMaterialMutations";
import { editMaterialSchema, type EditMaterialFormValues } from "@/features/materials/schemas/material.schema";
import { MATERIAL_CATEGORIES, MATERIAL_CATEGORY_LABEL, MATERIAL_UNITS, MATERIAL_UNIT_LABEL, type Material } from "@/features/materials/types/material";
import { ApiError } from "@/services/apiClient";

interface EditMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material;
}

const FORM_ID = "edit-material-form";

export function EditMaterialModal({ open, onOpenChange, material }: EditMaterialModalProps) {
  const updateMaterial = useUpdateMaterial();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditMaterialFormValues>({
    resolver: zodResolver(editMaterialSchema),
    defaultValues: {
      sku: material.sku,
      name: material.name,
      category: material.category,
      unit: material.unit,
      reorderLevel: material.reorderLevel,
      unitCost: material.unitCost,
    },
  });

  function onSubmit(values: EditMaterialFormValues) {
    updateMaterial.mutate({ id: material.id, ...values }, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Material"
      description={material.sku}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={updateMaterial.isPending}>
            {updateMaterial.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="edit-material-sku">SKU</Label>
          <Input id="edit-material-sku" invalid={!!errors.sku} {...register("sku")} />
          {errors.sku && <p className="mt-1.5 text-xs text-error">{errors.sku.message}</p>}
        </div>

        <div>
          <Label htmlFor="edit-material-name">Name</Label>
          <Input id="edit-material-name" invalid={!!errors.name} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-material-category">Category</Label>
            <select
              id="edit-material-category"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("category")}
            >
              {MATERIAL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {MATERIAL_CATEGORY_LABEL[category]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="edit-material-unit">Unit</Label>
            <select id="edit-material-unit" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("unit")}>
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
            <Label htmlFor="edit-material-cost">Unit Cost (₹)</Label>
            <Input id="edit-material-cost" type="number" step="1" invalid={!!errors.unitCost} {...register("unitCost", { valueAsNumber: true })} />
            {errors.unitCost && <p className="mt-1.5 text-xs text-error">{errors.unitCost.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-material-reorder">Reorder Level</Label>
            <Input
              id="edit-material-reorder"
              type="number"
              step="1"
              invalid={!!errors.reorderLevel}
              {...register("reorderLevel", { valueAsNumber: true })}
            />
            {errors.reorderLevel && <p className="mt-1.5 text-xs text-error">{errors.reorderLevel.message}</p>}
          </div>
        </div>

        {updateMaterial.isError && (
          <p className="text-sm text-error">
            {updateMaterial.error instanceof ApiError ? updateMaterial.error.message : "Couldn't save these changes. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
