import { notificationService } from "../service/notification.service";
import { asyncHandler } from "../util/asyncHandler";

export const notificationController = {
  list: asyncHandler(async (req, res) => {
    const notifications = await notificationService.getForUser(req.user!.id);
    res.json(notifications);
  }),

  markRead: asyncHandler(async (req, res) => {
    const notification = await notificationService.markRead(req.params.id, req.user!.id);
    res.json(notification);
  }),
};
