import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getEmployee, getEmployees } from "@/features/employees/services/employeeService";

export function useEmployees() {
  return useQuery({ queryKey: queryKeys.employees, queryFn: getEmployees });
}

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.employeeDetail(id ?? ""),
    queryFn: () => getEmployee(id as string),
    enabled: !!id,
  });
}
