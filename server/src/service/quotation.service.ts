import { quotationRepository, type ListQuotationsParams, type QuotationItemInput } from "../repository/quotation.repository";
import { leadRepository } from "../repository/lead.repository";
import { finalConfigurationRepository } from "../repository/finalConfiguration.repository";
import { productRepository } from "../repository/product.repository";
import { leadService } from "./lead.service";
import { activityService } from "./activity.service";
import { notificationService } from "./notification.service";
import { customerService } from "./customer.service";
import { projectService } from "./project.service";
import { commissionService } from "./commission.service";
import { PartnerModel } from "../models/Partner.model";
import { ApiError } from "../util/ApiError";
import crypto from "node:crypto";
import { env } from "../config/env";
import { formatDateLabel } from "../util/dateLabels";
import { DEFAULT_GST_RATE_PERCENT, PRICE_SPLIT, systemPriceFor } from "../config/company";
import { surveyRepository } from "../repository/survey.repository";
import { renderQuotationPdfBuffer } from "../util/renderQuotationPdf";
import { buildClickToChatLink, buildQuotationMessage } from "./whatsapp.service";
import { toPublicQuotation, type PublicQuotation } from "../util/serializeQuotation";
import { calculateEmi, calculateSubsidy, LOAN_CONFIG } from "../util/emiCalculator";
import { QUOTABLE_LEAD_STATUSES } from "../util/leadWorkflow";
import { LEAD_STATUS_LABEL } from "../util/leadStatusLabels";
import type { ProductDocument, ProductCategory } from "../models/Product.model";
import type { LeadDocument, ProjectType, LostReason } from "../models/Lead.model";

export interface PaginatedQuotations {
  items: PublicQuotation[];
  total: number;
  page: number;
  pageSize: number;
}

async function findRelevantLeadIds(employeeId: string): Promise<string[]> {
  const { items } = await leadRepository.list({ assignedEmployeeId: employeeId, page: 1, pageSize: 1000, sortDirection: "desc" });
  return items.map((lead) => lead._id.toString());
}

function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Prefers a product whose `specs[specKey]` matches the target value (e.g. the right inverter by
 * capacity, not just any inverter) — falls back to the first active product in the category only
 * when nothing matches, so the catalog still auto-populates something for the preparer to edit. */
function findBestMatch(products: ProductDocument[], specKey: string, specValue: string): ProductDocument | undefined {
  return products.find((p) => p.specs?.[specKey] === specValue) ?? products[0];
}

/** The system a quotation prices — the surveyed final configuration when one exists, otherwise the lead's own recommendation. */
interface SystemSpec {
  systemCapacityKw: number;
  panelModel: string;
  panelWattage: number;
  numberOfPanels: number;
  inverterCapacityKw: number;
  structureType: string;
}

// Same defaults the survey's final-configuration form pre-fills from the recommendation.
function systemSpecFromLead(lead: LeadDocument): SystemSpec {
  const recommendation = lead.solarRecommendation;
  return {
    systemCapacityKw: recommendation.recommendedCapacity,
    panelModel: `${recommendation.panelCapacity}W Mono PERC`,
    panelWattage: recommendation.panelCapacity,
    numberOfPanels: recommendation.estimatedPanels,
    inverterCapacityKw: recommendation.recommendedInverter,
    structureType: "GK India SolarTech Structure",
  };
}

async function buildItemsFromSystemSpec(config: SystemSpec): Promise<QuotationItemInput[]> {
  const [panels, inverters, structures] = await Promise.all([
    productRepository.listActiveByCategory("PANEL"),
    productRepository.listActiveByCategory("INVERTER"),
    productRepository.listActiveByCategory("STRUCTURE"),
  ]);

  function makeItem(category: ProductCategory, description: string, quantity: number, match: ProductDocument | undefined): QuotationItemInput {
    const unitPrice = match?.unitPrice ?? 0;
    return { productId: match?._id ?? null, description, category, quantity, unitPrice, amount: quantity * unitPrice };
  }

  const panelMatch = findBestMatch(panels, "wattage", String(config.panelWattage));
  const inverterMatch = findBestMatch(inverters, "capacityKw", String(config.inverterCapacityKw));

  const items = [
    makeItem("PANEL", `${config.panelModel} Solar Panel`, config.numberOfPanels, panelMatch),
    makeItem("INVERTER", `${config.inverterCapacityKw} kW Solar Inverter`, 1, inverterMatch),
    makeItem("STRUCTURE", config.structureType, 1, structures[0]),
  ];
  if (items.reduce((sum, item) => sum + item.amount, 0) > 0) return items;

  // The catalog has no prices yet — fall back to the standard rooftop price list so the draft is
  // still a realistic starting point. The preparer can edit every line before sending.
  const total = systemPriceFor(config.systemCapacityKw);
  const priced = (item: QuotationItemInput, share: number): QuotationItemInput => {
    const amount = Math.round(total * share);
    return { ...item, unitPrice: Math.round(amount / item.quantity), amount: Math.round(amount / item.quantity) * item.quantity };
  };
  const [panel, inverter, structure] = items as [QuotationItemInput, QuotationItemInput, QuotationItemInput];
  const bos: QuotationItemInput = {
    productId: null,
    description: "Cables, protection, earthing, net-metering, installation & commissioning",
    category: "ACCESSORY",
    quantity: 1,
    unitPrice: 0,
    amount: 0,
  };
  const partial = [priced(panel, PRICE_SPLIT.panels), priced(inverter, PRICE_SPLIT.inverter), priced(structure, PRICE_SPLIT.structure)];
  const remainder = total - partial.reduce((sum, item) => sum + item.amount, 0);
  return [...partial, { ...bos, unitPrice: remainder, amount: remainder }];
}

