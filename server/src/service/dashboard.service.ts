import { LeadModel, LEAD_STATUSES, LEAD_SOURCES, PROJECT_TYPES, type LeadStatus } from "../models/Lead.model";
import { FollowUpModel } from "../models/FollowUp.model";
import { SurveyModel } from "../models/Survey.model";
import { QuotationModel } from "../models/Quotation.model";
import { ProjectModel } from "../models/Project.model";
import { UserModel, EMPLOYEE_ROLES } from "../models/User.model";
import { PartnerModel } from "../models/Partner.model";
import { CommissionModel } from "../models/Commission.model";
import { ActivityModel } from "../models/Activity.model";

function istToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function istNowTime(): string {
  return new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Matches `followUpRepository`'s "overdue" scope exactly: a past day, or today past its time. */
function overdueFollowUpQuery(today: string) {
  return { status: "PENDING", $or: [{ date: { $lt: today } }, { date: today, time: { $lt: istNowTime() } }] };
}

/** The [start, end) UTC instants bounding a given "YYYY-MM-DD" calendar day in IST. */
function istDayRange(dateStr: string): { start: Date; end: Date } {
  const start = new Date(`${dateStr}T00:00:00+05:30`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
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
        // "today" excludes a today-dated follow-up whose time has already passed — that one belongs
        // to "overdue" only, or the two counts below would double-count it (and did, until this fix).
        FollowUpModel.countDocuments({ status: "PENDING", date: today, time: { $gte: istNowTime() } }),
        SurveyModel.countDocuments({}),
        QuotationModel.countDocuments({}),
        LeadModel.countDocuments({ status: "CONVERTED" }),
        FollowUpModel.countDocuments(overdueFollowUpQuery(today)),
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
    return FollowUpModel.countDocuments(overdueFollowUpQuery(istToday()));
  },

  /** Admin/sales-manager view of every approved partner's lead volume and commission totals — mirrors `getEmployeePerformance`'s per-entity loop-of-counts shape. */
  async getPartnerPerformance() {
    const partners = await PartnerModel.find({ applicationStatus: "APPROVED" });
    return Promise.all(
      partners.map(async (partner) => {
        const partnerId = partner._id;
        const [totalLeads, bookings, commissionAgg, paidAgg] = await Promise.all([
          LeadModel.countDocuments({ partnerId }),
          LeadModel.countDocuments({ partnerId, status: "CONVERTED" }),
          CommissionModel.aggregate<{ sum: number }>([{ $match: { partnerId } }, { $group: { _id: null, sum: { $sum: "$commissionAmount" } } }]),
          CommissionModel.aggregate<{ sum: number }>([
            { $match: { partnerId, status: "PAID" } },
            { $group: { _id: null, sum: { $sum: "$commissionAmount" } } },
          ]),
        ]);
        return {
          partnerId: partner._id.toString(),
          partnerCode: partner.partnerId,
          partnerName: partner.name,
          partnerType: partner.type,
          totalLeads,
          bookings,
          totalCommission: commissionAgg[0]?.sum ?? 0,
          paidCommission: paidAgg[0]?.sum ?? 0,
        };
      }),
    );
  },

  /**
   * Per-employee activity for a single IST calendar day, derived entirely from existing timestamped
   * records (the Activity log's `actorName`, plus FollowUp/Survey/Quotation completion timestamps) —
   * there is no call-log or manual daily-report entry anywhere in this app, so metrics like "calls
   * connected" from the original spec aren't tracked and are intentionally not included here.
   */
  async getDailySalesActivity(dateStr: string) {
    const { start, end } = istDayRange(dateStr);
    const range = { $gte: start, $lt: end };

    const employees = await UserModel.find({ role: { $in: EMPLOYEE_ROLES }, status: "ACTIVE" });

    return Promise.all(
      employees.map(async (employee) => {
        const employeeId = employee._id;
        const [statusChanges, remarksLogged, leadsLost, quotationsAccepted, quotationsSent, followUpsCompleted, surveysCompleted] =
          await Promise.all([
            ActivityModel.countDocuments({ type: "STATUS_CHANGED", actorName: employee.name, createdAt: range }),
            ActivityModel.countDocuments({ type: "REMARK_ADDED", actorName: employee.name, createdAt: range }),
            ActivityModel.countDocuments({ type: "LEAD_LOST", actorName: employee.name, createdAt: range }),
            ActivityModel.countDocuments({ type: "QUOTATION_ACCEPTED", actorName: employee.name, createdAt: range }),
            QuotationModel.countDocuments({ preparedBy: employee.name, sentAt: range }),
            FollowUpModel.countDocuments({ assignedEmployeeId: employeeId, status: "COMPLETED", completedAt: range }),
            SurveyModel.countDocuments({ engineerId: employeeId, status: "COMPLETED", completedAt: range }),
          ]);

        return {
          employeeId: employeeId.toString(),
          employeeName: employee.name,
          role: employee.role,
          statusChanges,
          remarksLogged,
          followUpsCompleted,
          surveysCompleted,
          quotationsSent,
          bookings: quotationsAccepted,
          leadsLost,
        };
      }),
    );
  },
};
