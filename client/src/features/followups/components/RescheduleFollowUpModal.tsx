import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/crm/hooks/authContext";
import { Modal } from "@/features/crm/components/Modal";
import { useRescheduleFollowUp } from "@/features/followups/hooks/useFollowUpMutations";
import { rescheduleFollowUpSchema, type RescheduleFollowUpFormValues } from "@/features/followups/schemas/followUp.schema";
import type { FollowUp } from "@/features/followups/types/followUp";

interface RescheduleFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followUp: FollowUp;
}

const FORM_ID = "reschedule-follow-up-form";

export function RescheduleFollowUpModal({ open, onOpenChange, followUp }: RescheduleFollowUpModalProps) {
  const { user } = useAuth();
  const reschedule = useRescheduleFollowUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RescheduleFollowUpFormValues>({
    resolver: zodResolver(rescheduleFollowUpSchema),
    defaultValues: { date: followUp.date, time: followUp.time, reason: "" },
  });

  function onSubmit(values: RescheduleFollowUpFormValues) {
    reschedule.mutate(
      { id: followUp.id, date: values.date, time: values.time, reason: values.reason, actorName: user?.name ?? "System" },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Reschedule Follow-up"
      description={followUp.customerName}
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={reschedule.isPending}>
            {reschedule.isPending ? "Saving…" : "Reschedule"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date">New Date</Label>
            <input id="date" type="date" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("date")} />
            {errors.date && <p className="mt-1.5 text-xs text-error">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="time">New Time</Label>
            <input id="time" type="time" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("time")} />
            {errors.time && <p className="mt-1.5 text-xs text-error">{errors.time.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="reason">Reason (optional)</Label>
          <Input id="reason" placeholder="Customer requested a different time" {...register("reason")} />
        </div>
        {reschedule.isError && <p className="text-sm text-error">Couldn't reschedule this follow-up. Please try again.</p>}
      </form>
    </Modal>
  );
}
