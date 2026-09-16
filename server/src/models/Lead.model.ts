import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "SURVEY_REQUESTED",
  "SURVEY_COMPLETED",
  "QUOTATION_PREPARED",
  "QUOTATION_SENT",
  "NEGOTIATION",
  "CONVERTED",
  "LOST",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];

export const LEAD_INTERESTS = ["LOW", "MEDIUM", "HIGH"] as const;
export type LeadInterest = (typeof LEAD_INTERESTS)[number];

export const LEAD_SOURCES = [
  "GOOGLE_ADS",
  "FACEBOOK",
  "INSTAGRAM",
  "YOUTUBE",
  "ORGANIC_SEARCH",
  "DIRECT",
  "REFERRAL",
  "OTHER",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LOST_REASONS = [
  "NOT_INTERESTED",
  "PRICE",
  "COMPETITOR",
  "LOCATION",
  "NOT_ELIGIBLE",
  "NO_RESPONSE",
  "OTHER",
] as const;
export type LostReason = (typeof LOST_REASONS)[number];

export const PROJECT_TYPES = ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface LeadCustomer {
  fullName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  address: string;
}

export interface LeadLocation {
  pincode: string;
  city: string;
  address: string;
}

export interface SolarRecommendation {
  recommendedCapacity: number;
  estimatedPanels: number;
  panelCapacity: number;
  recommendedInverter: number;
}

export interface LeadAttrs {
  leadId: string;
  customer: LeadCustomer;
  projectType: ProjectType;
  location: LeadLocation;
  monthlyBill: number;
  billDocumentName?: string;
  solarRecommendation: SolarRecommendation;
  source: LeadSource;
  status: LeadStatus;
  interest: LeadInterest;
  priority: LeadPriority;
  assignedEmployeeId: Types.ObjectId | null;
  lostReason?: LostReason;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadDocument = HydratedDocument<LeadAttrs>;

const leadCustomerSchema = new Schema<LeadCustomer>(
  {
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const leadLocationSchema = new Schema<LeadLocation>(
  {
    pincode: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const solarRecommendationSchema = new Schema<SolarRecommendation>(
  {
    recommendedCapacity: { type: Number, required: true },
    estimatedPanels: { type: Number, required: true },
    panelCapacity: { type: Number, required: true },
    recommendedInverter: { type: Number, required: true },
  },
  { _id: false },
);

const leadSchema = new Schema<LeadAttrs>(
  {
    leadId: { type: String, required: true, unique: true },
    customer: { type: leadCustomerSchema, required: true },
    projectType: { type: String, enum: PROJECT_TYPES, required: true },
    location: { type: leadLocationSchema, required: true },
    monthlyBill: { type: Number, required: true },
    billDocumentName: { type: String, trim: true },
    solarRecommendation: { type: solarRecommendationSchema, required: true },
    source: { type: String, enum: LEAD_SOURCES, required: true },
    status: { type: String, enum: LEAD_STATUSES, required: true, default: "NEW" },
    interest: { type: String, enum: LEAD_INTERESTS, required: true, default: "MEDIUM" },
    priority: { type: String, enum: LEAD_PRIORITIES, required: true, default: "MEDIUM" },
    assignedEmployeeId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    lostReason: { type: String, enum: LOST_REASONS },
  },
  { timestamps: true },
);

leadSchema.index({ status: 1 });
leadSchema.index({ assignedEmployeeId: 1 });

export const LeadModel: Model<LeadAttrs> = model<LeadAttrs>("Lead", leadSchema);
