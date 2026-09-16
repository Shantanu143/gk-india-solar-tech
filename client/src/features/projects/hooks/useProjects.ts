import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getProject, getProjectByCustomerId, getProjects, type GetProjectsParams } from "@/features/projects/services/projectService";

export function useProjects(params: GetProjectsParams = {}) {
  return useQuery({
    queryKey: queryKeys.projectsList(params),
    queryFn: () => getProjects(params),
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projectDetail(id ?? ""),
    queryFn: () => getProject(id as string),
    enabled: !!id,
  });
}

export function useProjectForCustomer(customerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projectForCustomer(customerId ?? ""),
    queryFn: () => getProjectByCustomerId(customerId as string),
    enabled: !!customerId,
  });
}
