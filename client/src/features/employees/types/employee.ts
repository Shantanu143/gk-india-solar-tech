import type { UserRole } from "@/features/auth/types/auth";

/** Every real role except CUSTOMER — the unified `UserRole` (`features/auth/types/auth.ts`) is the single source of truth. */
export type EmployeeRole = Exclude<UserRole, "CUSTOMER">;

export type EmployeeStatus = "ACTIVE" | "INACTIVE";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  avatarUrl?: string;
  status: EmployeeStatus;
}

export const EMPLOYEE_ROLE_LABEL: Record<EmployeeRole, string> = {
  ADMIN: "Administrator",
  SALES_MANAGER: "Sales Manager",
  SALES_EXECUTIVE: "Sales Executive",
  SURVEY_ENGINEER: "Survey Engineer",
};
