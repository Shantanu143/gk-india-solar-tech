import { Router } from "express";
import { leadController } from "../controller/lead.controller";
import { activityController } from "../controller/activity.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { addRemarkSchema, assignLeadSchema, createLeadSchema, updateLeadStatusSchema } from "../validation/lead.validation";

const router = Router();

// Public — the solar estimate wizard's lead-capture submission, no auth required.
router.post("/", validateBody(createLeadSchema), leadController.create);

router.use(authenticate);

router.get("/", authorizePermission("leads.view"), leadController.list);
router.get("/:id", authorizePermission("leads.view"), leadController.get);
router.get("/:leadId/activities", authorizePermission("leads.view"), activityController.listForLead);
router.post("/:id/assign", authorizePermission("leads.assign"), validateBody(assignLeadSchema), leadController.assign);
router.patch("/:id/status", authorizePermission("leads.edit"), validateBody(updateLeadStatusSchema), leadController.updateStatus);
router.patch("/:id", authorizePermission("leads.edit"), validateBody(addRemarkSchema), leadController.addRemark);

export default router;
