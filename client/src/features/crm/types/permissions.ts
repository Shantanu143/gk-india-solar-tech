import type { UserRole } from "@/features/auth/types/auth";
import type { EmployeeRole } from "@/features/employees/types/employee";

export type Permission =
  | "leads.view"
  | "leads.viewAll"
  | "leads.edit"
  | "leads.assign"
  | "leads.delete"
  | "followups.view"
  | "followups.create"
  | "followups.edit"
  | "surveys.view"
  | "surveys.create"
  | "quotations.view"
  | "quotations.create"
  | "reports.view"
  | "employees.view"
  | "employees.manage"
  | "settings.manage"
  | "partners.view"
  | "partners.manage"
  | "commissions.view"
  | "commissions.manage";

/**
 * Frontend permission map for UX only — hiding a button here is not security. The backend will
 * enforce the real authorization once it exists; this exists so the UI can behave sensibly today.
 */
const ROLE_PERMISSIONS: Record<EmployeeRole, Permission[]> = {
  ADMIN: [
    "leads.view",
    "leads.viewAll",
    "leads.edit",
    "leads.assign",
    "leads.delete",
    "followups.view",
    "followups.create",
    "followups.edit",
    "surveys.view",
    "surveys.create",
    "quotations.view",
    "quotations.create",
    "reports.view",
    "employees.view",
    "employees.manage",
    "settings.manage",
    "partners.view",
    "partners.manage",
    "commissions.view",
    "commissions.manage",
  ],
  SALES_MANAGER: [
    "leads.view",
    "leads.viewAll",
    "leads.edit",
    "leads.assign",
    "followups.view",
    "followups.create",
    "followups.edit",
    "surveys.view",
    "quotations.view",
    "reports.view",
    "employees.view",
    "partners.view",
    "commissions.view",
  ],
  SALES_EXECUTIVE: [
    "leads.view",
    "leads.edit",
    "followups.view",
    "followups.create",
    "followups.edit",
    "surveys.view",
    "surveys.create",
    "quotations.view",
    "quotations.create",
    "employees.view",
  ],
  SURVEY_ENGINEER: ["leads.view", "surveys.view", "surveys.create", "followups.view", "employees.view"],
};

/** CUSTOMER and PARTNER always fall through to `false`/`[]` — neither sees the employee CRM UI (Partner has its own portal). */
export function can(role: UserRole, permission: Permission): boolean {
  if (role === "CUSTOMER" || role === "PARTNER") return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  if (role === "CUSTOMER" || role === "PARTNER") return [];
  return ROLE_PERMISSIONS[role] ?? [];
}
