import { Schema, model, type HydratedDocument, type Model } from "mongoose";

export const MATERIAL_CATEGORIES = ["PANEL", "INVERTER", "STRUCTURE", "CABLE", "BATTERY", "ACCESSORY", "OTHER"] as const;
export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];

export const MATERIAL_UNITS = ["PIECE", "SET", "METER", "KG", "BOX"] as const;
export type MaterialUnit = (typeof MATERIAL_UNITS)[number];

export const MATERIAL_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type MaterialStatus = (typeof MATERIAL_STATUSES)[number];

export interface MaterialAttrs {
  sku: string;
  name: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  quantityInStock: number;
  reorderLevel: number;
  unitCost: number;
  status: MaterialStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type MaterialDocument = HydratedDocument<MaterialAttrs>;

const materialSchema = new Schema<MaterialAttrs>(
  {
    sku: { type: String, required: true, trim: true, uppercase: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: MATERIAL_CATEGORIES, required: true },
    unit: { type: String, enum: MATERIAL_UNITS, required: true },
    quantityInStock: { type: Number, required: true, default: 0, min: 0 },
    reorderLevel: { type: Number, required: true, default: 0, min: 0 },
    unitCost: { type: Number, required: true, min: 0 },
    status: { type: String, enum: MATERIAL_STATUSES, required: true, default: "ACTIVE" },
  },
  { timestamps: true },
);

materialSchema.index({ category: 1, status: 1 });

export const MaterialModel: Model<MaterialAttrs> = model<MaterialAttrs>("Material", materialSchema);
