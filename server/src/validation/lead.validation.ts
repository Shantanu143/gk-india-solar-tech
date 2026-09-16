import { z } from "zod";
import { LEAD_INTERESTS, LEAD_PRIORITIES, LEAD_SOURCES, LEAD_STATUSES, LOST_REASONS, PROJECT_TYPES } from "../models/Lead.model";

export const listLeadsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  // 500 comfortably covers the "show everything, no pagination" Kanban pipeline view, not just the paged table.
  pageSize: z.coerce.number().int().positive().max(500).default(10),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(LEAD_STATUSES).optional(),
  projectType: z.enum(PROJECT_TYPES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  assignedEmployeeId: z.string().optional(),
  interest: z.enum(LEAD_INTERESTS).optional(),
  search: z.string().trim().optional(),
});
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;

export const assignLeadSchema = z.object({
  employeeId: z.string().min(1, "Select an employee."),
  priority: z.enum(LEAD_PRIORITIES).optional(),
});
export type AssignLeadInput = z.infer<typeof assignLeadSchema>;

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
  lostReason: z.enum(LOST_REASONS).optional(),
});
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;

export const addRemarkSchema = z.object({
  remark: z.string().trim().min(3, "Please enter a remark."),
  interest: z.enum(LEAD_INTERESTS).optional(),
});
export type AddRemarkInput = z.infer<typeof addRemarkSchema>;

const leadCustomerSchema = z.object({
  fullName: z.string().trim().min(2),
  mobile: z.string().trim().min(10),
  whatsapp: z.string().trim().min(10),
  email: z.string().trim().email().optional(),
  address: z.string().trim().min(3),
});

const leadLocationSchema = z.object({
  pincode: z.string().trim().min(4),
  city: z.string().trim().min(2),
  address: z.string().trim().min(3),
});

const solarRecommendationSchema = z.object({
  recommendedCapacity: z.number().positive(),
  estimatedPanels: z.number().int().positive(),
  panelCapacity: z.number().positive(),
  recommendedInverter: z.number().positive(),
});

/** Public — the solar estimate wizard's lead-capture submission. */
export const createLeadSchema = z.object({
  customer: leadCustomerSchema,
  projectType: z.enum(PROJECT_TYPES),
  location: leadLocationSchema,
  monthlyBill: z.number().positive(),
  billDocumentName: z.string().trim().optional(),
  solarRecommendation: solarRecommendationSchema,
  source: z.enum(LEAD_SOURCES),
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
