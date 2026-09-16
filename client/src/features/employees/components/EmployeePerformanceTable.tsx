import { Avatar } from "@/features/crm/components/Avatar";
import { EmptyState } from "@/features/crm/components/EmptyState";
import type { EmployeePerformanceRow } from "@/features/crm/types/dashboard";

export function EmployeePerformanceTable({ rows }: { rows: EmployeePerformanceRow[] }) {
  if (rows.length === 0) return <EmptyState title="No employees found" />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {["Employee", "Assigned", "Contacted", "Follow-ups", "Surveys", "Quotations", "Converted"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.employeeId} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={row.employeeName} size="sm" />
                  <span className="font-medium text-navy">{row.employeeName}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-foreground/80">{row.assignedLeads}</td>
              <td className="px-3 py-3 text-foreground/80">{row.contacted}</td>
              <td className="px-3 py-3 text-foreground/80">{row.followUps}</td>
              <td className="px-3 py-3 text-foreground/80">{row.surveys}</td>
              <td className="px-3 py-3 text-foreground/80">{row.quotations}</td>
              <td className="px-3 py-3 font-semibold text-green">{row.converted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
