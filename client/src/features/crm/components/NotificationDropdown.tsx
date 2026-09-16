import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, Calendar, ClipboardCheck, FileText, UserPlus, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMarkNotificationRead, useNotifications } from "@/features/crm/hooks/useNotifications";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/features/crm/types/notification";

const NOTIFICATION_ICON: Record<NotificationType, LucideIcon> = {
  LEAD_ASSIGNED: UserPlus,
  FOLLOW_UP_DUE: Calendar,
  FOLLOW_UP_OVERDUE: Calendar,
  SURVEY_SCHEDULED: ClipboardCheck,
  QUOTATION_READY: FileText,
};

interface NotificationDropdownProps {
  leadDetailPath: (leadId: string) => string;
}

export function NotificationDropdown({ leadDetailPath }: NotificationDropdownProps) {
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-navy transition-colors hover:border-white/60 hover:bg-white/50"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-80 rounded-2xl border border-white/60 bg-white/80 p-2 shadow-soft-lg backdrop-blur-2xl"
        >
          <p className="px-2 py-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">Notifications</p>
          {notifications.length === 0 ? (
            <EmptyState title="You're all caught up." className="py-8" />
          ) : (
            <div className="flex max-h-96 flex-col overflow-y-auto">
              {notifications.map((notification) => {
                const Icon = NOTIFICATION_ICON[notification.type];
                const content = (
                  <div className={cn("flex gap-3 rounded-lg px-2 py-2.5 hover:bg-surface-muted", !notification.read && "bg-orange/5")}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/8 text-navy">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy">{notification.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{notification.description}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
                    </div>
                    {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange" aria-hidden="true" />}
                  </div>
                );
                return (
                  <DropdownMenu.Item key={notification.id} asChild onSelect={() => markRead.mutate(notification.id)}>
                    {notification.leadId ? (
                      <Link to={leadDetailPath(notification.leadId)}>{content}</Link>
                    ) : (
                      <div>{content}</div>
                    )}
                  </DropdownMenu.Item>
                );
              })}
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
