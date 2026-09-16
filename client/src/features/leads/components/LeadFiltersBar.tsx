import { FilterSelect } from "@/features/crm/components/FilterSelect";
import { LEAD_SOURCE_LABEL, PROJECT_TYPE_LABEL, type LeadFilters } from "@/features/leads/types/lead";
import { LEAD_STATUS_CONFIG } from "@/features/leads/utils/leadStatusConfig";
import type { Employee } from "@/features/employees/types/employee";

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
  employees?: Employee[];
}

export function LeadFiltersBar({ filters, onChange, employees }: LeadFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterSelect
        label="Status"
        value={filters.status ?? "ALL"}
        onChange={(v) => onChange({ ...filters, status: v === "ALL" ? undefined : (v as LeadFilters["status"]) })}
        options={[
          { value: "ALL", label: "All Statuses" },
          ...Object.entries(LEAD_STATUS_CONFIG).map(([value, config]) => ({ value, label: config.label })),
        ]}
        className="w-40"
      />
      <FilterSelect
        label="Project Type"
        value={filters.projectType ?? "ALL"}
        onChange={(v) => onChange({ ...filters, projectType: v === "ALL" ? undefined : (v as LeadFilters["projectType"]) })}
        options={[{ value: "ALL", label: "All Types" }, ...Object.entries(PROJECT_TYPE_LABEL).map(([value, label]) => ({ value, label }))]}
        className="w-36"
      />
      <FilterSelect
        label="Source"
        value={filters.source ?? "ALL"}
        onChange={(v) => onChange({ ...filters, source: v === "ALL" ? undefined : (v as LeadFilters["source"]) })}
        options={[{ value: "ALL", label: "All Sources" }, ...Object.entries(LEAD_SOURCE_LABEL).map(([value, label]) => ({ value, label }))]}
        className="w-36"
      />
      <FilterSelect
        label="Interest"
        value={filters.interest ?? "ALL"}
        onChange={(v) => onChange({ ...filters, interest: v === "ALL" ? undefined : (v as LeadFilters["interest"]) })}
        options={[
          { value: "ALL", label: "All Interest" },
          { value: "LOW", label: "Low" },
          { value: "MEDIUM", label: "Medium" },
          { value: "HIGH", label: "High" },
        ]}
        className="w-36"
      />
      {employees && (
        <FilterSelect
          label="Assigned Employee"
          value={filters.assignedEmployeeId ?? "ALL"}
          onChange={(v) => onChange({ ...filters, assignedEmployeeId: v === "ALL" ? undefined : v })}
          options={[{ value: "ALL", label: "All Employees" }, ...employees.map((e) => ({ value: e.id, label: e.name }))]}
          className="w-40"
        />
      )}
    </div>
  );
}
