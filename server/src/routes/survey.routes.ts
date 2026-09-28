import { Router } from "express";
import { surveyController } from "../controller/survey.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizePermission } from "../middleware/authorize";
import { validateBody } from "../middleware/validateRequest";
import { prepareFinalConfigurationSchema, saveSurveyProgressSchema, scheduleSurveySchema } from "../validation/survey.validation";

const router = Router();

router.use(authenticate, authorizePermission("surveys.view"));

router.get("/", surveyController.list);
router.get("/for-lead/:leadId", surveyController.getForLead);
router.get("/:id", surveyController.get);
router.post("/", authorizePermission("surveys.create"), validateBody(scheduleSurveySchema), surveyController.schedule);
router.post("/:id/start", authorizePermission("surveys.create"), surveyController.start);
router.patch("/:id/progress", authorizePermission("surveys.create"), validateBody(saveSurveyProgressSchema), surveyController.saveProgress);
router.post("/:id/complete", authorizePermission("surveys.create"), validateBody(saveSurveyProgressSchema), surveyController.complete);
router.get("/:id/final-configuration", surveyController.getFinalConfiguration);
router.post(
  "/:id/final-configuration",
  authorizePermission("surveys.create"),
  validateBody(prepareFinalConfigurationSchema),
  surveyController.prepareFinalConfiguration,
);

export default router;
