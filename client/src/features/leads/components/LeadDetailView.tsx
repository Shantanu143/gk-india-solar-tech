import { useState } from "react";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { AssignLeadModal } from "@/features/leads/components/AssignLeadModal";
import { LeadActions } from "@/features/leads/components/LeadActions";
import { LeadHeader } from "@/features/leads/components/LeadHeader";
import { LeadStatusControl } from "@/features/leads/components/LeadStatusControl";
import { LeadTabs } from "@/features/leads/components/LeadTabs";
import { useLead } from "@/features/leads/hooks/useLead";
import { CreateFollowUpModal } from "@/features/followups/components/CreateFollowUpModal";
import { ScheduleSurveyModal } from "@/features/surveys/components/ScheduleSurveyModal";
import { useAuth } from "@/features/crm/hooks/authContext";

interface LeadDetailViewProps {
  leadId: string;
  backHref: string;
}

export function LeadDetailView({ leadId, backHref }: LeadDetailViewProps) {
  const { data: lead, isLoading, isError, refetch } = useLead(leadId);
  const { can } = useAuth();
  const [assignOpen, setAssignOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [scheduleSurveyOpen, setScheduleSurveyOpen] = useState(false);

  if (isLoading) return <SkeletonRows rows={6} />;
  if (isError || !lead) {
    return <ErrorState title="We couldn't display this lead." description="It may have been removed or the link is incorrect." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <LeadHeader lead={lead} backHref={backHref} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/55 p-4 shadow-[0_8px_32px_-12px_rgba(0,22,63,0.12)] backdrop-blur-xl">
        <LeadActions
          lead={lead}
          onAssign={can("leads.assign") ? () => setAssignOpen(true) : undefined}
          onAddFollowUp={() => setFollowUpOpen(true)}
          onScheduleSurvey={() => setScheduleSurveyOpen(true)}
        />
        <LeadStatusControl lead={lead} />
      </div>

      <LeadTabs lead={lead} />

      <AssignLeadModal open={assignOpen} onOpenChange={setAssignOpen} lead={lead} />
      <CreateFollowUpModal open={followUpOpen} onOpenChange={setFollowUpOpen} lead={lead} />
      <ScheduleSurveyModal open={scheduleSurveyOpen} onOpenChange={setScheduleSurveyOpen} lead={lead} />
    </div>
  );
}
