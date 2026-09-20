import { commissionRuleService } from "../service/commissionRule.service";
import { commissionService } from "../service/commission.service";
import { PartnerModel } from "../models/Partner.model";
import { asyncHandler } from "../util/asyncHandler";
import { ApiError } from "../util/ApiError";
import { listCommissionsQuerySchema, paginationQuerySchema } from "../validation/commission.validation";

export const commissionController = {
  createRule: asyncHandler(async (req, res) => {
    const rule = await commissionRuleService.createRule(req.body);
    res.status(201).json({ rule });
  }),

  listRules: asyncHandler(async (_req, res) => {
    const rules = await commissionRuleService.listRules();
    res.json({ rules });
  }),

  updateRule: asyncHandler(async (req, res) => {
    const rule = await commissionRuleService.updateRule(req.params.id, req.body);
    res.json({ rule });
  }),

  list: asyncHandler(async (req, res) => {
    const query = listCommissionsQuerySchema.parse(req.query);
    const result = await commissionService.listCommissions(query);
    res.json(result);
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const commission = await commissionService.updateStatus(req.params.id, req.body);
    res.json({ commission });
  }),

  /** The calling partner's own commissions. Resolved directly against PartnerModel rather than
   * depending on the in-progress partner-repository work happening elsewhere in parallel. */
  listMine: asyncHandler(async (req, res) => {
    const query = paginationQuerySchema.parse(req.query);
    const partner = await PartnerModel.findOne({ user: req.user!.id });
    if (!partner) throw ApiError.notFound("Partner profile not found.");

    const result = await commissionService.listForPartner(partner._id.toString(), query);
    res.json(result);
  }),
};
