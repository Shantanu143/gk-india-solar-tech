import { apiRequest } from "@/services/apiClient";
import type { GpsLocation, RoofAssessment, Survey, SurveyDocument, SurveyPhoto, SurveyStatus } from "@/features/surveys/types/survey";

export interface GetSurveysParams {
  /** Surveys assigned to this engineer, or scheduled by this employee for their own leads. */
  relevantToEmployeeId?: string;
  status?: SurveyStatus;
  scope?: "upcoming" | "today" | "completed";
}

function toQueryString(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getSurveys(params: GetSurveysParams = {}): Promise<Survey[]> {
  const qs = toQueryString({ ...params });
  return apiRequest<Survey[]>(`/surveys${qs}`);
}

export async function getSurvey(id: string): Promise<Survey> {
  const { survey } = await apiRequest<{ survey: Survey }>(`/surveys/${id}`);
  return survey;
}

export async function getSurveyByLeadId(leadId: string): Promise<Survey | null> {
  const { survey } = await apiRequest<{ survey: Survey | null }>(`/surveys/for-lead/${leadId}`);
  return survey;
}

export interface ScheduleSurveyPayload {
  leadId: string;
  date: string;
  time: string;
  engineerId: string;
  actorName: string;
}

export async function scheduleSurvey(payload: ScheduleSurveyPayload): Promise<Survey> {
  const { survey } = await apiRequest<{ survey: Survey }>("/surveys", {
    method: "POST",
    body: JSON.stringify({ leadId: payload.leadId, date: payload.date, time: payload.time, engineerId: payload.engineerId }),
  });
  return survey;
}

export async function startSurvey(id: string): Promise<Survey> {
  const { survey } = await apiRequest<{ survey: Survey }>(`/surveys/${id}/start`, { method: "POST" });
  return survey;
}

export interface SaveSurveyProgressPayload {
  id: string;
  roofAssessment?: RoofAssessment;
  gpsLocation?: GpsLocation;
  roofPhotos?: SurveyPhoto[];
  meterPhoto?: SurveyPhoto;
  electricityBillDocument?: SurveyDocument;
  notes?: string;
}

/** Saves in-progress form data without changing status — called as the engineer fills each section, so nothing is lost on-site. */
export async function saveSurveyProgress(payload: SaveSurveyProgressPayload): Promise<Survey> {
  const { id, ...body } = payload;
  const { survey } = await apiRequest<{ survey: Survey }>(`/surveys/${id}/progress`, { method: "PATCH", body: JSON.stringify(body) });
  return survey;
}

export interface CompleteSurveyPayload extends SaveSurveyProgressPayload {
  actorName: string;
}

export async function completeSurvey(payload: CompleteSurveyPayload): Promise<Survey> {
  // actorName rides along in the payload for the mutation hooks' convenience, but the server
  // always derives the real actor from the authenticated session — extra JSON fields are ignored.
  const { id, ...body } = payload;
  const { survey } = await apiRequest<{ survey: Survey }>(`/surveys/${id}/complete`, { method: "POST", body: JSON.stringify(body) });
  return survey;
}
