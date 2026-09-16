import { Router } from "express";
import { employeeController } from "../controller/employee.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import {
  createEmployeeSchema,
  resetEmployeePasswordSchema,
  setEmployeeStatusSchema,
  updateEmployeeSchema,
} from "../validation/employee.validation";

const router = Router();

router.use(authenticate);

router.post("/", authorizePermission("employees.manage"), validateBody(createEmployeeSchema), employeeController.create);
router.get("/", authorizePermission("employees.view"), employeeController.list);
router.get("/:id", authorizePermission("employees.view"), employeeController.get);
router.patch("/:id", authorizePermission("employees.manage"), validateBody(updateEmployeeSchema), employeeController.update);
router.patch("/:id/status", authorizePermission("employees.manage"), validateBody(setEmployeeStatusSchema), employeeController.setStatus);
router.patch(
  "/:id/password",
  authorizePermission("employees.manage"),
  validateBody(resetEmployeePasswordSchema),
  employeeController.resetPassword,
);

export default router;
