import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

const phoneSchema = z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number.");

export const createEmployeeSchema = z.object({
  name: z.string().trim().min(2, "Enter the employee's full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: phoneSchema,
  password: passwordSchema,
  role: z.enum(["ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "SURVEY_ENGINEER"], { message: "Select a role." }),
});
export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;

export const editEmployeeSchema = z.object({
  name: z.string().trim().min(2, "Enter the employee's full name."),
  phone: phoneSchema,
  role: z.enum(["ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "SURVEY_ENGINEER"], { message: "Select a role." }),
});
export type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>;

export const resetEmployeePasswordSchema = z.object({
  password: passwordSchema,
});
export type ResetEmployeePasswordFormValues = z.infer<typeof resetEmployeePasswordSchema>;
