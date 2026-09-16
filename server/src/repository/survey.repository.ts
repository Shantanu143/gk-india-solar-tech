import type { Types } from "mongoose";
import { SurveyModel, type SurveyAttrs, type SurveyStatus } from "../models/Survey.model";

export interface CreateSurveyInput extends Omit<SurveyAttrs, "createdAt" | "updatedAt" | "lead" | "engineerId"> {
  lead: string | Types.ObjectId;
  engineerId: string | Types.ObjectId;
}

export interface SurveyFilters {
  status?: SurveyStatus;
  /** Resolved by the service — surveys assigned to this engineer OR scheduled on one of their own leads. */
  relevantToEmployeeId?: string;
  leadIdsForEmployee?: string[];
  scope?: "upcoming" | "today" | "completed";
}

function istToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export const surveyRepository = {
  list(filters: SurveyFilters) {
    const query: Record<string, unknown> = {};
    if (filters.status) query.status = filters.status;

    if (filters.relevantToEmployeeId) {
      const orClauses: Record<string, unknown>[] = [{ engineerId: filters.relevantToEmployeeId }];
      if (filters.leadIdsForEmployee) orClauses.push({ lead: { $in: filters.leadIdsForEmployee } });
      query.$or = orClauses;
    }

    if (filters.scope === "today") {
      query.date = istToday();
    } else if (filters.scope === "upcoming") {
      query.status = { $in: ["SCHEDULED", "IN_PROGRESS"] };
      query.date = { $gte: istToday() };
    } else if (filters.scope === "completed") {
      query.status = "COMPLETED";
    }

    return SurveyModel.find(query).sort({ date: 1, time: 1 });
  },

  findById(id: string) {
    return SurveyModel.findById(id);
  },

  findForLead(leadId: string) {
    return SurveyModel.findOne({ lead: leadId }).sort({ createdAt: -1 });
  },

  create(input: CreateSurveyInput) {
    return SurveyModel.create(input);
  },
};
