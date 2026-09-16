import { MaterialModel, type MaterialAttrs, type MaterialCategory, type MaterialStatus } from "../models/Material.model";

export interface CreateMaterialInput extends Omit<MaterialAttrs, "createdAt" | "updatedAt" | "status" | "quantityInStock"> {
  status?: MaterialStatus;
  quantityInStock?: number;
}

export type UpdateMaterialInput = Partial<Omit<MaterialAttrs, "createdAt" | "updatedAt" | "quantityInStock">>;

export interface MaterialFilters {
  category?: MaterialCategory;
  status?: MaterialStatus;
  search?: string;
}

export interface ListMaterialsParams extends MaterialFilters {
  page: number;
  pageSize: number;
}

function buildFilterQuery(filters: MaterialFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    const rx = new RegExp(filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: rx }, { sku: rx }];
  }
  return query;
}

export const materialRepository = {
  async list(params: ListMaterialsParams) {
    const { page, pageSize, ...filters } = params;
    const query = buildFilterQuery(filters);
    const [items, total] = await Promise.all([
      MaterialModel.find(query)
        .sort({ category: 1, name: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      MaterialModel.countDocuments(query),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return MaterialModel.findById(id);
  },

  findBySku(sku: string) {
    return MaterialModel.findOne({ sku: sku.trim().toUpperCase() });
  },

  create(input: CreateMaterialInput) {
    return MaterialModel.create(input);
  },

  updateById(id: string, updates: UpdateMaterialInput) {
    return MaterialModel.findByIdAndUpdate(id, updates, { new: true });
  },

  /** Atomic stock adjustment — `delta` is signed (positive for IN, negative for OUT). Rejects if it would go below 0. */
  adjustStock(id: string, delta: number) {
    return MaterialModel.findOneAndUpdate({ _id: id, quantityInStock: { $gte: -delta } }, { $inc: { quantityInStock: delta } }, { new: true });
  },

  countLowStock() {
    return MaterialModel.countDocuments({ $expr: { $lte: ["$quantityInStock", "$reorderLevel"] } });
  },
};
