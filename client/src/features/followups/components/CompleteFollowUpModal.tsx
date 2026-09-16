import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/features/crm/hooks/authContext";
import { Modal } from "@/features/crm/components/Modal";
import { useCompleteFollowUp } from "@/features/followups/hooks/useFollowUpMutations";
import { completeFollowUpSchema, type CompleteFollowUpFormValues } from "@/features/followups/schemas/followUp.schema";
import type { FollowUp } from "@/features/followups/types/followUp";

interface CompleteFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followUp: FollowUp;
}

const FORM_ID = "complete-follow-up-form";

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function CompleteFollowUpModal({ open, onOpenChange, followUp }: CompleteFollowUpModalProps) {
  const { user } = useAuth();
  const completeFollowUp = useCompleteFollowUp();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CompleteFollowUpFormValues>({
    resolver: zodResolver(completeFollowUpSchema),
    defaultValues: {
      outcome: "",
      scheduleNext: false,
      nextDate: tomorrowIso(),
      nextTime: "11:00",
      nextType: followUp.type,
      nextPriority: followUp.priority,
      nextNotes: "",
    },
  });

  const scheduleNext = watch("scheduleNext");

  function onSubmit(values: CompleteFollowUpFormValues) {
    completeFollowUp.mutate(
      {
        id: followUp.id,
        outcome: values.outcome,
        actorName: user?.name ?? "System",
        scheduleNext: values.scheduleNext
          ? {
              date: values.nextDate!,
              time: values.nextTime!,
              type: values.nextType ?? followUp.type,
              priority: values.nextPriority ?? followUp.priority,
              notes: values.nextNotes,
            }
          : undefined,
      },
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
      title="Complete Follow-up"
      description={followUp.customerName}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={completeFollowUp.isPending}>
            {completeFollowUp.isPending ? "Saving…" : scheduleNext ? "Save & Schedule Next" : "Complete Follow-up"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="outcome">Outcome</Label>
          <Textarea
            id="outcome"
            rows={3}
            placeholder="Customer interested. Wants a proposal after site survey."
            invalid={!!errors.outcome}
            {...register("outcome")}
          />
          {errors.outcome && <p className="mt-1.5 text-xs text-error">{errors.outcome.message}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-navy">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-orange" {...register("scheduleNext")} />
          Schedule next follow-up
        </label>

        {scheduleNext && (
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface-muted/50 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="nextDate">Next Date</Label>
                <input
                  id="nextDate"
                  type="date"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
                  {...register("nextDate")}
                />
                {errors.nextDate && <p className="mt-1.5 text-xs text-error">{errors.nextDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="nextTime">Next Time</Label>
                <input
                  id="nextTime"
                  type="time"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
                  {...register("nextTime")}
                />
                {errors.nextTime && <p className="mt-1.5 text-xs text-error">{errors.nextTime.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="nextType">Next Follow-up Type</Label>
              <select
                id="nextType"
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
                {...register("nextType")}
              >
                <option value="CALL">Call</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Meeting</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        )}

        {completeFollowUp.isError && <p className="text-sm text-error">Couldn't save this follow-up. Please try again.</p>}
      </form>
    </Modal>
  );
}
