import { Router } from "express";
import { authController } from "../controller/auth.controller";
import { authenticate } from "../middleware/authenticate";
import { validateBody } from "../middleware/validateRequest";
import {
  changePasswordSchema,
  employeeBootstrapSchema,
  loginSchema,
  signupCustomerSchema,
  updateProfileSchema,
} from "../validation/auth.validation";

const router = Router();

router.post("/signup", validateBody(signupCustomerSchema), authController.signupCustomer);
router.post("/employee-signup", validateBody(employeeBootstrapSchema), authController.employeeSetup);
router.get("/employee-signup/status", authController.employeeSetupStatus);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
router.patch("/me", authenticate, validateBody(updateProfileSchema), authController.updateMe);
router.post("/change-password", authenticate, validateBody(changePasswordSchema), authController.changePassword);

export default router;
