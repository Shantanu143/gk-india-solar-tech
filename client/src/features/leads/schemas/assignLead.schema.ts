import { z } from "zod";

export const assignLeadSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export type AssignLeadFormValues = z.infer<typeof assignLeadSchema>;
