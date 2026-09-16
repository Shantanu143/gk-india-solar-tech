import type { SurveyDocument } from "../models/Survey.model";

export function toPublicSurvey(survey: SurveyDocument) {
  return {
    id: survey._id.toString(),
    leadId: survey.lead.toString(),
    customerName: survey.customerName,
    address: survey.address,
    location: survey.location,
    date: survey.date,
    time: survey.time,
    engineerId: survey.engineerId.toString(),
    status: survey.status,
    roofAssessment: survey.roofAssessment,
    gpsLocation: survey.gpsLocation
      ? { latitude: survey.gpsLocation.latitude, longitude: survey.gpsLocation.longitude, capturedAt: survey.gpsLocation.capturedAt.toISOString() }
      : undefined,
    roofPhotos: survey.roofPhotos,
    meterPhoto: survey.meterPhoto,
    electricityBillDocument: survey.electricityBillDocument,
    notes: survey.notes,
    scheduledBy: survey.scheduledBy,
    startedAt: survey.startedAt ? survey.startedAt.toISOString() : undefined,
    completedAt: survey.completedAt ? survey.completedAt.toISOString() : undefined,
    createdAt: survey.createdAt.toISOString(),
    updatedAt: survey.updatedAt.toISOString(),
  };
}

export type PublicSurvey = ReturnType<typeof toPublicSurvey>;
