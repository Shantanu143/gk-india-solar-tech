import { Router } from "express";
import { commissionController } from "../controller/commission.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission, authorizeRoles } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { createCommissionRuleSchema, updateCommissionRuleSchema, updateCommissionStatusSchema } from "../validation/commission.validation";

// Commission domain: admin CommissionRule CRUD (/rules), admin Commission ledger + status updates,
// and the partner's own commission view (/me). Mounted at /api/commissions in routes/index.ts.
const router = Router();

router.use(authenticate);

router.post("/rules", authorizePermission("commissions.manage"), validateBody(createCommissionRuleSchema), commissionController.createRule);
router.get("/rules", authorizePermission("commissions.view"), commissionController.listRules);
router.patch("/rules/:id", authorizePermission("commissions.manage"), validateBody(updateCommissionRuleSchema), commissionController.updateRule);

router.get("/me", authorizeRoles("PARTNER"), commissionController.listMine);

router.get("/", authorizePermission("commissions.view"), commissionController.list);
router.patch("/:id/status", authorizePermission("commissions.manage"), validateBody(updateCommissionStatusSchema), commissionController.updateStatus);

export default router;
