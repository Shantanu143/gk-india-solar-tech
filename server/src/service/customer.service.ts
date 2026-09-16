import { customerRepository, type ListCustomersParams } from "../repository/customer.repository";
import { ApiError } from "../util/ApiError";
import { toPublicCustomer, type PublicCustomer } from "../util/serializeCustomer";
import type { LeadDocument } from "../models/Lead.model";

export interface PaginatedCustomers {
  items: PublicCustomer[];
  total: number;
  page: number;
  pageSize: number;
}

export const customerService = {
  async getCustomers(params: ListCustomersParams): Promise<PaginatedCustomers> {
    const { items, total } = await customerRepository.list(params);
    return { items: items.map(toPublicCustomer), total, page: params.page, pageSize: params.pageSize };
  },

  async getCustomer(id: string): Promise<PublicCustomer> {
    const customer = await customerRepository.findById(id);
    if (!customer) throw ApiError.notFound("Customer not found.");
    return toPublicCustomer(customer);
  },

  async getCustomerByLeadId(leadId: string): Promise<PublicCustomer | null> {
    const customer = await customerRepository.findByLeadId(leadId);
    return customer ? toPublicCustomer(customer) : null;
  },

  /** Called when a lead converts (its quotation is accepted) — idempotent, so a retried accept never double-creates. */
  async createFromLead(lead: LeadDocument, systemCapacityKw?: number) {
    const existing = await customerRepository.findByLeadId(lead._id.toString());
    if (existing) return existing;

    return customerRepository.create({
      lead: lead._id,
      fullName: lead.customer.fullName,
      mobile: lead.customer.mobile,
      whatsapp: lead.customer.whatsapp,
      email: lead.customer.email,
      address: lead.customer.address,
      projectType: lead.projectType,
      systemCapacityKw,
      assignedEmployeeId: lead.assignedEmployeeId,
    });
  },
};
