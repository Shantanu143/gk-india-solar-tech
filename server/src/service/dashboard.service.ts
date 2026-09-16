import { LeadModel, LEAD_STATUSES, LEAD_SOURCES, PROJECT_TYPES, type LeadStatus } from "../models/Lead.model";
import { FollowUpModel } from "../models/FollowUp.model";
import { SurveyModel } from "../models/Survey.model";
import { QuotationModel } from "../models/Quotation.model";
import { ProjectModel } from "../models/Project.model";
import { UserModel } from "../models/User.model";

function istToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** Mirrors `client/src/features/leads/types/lead.ts`'s `LEAD_SOURCE_LABEL` exactly. */
const LEAD_SOURCE_LABEL: Record<string, string> = {
  GOOGLE_ADS: "Google Ads",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  ORGANIC_SEARCH: "Organic Search",
  DIRECT: "Direct",
  REFERRAL: "Referral",
  OTHER: "Other",
};

/** Mirrors `client/src/features/leads/types/lead.ts`'s `PROJECT_TYPE_LABEL` exactly. */
const PROJECT_TYPE_LABEL: Record<string, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

export const dashboardService = {
  async getMetrics() {
    const today = istToday();
    const [totalLeads, newLeads, followUpsToday, siteSurveys, quotations, convertedLeads, overdueFollowUps, activeProjects, completedProjects] =
      await Promise.all([
        LeadModel.countDocuments({}),
        LeadModel.countDocuments({ status: "NEW" }),
        FollowUpModel.countDocuments({ status: "PENDING", date: today }),
        SurveyModel.countDocuments({}),
        QuotationModel.countDocuments({}),
        LeadModel.countDocuments({ status: "CONVERTED" }),
        FollowUpModel.countDocuments({ status: "PENDING", date: { $lt: today } }),
        ProjectModel.countDocuments({ status: { $ne: "COMPLETED" } }),
        ProjectModel.countDocuments({ status: "COMPLETED" }),
      ]);

    return {
      totalLeads,
      newLeads,
      followUpsToday,
      siteSurveys,
      quotations,
      convertedLeads,
      activeProjects,
      completedProjects,
      overdueFollowUps,
    };
  },

  async getLeadFunnel() {
    const results = await LeadModel.aggregate<{ _id: LeadStatus; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const counts = new Map(results.map((r) => [r._id, r.count]));
    const total = [...counts.values()].reduce((sum, c) => sum + c, 0);
    return LEAD_STATUSES.map((status) => {
      const count = counts.get(status) ?? 0;
      return { status, count, percentOfTotal: total > 0 ? Math.round((count / total) * 100) : 0 };
    });
  },

  async getLeadSources() {
    const results = await LeadModel.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$source", count: { $sum: 1 } } }]);
    const counts = new Map(results.map((r) => [r._id, r.count]));
    return LEAD_SOURCES.map((source) => ({ source, label: LEAD_SOURCE_LABEL[source], count: counts.get(source) ?? 0 }));
  },

  async getProjectTypeDistribution() {
    const results = await LeadModel.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$projectType", count: { $sum: 1 } } }]);
    const counts = new Map(results.map((r) => [r._id, r.count]));
    return PROJECT_TYPES.map((projectType) => ({ projectType, label: PROJECT_TYPE_LABEL[projectType], count: counts.get(projectType) ?? 0 }));
  },

  async getEmployeePerformance() {
    const employees = await UserModel.find({ role: { $ne: "CUSTOMER" }, status: "ACTIVE" });
    return Promise.all(
      employees.map(async (employee) => {
        const employeeId = employee._id;
        const leadIds = await LeadModel.find({ assignedEmployeeId: employeeId }).distinct("_id");
        const [contacted, followUps, surveys, quotationsCount, converted] = await Promise.all([
          LeadModel.countDocuments({ assignedEmployeeId: employeeId, status: { $ne: "NEW" } }),
          FollowUpModel.countDocuments({ assignedEmployeeId: employeeId }),
          SurveyModel.countDocuments({ engineerId: employeeId }),
          QuotationModel.countDocuments({ lead: { $in: leadIds } }),
          LeadModel.countDocuments({ assignedEmployeeId: employeeId, status: "CONVERTED" }),
        ]);
        return {
          employeeId: employeeId.toString(),
          employeeName: employee.name,
          assignedLeads: leadIds.length,
          contacted,
          followUps,
          surveys,
          quotations: quotationsCount,
          converted,
        };
      }),
    );
  },

  async getLeadTrend(days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const results = await LeadModel.aggregate<{ _id: string; count: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    return results.map((r) => ({ date: r._id, count: r.count }));
  },

  async getOverdueFollowUpsCount(): Promise<number> {
    const today = istToday();
    return FollowUpModel.countDocuments({ status: "PENDING", date: { $lt: today } });
  },
};
