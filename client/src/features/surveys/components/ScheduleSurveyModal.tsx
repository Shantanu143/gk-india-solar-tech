import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/features/crm/hooks/authContext";
import { Modal } from "@/features/crm/components/Modal";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import type { Lead } from "@/features/leads/types/lead";
import { useScheduleSurvey } from "@/features/surveys/hooks/useSurveyMutations";
import { scheduleSurveySchema, type ScheduleSurveyFormValues } from "@/features/surveys/schemas/survey.schema";

interface ScheduleSurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

const FORM_ID = "schedule-survey-form";

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function ScheduleSurveyModal({ open, onOpenChange, lead }: ScheduleSurveyModalProps) {
  const { user } = useAuth();
  const { data: employees = [] } = useEmployees();
  const scheduleSurvey = useScheduleSurvey();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleSurveyFormValues>({
    resolver: zodResolver(scheduleSurveySchema),
    defaultValues: { date: tomorrowIso(), time: "11:00", engineerId: "" },
  });

  const engineers = employees.filter((e) => e.role === "SURVEY_ENGINEER" && e.status === "ACTIVE");

  function onSubmit(values: ScheduleSurveyFormValues) {
    scheduleSurvey.mutate(
      { leadId: lead.id, date: values.date, time: values.time, engineerId: values.engineerId, actorName: user?.name ?? "System" },
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
      title="Schedule Site Survey"
      description={`${lead.customer.fullName} · ${lead.leadId}`}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={scheduleSurvey.isPending}>
            {scheduleSurvey.isPending ? "Scheduling…" : "Schedule"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label>Customer</Label>
          <p className="text-sm text-foreground/80">{lead.customer.fullName} · {lead.customer.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="survey-date">Survey Date</Label>
            <input
              id="survey-date"
              type="date"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("date")}
            />
            {errors.date && <p className="mt-1.5 text-xs text-error">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="survey-time">Time</Label>
            <input
              id="survey-time"
              type="time"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("time")}
            />
            {errors.time && <p className="mt-1.5 text-xs text-error">{errors.time.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="engineerId">Survey Engineer</Label>
          <select
            id="engineerId"
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
            {...register("engineerId")}
          >
            <option value="">Select an engineer</option>
            {engineers.map((engineer) => (
              <option key={engineer.id} value={engineer.id}>
                {engineer.name}
              </option>
            ))}
          </select>
          {errors.engineerId && <p className="mt-1.5 text-xs text-error">{errors.engineerId.message}</p>}
        </div>

        {scheduleSurvey.isError && <p className="text-sm text-error">Couldn't schedule this survey. Please try again.</p>}
      </form>
    </Modal>
  );
}
