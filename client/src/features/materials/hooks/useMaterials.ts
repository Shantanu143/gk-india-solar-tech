import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getMaterial, getMaterials, getMaterialTransactions, type GetMaterialsParams } from "@/features/materials/services/materialService";

export function useMaterials(params: GetMaterialsParams = {}) {
  return useQuery({
    queryKey: queryKeys.materialsList(params),
    queryFn: () => getMaterials(params),
  });
}

export function useMaterial(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.materialDetail(id ?? ""),
    queryFn: () => getMaterial(id as string),
    enabled: !!id,
  });
}

export function useMaterialTransactions(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.materialTransactions(id ?? ""),
    queryFn: () => getMaterialTransactions(id as string),
    enabled: !!id,
  });
}
