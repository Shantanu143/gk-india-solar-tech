import { surveyRepository, type SurveyFilters } from "../repository/survey.repository";
import { leadRepository } from "../repository/lead.repository";
import { activityService } from "./activity.service";
import { leadService } from "./lead.service";
import { notificationService } from "./notification.service";
import { ApiError } from "../util/ApiError";
import { toPublicSurvey, type PublicSurvey } from "../util/serializeSurvey";
import type { GpsLocation, RoofAssessment, SurveyDocumentFile, SurveyPhoto } from "../models/Survey.model";

export interface ScheduleSurveyInput {
  leadId: string;
  date: string;
  time: string;
  engineerId: string;
  actorName: string;
}

export interface SaveSurveyProgressInput {
  id: string;
  roofAssessment?: RoofAssessment;
  gpsLocation?: GpsLocation;
  roofPhotos?: SurveyPhoto[];
  meterPhoto?: SurveyPhoto;
  electricityBillDocument?: SurveyDocumentFile;
  notes?: string;
}

export interface CompleteSurveyInput extends SaveSurveyProgressInput {
  actorName: string;
}

async function findRelevantLeadIds(employeeId: string): Promise<string[]> {
  const { items } = await leadRepository.list({ assignedEmployeeId: employeeId, page: 1, pageSize: 1000, sortDirection: "desc" });
  return items.map((lead) => lead._id.toString());
}

export const surveyService = {
  async getSurveys(filters: SurveyFilters): Promise<PublicSurvey[]> {
    const leadIdsForEmployee = filters.relevantToEmployeeId ? await findRelevantLeadIds(filters.relevantToEmployeeId) : undefined;
    const items = await surveyRepository.list({ ...filters, leadIdsForEmployee });
    return items.map(toPublicSurvey);
  },

  async getSurvey(id: string): Promise<PublicSurvey> {
    const survey = await surveyRepository.findById(id);
    if (!survey) throw ApiError.notFound("Survey not found.");
    return toPublicSurvey(survey);
  },

  async getSurveyByLeadId(leadId: string): Promise<PublicSurvey | null> {
    const survey = await surveyRepository.findForLead(leadId);
    return survey ? toPublicSurvey(survey) : null;
  },

  async scheduleSurvey(input: ScheduleSurveyInput): Promise<PublicSurvey> {
    const lead = await leadRepository.findById(input.leadId);
    if (!lead) throw ApiError.notFound("Lead not found.");

    const survey = await surveyRepository.create({
      lead: input.leadId,
      customerName: lead.customer.fullName,
      address: lead.customer.address,
      location: lead.location,
      date: input.date,
      time: input.time,
      engineerId: input.engineerId,
      status: "SCHEDULED",
      roofPhotos: [],
      scheduledBy: input.actorName,
    });

    await leadService.updateLeadStatus({ leadId: input.leadId, status: "SURVEY_REQUESTED", actorName: input.actorName });
    await activityService.log({ leadId: input.leadId, type: "SURVEY_REQUESTED", actorName: input.actorName, description: "Site survey scheduled" });
    await notificationService.notify({
      recipient: input.engineerId,
      type: "SURVEY_SCHEDULED",
      title: "Survey Scheduled",
      description: `Site survey requested for ${lead.customer.fullName} — ${input.date} at ${input.time}`,
      lead: lead._id,
    });

    return toPublicSurvey(survey);
  },

  async startSurvey(id: string): Promise<PublicSurvey> {
    const survey = await surveyRepository.findById(id);
    if (!survey) throw ApiError.notFound("Survey not found.");

    survey.status = "IN_PROGRESS";
    survey.startedAt = new Date();
    await survey.save();
    return toPublicSurvey(survey);
  },

  async saveSurveyProgress(input: SaveSurveyProgressInput) {
    const survey = await surveyRepository.findById(input.id);
    if (!survey) throw ApiError.notFound("Survey not found.");

    if (input.roofAssessment) survey.roofAssessment = input.roofAssessment;
    if (input.gpsLocation) survey.gpsLocation = input.gpsLocation;
    if (input.roofPhotos) survey.roofPhotos = input.roofPhotos;
    if (input.meterPhoto) survey.meterPhoto = input.meterPhoto;
    if (input.electricityBillDocument) survey.electricityBillDocument = input.electricityBillDocument;
    if (input.notes !== undefined) survey.notes = input.notes;
    await survey.save();
    return survey;
  },

  async completeSurvey(input: CompleteSurveyInput): Promise<PublicSurvey> {
    const survey = await surveyService.saveSurveyProgress(input);
    if (!survey.roofAssessment) {
      throw ApiError.badRequest("Complete the roof assessment before finishing this survey.");
    }

    survey.status = "COMPLETED";
    survey.completedAt = new Date();
    await survey.save();

    const leadId = survey.lead.toString();
    await leadService.updateLeadStatus({ leadId, status: "SURVEY_COMPLETED", actorName: input.actorName });
    await activityService.log({ leadId, type: "SURVEY_COMPLETED", actorName: input.actorName, description: "Site survey completed" });

    return toPublicSurvey(survey);
  },
};
