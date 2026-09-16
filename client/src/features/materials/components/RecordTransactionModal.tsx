import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useRecordTransaction } from "@/features/materials/hooks/useMaterialMutations";
import { recordTransactionSchema, type RecordTransactionFormValues } from "@/features/materials/schemas/material.schema";
import { INVENTORY_TRANSACTION_TYPES, INVENTORY_TRANSACTION_TYPE_LABEL, type Material } from "@/features/materials/types/material";
import { ApiError } from "@/services/apiClient";

interface RecordTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material;
}

const FORM_ID = "record-transaction-form";

export function RecordTransactionModal({ open, onOpenChange, material }: RecordTransactionModalProps) {
  const recordTransaction = useRecordTransaction();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RecordTransactionFormValues>({
    resolver: zodResolver(recordTransactionSchema),
    defaultValues: { type: "IN", note: "" },
  });

  const selectedType = watch("type");

  function onSubmit(values: RecordTransactionFormValues) {
    recordTransaction.mutate(
      { materialId: material.id, ...values },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset({ type: "IN", note: "" });
        },
      },
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Record Stock Movement"
      description={`${material.name} · Currently ${material.quantityInStock} ${material.unit.toLowerCase()} in stock`}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={recordTransaction.isPending}>
            {recordTransaction.isPending ? "Saving…" : "Record"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="transaction-type">Movement Type</Label>
          <select
            id="transaction-type"
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
            {...register("type")}
          >
            {INVENTORY_TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {INVENTORY_TRANSACTION_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
          {selectedType === "OUT" && (
            <p className="mt-1.5 text-xs text-muted-foreground">To correct an overcount, record an OUT with an explanatory note.</p>
          )}
        </div>

        <div>
          <Label htmlFor="transaction-quantity">Quantity</Label>
          <Input id="transaction-quantity" type="number" step="1" invalid={!!errors.quantity} {...register("quantity", { valueAsNumber: true })} />
          {errors.quantity && <p className="mt-1.5 text-xs text-error">{errors.quantity.message}</p>}
        </div>

        <div>
          <Label htmlFor="transaction-note">Note (optional)</Label>
          <Input id="transaction-note" {...register("note")} placeholder="e.g. Dispatched to GK-PRJ-2026-00004" />
        </div>

        {recordTransaction.isError && (
          <p className="text-sm text-error">
            {recordTransaction.error instanceof ApiError ? recordTransaction.error.message : "Couldn't record this transaction. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
