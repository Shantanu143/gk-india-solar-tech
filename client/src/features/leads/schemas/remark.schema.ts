import { z } from "zod";

export const remarkSchema = z.object({
  remark: z.string().trim().min(3, "Please enter a remark."),
  interest: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type RemarkFormValues = z.infer<typeof remarkSchema>;
