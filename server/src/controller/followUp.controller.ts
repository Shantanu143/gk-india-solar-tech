import { followUpService } from "../service/followUp.service";
import { asyncHandler } from "../util/asyncHandler";
import { can } from "../util/permissions";
import { listFollowUpsQuerySchema } from "../validation/followUp.validation";

export const followUpController = {
  list: asyncHandler(async (req, res) => {
    const query = listFollowUpsQuerySchema.parse(req.query);
    if (!can(req.user!.role, "leads.viewAll")) {
      query.assignedEmployeeId = req.user!.id;
    }
    const followUps = await followUpService.getFollowUps(query);
    res.json(followUps);
  }),

  get: asyncHandler(async (req, res) => {
    const followUp = await followUpService.getFollowUp(req.params.id);
    res.json({ followUp });
  }),

  create: asyncHandler(async (req, res) => {
    // A follow-up is always self-assigned to whoever creates it — never trusted from the client.
    const followUp = await followUpService.createFollowUp({ ...req.body, assignedEmployeeId: req.user!.id, actorName: req.user!.name });
    res.status(201).json({ followUp });
  }),

  complete: asyncHandler(async (req, res) => {
    const result = await followUpService.completeFollowUp({ id: req.params.id, ...req.body, actorName: req.user!.name });
    res.json(result);
  }),

  reschedule: asyncHandler(async (req, res) => {
    const followUp = await followUpService.rescheduleFollowUp({
      id: req.params.id,
      date: req.body.date,
      time: req.body.time,
      reason: req.body.reason,
      actorName: req.user!.name,
    });
    res.json({ followUp });
  }),

  cancel: asyncHandler(async (req, res) => {
    const followUp = await followUpService.cancelFollowUp({ id: req.params.id, actorName: req.user!.name });
    res.json({ followUp });
  }),
};
