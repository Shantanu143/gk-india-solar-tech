import { Router } from "express";
import { partnerLeadController } from "../controller/partnerLead.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { createPartnerLeadSchema } from "../validation/partnerLead.validation";

// Partner-scoped lead submission and tracking (GET/POST /me/leads, GET /me/leads/:leadId).
// Mounted at /api/partners in routes/index.ts, alongside partner.routes.ts.
// (`/me/dashboard` is out of scope here — built separately.)
const router = Router();

router.use(authenticate, authorizeRoles("PARTNER"));

router.post("/me/leads", validateBody(createPartnerLeadSchema), partnerLeadController.create);
router.get("/me/leads", partnerLeadController.list);
router.get("/me/leads/:leadId", partnerLeadController.get);

export default router;
