import { z } from "zod";
import { LEAD_STATUSES, PROJECT_TYPES } from "../models/Lead.model";

const partnerLeadCustomerSchema = z.object({
  fullName: z.string().trim().min(2),
  mobile: z.string().trim().min(10),
  whatsapp: z.string().trim().min(10),
  email: z.string().trim().email().optional(),
  address: z.string().trim().min(3),
});

const partnerLeadLocationSchema = z.object({
  pincode: z.string().trim().min(4),
  city: z.string().trim().min(2),
  address: z.string().trim().min(3),
});

const partnerSolarRecommendationSchema = z.object({
  recommendedCapacity: z.number().positive(),
  estimatedPanels: z.number().int().positive(),
  panelCapacity: z.number().positive(),
  recommendedInverter: z.number().positive(),
});

/**
 * Partner dashboard's "Submit New Lead" form. Mirrors the public `createLeadSchema` shape
 * (`lead.validation.ts`) for customer/location/solarRecommendation — the partner UI computes
 * `solarRecommendation` client-side with the same calculator the public site uses and submits it
 * as-is — plus the partner-only note fields captured alongside it.
 */
export const createPartnerLeadSchema = z.object({
  customer: partnerLeadCustomerSchema,
  projectType: z.enum(PROJECT_TYPES),
  location: partnerLeadLocationSchema,
  monthlyBill: z.number().positive(),
  billDocumentName: z.string().trim().optional(),
  solarRecommendation: partnerSolarRecommendationSchema,
  requirement: z.string().trim().optional(),
  preferredContactTime: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
});
export type CreatePartnerLeadInput = z.infer<typeof createPartnerLeadSchema>;

/** Mirrors `listLeadsQuerySchema`'s pagination/sort shape, scoped down to what a partner can filter their own leads by. */
export const listPartnerLeadsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(500).default(10),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(LEAD_STATUSES).optional(),
});
export type ListPartnerLeadsQuery = z.infer<typeof listPartnerLeadsQuerySchema>;
