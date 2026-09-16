import type { Types } from "mongoose";
import { ProjectModel, type ProjectAttrs, type ProjectStatus } from "../models/Project.model";

export interface CreateProjectInput
  extends Omit<ProjectAttrs, "createdAt" | "updatedAt" | "lead" | "customer" | "quotation" | "assignedEmployeeId" | "documents"> {
  lead: string | Types.ObjectId;
  customer: string | Types.ObjectId;
  quotation: string | Types.ObjectId;
  assignedEmployeeId?: string | Types.ObjectId | null;
}

export type UpdateProjectInput = Partial<Omit<ProjectAttrs, "createdAt" | "updatedAt" | "lead" | "customer" | "quotation" | "projectNumber">>;

export interface ProjectFilters {
  status?: ProjectStatus;
  assignedEmployeeId?: string;
}

export const projectRepository = {
  list(filters: ProjectFilters) {
    const query: Record<string, unknown> = {};
    if (filters.status) query.status = filters.status;
    if (filters.assignedEmployeeId) query.assignedEmployeeId = filters.assignedEmployeeId;
    return ProjectModel.find(query).sort({ createdAt: -1 });
  },

  findById(id: string) {
    return ProjectModel.findById(id);
  },

  findByCustomerId(customerId: string) {
    return ProjectModel.findOne({ customer: customerId });
  },

  create(input: CreateProjectInput) {
    return ProjectModel.create(input);
  },

  updateById(id: string, updates: UpdateProjectInput) {
    return ProjectModel.findByIdAndUpdate(id, updates, { new: true });
  },

  async nextProjectNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await ProjectModel.countDocuments({});
    return `GK-PRJ-${year}-${String(count + 1).padStart(5, "0")}`;
  },

  countByStatus(status: ProjectStatus) {
    return ProjectModel.countDocuments({ status });
  },
};
