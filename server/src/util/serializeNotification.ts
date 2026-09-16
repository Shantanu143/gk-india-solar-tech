import type { NotificationDocument } from "../models/Notification.model";

export function toPublicNotification(notification: NotificationDocument) {
  return {
    id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    description: notification.description,
    leadId: notification.lead ? notification.lead.toString() : undefined,
    read: notification.read,
    createdAt: notification.createdAt.toISOString(),
  };
}

export type PublicNotification = ReturnType<typeof toPublicNotification>;
