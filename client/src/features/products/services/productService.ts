import { apiRequest } from "@/services/apiClient";
import type { PaginatedResult } from "@/features/crm/types/api";
import type { Product, ProductCategory, ProductStatus, ProductUnit } from "@/features/products/types/product";

export interface GetProductsParams {
  category?: ProductCategory;
  status?: ProductStatus;
  search?: string;
}

/** Product counts are small for this kind of catalog — one large page covers everything. */
export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  const search = new URLSearchParams({ pageSize: "200" });
  if (params.category) search.set("category", params.category);
  if (params.status) search.set("status", params.status);
  if (params.search) search.set("search", params.search);
  const result = await apiRequest<PaginatedResult<Product>>(`/products?${search.toString()}`);
  return result.items;
}

export async function getProduct(id: string): Promise<Product> {
  const { product } = await apiRequest<{ product: Product }>(`/products/${id}`);
  return product;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  unit: ProductUnit;
  description?: string;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { product } = await apiRequest<{ product: Product }>("/products", { method: "POST", body: JSON.stringify(payload) });
  return product;
}

export interface UpdateProductPayload {
  id: string;
  sku?: string;
  name?: string;
  category?: ProductCategory;
  unitPrice?: number;
  unit?: ProductUnit;
  description?: string;
}

export async function updateProduct(payload: UpdateProductPayload): Promise<Product> {
  const { id, ...body } = payload;
  const { product } = await apiRequest<{ product: Product }>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  return product;
}

export interface SetProductStatusPayload {
  id: string;
  status: ProductStatus;
}

export async function setProductStatus(payload: SetProductStatusPayload): Promise<Product> {
  const { product } = await apiRequest<{ product: Product }>(`/products/${payload.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: payload.status }),
  });
  return product;
}
