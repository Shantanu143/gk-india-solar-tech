import type { FinalSolarConfigurationDocument } from "../models/FinalSolarConfiguration.model";

export function toPublicFinalConfiguration(config: FinalSolarConfigurationDocument) {
  return {
    id: config._id.toString(),
    leadId: config.lead.toString(),
    surveyId: config.survey.toString(),
    systemCapacityKw: config.systemCapacityKw,
    panelModel: config.panelModel,
    panelWattage: config.panelWattage,
    numberOfPanels: config.numberOfPanels,
    inverterCapacityKw: config.inverterCapacityKw,
    structureType: config.structureType,
    installationType: config.installationType,
    preparedBy: config.preparedBy,
    createdAt: config.createdAt.toISOString(),
    updatedAt: config.updatedAt.toISOString(),
  };
}

export type PublicFinalConfiguration = ReturnType<typeof toPublicFinalConfiguration>;
