import { z } from "zod";
import { INSTALLATION_TYPES } from "../models/FinalSolarConfiguration.model";
import { METER_TYPES, ROOF_CONDITIONS, ROOF_TYPES, SHADOW_LEVELS, SURVEY_STATUSES } from "../models/Survey.model";

export const listSurveysQuerySchema = z.object({
  status: z.enum(SURVEY_STATUSES).optional(),
  relevantToEmployeeId: z.string().optional(),
  scope: z.enum(["upcoming", "today", "completed"]).optional(),
});
export type ListSurveysQuery = z.infer<typeof listSurveysQuerySchema>;

export const scheduleSurveySchema = z.object({
  leadId: z.string().min(1, "leadId is required."),
  date: z.string().min(1),
  time: z.string().min(1),
  engineerId: z.string().min(1, "Select an engineer."),
});
export type ScheduleSurveyInput = z.infer<typeof scheduleSurveySchema>;

const roofAssessmentSchema = z.object({
  roofType: z.enum(ROOF_TYPES),
  roofAreaSqft: z.number().positive(),
  roofCondition: z.enum(ROOF_CONDITIONS),
  shadowLevel: z.enum(SHADOW_LEVELS),
  meterType: z.enum(METER_TYPES),
});

const gpsLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  capturedAt: z.coerce.date(),
});

const surveyPhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  fileName: z.string(),
});

const surveyDocumentFileSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  url: z.string(),
});

export const saveSurveyProgressSchema = z.object({
  roofAssessment: roofAssessmentSchema.optional(),
  gpsLocation: gpsLocationSchema.optional(),
  roofPhotos: z.array(surveyPhotoSchema).optional(),
  meterPhoto: surveyPhotoSchema.optional(),
  electricityBillDocument: surveyDocumentFileSchema.optional(),
  notes: z.string().trim().optional(),
});
export type SaveSurveyProgressInput = z.infer<typeof saveSurveyProgressSchema>;

export const prepareFinalConfigurationSchema = z.object({
  systemCapacityKw: z.number().positive(),
  panelModel: z.string().trim().min(1),
  panelWattage: z.number().positive(),
  numberOfPanels: z.number().int().positive(),
  inverterCapacityKw: z.number().positive(),
  structureType: z.string().trim().min(1),
  installationType: z.enum(INSTALLATION_TYPES),
});
export type PrepareFinalConfigurationInput = z.infer<typeof prepareFinalConfigurationSchema>;
