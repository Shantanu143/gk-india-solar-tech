import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { addProjectDocument, updateProjectStatus } from "@/features/projects/services/projectService";

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectStatus,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectDetail(project.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useAddProjectDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProjectDocument,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectDetail(project.id) });
    },
  });
}
