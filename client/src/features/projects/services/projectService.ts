import { apiRequest } from "@/services/apiClient";
import type { Project, ProjectDocumentFile, ProjectStatus } from "@/features/projects/types/project";

export interface GetProjectsParams {
  status?: ProjectStatus;
  assignedEmployeeId?: string;
}

function toQueryString(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getProjects(params: GetProjectsParams = {}): Promise<Project[]> {
  const qs = toQueryString({ ...params });
  return apiRequest<Project[]>(`/projects${qs}`);
}

export async function getProject(id: string): Promise<Project> {
  const { project } = await apiRequest<{ project: Project }>(`/projects/${id}`);
  return project;
}

export async function getProjectByCustomerId(customerId: string): Promise<Project | null> {
  const { project } = await apiRequest<{ project: Project | null }>(`/projects/for-customer/${customerId}`);
  return project;
}

export async function updateProjectStatus(input: { id: string; status: ProjectStatus }): Promise<Project> {
  const { project } = await apiRequest<{ project: Project }>(`/projects/${input.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: input.status }),
  });
  return project;
}

export async function addProjectDocument(input: { id: string; document: Omit<ProjectDocumentFile, "uploadedAt"> }): Promise<Project> {
  const { project } = await apiRequest<{ project: Project }>(`/projects/${input.id}/documents`, {
    method: "POST",
    body: JSON.stringify(input.document),
  });
  return project;
}
