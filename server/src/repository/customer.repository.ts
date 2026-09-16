import type { Types } from "mongoose";
import { CustomerModel, type CustomerAttrs } from "../models/Customer.model";

export interface CreateCustomerInput extends Omit<CustomerAttrs, "createdAt" | "updatedAt" | "lead" | "assignedEmployeeId"> {
  lead: string | Types.ObjectId;
  assignedEmployeeId?: string | Types.ObjectId | null;
}

export interface CustomerFilters {
  assignedEmployeeId?: string;
  search?: string;
}

export interface ListCustomersParams extends CustomerFilters {
  page: number;
  pageSize: number;
}

function buildFilterQuery(filters: CustomerFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (filters.assignedEmployeeId) query.assignedEmployeeId = filters.assignedEmployeeId;
  if (filters.search) {
    const rx = new RegExp(filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ fullName: rx }, { mobile: rx }, { email: rx }];
  }
  return query;
}

export const customerRepository = {
  async list(params: ListCustomersParams) {
    const { page, pageSize, ...filters } = params;
    const query = buildFilterQuery(filters);
    const [items, total] = await Promise.all([
      CustomerModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      CustomerModel.countDocuments(query),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return CustomerModel.findById(id);
  },

  findByLeadId(leadId: string) {
    return CustomerModel.findOne({ lead: leadId });
  },

  create(input: CreateCustomerInput) {
    return CustomerModel.create(input);
  },

  countAll() {
    return CustomerModel.countDocuments({});
  },
};
