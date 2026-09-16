import { ProductModel, type ProductAttrs, type ProductCategory, type ProductStatus } from "../models/Product.model";

export interface CreateProductInput extends Omit<ProductAttrs, "createdAt" | "updatedAt" | "status"> {
  status?: ProductStatus;
}

export type UpdateProductInput = Partial<Omit<ProductAttrs, "createdAt" | "updatedAt">>;

export interface ProductFilters {
  category?: ProductCategory;
  status?: ProductStatus;
  search?: string;
}

export interface ListProductsParams extends ProductFilters {
  page: number;
  pageSize: number;
}

function buildFilterQuery(filters: ProductFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    const rx = new RegExp(filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: rx }, { sku: rx }];
  }
  return query;
}

export const productRepository = {
  async list(params: ListProductsParams) {
    const { page, pageSize, ...filters } = params;
    const query = buildFilterQuery(filters);
    const [items, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ category: 1, name: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      ProductModel.countDocuments(query),
    ]);
    return { items, total };
  },

  /** Every active product in a category, unpaginated — used to auto-populate a quotation's line items. */
  listActiveByCategory(category: ProductCategory) {
    return ProductModel.find({ category, status: "ACTIVE" }).sort({ name: 1 });
  },

  findById(id: string) {
    return ProductModel.findById(id);
  },

  findBySku(sku: string) {
    return ProductModel.findOne({ sku: sku.trim().toUpperCase() });
  },

  create(input: CreateProductInput) {
    return ProductModel.create(input);
  },

  updateById(id: string, updates: UpdateProductInput) {
    return ProductModel.findByIdAndUpdate(id, updates, { new: true });
  },
};
