import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export const INVENTORY_TRANSACTION_TYPES = ["IN", "OUT", "ADJUSTMENT"] as const;
export type InventoryTransactionType = (typeof INVENTORY_TRANSACTION_TYPES)[number];

export interface InventoryTransactionAttrs {
  material: Types.ObjectId;
  type: InventoryTransactionType;
  quantity: number;
  relatedProjectId: Types.ObjectId | null;
  note?: string;
  createdBy: string;
  createdAt: Date;
}

export type InventoryTransactionDocument = HydratedDocument<InventoryTransactionAttrs>;

const inventoryTransactionSchema = new Schema<InventoryTransactionAttrs>(
  {
    material: { type: Schema.Types.ObjectId, ref: "Material", required: true, index: true },
    type: { type: String, enum: INVENTORY_TRANSACTION_TYPES, required: true },
    quantity: { type: Number, required: true, min: 0 },
    relatedProjectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    note: { type: String, trim: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const InventoryTransactionModel: Model<InventoryTransactionAttrs> = model<InventoryTransactionAttrs>(
  "InventoryTransaction",
  inventoryTransactionSchema,
);
