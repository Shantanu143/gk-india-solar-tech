import { Router } from "express";
import { partnerController } from "../controller/partner.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission, authorizeRoles } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { applyPartnerSchema, updateMyPartnerSchema, updatePartnerStatusSchema } from "../validation/partner.validation";

// Partner domain: public application, admin review/list/detail, partner's own profile.
// Mounted at /api/partners in routes/index.ts.
const router = Router();

// Public — a prospective partner's self-registration, no auth required.
router.post("/apply", validateBody(applyPartnerSchema), partnerController.apply);

router.use(authenticate);

router.get("/me", authorizeRoles("PARTNER"), partnerController.getMe);
router.patch("/me", authorizeRoles("PARTNER"), validateBody(updateMyPartnerSchema), partnerController.updateMe);
router.get("/me/dashboard", authorizeRoles("PARTNER"), partnerController.getMyDashboard);
router.get("/me/projects", authorizeRoles("PARTNER"), partnerController.getMyProjects);

router.get("/", authorizePermission("partners.view"), partnerController.list);
router.post("/", authorizePermission("partners.manage"), validateBody(applyPartnerSchema), partnerController.createByAdmin);
router.get("/:id", authorizePermission("partners.view"), partnerController.get);
router.patch(
  "/:id/status",
  authorizePermission("partners.manage"),
  validateBody(updatePartnerStatusSchema),
  partnerController.updateStatus,
);

export default router;
