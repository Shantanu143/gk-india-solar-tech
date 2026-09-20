import { UserModel } from "../models/User.model";
import { LeadModel } from "../models/Lead.model";
import { CustomerModel } from "../models/Customer.model";
import { ProjectModel } from "../models/Project.model";
import { toPublicLead, type PublicLead } from "../util/serializeLead";
import { toPublicProject, type PublicProject } from "../util/serializeProject";
import { ApiError } from "../util/ApiError";

export interface CustomerInquiry {
  lead: PublicLead;
  project: PublicProject | null;
}

export const customerInquiryService = {
  /**
   * Matches by contact info (email, and mobile if the account has one) rather than an explicit
   * account link — the public solar-estimate wizard that creates a Lead has no login step, so
   * there's no `customerId` to join against. A customer who later signs up with the same email or
   * mobile they used when requesting their estimate sees it here automatically.
   */
  async getMyInquiries(userId: string): Promise<CustomerInquiry[]> {
    const user = await UserModel.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    const orConditions: Record<string, unknown>[] = [{ "customer.email": user.email }];
    if (user.phone) orConditions.push({ "customer.mobile": user.phone });

    const leads = await LeadModel.find({ $or: orConditions }).sort({ createdAt: -1 });

    return Promise.all(
      leads.map(async (lead) => {
        const customer = await CustomerModel.findOne({ lead: lead._id });
        const project = customer ? await ProjectModel.findOne({ customer: customer._id }) : null;
        return { lead: toPublicLead(lead), project: project ? toPublicProject(project) : null };
      }),
    );
  },
};
