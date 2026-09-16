import { activityService } from "../service/activity.service";
import { asyncHandler } from "../util/asyncHandler";

export const activityController = {
  listForLead: asyncHandler(async (req, res) => {
    const activities = await activityService.getForLead(req.params.leadId);
    res.json(activities);
  }),
};
