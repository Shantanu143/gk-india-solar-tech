import { leadService } from "../service/lead.service";
import { userRepository } from "../repository/user.repository";
import { asyncHandler } from "../util/asyncHandler";
import { can } from "../util/permissions";
import { listLeadsQuerySchema } from "../validation/lead.validation";

export const leadController = {
  list: asyncHandler(async (req, res) => {
    const query = listLeadsQuerySchema.parse(req.query);
    // Without leads.viewAll, a request can only ever see its own assigned leads — regardless of
    // what assignedEmployeeId the query string asked for.
    if (!can(req.user!.role, "leads.viewAll")) {
      query.assignedEmployeeId = req.user!.id;
    }
    const result = await leadService.getLeads(query);
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const lead = await leadService.getLead(req.params.id);
    res.json({ lead });
  }),

  create: asyncHandler(async (req, res) => {
    const lead = await leadService.createLead(req.body);
    res.status(201).json({ lead });
  }),

  assign: asyncHandler(async (req, res) => {
    const employee = await userRepository.findById(req.body.employeeId);
    const lead = await leadService.assignLead({
      leadId: req.params.id,
      employeeId: req.body.employeeId,
      priority: req.body.priority,
      actorName: req.user!.name,
      employeeName: employee?.name ?? "an employee",
    });
    res.json({ lead });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const lead = await leadService.updateLeadStatus({
      leadId: req.params.id,
      status: req.body.status,
      lostReason: req.body.lostReason,
      actorName: req.user!.name,
    });
    res.json({ lead });
  }),

  addRemark: asyncHandler(async (req, res) => {
    const lead = await leadService.addRemark({
      leadId: req.params.id,
      remark: req.body.remark,
      interest: req.body.interest,
      actorName: req.user!.name,
    });
    res.json({ lead });
  }),
};
