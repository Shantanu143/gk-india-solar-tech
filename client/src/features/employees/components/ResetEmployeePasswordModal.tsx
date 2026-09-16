import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { useResetEmployeePassword } from "@/features/employees/hooks/useEmployeeMutations";
import { resetEmployeePasswordSchema, type ResetEmployeePasswordFormValues } from "@/features/employees/schemas/employee.schema";
import type { Employee } from "@/features/employees/types/employee";
import { ApiError } from "@/services/apiClient";

interface ResetEmployeePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
}

const FORM_ID = "reset-employee-password-form";

export function ResetEmployeePasswordModal({ open, onOpenChange, employee }: ResetEmployeePasswordModalProps) {
  const resetPassword = useResetEmployeePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetEmployeePasswordFormValues>({ resolver: zodResolver(resetEmployeePasswordSchema) });

  function onSubmit(values: ResetEmployeePasswordFormValues) {
    resetPassword.mutate(
      { id: employee.id, password: values.password },
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
      title="Reset Password"
      description={`Sets a new password for ${employee.name} and signs them out everywhere.`}
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={resetPassword.isPending}>
            {resetPassword.isPending ? "Saving…" : "Reset Password"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <PasswordInput id="new-password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
          {errors.password && <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>}
        </div>

        {resetPassword.isError && (
          <p className="text-sm text-error">
            {resetPassword.error instanceof ApiError ? resetPassword.error.message : "Couldn't reset this password. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
