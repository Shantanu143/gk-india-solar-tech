import type { UserRole } from "../models/User.model";

/**
 * The backend's authoritative RBAC map — mirrors `client/src/features/crm/types/permissions.ts`,
 * which is UI-only (hides buttons) and explicitly not real enforcement. This is the real
 * enforcement layer; keep both files in sync when a permission or role changes.
 */
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
  | "products.view"
  | "products.manage"
  | "customers.view"
  | "projects.view"
  | "projects.manage"
  | "materials.view"
  | "materials.manage"
  | "reports.view"
  | "employees.view"
  | "employees.manage"
  | "settings.manage";

type EmployeeRole = Exclude<UserRole, "CUSTOMER">;

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
    "products.view",
    "products.manage",
    "customers.view",
    "projects.view",
    "projects.manage",
    "materials.view",
    "materials.manage",
    "reports.view",
    "employees.view",
    "employees.manage",
    "settings.manage",
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
    "products.view",
    "customers.view",
    "projects.view",
    "projects.manage",
    "materials.view",
    "reports.view",
    "employees.view",
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
    "products.view",
    "customers.view",
    "projects.view",
    "projects.manage",
    "employees.view",
  ],
  SURVEY_ENGINEER: ["leads.view", "surveys.view", "surveys.create", "followups.view", "employees.view"],
};

/** CUSTOMER always falls through to `false` — customers act through their own portal endpoints, never these permissions. */
export function can(role: UserRole, permission: Permission): boolean {
  if (role === "CUSTOMER") return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
