import { quotationService } from "../service/quotation.service";
import { asyncHandler } from "../util/asyncHandler";
import { can } from "../util/permissions";
import { listQuotationsQuerySchema } from "../validation/quotation.validation";

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
    const result = await quotationService.sendQuotation({
      id: req.params.id,
      actorName: req.user!.name,
      requestBaseUrl: `${req.protocol}://${req.get("host")}`,
    });
    res.json(result);
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
    const { pdf, filename } = await quotationService.buildPdf(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdf);
  }),

  /** Login-free download for the customer, addressed by an unguessable share token. */
  publicPdf: asyncHandler(async (req, res) => {
    const { pdf, filename } = await quotationService.getPdfByShareToken(req.params.token);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Cache-Control", "private, no-store");
    res.send(pdf);
  }),
};
