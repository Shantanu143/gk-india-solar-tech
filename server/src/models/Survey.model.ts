import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";
import type { LeadLocation } from "./Lead.model";

export const SURVEY_STATUSES = ["SCHEDULED", "IN_PROGRESS", "COMPLETED"] as const;
export type SurveyStatus = (typeof SURVEY_STATUSES)[number];

export const ROOF_TYPES = ["RCC", "METAL", "TILE", "OTHER"] as const;
export type RoofType = (typeof ROOF_TYPES)[number];

export const ROOF_CONDITIONS = ["GOOD", "AVERAGE", "POOR"] as const;
export type RoofCondition = (typeof ROOF_CONDITIONS)[number];

export const SHADOW_LEVELS = ["LOW", "MEDIUM", "HIGH"] as const;
export type ShadowLevel = (typeof SHADOW_LEVELS)[number];

export const METER_TYPES = ["SINGLE_PHASE", "THREE_PHASE", "OTHER"] as const;
export type MeterType = (typeof METER_TYPES)[number];

export interface RoofAssessment {
  roofType: RoofType;
  roofAreaSqft: number;
  roofCondition: RoofCondition;
  shadowLevel: ShadowLevel;
  meterType: MeterType;
}

export interface GpsLocation {
  latitude: number;
  longitude: number;
  capturedAt: Date;
}

export interface SurveyPhoto {
  id: string;
  /** Object URL or data URI. */
  url: string;
  fileName: string;
}

export interface SurveyDocumentFile {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
}

export interface SurveyAttrs {
  lead: Types.ObjectId;
  customerName: string;
  address: string;
  location: LeadLocation;
  date: string;
  time: string;
  engineerId: Types.ObjectId;
  status: SurveyStatus;
  roofAssessment?: RoofAssessment;
  gpsLocation?: GpsLocation;
  roofPhotos: SurveyPhoto[];
  meterPhoto?: SurveyPhoto;
  electricityBillDocument?: SurveyDocumentFile;
  notes?: string;
  scheduledBy: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SurveyDocument = HydratedDocument<SurveyAttrs>;

const roofAssessmentSchema = new Schema<RoofAssessment>(
  {
    roofType: { type: String, enum: ROOF_TYPES, required: true },
    roofAreaSqft: { type: Number, required: true },
    roofCondition: { type: String, enum: ROOF_CONDITIONS, required: true },
    shadowLevel: { type: String, enum: SHADOW_LEVELS, required: true },
    meterType: { type: String, enum: METER_TYPES, required: true },
  },
  { _id: false },
);

const gpsLocationSchema = new Schema<GpsLocation>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    capturedAt: { type: Date, required: true },
  },
  { _id: false },
);

const surveyPhotoSchema = new Schema<SurveyPhoto>(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  { _id: false },
);

const surveyDocumentFileSchema = new Schema<SurveyDocumentFile>(
  {
    id: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const surveyLocationSchema = new Schema<LeadLocation>(
  {
    pincode: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const surveySchema = new Schema<SurveyAttrs>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    location: { type: surveyLocationSchema, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    engineerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: SURVEY_STATUSES, required: true, default: "SCHEDULED" },
    roofAssessment: { type: roofAssessmentSchema },
    gpsLocation: { type: gpsLocationSchema },
    roofPhotos: { type: [surveyPhotoSchema], default: [] },
    meterPhoto: { type: surveyPhotoSchema },
    electricityBillDocument: { type: surveyDocumentFileSchema },
    notes: { type: String, trim: true },
    scheduledBy: { type: String, required: true },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

export const SurveyModel: Model<SurveyAttrs> = model<SurveyAttrs>("Survey", surveySchema);
