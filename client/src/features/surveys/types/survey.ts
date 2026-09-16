import type { LocationData } from "@/types/solarEstimate";

export type SurveyStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";

export type RoofType = "RCC" | "METAL" | "TILE" | "OTHER";
export type RoofCondition = "GOOD" | "AVERAGE" | "POOR";
export type ShadowLevel = "LOW" | "MEDIUM" | "HIGH";
export type MeterType = "SINGLE_PHASE" | "THREE_PHASE" | "OTHER";

/** Mirrors the browser Geolocation API's own request lifecycle so the UI can render every state it defines. */
export type GpsCaptureState = "idle" | "requesting" | "captured" | "denied" | "error";

export interface GpsLocation {
  latitude: number;
  longitude: number;
  capturedAt: string;
}

export interface SurveyPhoto {
  id: string;
  /** Object URL or data URI — never a raw File, matching the bill-upload pattern from Feature 2. */
  url: string;
  fileName: string;
}

export interface SurveyDocument {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
}

export interface RoofAssessment {
  roofType: RoofType;
  roofAreaSqft: number;
  roofCondition: RoofCondition;
  shadowLevel: ShadowLevel;
  meterType: MeterType;
}

/**
 * A technical site assessment for one lead. Deliberately its own entity (not embedded on Lead) —
 * a lead can only ever have one active survey, but keeping it separate matches how the real
 * `GET /api/surveys?leadId=` / `GET /api/surveys/:id` contracts will be shaped, and lets the
 * schedule → start → complete lifecycle carry its own status independent of the lead's.
 */
export interface Survey {
  id: string;
  leadId: string;
  /** Denormalized for list/card display without a join — the lead remains the source of truth. */
  customerName: string;
  address: string;
  location: LocationData;
  /** ISO date, e.g. "2026-07-15". */
  date: string;
  /** 24-hour "HH:mm", e.g. "11:00". */
  time: string;
  engineerId: string;
  status: SurveyStatus;
  roofAssessment?: RoofAssessment;
  gpsLocation?: GpsLocation;
  roofPhotos: SurveyPhoto[];
  meterPhoto?: SurveyPhoto;
  electricityBillDocument?: SurveyDocument;
  notes?: string;
  scheduledBy: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const ROOF_TYPE_LABEL: Record<RoofType, string> = {
  RCC: "RCC",
  METAL: "Metal",
  TILE: "Tile",
  OTHER: "Other",
};

export const ROOF_CONDITION_LABEL: Record<RoofCondition, string> = {
  GOOD: "Good",
  AVERAGE: "Average",
  POOR: "Poor",
};

export const SHADOW_LEVEL_LABEL: Record<ShadowLevel, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const METER_TYPE_LABEL: Record<MeterType, string> = {
  SINGLE_PHASE: "Single Phase",
  THREE_PHASE: "Three Phase",
  OTHER: "Other",
};

export const SURVEY_STATUS_LABEL: Record<SurveyStatus, string> = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};
