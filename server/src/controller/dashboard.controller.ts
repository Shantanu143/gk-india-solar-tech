import { dashboardService } from "../service/dashboard.service";
import { asyncHandler } from "../util/asyncHandler";

export const dashboardController = {
  metrics: asyncHandler(async (_req, res) => {
    const metrics = await dashboardService.getMetrics();
    res.json(metrics);
  }),

  funnel: asyncHandler(async (_req, res) => {
    const funnel = await dashboardService.getLeadFunnel();
    res.json(funnel);
  }),

  sources: asyncHandler(async (_req, res) => {
    const sources = await dashboardService.getLeadSources();
    res.json(sources);
  }),

  projectTypes: asyncHandler(async (_req, res) => {
    const projectTypes = await dashboardService.getProjectTypeDistribution();
    res.json(projectTypes);
  }),

  employeePerformance: asyncHandler(async (_req, res) => {
    const rows = await dashboardService.getEmployeePerformance();
    res.json(rows);
  }),

  partnerPerformance: asyncHandler(async (_req, res) => {
    const rows = await dashboardService.getPartnerPerformance();
    res.json(rows);
  }),

  dailySalesActivity: asyncHandler(async (req, res) => {
    const date = typeof req.query.date === "string" && req.query.date ? req.query.date : new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const rows = await dashboardService.getDailySalesActivity(date);
    res.json({ date, rows });
  }),

  trend: asyncHandler(async (req, res) => {
    const days = Number(req.query.days) || 30;
    const trend = await dashboardService.getLeadTrend(days);
    res.json(trend);
  }),

  overdueFollowUps: asyncHandler(async (_req, res) => {
    const count = await dashboardService.getOverdueFollowUpsCount();
    res.json({ count });
  }),
};
