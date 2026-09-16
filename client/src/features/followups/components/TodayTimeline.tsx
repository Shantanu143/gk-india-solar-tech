import { Mail, MessageCircle, Phone, Users, type LucideIcon, Calendar } from "lucide-react";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { PriorityBadge } from "@/features/crm/components/PriorityBadge";
import { FOLLOW_UP_TYPE_LABEL, type FollowUp } from "@/features/followups/types/followUp";
import { formatTime } from "@/lib/format";

const TYPE_ICON: Record<FollowUp["type"], LucideIcon> = {
  CALL: Phone,
  WHATSAPP: MessageCircle,
  EMAIL: Mail,
  MEETING: Users,
  OTHER: Calendar,
};

interface TodayTimelineProps {
  followUps: FollowUp[];
  onOpen: (followUp: FollowUp) => void;
}

export function TodayTimeline({ followUps, onOpen }: TodayTimelineProps) {
  if (followUps.length === 0) {
    return <EmptyState title="No follow-ups today" description="You're all caught up." />;
  }

  const sorted = [...followUps].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <ol className="relative flex flex-col gap-1">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[52px] w-px bg-border" />
      {sorted.map((followUp) => {
        const Icon = TYPE_ICON[followUp.type];
        return (
          <li key={followUp.id}>
            <button
              type="button"
              onClick={() => onOpen(followUp)}
              className="flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left hover:bg-surface-muted"
            >
              <span className="w-11 shrink-0 text-xs font-semibold text-muted-foreground">{formatTime(`${followUp.date}T${followUp.time}:00`)}</span>
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/8 text-navy">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-navy">
                  {FOLLOW_UP_TYPE_LABEL[followUp.type]} — {followUp.customerName}
                </span>
                {followUp.notes && <span className="block truncate text-xs text-muted-foreground">{followUp.notes}</span>}
              </span>
              <PriorityBadge priority={followUp.priority} />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
