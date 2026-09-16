import type { ProductDocument } from "../models/Product.model";

export function toPublicProduct(product: ProductDocument) {
  return {
    id: product._id.toString(),
    sku: product.sku,
    name: product.name,
    category: product.category,
    unitPrice: product.unitPrice,
    unit: product.unit,
    specs: product.specs,
    status: product.status,
    description: product.description,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export type PublicProduct = ReturnType<typeof toPublicProduct>;
