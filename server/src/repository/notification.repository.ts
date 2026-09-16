import type { Types } from "mongoose";
import { NotificationModel, type NotificationType } from "../models/Notification.model";

export interface CreateNotificationInput {
  recipient: string | Types.ObjectId;
  type: NotificationType;
  title: string;
  description: string;
  lead?: string | Types.ObjectId | null;
}

export const notificationRepository = {
  /** Most recent first, capped — this is a dropdown feed, not a paginated inbox. */
  listForRecipient(recipientId: string, limit = 30) {
    return NotificationModel.find({ recipient: recipientId }).sort({ createdAt: -1 }).limit(limit);
  },

  create(input: CreateNotificationInput) {
    return NotificationModel.create(input);
  },

  createMany(inputs: CreateNotificationInput[]) {
    if (inputs.length === 0) return Promise.resolve([]);
    return NotificationModel.insertMany(inputs);
  },

  markRead(id: string, recipientId: string) {
    return NotificationModel.findOneAndUpdate({ _id: id, recipient: recipientId }, { read: true }, { new: true });
  },
};
