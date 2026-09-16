import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/features/crm/hooks/authContext";
import { Modal } from "@/features/crm/components/Modal";
import { useCreateFollowUp } from "@/features/followups/hooks/useFollowUpMutations";
import { followUpSchema, type FollowUpFormValues } from "@/features/followups/schemas/followUp.schema";
import type { Lead } from "@/features/leads/types/lead";

interface CreateFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

const FORM_ID = "create-follow-up-form";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CreateFollowUpModal({ open, onOpenChange, lead }: CreateFollowUpModalProps) {
  const { user } = useAuth();
  const createFollowUp = useCreateFollowUp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema),
    defaultValues: { type: "CALL", date: todayIso(), time: "11:00", priority: "MEDIUM", notes: "" },
  });

  function onSubmit(values: FollowUpFormValues) {
    createFollowUp.mutate(
      {
        leadId: lead.id,
        customerName: lead.customer.fullName,
        assignedEmployeeId: lead.assignedEmployeeId ?? user?.id ?? "",
        type: values.type,
        date: values.date,
        time: values.time,
        priority: values.priority,
        notes: values.notes,
        createdBy: user?.name ?? "System",
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
      title="Add Follow-up"
      description={`${lead.customer.fullName} · ${lead.leadId}`}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={createFollowUp.isPending}>
            {createFollowUp.isPending ? "Saving…" : "Save Follow-up"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="type">Follow-up Type</Label>
          <select id="type" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("type")}>
            <option value="CALL">Call</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="EMAIL">Email</option>
            <option value="MEETING">Meeting</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date">Date</Label>
            <input
              id="date"
              type="date"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("date")}
            />
            {errors.date && <p className="mt-1.5 text-xs text-error">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <input
              id="time"
              type="time"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("time")}
            />
            {errors.time && <p className="mt-1.5 text-xs text-error">{errors.time.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <select id="priority" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("priority")}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" rows={3} {...register("notes")} />
        </div>

        {createFollowUp.isError && <p className="text-sm text-error">Couldn't save this follow-up. Please try again.</p>}
      </form>
    </Modal>
  );
}
