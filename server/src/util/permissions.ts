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
  /** Generate a quotation at any lead stage, without waiting for the site survey (admin on-the-spot quoting). */
  | "quotations.createWithoutSurvey"
  /** Upload / remove photos directly on a quotation (everyone else gets the site engineer's survey photos automatically). */
  | "quotations.managePhotos"
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
  | "settings.manage"
  | "partners.view"
  | "partners.manage"
  | "commissions.view"
  | "commissions.manage";

type EmployeeRole = Exclude<UserRole, "CUSTOMER" | "PARTNER">;

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
    "quotations.createWithoutSurvey",
    "quotations.managePhotos",
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
    "products.view",
    "customers.view",
    "projects.view",
    "projects.manage",
    "materials.view",
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
    "products.view",
    "customers.view",
    "projects.view",
    "projects.manage",
    "employees.view",
  ],
  SURVEY_ENGINEER: ["leads.view", "surveys.view", "surveys.create", "followups.view", "employees.view"],
};

/** CUSTOMER and PARTNER always fall through to `false` — both act through their own dedicated, self-scoped portal endpoints, never this employee RBAC map. */
export function can(role: UserRole, permission: Permission): boolean {
  if (role === "CUSTOMER" || role === "PARTNER") return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
