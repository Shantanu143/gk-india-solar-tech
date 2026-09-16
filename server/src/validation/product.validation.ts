import { z } from "zod";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES, PRODUCT_UNITS } from "../models/Product.model";

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(500).default(20),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  search: z.string().trim().optional(),
});
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export const createProductSchema = z.object({
  sku: z.string().trim().min(2, "SKU is required."),
  name: z.string().trim().min(2, "Name is required."),
  category: z.enum(PRODUCT_CATEGORIES),
  unitPrice: z.coerce.number().positive("Unit price must be greater than 0."),
  unit: z.enum(PRODUCT_UNITS),
  specs: z.record(z.string(), z.string()).optional(),
  description: z.string().trim().optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  sku: z.string().trim().min(2).optional(),
  name: z.string().trim().min(2).optional(),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  unitPrice: z.coerce.number().positive().optional(),
  unit: z.enum(PRODUCT_UNITS).optional(),
  specs: z.record(z.string(), z.string()).optional(),
  description: z.string().trim().optional(),
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const setProductStatusSchema = z.object({
  status: z.enum(PRODUCT_STATUSES),
});
