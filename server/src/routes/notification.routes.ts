import { Router } from "express";
import { notificationController } from "../controller/notification.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", notificationController.list);
router.patch("/:id/read", notificationController.markRead);

export default router;
