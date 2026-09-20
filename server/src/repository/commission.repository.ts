import { CommissionModel, type CommissionAttrs, type CommissionStatus } from "../models/Commission.model";

export interface CreateCommissionInput extends Omit<CommissionAttrs, "createdAt" | "updatedAt" | "status" | "projectId"> {
  status?: CommissionStatus;
  projectId?: CommissionAttrs["projectId"];
}

export interface CommissionFilters {
  partnerId?: string;
  status?: CommissionStatus;
}

export interface ListCommissionsParams extends CommissionFilters {
  page: number;
  pageSize: number;
}

export interface UpdateCommissionStatusInput {
  status: CommissionStatus;
  paymentDate?: Date;
  paymentReference?: string;
}

function buildFilterQuery(filters: CommissionFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (filters.partnerId) query.partnerId = filters.partnerId;
  if (filters.status) query.status = filters.status;
  return query;
}

export const commissionRepository = {
  findByLeadId(leadId: string) {
    return CommissionModel.findOne({ leadId });
  },

  findById(id: string) {
    return CommissionModel.findById(id);
  },

  create(input: CreateCommissionInput) {
    return CommissionModel.create(input);
  },

  async list(params: ListCommissionsParams) {
    const { page, pageSize, ...filters } = params;
    const query = buildFilterQuery(filters);

    const [items, total] = await Promise.all([
      CommissionModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      CommissionModel.countDocuments(query),
    ]);

    return { items, total };
  },

  updateStatusById(id: string, updates: UpdateCommissionStatusInput) {
    return CommissionModel.findByIdAndUpdate(id, updates, { new: true });
  },
};
