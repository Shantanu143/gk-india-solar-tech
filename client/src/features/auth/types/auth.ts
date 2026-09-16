/**
 * The real, backend-authenticated user — the single source of truth for identity across the whole
 * app, public site and CRM alike (`features/crm/hooks/authContext.ts` adapts this for CRM
 * components). Matches `server/src/models/User.model.ts` exactly.
 */
export type UserRole = "ADMIN" | "SALES_MANAGER" | "SALES_EXECUTIVE" | "SURVEY_ENGINEER" | "CUSTOMER";

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Administrator",
  SALES_MANAGER: "Sales Manager",
  SALES_EXECUTIVE: "Sales Executive",
  SURVEY_ENGINEER: "Survey Engineer",
  CUSTOMER: "Customer",
};
