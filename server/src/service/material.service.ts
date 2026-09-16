import { materialRepository, type ListMaterialsParams, type CreateMaterialInput, type UpdateMaterialInput } from "../repository/material.repository";
import { inventoryTransactionRepository } from "../repository/inventoryTransaction.repository";
import { ApiError } from "../util/ApiError";
import { toPublicInventoryTransaction, toPublicMaterial, type PublicInventoryTransaction, type PublicMaterial } from "../util/serializeMaterial";
import type { InventoryTransactionType } from "../models/InventoryTransaction.model";
import type { MaterialStatus } from "../models/Material.model";

export interface PaginatedMaterials {
  items: PublicMaterial[];
  total: number;
  page: number;
  pageSize: number;
}

export const materialService = {
  async listMaterials(params: ListMaterialsParams): Promise<PaginatedMaterials> {
    const { items, total } = await materialRepository.list(params);
    return { items: items.map(toPublicMaterial), total, page: params.page, pageSize: params.pageSize };
  },

  async getMaterial(id: string): Promise<PublicMaterial> {
    const material = await materialRepository.findById(id);
    if (!material) throw ApiError.notFound("Material not found.");
    return toPublicMaterial(material);
  },

  async createMaterial(input: CreateMaterialInput): Promise<PublicMaterial> {
    const existing = await materialRepository.findBySku(input.sku);
    if (existing) throw ApiError.conflict(`A material with SKU "${input.sku.toUpperCase()}" already exists.`);
    const material = await materialRepository.create(input);
    return toPublicMaterial(material);
  },

  async updateMaterial(id: string, updates: UpdateMaterialInput): Promise<PublicMaterial> {
    if (updates.sku) {
      const existing = await materialRepository.findBySku(updates.sku);
      if (existing && existing._id.toString() !== id) {
        throw ApiError.conflict(`A material with SKU "${updates.sku.toUpperCase()}" already exists.`);
      }
    }
    const material = await materialRepository.updateById(id, updates);
    if (!material) throw ApiError.notFound("Material not found.");
    return toPublicMaterial(material);
  },

  async setMaterialStatus(id: string, status: MaterialStatus): Promise<PublicMaterial> {
    const material = await materialRepository.updateById(id, { status });
    if (!material) throw ApiError.notFound("Material not found.");
    return toPublicMaterial(material);
  },

  async getTransactionsForMaterial(materialId: string): Promise<PublicInventoryTransaction[]> {
    const items = await inventoryTransactionRepository.listForMaterial(materialId);
    return items.map(toPublicInventoryTransaction);
  },

  /** IN and ADJUSTMENT both add to stock; OUT subtracts. To correct an overcount, record an OUT with an explanatory note. */
  async recordTransaction(input: {
    materialId: string;
    type: InventoryTransactionType;
    quantity: number;
    relatedProjectId?: string;
    note?: string;
    createdBy: string;
  }): Promise<PublicMaterial> {
    const material = await materialRepository.findById(input.materialId);
    if (!material) throw ApiError.notFound("Material not found.");

    const delta = input.type === "OUT" ? -input.quantity : input.quantity;
    const updated = await materialRepository.adjustStock(input.materialId, delta);
    if (!updated) throw ApiError.badRequest("This adjustment would leave the stock below zero.");

    await inventoryTransactionRepository.create({
      material: input.materialId,
      type: input.type,
      quantity: input.quantity,
      relatedProjectId: input.relatedProjectId,
      note: input.note,
      createdBy: input.createdBy,
    });

    return toPublicMaterial(updated);
  },
};
