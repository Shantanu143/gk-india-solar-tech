import { partnerRepository } from "../repository/partner.repository";
import { LeadModel } from "../models/Lead.model";
import { CustomerModel } from "../models/Customer.model";
import { ProjectModel } from "../models/Project.model";
import { CommissionModel } from "../models/Commission.model";
import { ApiError } from "../util/ApiError";

async function sumCommissions(matchExtra: Record<string, unknown>, partnerId: unknown): Promise<number> {
  const [result] = await CommissionModel.aggregate<{ sum: number }>([
    { $match: { partnerId, ...matchExtra } },
    { $group: { _id: null, sum: { $sum: "$commissionAmount" } } },
  ]);
  return result?.sum ?? 0;
}

export const partnerDashboardService = {
  /** A partner's own mobile-first dashboard — lead pipeline counts plus commission totals. */
  async getMyDashboard(userId: string) {
    const partner = await partnerRepository.findByUserId(userId);
    if (!partner) throw ApiError.notFound("Partner profile not found.");

    const partnerId = partner._id;

    const [totalLeads, newLeads, bookings, lostLeads] = await Promise.all([
      LeadModel.countDocuments({ partnerId }),
      LeadModel.countDocuments({ partnerId, status: "NEW" }),
      LeadModel.countDocuments({ partnerId, status: "CONVERTED" }),
      LeadModel.countDocuments({ partnerId, status: "LOST" }),
    ]);
    const activeLeads = Math.max(0, totalLeads - bookings - lostLeads);

    // Completed projects among this partner's converted leads (Lead -> Customer -> Project chain).
    const convertedLeadIds = await LeadModel.find({ partnerId, status: "CONVERTED" }).distinct("_id");
    const customerIds = convertedLeadIds.length
      ? await CustomerModel.find({ lead: { $in: convertedLeadIds } }).distinct("_id")
      : [];
    const completedProjects = customerIds.length
      ? await ProjectModel.countDocuments({ customer: { $in: customerIds }, status: "COMPLETED" })
      : 0;

    const [totalCommission, paidCommission, pendingCommission] = await Promise.all([
      sumCommissions({}, partnerId),
      sumCommissions({ status: "PAID" }, partnerId),
      sumCommissions({ status: { $nin: ["PAID", "CANCELLED"] } }, partnerId),
    ]);

    return {
      partnerId: partner.partnerId,
      applicationStatus: partner.applicationStatus,
      totalLeads,
      newLeads,
      activeLeads,
      bookings,
      lostLeads,
      completedProjects,
      totalCommission,
      paidCommission,
      pendingCommission,
    };
  },
};
