import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useUpdateEmployee } from "@/features/employees/hooks/useEmployeeMutations";
import { editEmployeeSchema, type EditEmployeeFormValues } from "@/features/employees/schemas/employee.schema";
import { EMPLOYEE_ROLE_LABEL, type Employee } from "@/features/employees/types/employee";
import { ApiError } from "@/services/apiClient";

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
}

const FORM_ID = "edit-employee-form";

export function EditEmployeeModal({ open, onOpenChange, employee }: EditEmployeeModalProps) {
  const updateEmployee = useUpdateEmployee();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: { name: employee.name, phone: employee.phone, role: employee.role },
  });

  function onSubmit(values: EditEmployeeFormValues) {
    updateEmployee.mutate({ id: employee.id, ...values }, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Employee"
      description={employee.email}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={updateEmployee.isPending}>
            {updateEmployee.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="edit-name">Full Name</Label>
          <Input id="edit-name" invalid={!!errors.name} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="edit-phone">Phone</Label>
          <Input id="edit-phone" type="tel" invalid={!!errors.phone} {...register("phone")} />
          {errors.phone && <p className="mt-1.5 text-xs text-error">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="edit-role">Role</Label>
          <select id="edit-role" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("role")}>
            {(["ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "SURVEY_ENGINEER"] as const).map((role) => (
              <option key={role} value={role}>
                {EMPLOYEE_ROLE_LABEL[role]}
              </option>
            ))}
          </select>
        </div>

        {updateEmployee.isError && (
          <p className="text-sm text-error">
            {updateEmployee.error instanceof ApiError ? updateEmployee.error.message : "Couldn't save these changes. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
