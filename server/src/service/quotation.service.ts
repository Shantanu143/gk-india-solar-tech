import { quotationRepository, type ListQuotationsParams, type QuotationItemInput } from "../repository/quotation.repository";
import { leadRepository } from "../repository/lead.repository";
import { finalConfigurationRepository } from "../repository/finalConfiguration.repository";
import { productRepository } from "../repository/product.repository";
import { leadService } from "./lead.service";
import { activityService } from "./activity.service";
import { notificationService } from "./notification.service";
import { customerService } from "./customer.service";
import { projectService } from "./project.service";
import { ApiError } from "../util/ApiError";
import { toPublicQuotation, type PublicQuotation } from "../util/serializeQuotation";
import { calculateEmi, calculateSubsidy, LOAN_CONFIG } from "../util/emiCalculator";
import type { FinalSolarConfigurationDocument } from "../models/FinalSolarConfiguration.model";
import type { ProductDocument, ProductCategory } from "../models/Product.model";
import type { ProjectType, LostReason } from "../models/Lead.model";

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

async function buildItemsFromFinalConfiguration(config: FinalSolarConfigurationDocument): Promise<QuotationItemInput[]> {
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

  return [
    makeItem("PANEL", `${config.panelModel} Solar Panel`, config.numberOfPanels, panelMatch),
    makeItem("INVERTER", `${config.inverterCapacityKw} kW Solar Inverter`, 1, inverterMatch),
    makeItem("STRUCTURE", config.structureType, 1, structures[0]),
  ];
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

  async createQuotation(input: { leadId: string; actorName: string }): Promise<PublicQuotation> {
    const lead = await leadRepository.findById(input.leadId);
    if (!lead) throw ApiError.notFound("Lead not found.");
    if (lead.status !== "SURVEY_COMPLETED") {
      throw ApiError.badRequest("Complete the site survey before generating a quotation.");
    }

    const existing = await quotationRepository.findByLeadId(input.leadId);
    if (existing) throw ApiError.conflict("A quotation already exists for this lead.");

    const finalConfig = await finalConfigurationRepository.findByLeadId(input.leadId);
    if (!finalConfig) {
      throw ApiError.badRequest("Prepare the final solar configuration before generating a quotation.");
    }

    const items = await buildItemsFromFinalConfiguration(finalConfig);
    const subsidyAmount = calculateSubsidy(finalConfig.systemCapacityKw, lead.projectType as ProjectType);
    const { subtotal, totalAmount, emiEstimate } = computeTotals(items, subsidyAmount, 0);

    const quotationNumber = await quotationRepository.nextQuotationNumber();
    const quotation = await quotationRepository.create({
      quotationNumber,
      lead: lead._id,
      finalConfiguration: finalConfig._id,
      items,
      subtotal,
      subsidyAmount,
      discountAmount: 0,
      totalAmount,
      emiEstimate,
      validUntil: addDaysIso(30),
      status: "DRAFT",
      preparedBy: input.actorName,
    });

    await leadService.updateLeadStatus({ leadId: input.leadId, status: "QUOTATION_PREPARED", actorName: input.actorName });
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

  async sendQuotation(input: { id: string; actorName: string }): Promise<PublicQuotation> {
    const existing = await quotationRepository.findById(input.id);
    if (!existing) throw ApiError.notFound("Quotation not found.");
    if (existing.status !== "DRAFT") throw ApiError.badRequest("Only draft quotations can be sent.");

    const quotation = await quotationRepository.updateById(input.id, { status: "SENT", sentAt: new Date() });
    if (!quotation) throw ApiError.notFound("Quotation not found.");

    const leadId = quotation.lead.toString();
    await leadService.updateLeadStatus({ leadId, status: "QUOTATION_SENT", actorName: input.actorName });
    await activityService.log({
      leadId,
      type: "QUOTATION_SENT",
      actorName: input.actorName,
      description: `Quotation ${quotation.quotationNumber} sent to customer`,
    });

    return toPublicQuotation(quotation);
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
      const finalConfig = await finalConfigurationRepository.findByLeadId(leadId);
      const customer = await customerService.createFromLead(lead, finalConfig?.systemCapacityKw);
      await projectService.createFromConversion({
        leadId,
        customer,
        quotation,
        systemCapacityKw: finalConfig?.systemCapacityKw ?? 0,
      });
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
