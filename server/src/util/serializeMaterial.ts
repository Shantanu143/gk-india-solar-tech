import type { MaterialDocument } from "../models/Material.model";
import type { InventoryTransactionDocument } from "../models/InventoryTransaction.model";

export function toPublicMaterial(material: MaterialDocument) {
  return {
    id: material._id.toString(),
    sku: material.sku,
    name: material.name,
    category: material.category,
    unit: material.unit,
    quantityInStock: material.quantityInStock,
    reorderLevel: material.reorderLevel,
    unitCost: material.unitCost,
    status: material.status,
    lowStock: material.quantityInStock <= material.reorderLevel,
    createdAt: material.createdAt.toISOString(),
    updatedAt: material.updatedAt.toISOString(),
  };
}

export type PublicMaterial = ReturnType<typeof toPublicMaterial>;

export function toPublicInventoryTransaction(transaction: InventoryTransactionDocument) {
  return {
    id: transaction._id.toString(),
    materialId: transaction.material.toString(),
    type: transaction.type,
    quantity: transaction.quantity,
    relatedProjectId: transaction.relatedProjectId ? transaction.relatedProjectId.toString() : undefined,
    note: transaction.note,
    createdBy: transaction.createdBy,
    createdAt: transaction.createdAt.toISOString(),
  };
}

export type PublicInventoryTransaction = ReturnType<typeof toPublicInventoryTransaction>;
