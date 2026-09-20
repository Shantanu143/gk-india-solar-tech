import { partnerService } from "../service/partner.service";
import { partnerDashboardService } from "../service/partnerDashboard.service";
import { partnerRepository } from "../repository/partner.repository";
import { projectService } from "../service/project.service";
import { ApiError } from "../util/ApiError";
import { asyncHandler } from "../util/asyncHandler";
import { listPartnersQuerySchema } from "../validation/partner.validation";

export const partnerController = {
  apply: asyncHandler(async (req, res) => {
    const partner = await partnerService.applyAsPartner(req.body);
    res.status(201).json({ partner });
  }),

  createByAdmin: asyncHandler(async (req, res) => {
    const partner = await partnerService.createByAdmin(req.body, req.user!.id);
    res.status(201).json({ partner });
  }),

  getMe: asyncHandler(async (req, res) => {
    const partner = await partnerService.getMyProfile(req.user!.id);
    res.json({ partner });
  }),

  getMyDashboard: asyncHandler(async (req, res) => {
    const dashboard = await partnerDashboardService.getMyDashboard(req.user!.id);
    res.json(dashboard);
  }),

  getMyProjects: asyncHandler(async (req, res) => {
    const partner = await partnerRepository.findByUserId(req.user!.id);
    if (!partner) throw ApiError.notFound("Partner profile not found.");
    const projects = await projectService.getProjectsForPartner(partner._id.toString());
    res.json({ items: projects });
  }),

  updateMe: asyncHandler(async (req, res) => {
    const partner = await partnerService.updateMyProfile(req.user!.id, req.body);
    res.json({ partner });
  }),

  list: asyncHandler(async (req, res) => {
    const query = listPartnersQuerySchema.parse(req.query);
    const result = await partnerService.listPartners(query);
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const includeSensitive = req.user!.role === "ADMIN";
    const partner = await partnerService.getPartnerById(req.params.id, { includeSensitive });
    res.json({ partner });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const partner = await partnerService.updatePartnerStatus(req.params.id, req.user!.id, req.body);
    res.json({ partner });
  }),
};
