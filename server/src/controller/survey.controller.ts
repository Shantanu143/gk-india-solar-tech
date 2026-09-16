import { surveyService } from "../service/survey.service";
import { finalConfigurationService } from "../service/finalConfiguration.service";
import { asyncHandler } from "../util/asyncHandler";
import { can } from "../util/permissions";
import { toPublicSurvey } from "../util/serializeSurvey";
import { listSurveysQuerySchema } from "../validation/survey.validation";

export const surveyController = {
  list: asyncHandler(async (req, res) => {
    const query = listSurveysQuerySchema.parse(req.query);
    if (!can(req.user!.role, "leads.viewAll")) {
      query.relevantToEmployeeId = req.user!.id;
    }
    const surveys = await surveyService.getSurveys(query);
    res.json(surveys);
  }),

  get: asyncHandler(async (req, res) => {
    const survey = await surveyService.getSurvey(req.params.id);
    res.json({ survey });
  }),

  getForLead: asyncHandler(async (req, res) => {
    const survey = await surveyService.getSurveyByLeadId(req.params.leadId);
    res.json({ survey });
  }),

  schedule: asyncHandler(async (req, res) => {
    const survey = await surveyService.scheduleSurvey({
      leadId: req.body.leadId,
      date: req.body.date,
      time: req.body.time,
      engineerId: req.body.engineerId,
      actorName: req.user!.name,
    });
    res.status(201).json({ survey });
  }),

  start: asyncHandler(async (req, res) => {
    const survey = await surveyService.startSurvey(req.params.id);
    res.json({ survey });
  }),

  saveProgress: asyncHandler(async (req, res) => {
    const survey = await surveyService.saveSurveyProgress({ id: req.params.id, ...req.body });
    res.json({ survey: toPublicSurvey(survey) });
  }),

  complete: asyncHandler(async (req, res) => {
    const survey = await surveyService.completeSurvey({ id: req.params.id, ...req.body, actorName: req.user!.name });
    res.json({ survey });
  }),

  getFinalConfiguration: asyncHandler(async (req, res) => {
    const config = await finalConfigurationService.getForSurvey(req.params.id);
    res.json({ finalConfiguration: config });
  }),

  prepareFinalConfiguration: asyncHandler(async (req, res) => {
    const config = await finalConfigurationService.prepare({
      surveyId: req.params.id,
      ...req.body,
      preparedBy: req.user!.name,
    });
    res.status(201).json({ finalConfiguration: config });
  }),
};
