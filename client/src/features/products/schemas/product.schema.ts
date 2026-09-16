import { z } from "zod";
import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from "@/features/products/types/product";

export const createProductSchema = z.object({
  sku: z.string().trim().min(2, "Enter a SKU."),
  name: z.string().trim().min(2, "Enter a product name."),
  category: z.enum(PRODUCT_CATEGORIES, { message: "Select a category." }),
  unitPrice: z.number({ error: "Enter a unit price." }).positive("Unit price must be greater than 0."),
  unit: z.enum(PRODUCT_UNITS, { message: "Select a unit." }),
  description: z.string().trim().optional(),
});
export type CreateProductFormValues = z.infer<typeof createProductSchema>;

export const editProductSchema = z.object({
  sku: z.string().trim().min(2, "Enter a SKU."),
  name: z.string().trim().min(2, "Enter a product name."),
  category: z.enum(PRODUCT_CATEGORIES, { message: "Select a category." }),
  unitPrice: z.number({ error: "Enter a unit price." }).positive("Unit price must be greater than 0."),
  unit: z.enum(PRODUCT_UNITS, { message: "Select a unit." }),
  description: z.string().trim().optional(),
});
export type EditProductFormValues = z.infer<typeof editProductSchema>;
