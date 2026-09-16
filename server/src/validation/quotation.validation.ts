import { z } from "zod";
import { QUOTATION_STATUSES } from "../models/Quotation.model";
import { PRODUCT_CATEGORIES } from "../models/Product.model";
import { LOST_REASONS } from "../models/Lead.model";

export const listQuotationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(500).default(20),
  status: z.enum(QUOTATION_STATUSES).optional(),
  leadId: z.string().trim().optional(),
});
export type ListQuotationsQuery = z.infer<typeof listQuotationsQuerySchema>;

export const createQuotationSchema = z.object({
  leadId: z.string().min(1, "leadId is required."),
});

const quotationItemSchema = z.object({
  productId: z.string().nullable().optional(),
  description: z.string().trim().min(1, "Description is required."),
  category: z.enum(PRODUCT_CATEGORIES),
  quantity: z.coerce.number().positive("Quantity must be greater than 0."),
  unitPrice: z.coerce.number().min(0, "Unit price can't be negative."),
  amount: z.coerce.number().min(0),
});

export const updateQuotationItemsSchema = z.object({
  items: z.array(quotationItemSchema).min(1, "A quotation needs at least one line item."),
  discountAmount: z.coerce.number().min(0).optional(),
  validUntil: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});
export type UpdateQuotationItemsInput = z.infer<typeof updateQuotationItemsSchema>;

export const rejectQuotationSchema = z.object({
  lostReason: z.enum(LOST_REASONS).optional(),
});
