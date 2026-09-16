import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

const nameSchema = z.string().trim().min(2, "Enter your full name.").max(100);
const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address.");
// An untouched "optional" field in a submitted form is an empty string, not `undefined` — accept
// both and normalize to `undefined` so the model never stores an empty phone.
const phoneSchema = z
  .union([z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number."), z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

export const signupCustomerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});
export type SignupCustomerInput = z.infer<typeof signupCustomerSchema>;

/** One-time setup — only succeeds while no ADMIN account exists yet; locks itself after. */
export const employeeBootstrapSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});
export type EmployeeBootstrapInput = z.infer<typeof employeeBootstrapSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: passwordSchema,
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
