import { apiRequest } from "@/services/apiClient";
import type { FinalSolarConfiguration, InstallationType } from "@/features/surveys/types/finalSolarConfiguration";

export async function getFinalConfigurationForSurvey(surveyId: string): Promise<FinalSolarConfiguration | null> {
  const { finalConfiguration } = await apiRequest<{ finalConfiguration: FinalSolarConfiguration | null }>(`/surveys/${surveyId}/final-configuration`);
  return finalConfiguration;
}

export interface PrepareFinalConfigurationPayload {
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

/**
 * Creates the technical configuration a survey produces — deliberately never writes to the lead's
 * original `SolarRecommendation`, which stays the customer-facing estimate on record.
 */
export async function prepareFinalConfiguration(payload: PrepareFinalConfigurationPayload): Promise<FinalSolarConfiguration> {
  // preparedBy rides along for the mutation hooks' convenience, but the server always derives the
  // real preparer from the authenticated session — extra JSON fields are ignored.
  const { surveyId, ...body } = payload;
  const { finalConfiguration } = await apiRequest<{ finalConfiguration: FinalSolarConfiguration }>(`/surveys/${surveyId}/final-configuration`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return finalConfiguration;
}
