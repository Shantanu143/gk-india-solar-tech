import { useState } from "react";
import { KeyRound, Mail, Pencil, Phone, Power, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Seo } from "@/components/layout/Seo";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { Avatar } from "@/features/crm/components/Avatar";
import { ConfirmDialog } from "@/features/crm/components/ConfirmDialog";
import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { AddEmployeeModal } from "@/features/employees/components/AddEmployeeModal";
import { EditEmployeeModal } from "@/features/employees/components/EditEmployeeModal";
import { ResetEmployeePasswordModal } from "@/features/employees/components/ResetEmployeePasswordModal";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import { useSetEmployeeStatus } from "@/features/employees/hooks/useEmployeeMutations";
import { EMPLOYEE_ROLE_LABEL, type Employee } from "@/features/employees/types/employee";

export function AdminEmployeesPage() {
  const { data: employees = [], isLoading, isError, refetch } = useEmployees();
  const setStatus = useSetEmployeeStatus();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [statusTarget, setStatusTarget] = useState<Employee | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<Employee | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Employees | GK India SolarTech CRM" description="Company employee directory." path={CRM_ROUTES.adminEmployees} noindex />
      <PageHeader
        title="Employees"
        description="Your sales and survey team."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Add Employee
          </Button>
        }
      />

      <Card className="p-2 sm:p-4">
        {isLoading ? (
          <SkeletonRows rows={5} className="p-4" />
        ) : isError ? (
          <ErrorState title="Couldn't load employees." onRetry={() => refetch()} />
        ) : employees.length === 0 ? (
          <EmptyState title="No employees found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Employee", "Contact", "Role", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={employee.name} />
                        <span className="font-semibold text-navy">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                          {employee.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                          {employee.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/80">{EMPLOYEE_ROLE_LABEL[employee.role]}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={employee.status === "ACTIVE" ? "Active" : "Inactive"}
                        tone={employee.status === "ACTIVE" ? "green" : "neutral"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditTarget(employee)}
                          className="flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPasswordTarget(employee)}
                          className="flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                        >
                          <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                          Reset Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusTarget(employee)}
                          className={`flex items-center gap-1 text-xs font-semibold hover:underline ${employee.status === "ACTIVE" ? "text-error" : "text-green"}`}
                        >
                          <Power className="h-3.5 w-3.5" aria-hidden="true" />
                          {employee.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AddEmployeeModal open={addOpen} onOpenChange={setAddOpen} />

      {editTarget && <EditEmployeeModal open onOpenChange={() => setEditTarget(null)} employee={editTarget} />}

      {passwordTarget && (
        <ResetEmployeePasswordModal open onOpenChange={() => setPasswordTarget(null)} employee={passwordTarget} />
      )}

      {statusTarget && (
        <ConfirmDialog
          open
          onOpenChange={() => setStatusTarget(null)}
          title={statusTarget.status === "ACTIVE" ? "Deactivate This Employee?" : "Activate This Employee?"}
          description={
            statusTarget.status === "ACTIVE"
              ? `${statusTarget.name} will no longer be able to sign in.`
              : `${statusTarget.name} will be able to sign in again.`
          }
          confirmLabel={statusTarget.status === "ACTIVE" ? "Deactivate" : "Activate"}
          destructive={statusTarget.status === "ACTIVE"}
          isLoading={setStatus.isPending}
          onConfirm={() =>
            setStatus.mutate(
              { id: statusTarget.id, status: statusTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
              { onSuccess: () => setStatusTarget(null) },
            )
          }
        />
      )}
    </div>
  );
}
