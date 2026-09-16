import { Router } from "express";
import authRoutes from "./auth.routes";
import employeeRoutes from "./employee.routes";
import leadRoutes from "./lead.routes";
import followUpRoutes from "./followUp.routes";
import surveyRoutes from "./survey.routes";
import dashboardRoutes from "./dashboard.routes";
import productRoutes from "./product.routes";
import quotationRoutes from "./quotation.routes";
import notificationRoutes from "./notification.routes";
import customerRoutes from "./customer.routes";
import projectRoutes from "./project.routes";
import materialRoutes from "./material.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/leads", leadRoutes);
router.use("/follow-ups", followUpRoutes);
router.use("/surveys", surveyRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/products", productRoutes);
router.use("/quotations", quotationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/customers", customerRoutes);
router.use("/projects", projectRoutes);
router.use("/materials", materialRoutes);

export default router;
