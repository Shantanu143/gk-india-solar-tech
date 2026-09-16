import { Router } from "express";
import { materialController } from "../controller/material.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { createMaterialSchema, recordTransactionSchema, setMaterialStatusSchema, updateMaterialSchema } from "../validation/material.validation";

const router = Router();

router.use(authenticate, authorizePermission("materials.view"));

router.get("/", materialController.list);
router.get("/:id", materialController.get);
router.get("/:id/transactions", materialController.transactions);
router.post("/", authorizePermission("materials.manage"), validateBody(createMaterialSchema), materialController.create);
router.patch("/:id", authorizePermission("materials.manage"), validateBody(updateMaterialSchema), materialController.update);
router.patch("/:id/status", authorizePermission("materials.manage"), validateBody(setMaterialStatusSchema), materialController.setStatus);
router.post("/:id/transactions", authorizePermission("materials.manage"), validateBody(recordTransactionSchema), materialController.recordTransaction);

export default router;
