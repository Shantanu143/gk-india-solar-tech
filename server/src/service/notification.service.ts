import { notificationRepository, type CreateNotificationInput } from "../repository/notification.repository";
import { userRepository } from "../repository/user.repository";
import { ApiError } from "../util/ApiError";
import { toPublicNotification, type PublicNotification } from "../util/serializeNotification";
import type { UserRole } from "../models/User.model";

export const notificationService = {
  async getForUser(userId: string): Promise<PublicNotification[]> {
    const items = await notificationRepository.listForRecipient(userId);
    return items.map(toPublicNotification);
  },

  async markRead(id: string, userId: string): Promise<PublicNotification> {
    const notification = await notificationRepository.markRead(id, userId);
    if (!notification) throw ApiError.notFound("Notification not found.");
    return toPublicNotification(notification);
  },

  /** Fire-and-forget — a failure to notify should never fail the action that triggered it. */
  async notify(input: CreateNotificationInput): Promise<void> {
    try {
      await notificationRepository.create(input);
    } catch {
      // Notifications are a convenience layer; swallow errors rather than surface them to the caller.
    }
  },

  /** Same as `notify`, broadcast to every active user holding one of the given roles (e.g. admins/managers). */
  async notifyRoles(roles: UserRole[], input: Omit<CreateNotificationInput, "recipient">): Promise<void> {
    try {
      const recipientIds = await userRepository.findIdsByRoles(roles);
      await notificationRepository.createMany(recipientIds.map((recipient) => ({ ...input, recipient })));
    } catch {
      // Notifications are a convenience layer; swallow errors rather than surface them to the caller.
    }
  },
};
