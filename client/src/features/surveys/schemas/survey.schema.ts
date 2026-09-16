import { z } from "zod";

export const scheduleSurveySchema = z.object({
  date: z.string().min(1, "Survey date is required."),
  time: z.string().min(1, "Survey time is required."),
  engineerId: z.string().min(1, "Select a survey engineer."),
});

export type ScheduleSurveyFormValues = z.infer<typeof scheduleSurveySchema>;

export const roofAssessmentSchema = z.object({
  roofType: z.enum(["RCC", "METAL", "TILE", "OTHER"]),
  roofAreaSqft: z.number({ error: "Enter the roof area in sq.ft." }).positive("Enter the roof area in sq.ft."),
  roofCondition: z.enum(["GOOD", "AVERAGE", "POOR"]),
  shadowLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  meterType: z.enum(["SINGLE_PHASE", "THREE_PHASE", "OTHER"]),
  notes: z.string().trim().optional(),
});

export type RoofAssessmentFormValues = z.infer<typeof roofAssessmentSchema>;

export const prepareFinalConfigurationSchema = z.object({
  systemCapacityKw: z.number({ error: "Enter the system capacity in kW." }).positive("Enter the system capacity in kW."),
  panelModel: z.string().trim().min(1, "Enter the panel model."),
  panelWattage: z.number({ error: "Enter the panel wattage." }).positive("Enter the panel wattage."),
  numberOfPanels: z.number({ error: "Enter the number of panels." }).int().positive("Enter the number of panels."),
  inverterCapacityKw: z.number({ error: "Enter the inverter capacity in kW." }).positive("Enter the inverter capacity in kW."),
  structureType: z.string().trim().min(1, "Enter the structure type."),
  installationType: z.enum(["RCC_ROOFTOP", "METAL_ROOFTOP", "TILE_ROOFTOP", "OTHER"]),
});

export type PrepareFinalConfigurationFormValues = z.infer<typeof prepareFinalConfigurationSchema>;
