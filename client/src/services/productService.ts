import { mockDelay } from "./apiClient";
import { productCategories } from "@/data/solutions";
import type { ProductCategory } from "@/types/product";

/** TODO(Feature 9 — Product Management): replace with `apiRequest<ProductCategory[]>("/products")`. */
export async function getProductCategories(): Promise<ProductCategory[]> {
  return mockDelay(productCategories);
}
