import { finalConfigurationRepository } from "../repository/finalConfiguration.repository";
import { surveyRepository } from "../repository/survey.repository";
import { ApiError } from "../util/ApiError";
import { toPublicFinalConfiguration, type PublicFinalConfiguration } from "../util/serializeFinalConfiguration";
import type { InstallationType } from "../models/FinalSolarConfiguration.model";

export interface PrepareFinalConfigurationInput {
  surveyId: string;
  systemCapacityKw: number;
  panelModel: string;
  panelWattage: number;
  numberOfPanels: number;
  inverterCapacityKw: number;
  structureType: string;
  installationType: InstallationType;
  preparedBy: string;
}

export const finalConfigurationService = {
  async getForSurvey(surveyId: string): Promise<PublicFinalConfiguration | null> {
    const config = await finalConfigurationRepository.findBySurveyId(surveyId);
    return config ? toPublicFinalConfiguration(config) : null;
  },

  async prepare(input: PrepareFinalConfigurationInput): Promise<PublicFinalConfiguration> {
    const survey = await surveyRepository.findById(input.surveyId);
    if (!survey) throw ApiError.notFound("Survey not found.");
    if (survey.status !== "COMPLETED") throw ApiError.badRequest("Complete the site survey before preparing a final configuration.");

    const existing = await finalConfigurationRepository.findBySurveyId(input.surveyId);
    if (existing) throw ApiError.conflict("A final configuration already exists for this survey.");

    const config = await finalConfigurationRepository.create({
      lead: survey.lead,
      survey: survey._id,
      systemCapacityKw: input.systemCapacityKw,
      panelModel: input.panelModel,
      panelWattage: input.panelWattage,
      numberOfPanels: input.numberOfPanels,
      inverterCapacityKw: input.inverterCapacityKw,
      structureType: input.structureType,
      installationType: input.installationType,
      preparedBy: input.preparedBy,
    });

    return toPublicFinalConfiguration(config);
  },
};
