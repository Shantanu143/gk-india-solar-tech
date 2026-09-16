import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getProducts, type GetProductsParams } from "@/features/products/services/productService";

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: queryKeys.productsList(params),
    queryFn: () => getProducts(params),
  });
}
