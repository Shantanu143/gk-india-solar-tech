import type { Types } from "mongoose";
import { QuotationModel, type QuotationAttrs, type QuotationItem, type QuotationStatus } from "../models/Quotation.model";

/** A line item as accepted from the service layer — `productId` may still be a plain string here; Mongoose casts it on save. */
export type QuotationItemInput = Omit<QuotationItem, "_id" | "productId"> & { productId?: string | Types.ObjectId | null };

export interface CreateQuotationInput extends Omit<QuotationAttrs, "createdAt" | "updatedAt" | "lead" | "finalConfiguration" | "items"> {
  lead: string | Types.ObjectId;
  finalConfiguration?: string | Types.ObjectId | null;
  items: QuotationItemInput[];
}

export type UpdateQuotationInput = Partial<Omit<QuotationAttrs, "createdAt" | "updatedAt" | "lead" | "quotationNumber" | "items">> & {
  items?: QuotationItemInput[];
};

export interface QuotationFilters {
  status?: QuotationStatus;
  leadId?: string;
  /** Resolved by the service — restricts results to leads assigned to this employee (RBAC scoping without `leads.viewAll`). */
  leadIdsForEmployee?: string[];
}

export interface ListQuotationsParams extends QuotationFilters {
  page: number;
  pageSize: number;
}

export const quotationRepository = {
  async list(params: ListQuotationsParams) {
    const { page, pageSize, status, leadId, leadIdsForEmployee } = params;
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (leadId) query.lead = leadId;
    if (leadIdsForEmployee) query.lead = { $in: leadIdsForEmployee };

    const [items, total] = await Promise.all([
      QuotationModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      QuotationModel.countDocuments(query),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return QuotationModel.findById(id);
  },

  findByLeadId(leadId: string) {
    return QuotationModel.findOne({ lead: leadId });
  },

  create(input: CreateQuotationInput) {
    return QuotationModel.create(input);
  },

  updateById(id: string, updates: UpdateQuotationInput) {
    return QuotationModel.findByIdAndUpdate(id, updates, { new: true });
  },

  async nextQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await QuotationModel.countDocuments({});
    return `GK-QUO-${year}-${String(count + 1).padStart(5, "0")}`;
  },
};
