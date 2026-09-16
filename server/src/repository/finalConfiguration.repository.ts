import type { Types } from "mongoose";
import { FinalSolarConfigurationModel, type FinalSolarConfigurationAttrs } from "../models/FinalSolarConfiguration.model";

export interface CreateFinalConfigurationInput extends Omit<FinalSolarConfigurationAttrs, "createdAt" | "updatedAt" | "lead" | "survey"> {
  lead: string | Types.ObjectId;
  survey: string | Types.ObjectId;
}

export const finalConfigurationRepository = {
  findBySurveyId(surveyId: string) {
    return FinalSolarConfigurationModel.findOne({ survey: surveyId });
  },

  findByLeadId(leadId: string) {
    return FinalSolarConfigurationModel.findOne({ lead: leadId });
  },

  create(input: CreateFinalConfigurationInput) {
    return FinalSolarConfigurationModel.create(input);
  },
};
