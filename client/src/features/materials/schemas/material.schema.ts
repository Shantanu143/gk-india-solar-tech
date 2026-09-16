import { z } from "zod";
import { MATERIAL_CATEGORIES, MATERIAL_UNITS, INVENTORY_TRANSACTION_TYPES } from "@/features/materials/types/material";

export const createMaterialSchema = z.object({
  sku: z.string().trim().min(2, "Enter a SKU."),
  name: z.string().trim().min(2, "Enter a material name."),
  category: z.enum(MATERIAL_CATEGORIES, { message: "Select a category." }),
  unit: z.enum(MATERIAL_UNITS, { message: "Select a unit." }),
  reorderLevel: z.number({ error: "Enter a reorder level." }).min(0, "Reorder level can't be negative."),
  unitCost: z.number({ error: "Enter a unit cost." }).min(0, "Unit cost can't be negative."),
  quantityInStock: z.number().min(0).optional(),
});
export type CreateMaterialFormValues = z.infer<typeof createMaterialSchema>;

export const editMaterialSchema = z.object({
  sku: z.string().trim().min(2, "Enter a SKU."),
  name: z.string().trim().min(2, "Enter a material name."),
  category: z.enum(MATERIAL_CATEGORIES, { message: "Select a category." }),
  unit: z.enum(MATERIAL_UNITS, { message: "Select a unit." }),
  reorderLevel: z.number({ error: "Enter a reorder level." }).min(0, "Reorder level can't be negative."),
  unitCost: z.number({ error: "Enter a unit cost." }).min(0, "Unit cost can't be negative."),
});
export type EditMaterialFormValues = z.infer<typeof editMaterialSchema>;

export const recordTransactionSchema = z.object({
  type: z.enum(INVENTORY_TRANSACTION_TYPES, { message: "Select a transaction type." }),
  quantity: z.number({ error: "Enter a quantity." }).positive("Quantity must be greater than 0."),
  note: z.string().trim().optional(),
});
export type RecordTransactionFormValues = z.infer<typeof recordTransactionSchema>;
