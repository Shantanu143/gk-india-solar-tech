import { z } from "zod";
import { MATERIAL_CATEGORIES, MATERIAL_STATUSES, MATERIAL_UNITS } from "../models/Material.model";
import { INVENTORY_TRANSACTION_TYPES } from "../models/InventoryTransaction.model";

export const listMaterialsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(500).default(20),
  category: z.enum(MATERIAL_CATEGORIES).optional(),
  status: z.enum(MATERIAL_STATUSES).optional(),
  search: z.string().trim().optional(),
});
export type ListMaterialsQuery = z.infer<typeof listMaterialsQuerySchema>;

export const createMaterialSchema = z.object({
  sku: z.string().trim().min(2, "SKU is required."),
  name: z.string().trim().min(2, "Name is required."),
  category: z.enum(MATERIAL_CATEGORIES),
  unit: z.enum(MATERIAL_UNITS),
  reorderLevel: z.coerce.number().min(0).default(0),
  unitCost: z.coerce.number().min(0),
  quantityInStock: z.coerce.number().min(0).default(0),
});
export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;

export const updateMaterialSchema = z.object({
  sku: z.string().trim().min(2).optional(),
  name: z.string().trim().min(2).optional(),
  category: z.enum(MATERIAL_CATEGORIES).optional(),
  unit: z.enum(MATERIAL_UNITS).optional(),
  reorderLevel: z.coerce.number().min(0).optional(),
  unitCost: z.coerce.number().min(0).optional(),
});
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;

export const setMaterialStatusSchema = z.object({
  status: z.enum(MATERIAL_STATUSES),
});

export const recordTransactionSchema = z.object({
  type: z.enum(INVENTORY_TRANSACTION_TYPES),
  quantity: z.coerce.number().positive("Quantity must be greater than 0."),
  relatedProjectId: z.string().optional(),
  note: z.string().trim().optional(),
});
export type RecordTransactionInput = z.infer<typeof recordTransactionSchema>;