function computeTotals(items: QuotationItemInput[], subsidyAmount: number, discountAmount: number) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const totalAmount = Math.max(0, subtotal - subsidyAmount - discountAmount);
  const emiEstimate = {
    principal: totalAmount,
    tenureYears: LOAN_CONFIG.defaultTenureYears,
    monthlyEmi: calculateEmi(totalAmount, LOAN_CONFIG.annualInterestRate, LOAN_CONFIG.defaultTenureYears),
  };
  return { subtotal, totalAmount, emiEstimate };
}

export const quotationService = {
  async getQuotations(params: ListQuotationsParams & { relevantToEmployeeId?: string }): Promise<PaginatedQuotations> {
    const { relevantToEmployeeId, ...rest } = params;
    const leadIdsForEmployee = relevantToEmployeeId ? await findRelevantLeadIds(relevantToEmployeeId) : undefined;
    const { items, total } = await quotationRepository.list({ ...rest, leadIdsForEmployee });
    return { items: items.map(toPublicQuotation), total, page: params.page, pageSize: params.pageSize };
  },

  async getQuotation(id: string): Promise<PublicQuotation> {
    const quotation = await quotationRepository.findById(id);
    if (!quotation) throw ApiError.notFound("Quotation not found.");
    return toPublicQuotation(quotation);
  },

  async getQuotationByLeadId(leadId: string): Promise<PublicQuotation | null> {
    const quotation = await quotationRepository.findByLeadId(leadId);
    return quotation ? toPublicQuotation(quotation) : null;
  },

  /**
   * The site survey is optional: with a final configuration on file the quotation is priced from it,
   * otherwise from the lead's own solar recommendation. Either way the lead moves straight to
   * QUOTATION_PREPARED from whatever pre-quotation stage it is in.
   */
  async createQuotation(input: { leadId: string; actorName: string }): Promise<PublicQuotation> {
    const lead = await leadRepository.findById(input.leadId);
    if (!lead) throw ApiError.notFound("Lead not found.");

    const existing = await quotationRepository.findByLeadId(input.leadId);
    if (existing) throw ApiError.conflict("A quotation already exists for this lead.");

    if (!QUOTABLE_LEAD_STATUSES.includes(lead.status)) {
      throw ApiError.badRequest(`A quotation can't be created for a lead that is ${LEAD_STATUS_LABEL[lead.status]}.`);
    }

    const finalConfig = await finalConfigurationRepository.findByLeadId(input.leadId);
    const spec = finalConfig ?? systemSpecFromLead(lead);

    const items = await buildItemsFromSystemSpec(spec);
    const subsidyAmount = calculateSubsidy(spec.systemCapacityKw, lead.projectType as ProjectType);
    const { subtotal, totalAmount, emiEstimate } = computeTotals(items, subsidyAmount, 0);

    const quotationNumber = await quotationRepository.nextQuotationNumber();
    const quotation = await quotationRepository.create({
      quotationNumber,
      lead: lead._id,
      finalConfiguration: finalConfig?._id ?? null,
      items,
      subtotal,
      subsidyAmount,
      discountAmount: 0,
      totalAmount,
      emiEstimate,
      gstRatePercent: DEFAULT_GST_RATE_PERCENT,
      validUntil: addDaysIso(30),
      status: "DRAFT",
      preparedBy: input.actorName,
    });

    await leadService.updateLeadStatus({
      leadId: input.leadId,
      status: "QUOTATION_PREPARED",
      actorName: input.actorName,
      skipWorkflowCheck: true,
    });
    await activityService.log({
      leadId: input.leadId,
      type: "QUOTATION_CREATED",
      actorName: input.actorName,
      description: `Quotation ${quotationNumber} created`,
    });
    // Admins/managers get visibility into every quotation as it's generated, regardless of who prepared it.
    await notificationService.notifyRoles(["ADMIN", "SALES_MANAGER"], {
      type: "QUOTATION_READY",
      title: "Quotation Ready",
      description: `${quotationNumber} for ${lead.customer.fullName} — ${totalAmount.toLocaleString("en-IN")}`,
      lead: lead._id,
    });

    return toPublicQuotation(quotation);
  },

  async updateQuotationItems(input: {
    id: string;
    items: QuotationItemInput[];
    discountAmount?: number;
    validUntil?: string;
    notes?: string;
  }): Promise<PublicQuotation> {
    const existing = await quotationRepository.findById(input.id);
    if (!existing) throw ApiError.notFound("Quotation not found.");
    if (existing.status !== "DRAFT") throw ApiError.badRequest("Only draft quotations can be edited.");

    const discountAmount = input.discountAmount ?? existing.discountAmount;
    const { subtotal, totalAmount, emiEstimate } = computeTotals(input.items, existing.subsidyAmount, discountAmount);

    const quotation = await quotationRepository.updateById(input.id, {
      items: input.items,
      subtotal,
      discountAmount,
      totalAmount,
      emiEstimate,
      ...(input.validUntil ? { validUntil: input.validUntil } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
    });
    if (!quotation) throw ApiError.notFound("Quotation not found.");
    return toPublicQuotation(quotation);
  },

  /** Builds the PDF for a quotation with everything the template needs (final config + survey). */
  async buildPdf(quotationId: string): Promise<{ pdf: Buffer; quotation: PublicQuotation; filename: string }> {
    const doc = await quotationRepository.findById(quotationId);
    if (!doc) throw ApiError.notFound("Quotation not found.");
    const quotation = toPublicQuotation(doc);
    const lead = await leadRepository.findById(quotation.leadId);
    if (!lead) throw ApiError.notFound("Lead not found.");
    const finalConfig = await finalConfigurationRepository.findByLeadId(quotation.leadId);
    const survey = finalConfig ? await surveyRepository.findById(finalConfig.survey.toString()) : null;
    const pdf = await renderQuotationPdfBuffer(quotation, lead, { finalConfig, survey });
    return { pdf, quotation, filename: `${quotation.quotationNumber}.pdf` };
  },

  async getPdfByShareToken(token: string): Promise<{ pdf: Buffer; filename: string }> {
    const doc = await quotationRepository.findByShareToken(token);
    if (!doc) throw ApiError.notFound("This quotation link is invalid or has expired.");
    // Links stay live for a week past the quote's own validity so a late "let me check" still works.
    const expires = new Date(`${doc.validUntil}T23:59:59`);
    expires.setDate(expires.getDate() + 7);
    if (Date.now() > expires.getTime()) throw ApiError.notFound("This quotation link is invalid or has expired.");
    const { pdf, filename } = await quotationService.buildPdf(doc._id.toString());
    return { pdf, filename };
  },

  /**
   * Marks a draft as sent (re-sending an already-sent quotation is allowed) and returns a WhatsApp
   * click-to-chat link for the customer with a ready-made message containing the PDF link.
   */
  async sendQuotation(input: {
    id: string;
    actorName: string;
    requestBaseUrl: string;
  }): Promise<{ quotation: PublicQuotation; whatsappLink: string; pdfUrl: string }> {
    const existing = await quotationRepository.findById(input.id);
    if (!existing) throw ApiError.notFound("Quotation not found.");
    if (existing.status !== "DRAFT" && existing.status !== "SENT") {
      throw ApiError.badRequest("Only draft or sent quotations can be sent.");
    }
    const lead = await leadRepository.findById(existing.lead.toString());
    if (!lead) throw ApiError.notFound("Lead not found.");
    const wasDraft = existing.status === "DRAFT";

    const shareToken = existing.shareToken ?? crypto.randomBytes(24).toString("hex");
    const finalConfig = await finalConfigurationRepository.findByLeadId(lead._id.toString());
    const baseUrl = (env.PUBLIC_API_URL ?? input.requestBaseUrl).replace(/\/$/, "");
    const pdfUrl = `${baseUrl}/api/public/quotations/${shareToken}/pdf`;

    const now = new Date();
    const updated = await quotationRepository.updateById(input.id, {
      shareToken,
      whatsappSentAt: now,
      ...(wasDraft ? { status: "SENT" as const, sentAt: now } : {}),
    });
    if (!updated) throw ApiError.notFound("Quotation not found.");

    const leadId = updated.lead.toString();
    if (wasDraft) await leadService.updateLeadStatus({ leadId, status: "QUOTATION_SENT", actorName: input.actorName });
    await activityService.log({
      leadId,
      type: "QUOTATION_SENT",
      actorName: input.actorName,
      description: `Quotation ${updated.quotationNumber} sent to customer on WhatsApp`,
    });

    const message = buildQuotationMessage({
      customerName: lead.customer.fullName,
      quotationNumber: updated.quotationNumber,
      systemSizeKw: finalConfig?.systemCapacityKw ?? lead.solarRecommendation.recommendedCapacity,
      netEffectivePrice: updated.totalAmount,
      validUntilLabel: formatDateLabel(updated.validUntil),
      pdfUrl,
      preparedBy: input.actorName,
    });

    return {
      quotation: toPublicQuotation(updated),
      whatsappLink: buildClickToChatLink(lead.customer.whatsapp || lead.customer.mobile, message),
      pdfUrl,
    };
  },

  async acceptQuotation(input: { id: string; actorName: string }): Promise<PublicQuotation> {
    const existing = await quotationRepository.findById(input.id);
    if (!existing) throw ApiError.notFound("Quotation not found.");
    if (existing.status !== "SENT") throw ApiError.badRequest("Only a sent quotation can be accepted.");

    const quotation = await quotationRepository.updateById(input.id, { status: "ACCEPTED", respondedAt: new Date() });
    if (!quotation) throw ApiError.notFound("Quotation not found.");

    const leadId = quotation.lead.toString();
    const lead = await leadRepository.findById(leadId);
    // The lead workflow graph only allows QUOTATION_SENT -> NEGOTIATION -> CONVERTED — accepting
    // hops through NEGOTIATION rather than adding a direct edge, so the graph stays a strict pipeline.
    if (lead?.status === "QUOTATION_SENT") {
      await leadService.updateLeadStatus({ leadId, status: "NEGOTIATION", actorName: input.actorName });
    }
    await leadService.updateLeadStatus({ leadId, status: "CONVERTED", actorName: input.actorName });
    await activityService.log({
      leadId,
      type: "QUOTATION_ACCEPTED",
      actorName: input.actorName,
      description: `Quotation ${quotation.quotationNumber} accepted by customer`,
    });

    // A converted lead becomes a real Customer + Project — both idempotent, so this is safe even
    // if accept somehow ran twice.
    if (lead) {
      // No surveyed configuration (the survey is optional) → the capacity the quotation was priced on.
      const finalConfig = await finalConfigurationRepository.findByLeadId(leadId);
      const systemCapacityKw = finalConfig?.systemCapacityKw ?? lead.solarRecommendation.recommendedCapacity;
      const customer = await customerService.createFromLead(lead, systemCapacityKw);
      await projectService.createFromConversion({
        leadId,
        customer,
        quotation,
        systemCapacityKw,
      });

      // Booking is the "ON_BOOKING" commission trigger for a partner-sourced lead — evaluateForLead
      // is idempotent (a no-op if a commission already exists or no rule matches), so this is safe
      // even if accept somehow ran twice.
      if (lead.partnerId) {
        const partner = await PartnerModel.findById(lead.partnerId);
        if (partner) {
          await commissionService.evaluateForLead({
            leadId,
            partnerId: lead.partnerId.toString(),
            partnerType: partner.type,
            projectType: lead.projectType,
            systemCapacityKw,
            bookingAmount: quotation.totalAmount,
            trigger: "ON_BOOKING",
          });
        }
      }
    }

    return toPublicQuotation(quotation);
  },

  async rejectQuotation(input: { id: string; actorName: string; lostReason?: LostReason }): Promise<PublicQuotation> {
    const existing = await quotationRepository.findById(input.id);
    if (!existing) throw ApiError.notFound("Quotation not found.");
    if (existing.status !== "SENT") throw ApiError.badRequest("Only a sent quotation can be rejected.");

    const quotation = await quotationRepository.updateById(input.id, { status: "REJECTED", respondedAt: new Date() });
    if (!quotation) throw ApiError.notFound("Quotation not found.");

    const leadId = quotation.lead.toString();
    await leadService.updateLeadStatus({ leadId, status: "LOST", actorName: input.actorName, lostReason: input.lostReason ?? "PRICE" });
    await activityService.log({
      leadId,
      type: "QUOTATION_REJECTED",
      actorName: input.actorName,
      description: `Quotation ${quotation.quotationNumber} rejected by customer`,
    });

    return toPublicQuotation(quotation);
  },
};
