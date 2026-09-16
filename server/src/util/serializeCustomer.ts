import type { CustomerDocument } from "../models/Customer.model";

export function toPublicCustomer(customer: CustomerDocument) {
  return {
    id: customer._id.toString(),
    leadId: customer.lead.toString(),
    fullName: customer.fullName,
    mobile: customer.mobile,
    whatsapp: customer.whatsapp,
    email: customer.email,
    address: customer.address,
    projectType: customer.projectType,
    systemCapacityKw: customer.systemCapacityKw,
    assignedEmployeeId: customer.assignedEmployeeId ? customer.assignedEmployeeId.toString() : null,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}

export type PublicCustomer = ReturnType<typeof toPublicCustomer>;
