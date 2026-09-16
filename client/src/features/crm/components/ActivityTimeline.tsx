import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  ClipboardCheck,
  FileText,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Send,
  UserCheck,
  UserPlus,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/format";
import type { Activity, ActivityType } from "@/features/crm/types/activity";

const ACTIVITY_ICON: Record<ActivityType, LucideIcon> = {
  LEAD_CREATED: UserPlus,
  LEAD_ASSIGNED: UserCheck,
  CUSTOMER_CONTACTED: Phone,
  STATUS_CHANGED: RefreshCw,
  REMARK_ADDED: MessageSquare,
  FOLLOW_UP_CREATED: CalendarPlus,
  FOLLOW_UP_COMPLETED: CalendarCheck,
  FOLLOW_UP_RESCHEDULED: CalendarClock,
  FOLLOW_UP_CANCELLED: CalendarX,
  SURVEY_REQUESTED: MapPin,
  SURVEY_COMPLETED: ClipboardCheck,
  QUOTATION_CREATED: FileText,
  QUOTATION_SENT: Send,
  LEAD_LOST: XCircle,
};

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const sorted = [...activities].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <ol className="relative flex flex-col gap-6">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-4 w-px bg-border" />
      {sorted.map((activity, i) => {
        const Icon = ACTIVITY_ICON[activity.type];
        return (
          <motion.li
            key={activity.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i, 6) * 0.03 }}
            className="relative flex gap-4"
          >
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/8 text-navy">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="pt-1">
              <p className="text-sm font-medium text-foreground/90">{activity.description}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activity.actorName} · {formatDateTime(activity.createdAt)}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
