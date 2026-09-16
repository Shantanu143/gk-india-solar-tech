/**
 * The technical configuration an employee prepares once a site survey is complete — combines the
 * electricity bill, roof area/type, site photos, customer requirement and survey report into a
 * concrete system design. Deliberately a SEPARATE entity from `SolarRecommendation`
 * (`@/types/solarEstimate`), which stays untouched as the original customer-facing estimate: the
 * final configuration is never written back over it, so "what we quoted the customer online" and
 * "what the site survey actually supports" can never collide.
 */
export type InstallationType = "RCC_ROOFTOP" | "METAL_ROOFTOP" | "TILE_ROOFTOP" | "OTHER";

export interface FinalSolarConfiguration {
  id: string;
  leadId: string;
  surveyId: string;
  systemCapacityKw: number;
  panelModel: string;
  panelWattage: number;
  numberOfPanels: number;
  inverterCapacityKw: number;
  structureType: string;
  installationType: InstallationType;
  preparedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const INSTALLATION_TYPE_LABEL: Record<InstallationType, string> = {
  RCC_ROOFTOP: "RCC Rooftop",
  METAL_ROOFTOP: "Metal Rooftop",
  TILE_ROOFTOP: "Tile Rooftop",
  OTHER: "Other",
};
