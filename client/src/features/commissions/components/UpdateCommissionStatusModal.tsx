import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useUpdateCommissionStatus } from "@/features/commissions/hooks/useCommissionMutations";
import { COMMISSION_STATUSES, COMMISSION_STATUS_LABEL, type Commission } from "@/features/commissions/types/commission";
import { ApiError } from "@/services/apiClient";

interface UpdateCommissionStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commission: Commission;
}

const FORM_ID = "update-commission-status-form";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const updateStatusSchema = z.object({
  status: z.enum(COMMISSION_STATUSES, { message: "Select a status." }),
  paymentDate: z.string().trim().optional(),
  paymentReference: z.string().trim().optional(),
});
type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

export function UpdateCommissionStatusModal({ open, onOpenChange, commission }: UpdateCommissionStatusModalProps) {
  const updateStatus = useUpdateCommissionStatus();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateStatusFormValues>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: commission.status,
      paymentDate: commission.paymentDate ? commission.paymentDate.slice(0, 10) : todayIso(),
      paymentReference: commission.paymentReference ?? "",
    },
  });

  const status = watch("status");
  const isPaid = status === "PAID";

  function onSubmit(values: UpdateStatusFormValues) {
    updateStatus.mutate(
      {
        id: commission.id,
        status: values.status,
        paymentDate: isPaid && values.paymentDate ? values.paymentDate : undefined,
        paymentReference: isPaid && values.paymentReference ? values.paymentReference : undefined,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Update Commission Status"
      description={`Commission of ₹${commission.commissionAmount.toLocaleString("en-IN")} for partner ${commission.partnerId}`}
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={updateStatus.isPending}>
            {updateStatus.isPending ? "Saving…" : "Update Status"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="status-select">Status</Label>
          <select
            id="status-select"
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
            {...register("status")}
          >
            {COMMISSION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {COMMISSION_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          {errors.status && <p className="mt-1.5 text-xs text-error">{errors.status.message}</p>}
        </div>

        {isPaid && (
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface-muted/50 p-3">
            <div>
              <Label htmlFor="status-paymentDate">Payment Date</Label>
              <Input id="status-paymentDate" type="date" {...register("paymentDate")} />
            </div>
            <div>
              <Label htmlFor="status-paymentReference">Payment Reference (optional)</Label>
              <Input id="status-paymentReference" placeholder="e.g. UTR / transaction ID" {...register("paymentReference")} />
            </div>
          </div>
        )}

        {updateStatus.isError && (
          <p className="text-sm text-error">
            {updateStatus.error instanceof ApiError ? updateStatus.error.message : "Couldn't update this commission's status. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
