import { partnerLeadService } from "../service/partnerLead.service";
import { asyncHandler } from "../util/asyncHandler";
import { listPartnerLeadsQuerySchema } from "../validation/partnerLead.validation";

export const partnerLeadController = {
  create: asyncHandler(async (req, res) => {
    const lead = await partnerLeadService.submitLead(req.user!.id, req.body);
    res.status(201).json({ lead });
  }),

  list: asyncHandler(async (req, res) => {
    const query = listPartnerLeadsQuerySchema.parse(req.query);
    const result = await partnerLeadService.listMyLeads(req.user!.id, query);
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const result = await partnerLeadService.getMyLead(req.user!.id, req.params.leadId);
    res.json(result);
  }),
};
