import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useCreateEmployee } from "@/features/employees/hooks/useEmployeeMutations";
import { createEmployeeSchema, type CreateEmployeeFormValues } from "@/features/employees/schemas/employee.schema";
import { EMPLOYEE_ROLE_LABEL } from "@/features/employees/types/employee";
import { ApiError } from "@/services/apiClient";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "add-employee-form";

export function AddEmployeeModal({ open, onOpenChange }: AddEmployeeModalProps) {
  const createEmployee = useCreateEmployee();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeFormValues>({ resolver: zodResolver(createEmployeeSchema), defaultValues: { role: "SALES_EXECUTIVE" } });

  function onSubmit(values: CreateEmployeeFormValues) {
    createEmployee.mutate(values, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Employee"
      description="Creates a real account this employee can sign in with immediately."
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={createEmployee.isPending}>
            {createEmployee.isPending ? "Creating…" : "Create Employee"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" invalid={!!errors.name} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" invalid={!!errors.phone} {...register("phone")} />
          {errors.phone && <p className="mt-1.5 text-xs text-error">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Temporary Password</Label>
          <Input id="password" type="password" invalid={!!errors.password} {...register("password")} />
          {errors.password && <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <select id="role" className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange" {...register("role")}>
            {(["ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "SURVEY_ENGINEER"] as const).map((role) => (
              <option key={role} value={role}>
                {EMPLOYEE_ROLE_LABEL[role]}
              </option>
            ))}
          </select>
        </div>

        {createEmployee.isError && (
          <p className="text-sm text-error">
            {createEmployee.error instanceof ApiError ? createEmployee.error.message : "Couldn't create this employee. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
