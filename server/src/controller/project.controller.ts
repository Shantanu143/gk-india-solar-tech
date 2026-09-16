import { projectService } from "../service/project.service";
import { asyncHandler } from "../util/asyncHandler";
import { can } from "../util/permissions";
import { listProjectsQuerySchema } from "../validation/project.validation";

export const projectController = {
  list: asyncHandler(async (req, res) => {
    const query = listProjectsQuerySchema.parse(req.query);
    if (!can(req.user!.role, "leads.viewAll")) {
      query.assignedEmployeeId = req.user!.id;
    }
    const projects = await projectService.getProjects(query);
    res.json(projects);
  }),

  get: asyncHandler(async (req, res) => {
    const project = await projectService.getProject(req.params.id);
    res.json({ project });
  }),

  getForCustomer: asyncHandler(async (req, res) => {
    const project = await projectService.getProjectByCustomerId(req.params.customerId);
    res.json({ project });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const project = await projectService.updateProjectStatus({ id: req.params.id, status: req.body.status, actorName: req.user!.name });
    res.json({ project });
  }),

  addDocument: asyncHandler(async (req, res) => {
    const project = await projectService.addDocument({ id: req.params.id, document: req.body });
    res.status(201).json({ project });
  }),
};
