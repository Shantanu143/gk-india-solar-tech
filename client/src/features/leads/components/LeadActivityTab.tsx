import { ActivityTimeline } from "@/features/crm/components/ActivityTimeline";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { useActivities } from "@/features/crm/hooks/useActivities";

export function LeadActivityTab({ leadId }: { leadId: string }) {
  const { data: activities = [], isLoading, isError, refetch } = useActivities(leadId);

  if (isLoading) return <SkeletonRows rows={5} />;
  if (isError) return <ErrorState title="Couldn't load activity." onRetry={() => refetch()} />;
  if (activities.length === 0) return <EmptyState title="No activity yet" />;

  return <ActivityTimeline activities={activities} />;
}
