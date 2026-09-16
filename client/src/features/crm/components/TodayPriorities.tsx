import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone, Users, type LucideIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { useFollowUps } from "@/features/followups/hooks/useFollowUps";
import { getFollowUpDateTime, isFollowUpOverdue, type FollowUp } from "@/features/followups/types/followUp";
import { useLead } from "@/features/leads/hooks/useLead";
import { formatTime } from "@/lib/format";

const TYPE_ICON: Record<FollowUp["type"], LucideIcon> = {
  CALL: Phone,
  WHATSAPP: MessageCircle,
  EMAIL: Mail,
  MEETING: Users,
  OTHER: Calendar,
};

interface PriorityItemProps {
  followUp: FollowUp;
  index: number;
}

/** Its own component (not a `.map()` callback) so it can hold a real `useLead` query per item. */
function PriorityItem({ followUp, index }: PriorityItemProps) {
  const { data: lead } = useLead(followUp.leadId);
  const Icon = TYPE_ICON[followUp.type];
  const overdueFlag = isFollowUpOverdue(followUp);

  return (
    <li className="flex items-start gap-3 rounded-xl border border-white/50 bg-white/40 p-4 backdrop-blur-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
        {index + 1}
      </span>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-navy">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-navy">
          {followUp.type === "CALL" ? "Call" : "Follow up with"} {followUp.customerName}
        </p>
        {lead && (
          <p className="text-sm text-muted-foreground">
            {lead.projectType.charAt(0) + lead.projectType.slice(1).toLowerCase()} · {lead.solarRecommendation.recommendedCapacity} kW
          </p>
        )}
        <p className={overdueFlag ? "text-sm font-semibold text-error" : "text-sm text-muted-foreground"}>
          {overdueFlag ? "Overdue — was due" : "Due"} {formatTime(`${followUp.date}T${followUp.time}:00`)}
        </p>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {lead && (followUp.type === "CALL" || followUp.type === "WHATSAPP") && (
            <>
              <Button asChild size="sm" className="gap-1.5">
                <a href={`tel:${lead.customer.mobile}`}>
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  Call
                </a>
              </Button>
              <Button asChild variant="secondary" size="sm" className="gap-1.5">
                <a href={`https://wa.me/91${lead.customer.whatsapp}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
            </>
          )}
          <Button asChild variant="secondary" size="sm">
            <Link to={CRM_ROUTES.employeeLeadDetail(followUp.leadId)}>View Lead</Link>
          </Button>
        </div>
      </div>
    </li>
  );
}

export function TodayPriorities({ employeeId }: { employeeId: string }) {
  const { data: today = [], isLoading: todayLoading } = useFollowUps({ assignedEmployeeId: employeeId, scope: "today" });
  const { data: overdue = [], isLoading: overdueLoading } = useFollowUps({ assignedEmployeeId: employeeId, scope: "overdue" });

  if (todayLoading || overdueLoading) return <SkeletonRows rows={3} />;

  const combined = [...overdue, ...today].sort(
    (a, b) => getFollowUpDateTime(a).getTime() - getFollowUpDateTime(b).getTime(),
  );

  if (combined.length === 0) {
    return <EmptyState title="You're all caught up." description="No priorities need your attention right now." />;
  }

  return (
    <ol className="flex flex-col gap-3">
      {combined.map((followUp, i) => (
        <PriorityItem key={followUp.id} followUp={followUp} index={i} />
      ))}
    </ol>
  );
}
