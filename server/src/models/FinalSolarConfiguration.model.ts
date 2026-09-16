import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export const INSTALLATION_TYPES = ["RCC_ROOFTOP", "METAL_ROOFTOP", "TILE_ROOFTOP", "OTHER"] as const;
export type InstallationType = (typeof INSTALLATION_TYPES)[number];

export interface FinalSolarConfigurationAttrs {
  lead: Types.ObjectId;
  survey: Types.ObjectId;
  systemCapacityKw: number;
  panelModel: string;
  panelWattage: number;
  numberOfPanels: number;
  inverterCapacityKw: number;
  structureType: string;
  installationType: InstallationType;
  preparedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FinalSolarConfigurationDocument = HydratedDocument<FinalSolarConfigurationAttrs>;

const finalSolarConfigurationSchema = new Schema<FinalSolarConfigurationAttrs>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    survey: { type: Schema.Types.ObjectId, ref: "Survey", required: true, unique: true },
    systemCapacityKw: { type: Number, required: true },
    panelModel: { type: String, required: true, trim: true },
    panelWattage: { type: Number, required: true },
    numberOfPanels: { type: Number, required: true },
    inverterCapacityKw: { type: Number, required: true },
    structureType: { type: String, required: true, trim: true },
    installationType: { type: String, enum: INSTALLATION_TYPES, required: true },
    preparedBy: { type: String, required: true },
  },
  { timestamps: true },
);

export const FinalSolarConfigurationModel: Model<FinalSolarConfigurationAttrs> = model<FinalSolarConfigurationAttrs>(
  "FinalSolarConfiguration",
  finalSolarConfigurationSchema,
);
