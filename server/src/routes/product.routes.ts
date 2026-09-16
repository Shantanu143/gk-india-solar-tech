import { Router } from "express";
import { productController } from "../controller/product.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { createProductSchema, setProductStatusSchema, updateProductSchema } from "../validation/product.validation";

const router = Router();

router.use(authenticate);

router.get("/", authorizePermission("products.view"), productController.list);
router.get("/:id", authorizePermission("products.view"), productController.get);
router.post("/", authorizePermission("products.manage"), validateBody(createProductSchema), productController.create);
router.patch("/:id", authorizePermission("products.manage"), validateBody(updateProductSchema), productController.update);
router.patch("/:id/status", authorizePermission("products.manage"), validateBody(setProductStatusSchema), productController.setStatus);

export default router;
