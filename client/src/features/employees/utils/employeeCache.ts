import type { Employee } from "@/features/employees/types/employee";

/**
 * A handful of CRM components (badges, list rows, cards) need a *synchronous* "look up this
 * employee's name" — too small and too pervasive a need to turn each into its own async fetch.
 * `CRMLayout` (the single shell every admin/employee CRM page renders through) keeps this warm via
 * `useEmployees()`; nothing else needs to populate it.
 */
let cache: Employee[] = [];

export function setEmployeeCache(employees: Employee[]): void {
  cache = employees;
}

export function getEmployeeById(id: string | null | undefined): Employee | undefined {
  if (!id) return undefined;
  return cache.find((employee) => employee.id === id);
}
