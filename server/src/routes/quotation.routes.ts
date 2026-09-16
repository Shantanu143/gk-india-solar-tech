import { Router } from "express";
import { quotationController } from "../controller/quotation.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { createQuotationSchema, rejectQuotationSchema, updateQuotationItemsSchema } from "../validation/quotation.validation";

const router = Router();

router.use(authenticate, authorizePermission("quotations.view"));

router.get("/", quotationController.list);
router.get("/for-lead/:leadId", quotationController.getForLead);
router.get("/:id", quotationController.get);
router.get("/:id/pdf", quotationController.pdf);
router.post("/", authorizePermission("quotations.create"), validateBody(createQuotationSchema), quotationController.create);
router.patch("/:id/items", authorizePermission("quotations.create"), validateBody(updateQuotationItemsSchema), quotationController.updateItems);
router.post("/:id/send", authorizePermission("quotations.create"), quotationController.send);
router.post("/:id/accept", authorizePermission("quotations.create"), quotationController.accept);
router.post("/:id/reject", authorizePermission("quotations.create"), validateBody(rejectQuotationSchema), quotationController.reject);

export default router;
