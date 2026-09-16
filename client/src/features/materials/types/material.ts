export const MATERIAL_CATEGORIES = ["PANEL", "INVERTER", "STRUCTURE", "CABLE", "BATTERY", "ACCESSORY", "OTHER"] as const;
export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];

export const MATERIAL_UNITS = ["PIECE", "SET", "METER", "KG", "BOX"] as const;
export type MaterialUnit = (typeof MATERIAL_UNITS)[number];

export type MaterialStatus = "ACTIVE" | "INACTIVE";

export interface Material {
  id: string;
  sku: string;
  name: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  quantityInStock: number;
  reorderLevel: number;
  unitCost: number;
  status: MaterialStatus;
  lowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export const INVENTORY_TRANSACTION_TYPES = ["IN", "OUT", "ADJUSTMENT"] as const;
export type InventoryTransactionType = (typeof INVENTORY_TRANSACTION_TYPES)[number];

export interface InventoryTransaction {
  id: string;
  materialId: string;
  type: InventoryTransactionType;
  quantity: number;
  relatedProjectId?: string;
  note?: string;
  createdBy: string;
  createdAt: string;
}

export const MATERIAL_CATEGORY_LABEL: Record<MaterialCategory, string> = {
  PANEL: "Solar Panel",
  INVERTER: "Inverter",
  STRUCTURE: "Structure",
  CABLE: "Cable",
  BATTERY: "Battery",
  ACCESSORY: "Accessory",
  OTHER: "Other",
};

export const MATERIAL_UNIT_LABEL: Record<MaterialUnit, string> = {
  PIECE: "Piece",
  SET: "Set",
  METER: "Meter",
  KG: "kg",
  BOX: "Box",
};

export const INVENTORY_TRANSACTION_TYPE_LABEL: Record<InventoryTransactionType, string> = {
  IN: "Stock In",
  OUT: "Stock Out",
  ADJUSTMENT: "Adjustment",
};
