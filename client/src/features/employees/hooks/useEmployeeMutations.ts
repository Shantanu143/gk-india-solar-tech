import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { createEmployee, resetEmployeePassword, setEmployeeStatus, updateEmployee } from "@/features/employees/services/employeeService";

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (employee) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeDetail(employee.id) });
    },
  });
}

export function useSetEmployeeStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setEmployeeStatus,
    onSuccess: (employee) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeDetail(employee.id) });
    },
  });
}

export function useResetEmployeePassword() {
  return useMutation({ mutationFn: resetEmployeePassword });
}
