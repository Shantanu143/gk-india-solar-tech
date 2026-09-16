import { apiRequest } from "@/services/apiClient";
import type { Employee, EmployeeRole, EmployeeStatus } from "@/features/employees/types/employee";
import type { PaginatedResult } from "@/features/crm/types/api";

/** Employee counts are always small for this kind of business — one large page covers everyone. */
export async function getEmployees(): Promise<Employee[]> {
  const result = await apiRequest<PaginatedResult<Employee>>("/employees?pageSize=200");
  return result.items;
}

export async function getEmployee(id: string): Promise<Employee> {
  const { employee } = await apiRequest<{ employee: Employee }>(`/employees/${id}`);
  return employee;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: EmployeeRole;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const { employee } = await apiRequest<{ employee: Employee }>("/employees", { method: "POST", body: JSON.stringify(payload) });
  return employee;
}

export interface UpdateEmployeePayload {
  id: string;
  name?: string;
  phone?: string;
  role?: EmployeeRole;
}

export async function updateEmployee(payload: UpdateEmployeePayload): Promise<Employee> {
  const { id, ...body } = payload;
  const { employee } = await apiRequest<{ employee: Employee }>(`/employees/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  return employee;
}

export interface SetEmployeeStatusPayload {
  id: string;
  status: EmployeeStatus;
}

export async function setEmployeeStatus(payload: SetEmployeeStatusPayload): Promise<Employee> {
  const { employee } = await apiRequest<{ employee: Employee }>(`/employees/${payload.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: payload.status }),
  });
  return employee;
}

export interface ResetEmployeePasswordPayload {
  id: string;
  password: string;
}

export async function resetEmployeePassword(payload: ResetEmployeePasswordPayload): Promise<void> {
  await apiRequest<void>(`/employees/${payload.id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ password: payload.password }),
  });
}
