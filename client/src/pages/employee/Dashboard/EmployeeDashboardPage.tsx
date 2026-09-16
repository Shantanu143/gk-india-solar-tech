import { Link } from "react-router-dom";
import { AlertCircle, CalendarClock, ClipboardList, FileText, UserPlus, Users } from "lucide-react";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { Seo } from "@/components/layout/Seo";
import { useAuth } from "@/features/crm/hooks/authContext";
import { MetricCard } from "@/features/crm/components/MetricCard";
import { SkeletonCards, SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { TodayPriorities } from "@/features/crm/components/TodayPriorities";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { FollowUpCard } from "@/features/followups/components/FollowUpCard";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { useFollowUps } from "@/features/followups/hooks/useFollowUps";
import { LeadCard } from "@/features/leads/components/LeadCard";
import { useLeads } from "@/features/leads/hooks/useLeads";

export function EmployeeDashboardPage() {
  const { user } = useAuth();
  const employeeId = user?.id ?? "";
  const firstName = user?.name.split(" ")[0] ?? "there";

  const { data: myLeads, isLoading: leadsLoading } = useLeads({ assignedEmployeeId: employeeId, pageSize: 4 });
  const { data: newLeads } = useLeads({ assignedEmployeeId: employeeId, status: "NEW", pageSize: 1 });
  const { data: todayFollowUps, isLoading: followUpsLoading } = useFollowUps({ assignedEmployeeId: employeeId, scope: "today" });
  const { data: overdueFollowUps } = useFollowUps({ assignedEmployeeId: employeeId, scope: "overdue" });
  const { data: surveyLeads } = useLeads({ assignedEmployeeId: employeeId, status: "SURVEY_REQUESTED", pageSize: 1 });
  const { data: quotationLeads } = useLeads({ assignedEmployeeId: employeeId, status: "QUOTATION_PREPARED", pageSize: 1 });

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Dashboard | GK India SolarTech CRM" description="Employee dashboard." path={CRM_ROUTES.employeeDashboard} noindex />

      <div>
        <h1 className="text-2xl font-bold text-navy">Good morning, {firstName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what needs your attention today.</p>
      </div>

      {leadsLoading ? (
        <SkeletonCards count={6} />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard icon={Users} label="My Leads" value={myLeads?.total ?? 0} tone="navy" />
          <MetricCard icon={UserPlus} label="New Leads" value={newLeads?.total ?? 0} tone="orange" />
          <MetricCard icon={CalendarClock} label="Follow-ups Today" value={todayFollowUps?.length ?? 0} tone="orange" />
          <MetricCard icon={AlertCircle} label="Overdue Follow-ups" value={overdueFollowUps?.length ?? 0} tone="orange" />
          <MetricCard icon={ClipboardList} label="Upcoming Surveys" value={surveyLeads?.total ?? 0} tone="navy" />
          <MetricCard icon={FileText} label="Quotations Pending" value={quotationLeads?.total ?? 0} tone="navy" />
        </div>
      )}

      <Card className="p-5">
        <h2 className="text-base font-bold text-navy">Today's Priorities</h2>
        <div className="mt-4">{employeeId && <TodayPriorities employeeId={employeeId} />}</div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy">My Leads</h2>
            <Link to={CRM_ROUTES.employeeLeads} className="text-sm font-semibold text-navy hover:text-orange">
              View All
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {leadsLoading ? (
              <SkeletonRows rows={3} />
            ) : myLeads && myLeads.items.length > 0 ? (
              myLeads.items.map((lead) => (
                <LeadCard key={lead.id} lead={lead} detailHref={CRM_ROUTES.employeeLeadDetail(lead.id)} showAssignee={false} />
              ))
            ) : (
              <EmptyState title="No leads assigned yet" description="You don't have any leads assigned yet." />
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy">Today's Follow-ups</h2>
            <Link to={CRM_ROUTES.employeeFollowUps} className="text-sm font-semibold text-navy hover:text-orange">
              View All
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {followUpsLoading ? (
              <SkeletonRows rows={3} />
            ) : todayFollowUps && todayFollowUps.length > 0 ? (
              todayFollowUps.map((followUp) => (
                <FollowUpCard key={followUp.id} followUp={followUp} leadDetailHref={CRM_ROUTES.employeeLeadDetail(followUp.leadId)} />
              ))
            ) : (
              <EmptyState title="No follow-ups today" description="You're all caught up." />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
