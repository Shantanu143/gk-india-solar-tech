import { Schema, model, type HydratedDocument, type Model } from "mongoose";

export const PRODUCT_CATEGORIES = ["PANEL", "INVERTER", "STRUCTURE", "BATTERY", "ACCESSORY", "OTHER"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_UNITS = ["PIECE", "SET", "KW"] as const;
export type ProductUnit = (typeof PRODUCT_UNITS)[number];

export const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export interface ProductAttrs {
  sku: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  unit: ProductUnit;
  specs?: Record<string, string>;
  status: ProductStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = HydratedDocument<ProductAttrs>;

const productSchema = new Schema<ProductAttrs>(
  {
    sku: { type: String, required: true, trim: true, uppercase: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: PRODUCT_CATEGORIES, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: PRODUCT_UNITS, required: true },
    specs: { type: Schema.Types.Mixed },
    status: { type: String, enum: PRODUCT_STATUSES, required: true, default: "ACTIVE" },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, status: 1 });

export const ProductModel: Model<ProductAttrs> = model<ProductAttrs>("Product", productSchema);
