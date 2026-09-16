import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/features/crm/hooks/authContext";
import { Modal } from "@/features/crm/components/Modal";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import { useAssignLead } from "@/features/leads/hooks/useLeadMutations";
import { assignLeadSchema, type AssignLeadFormValues } from "@/features/leads/schemas/assignLead.schema";
import type { Lead } from "@/features/leads/types/lead";

interface AssignLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

const FORM_ID = "assign-lead-form";

export function AssignLeadModal({ open, onOpenChange, lead }: AssignLeadModalProps) {
  const { data: employees = [] } = useEmployees();
  const { user } = useAuth();
  const assignMutation = useAssignLead();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignLeadFormValues>({
    resolver: zodResolver(assignLeadSchema),
    defaultValues: { employeeId: lead.assignedEmployeeId ?? "", priority: lead.priority },
  });

  const assignableEmployees = employees.filter((e) => e.status === "ACTIVE" && e.role !== "ADMIN");

  function onSubmit(values: AssignLeadFormValues) {
    assignMutation.mutate(
      { leadId: lead.id, employeeId: values.employeeId, priority: values.priority, actorName: user?.name ?? "Admin User" },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Lead"
      description={lead.customer.fullName}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={assignMutation.isPending}>
            {assignMutation.isPending ? "Assigning…" : "Assign Lead"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="employeeId">Assign To</Label>
          <select
            id="employeeId"
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
            {...register("employeeId")}
          >
            <option value="">Select an employee</option>
            {assignableEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          {errors.employeeId && <p className="mt-1.5 text-xs text-error">{errors.employeeId.message}</p>}
        </div>

        <div>
          <Label htmlFor="priority">Priority (optional)</Label>
          <select
            id="priority"
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
            {...register("priority")}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {assignMutation.isError && <p className="text-sm text-error">Couldn't assign this lead. Please try again.</p>}
      </form>
    </Modal>
  );
}
