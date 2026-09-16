export const PRODUCT_CATEGORIES = ["PANEL", "INVERTER", "STRUCTURE", "BATTERY", "ACCESSORY", "OTHER"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_UNITS = ["PIECE", "SET", "KW"] as const;
export type ProductUnit = (typeof PRODUCT_UNITS)[number];

export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  unit: ProductUnit;
  specs?: Record<string, string>;
  status: ProductStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
  PANEL: "Solar Panel",
  INVERTER: "Inverter",
  STRUCTURE: "Structure",
  BATTERY: "Battery",
  ACCESSORY: "Accessory",
  OTHER: "Other",
};

export const PRODUCT_UNIT_LABEL: Record<ProductUnit, string> = {
  PIECE: "Piece",
  SET: "Set",
  KW: "kW",
};
