import { z } from "zod";
import { PROJECT_STATUSES } from "../models/Project.model";

export const listProjectsQuerySchema = z.object({
  status: z.enum(PROJECT_STATUSES).optional(),
  assignedEmployeeId: z.string().optional(),
});
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

export const updateProjectStatusSchema = z.object({
  status: z.enum(PROJECT_STATUSES),
});
export type UpdateProjectStatusInput = z.infer<typeof updateProjectStatusSchema>;

export const addProjectDocumentSchema = z.object({
  id: z.string().min(1),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  url: z.string().min(1),
});
export type AddProjectDocumentInput = z.infer<typeof addProjectDocumentSchema>;
