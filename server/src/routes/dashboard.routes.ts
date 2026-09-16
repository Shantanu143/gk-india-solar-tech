import { Router } from "express";
import { dashboardController } from "../controller/dashboard.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";

const router = Router();

router.use(authenticate, authorizePermission("reports.view"));

router.get("/metrics", dashboardController.metrics);
router.get("/funnel", dashboardController.funnel);
router.get("/sources", dashboardController.sources);
router.get("/project-types", dashboardController.projectTypes);
router.get("/employee-performance", dashboardController.employeePerformance);
router.get("/trend", dashboardController.trend);
router.get("/overdue-follow-ups", dashboardController.overdueFollowUps);

export default router;
