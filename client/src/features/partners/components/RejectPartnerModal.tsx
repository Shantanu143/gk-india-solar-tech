import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/features/crm/components/Modal";
import { useSetPartnerStatus } from "@/features/partners/hooks/useAdminPartnerMutations";
import { rejectPartnerSchema, type RejectPartnerFormValues } from "@/features/partners/schemas/partnerStatus.schema";
import type { Partner } from "@/features/partners/types/partner";
import { ApiError } from "@/services/apiClient";

interface RejectPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner;
}

const FORM_ID = "reject-partner-form";

/** Rejecting requires a reason (enforced server-side too), so this can't reuse the plain `ConfirmDialog`. */
export function RejectPartnerModal({ open, onOpenChange, partner }: RejectPartnerModalProps) {
  const setStatus = useSetPartnerStatus();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectPartnerFormValues>({ resolver: zodResolver(rejectPartnerSchema) });

  function onSubmit(values: RejectPartnerFormValues) {
    setStatus.mutate(
      { id: partner.id, status: "REJECTED", rejectionReason: values.rejectionReason },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      },
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Reject This Application?"
      description={`${partner.name} will be notified that their partner application was not approved.`}
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={setStatus.isPending} className="bg-error hover:bg-error/90">
            {setStatus.isPending ? "Rejecting…" : "Reject Application"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="rejectionReason">Reason for Rejection</Label>
          <Textarea
            id="rejectionReason"
            rows={4}
            invalid={!!errors.rejectionReason}
            placeholder="Explain why this application is being rejected…"
            {...register("rejectionReason")}
          />
          {errors.rejectionReason && <p className="mt-1.5 text-xs text-error">{errors.rejectionReason.message}</p>}
        </div>

        {setStatus.isError && (
          <p className="text-sm text-error">
            {setStatus.error instanceof ApiError ? setStatus.error.message : "Couldn't reject this application. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
