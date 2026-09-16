import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";
import type { ProjectType } from "./Lead.model";
import { PROJECT_TYPES } from "./Lead.model";

export interface CustomerAttrs {
  lead: Types.ObjectId;
  fullName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  address: string;
  projectType: ProjectType;
  systemCapacityKw?: number;
  assignedEmployeeId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerDocument = HydratedDocument<CustomerAttrs>;

const customerSchema = new Schema<CustomerAttrs>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    projectType: { type: String, enum: PROJECT_TYPES, required: true },
    systemCapacityKw: { type: Number },
    assignedEmployeeId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export const CustomerModel: Model<CustomerAttrs> = model<CustomerAttrs>("Customer", customerSchema);
