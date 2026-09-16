import type { Types } from "mongoose";
import { InventoryTransactionModel, type InventoryTransactionAttrs } from "../models/InventoryTransaction.model";

export interface CreateInventoryTransactionInput extends Omit<InventoryTransactionAttrs, "createdAt" | "material" | "relatedProjectId"> {
  material: string | Types.ObjectId;
  relatedProjectId?: string | Types.ObjectId | null;
}

export const inventoryTransactionRepository = {
  listForMaterial(materialId: string) {
    return InventoryTransactionModel.find({ material: materialId }).sort({ createdAt: -1 });
  },

  create(input: CreateInventoryTransactionInput) {
    return InventoryTransactionModel.create(input);
  },
};
