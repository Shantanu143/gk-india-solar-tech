import { Router } from "express";
import { projectController } from "../controller/project.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { addProjectDocumentSchema, updateProjectStatusSchema } from "../validation/project.validation";

const router = Router();

router.use(authenticate, authorizePermission("projects.view"));

router.get("/", projectController.list);
router.get("/:id", projectController.get);
router.get("/for-customer/:customerId", projectController.getForCustomer);
router.patch("/:id/status", authorizePermission("projects.manage"), validateBody(updateProjectStatusSchema), projectController.updateStatus);
router.post("/:id/documents", authorizePermission("projects.manage"), validateBody(addProjectDocumentSchema), projectController.addDocument);

export default router;
