import { Router } from "express";
import { customerController } from "../controller/customer.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";

const router = Router();

router.use(authenticate, authorizePermission("customers.view"));

router.get("/", customerController.list);
router.get("/:id", customerController.get);
router.get("/for-lead/:leadId", customerController.getForLead);

export default router;
