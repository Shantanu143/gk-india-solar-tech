import type { Types } from "mongoose";
import { LeadModel, type LeadAttrs, type LeadStatus, type LeadSource, type LeadInterest, type ProjectType } from "../models/Lead.model";

export interface CreateLeadInput extends Omit<LeadAttrs, "createdAt" | "updatedAt" | "assignedEmployeeId"> {
  assignedEmployeeId?: string | Types.ObjectId | null;
}

export interface UpdateLeadInput extends Partial<Omit<LeadAttrs, "assignedEmployeeId">> {
  assignedEmployeeId?: string | Types.ObjectId | null;
}

export interface LeadFilters {
  status?: LeadStatus;
  projectType?: ProjectType;
  source?: LeadSource;
  assignedEmployeeId?: string;
  interest?: LeadInterest;
  search?: string;
}

export interface GetLeadsParams extends LeadFilters {
  page: number;
  pageSize: number;
  sortDirection: "asc" | "desc";
}

function buildFilterQuery(filters: LeadFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;
  if (filters.projectType) query.projectType = filters.projectType;
  if (filters.source) query.source = filters.source;
  if (filters.assignedEmployeeId) query.assignedEmployeeId = filters.assignedEmployeeId;
  if (filters.interest) query.interest = filters.interest;
  if (filters.search) {
    const q = filters.search.trim();
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ "customer.fullName": rx }, { "customer.mobile": rx }, { "customer.email": rx }, { leadId: rx }];
  }
  return query;
}

export const leadRepository = {
  async list(params: GetLeadsParams) {
    const { page, pageSize, sortDirection, ...filters } = params;
    const query = buildFilterQuery(filters);
    const sort: Record<string, 1 | -1> = { createdAt: sortDirection === "asc" ? 1 : -1 };

    const [items, total] = await Promise.all([
      LeadModel.find(query)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      LeadModel.countDocuments(query),
    ]);

    return { items, total };
  },

  findById(id: string) {
    return LeadModel.findById(id);
  },

  create(input: CreateLeadInput) {
    return LeadModel.create(input);
  },

  async nextLeadId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await LeadModel.countDocuments({});
    return `GK-LEAD-${year}-${String(count + 1).padStart(5, "0")}`;
  },

  updateById(id: string, updates: UpdateLeadInput) {
    return LeadModel.findByIdAndUpdate(id, updates, { new: true });
  },

  countByStatus(status: LeadStatus) {
    return LeadModel.countDocuments({ status });
  },

  countAll() {
    return LeadModel.countDocuments({});
  },
};
