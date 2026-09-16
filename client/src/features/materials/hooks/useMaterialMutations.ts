import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { createMaterial, recordTransaction, setMaterialStatus, updateMaterial } from "@/features/materials/services/materialService";

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.materials }),
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMaterial,
    onSuccess: (material) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialDetail(material.id) });
    },
  });
}

export function useSetMaterialStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setMaterialStatus,
    onSuccess: (material) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialDetail(material.id) });
    },
  });
}

export function useRecordTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordTransaction,
    onSuccess: (material) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialDetail(material.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialTransactions(material.id) });
    },
  });
}
