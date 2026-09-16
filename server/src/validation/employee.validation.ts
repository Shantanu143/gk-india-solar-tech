import { z } from "zod";
import { EMPLOYEE_ROLES, USER_STATUSES, type EmployeeRole } from "../models/User.model";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

// An untouched "optional" field in a submitted form is an empty string, not `undefined` — accept
// both and normalize to `undefined` so the model never stores an empty phone.
const phoneSchema = z
  .union([z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number."), z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

const employeeRoleSchema = z.enum(EMPLOYEE_ROLES as [EmployeeRole, ...EmployeeRole[]], {
  message: "Select a valid employee role.",
});

/** Admin-only: provisions a new employee account with an explicit role. Unlike customer signup, phone is required — employees are internal staff who need to be reachable. */
export const createEmployeeSchema = z.object({
  name: z.string().trim().min(2, "Enter the employee's full name.").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number."),
  password: passwordSchema,
  role: employeeRoleSchema,
});
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

/** Admin-only: edits an existing employee's profile/role. */
export const updateEmployeeSchema = z.object({
  name: z.string().trim().min(2, "Enter the employee's full name.").max(100).optional(),
  phone: phoneSchema,
  role: employeeRoleSchema.optional(),
});
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export const setEmployeeStatusSchema = z.object({
  status: z.enum(USER_STATUSES, { message: "Select a valid status." }),
});
export type SetEmployeeStatusInput = z.infer<typeof setEmployeeStatusSchema>;

export const resetEmployeePasswordSchema = z.object({
  password: passwordSchema,
});
export type ResetEmployeePasswordInput = z.infer<typeof resetEmployeePasswordSchema>;
