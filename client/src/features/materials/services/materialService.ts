import { apiRequest } from "@/services/apiClient";
import type { PaginatedResult } from "@/features/crm/types/api";
import type {
  InventoryTransaction,
  InventoryTransactionType,
  Material,
  MaterialCategory,
  MaterialStatus,
  MaterialUnit,
} from "@/features/materials/types/material";

export interface GetMaterialsParams {
  category?: MaterialCategory;
  status?: MaterialStatus;
  search?: string;
}

export async function getMaterials(params: GetMaterialsParams = {}): Promise<Material[]> {
  const search = new URLSearchParams({ pageSize: "200" });
  if (params.category) search.set("category", params.category);
  if (params.status) search.set("status", params.status);
  if (params.search) search.set("search", params.search);
  const result = await apiRequest<PaginatedResult<Material>>(`/materials?${search.toString()}`);
  return result.items;
}

export async function getMaterial(id: string): Promise<Material> {
  const { material } = await apiRequest<{ material: Material }>(`/materials/${id}`);
  return material;
}

export interface CreateMaterialPayload {
  sku: string;
  name: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  reorderLevel: number;
  unitCost: number;
  quantityInStock?: number;
}

export async function createMaterial(payload: CreateMaterialPayload): Promise<Material> {
  const { material } = await apiRequest<{ material: Material }>("/materials", { method: "POST", body: JSON.stringify(payload) });
  return material;
}

export interface UpdateMaterialPayload {
  id: string;
  sku?: string;
  name?: string;
  category?: MaterialCategory;
  unit?: MaterialUnit;
  reorderLevel?: number;
  unitCost?: number;
}

export async function updateMaterial(payload: UpdateMaterialPayload): Promise<Material> {
  const { id, ...body } = payload;
  const { material } = await apiRequest<{ material: Material }>(`/materials/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  return material;
}

export async function setMaterialStatus(payload: { id: string; status: MaterialStatus }): Promise<Material> {
  const { material } = await apiRequest<{ material: Material }>(`/materials/${payload.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: payload.status }),
  });
  return material;
}

export async function getMaterialTransactions(materialId: string): Promise<InventoryTransaction[]> {
  return apiRequest<InventoryTransaction[]>(`/materials/${materialId}/transactions`);
}

export interface RecordTransactionPayload {
  materialId: string;
  type: InventoryTransactionType;
  quantity: number;
  relatedProjectId?: string;
  note?: string;
}

export async function recordTransaction(payload: RecordTransactionPayload): Promise<Material> {
  const { materialId, ...body } = payload;
  const { material } = await apiRequest<{ material: Material }>(`/materials/${materialId}/transactions`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return material;
}
