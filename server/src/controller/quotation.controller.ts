import { quotationService } from "../service/quotation.service";
import { leadRepository } from "../repository/lead.repository";
import { asyncHandler } from "../util/asyncHandler";
import { ApiError } from "../util/ApiError";
import { can } from "../util/permissions";
import { listQuotationsQuerySchema } from "../validation/quotation.validation";
import { renderQuotationPdf } from "../util/renderQuotationPdf";

export const quotationController = {
  list: asyncHandler(async (req, res) => {
    const query = listQuotationsQuerySchema.parse(req.query);
    const relevantToEmployeeId = can(req.user!.role, "leads.viewAll") ? undefined : req.user!.id;
    const result = await quotationService.getQuotations({ ...query, relevantToEmployeeId });
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const quotation = await quotationService.getQuotation(req.params.id);
    res.json({ quotation });
  }),

  getForLead: asyncHandler(async (req, res) => {
    const quotation = await quotationService.getQuotationByLeadId(req.params.leadId);
    res.json({ quotation });
  }),

  create: asyncHandler(async (req, res) => {
    const quotation = await quotationService.createQuotation({ leadId: req.body.leadId, actorName: req.user!.name });
    res.status(201).json({ quotation });
  }),

  updateItems: asyncHandler(async (req, res) => {
    const quotation = await quotationService.updateQuotationItems({ id: req.params.id, ...req.body });
    res.json({ quotation });
  }),

  send: asyncHandler(async (req, res) => {
    const quotation = await quotationService.sendQuotation({ id: req.params.id, actorName: req.user!.name });
    res.json({ quotation });
  }),

  accept: asyncHandler(async (req, res) => {
    const quotation = await quotationService.acceptQuotation({ id: req.params.id, actorName: req.user!.name });
    res.json({ quotation });
  }),

  reject: asyncHandler(async (req, res) => {
    const quotation = await quotationService.rejectQuotation({ id: req.params.id, actorName: req.user!.name, lostReason: req.body.lostReason });
    res.json({ quotation });
  }),

  pdf: asyncHandler(async (req, res) => {
    const quotation = await quotationService.getQuotation(req.params.id);
    const lead = await leadRepository.findById(quotation.leadId);
    if (!lead) throw ApiError.notFound("Lead not found.");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${quotation.quotationNumber}.pdf"`);
    renderQuotationPdf(quotation, lead).pipe(res);
  }),
};
