import { Router } from "express";
import { followUpController } from "../controller/followUp.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { completeFollowUpSchema, createFollowUpSchema, rescheduleFollowUpSchema } from "../validation/followUp.validation";

const router = Router();

router.use(authenticate, authorizePermission("followups.view"));

router.get("/", followUpController.list);
router.get("/:id", followUpController.get);
router.post("/", authorizePermission("followups.create"), validateBody(createFollowUpSchema), followUpController.create);
router.post("/:id/complete", authorizePermission("followups.edit"), validateBody(completeFollowUpSchema), followUpController.complete);
router.post("/:id/reschedule", authorizePermission("followups.edit"), validateBody(rescheduleFollowUpSchema), followUpController.reschedule);
router.post("/:id/cancel", authorizePermission("followups.edit"), followUpController.cancel);

export default router;
