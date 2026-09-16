import { z } from "zod";

export const listCustomersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(500).default(20),
  assignedEmployeeId: z.string().optional(),
  search: z.string().trim().optional(),
});
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
