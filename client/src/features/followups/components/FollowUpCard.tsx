import { Link } from "react-router-dom";
import { Calendar, Mail, MessageCircle, Phone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PriorityBadge } from "@/features/crm/components/PriorityBadge";
import { FollowUpStatusBadge } from "@/features/followups/components/FollowUpStatusBadge";
import { FOLLOW_UP_TYPE_LABEL, type FollowUp } from "@/features/followups/types/followUp";
import { formatDate, formatTime } from "@/lib/format";

const TYPE_ICON: Record<FollowUp["type"], LucideIcon> = {
  CALL: Phone,
  WHATSAPP: MessageCircle,
  EMAIL: Mail,
  MEETING: Users,
  OTHER: Calendar,
};

interface FollowUpCardProps {
  followUp: FollowUp;
  leadDetailHref: string;
  onOpen?: () => void;
}

export function FollowUpCard({ followUp, leadDetailHref, onOpen }: FollowUpCardProps) {
  const Icon = TYPE_ICON[followUp.type];

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-navy">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold text-navy">{followUp.customerName}</p>
            <p className="text-xs text-muted-foreground">{FOLLOW_UP_TYPE_LABEL[followUp.type]}</p>
          </div>
        </div>
        <PriorityBadge priority={followUp.priority} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-foreground/80">
        <span>{formatDate(`${followUp.date}T00:00:00`)}</span>
        <span aria-hidden="true">·</span>
        <span>{formatTime(`${followUp.date}T${followUp.time}:00`)}</span>
      </div>

      {followUp.notes && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{followUp.notes}</p>}

      <div className="mt-3 flex items-center justify-between">
        <FollowUpStatusBadge followUp={followUp} />
        <div className="flex gap-2">
          {onOpen && (
            <button type="button" onClick={onOpen} className="text-xs font-semibold text-navy hover:text-orange">
              Open
            </button>
          )}
          <Link to={leadDetailHref} className="text-xs font-semibold text-navy hover:text-orange">
            View Lead
          </Link>
        </div>
      </div>
    </Card>
  );
}
