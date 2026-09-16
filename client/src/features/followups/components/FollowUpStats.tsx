import { AlertCircle, CalendarCheck, CalendarClock, CalendarDays } from "lucide-react";
import { MetricCard } from "@/features/crm/components/MetricCard";
import { useFollowUps } from "@/features/followups/hooks/useFollowUps";

interface FollowUpStatsProps {
  assignedEmployeeId?: string;
}

export function FollowUpStats({ assignedEmployeeId }: FollowUpStatsProps) {
  const { data: today = [] } = useFollowUps({ assignedEmployeeId, scope: "today" });
  const { data: overdue = [] } = useFollowUps({ assignedEmployeeId, scope: "overdue" });
  const { data: upcoming = [] } = useFollowUps({ assignedEmployeeId, scope: "upcoming" });
  const { data: completed = [] } = useFollowUps({ assignedEmployeeId, scope: "completed" });

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard icon={CalendarDays} label="Today" value={today.length} tone="navy" />
      <MetricCard icon={AlertCircle} label="Overdue" value={overdue.length} tone="orange" />
      <MetricCard icon={CalendarClock} label="Upcoming" value={upcoming.length} tone="navy" />
      <MetricCard icon={CalendarCheck} label="Completed" value={completed.length} tone="green" />
    </div>
  );
}
