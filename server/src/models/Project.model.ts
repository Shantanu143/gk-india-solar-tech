import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export const PROJECT_STATUSES = [
  "CREATED",
  "DOCUMENT_COLLECTION",
  "MATERIAL_PLANNING",
  "MATERIAL_DISPATCH",
  "INSTALLATION",
  "INSPECTION",
  "NET_METERING",
  "SUBSIDY_PROCESS",
  "COMPLETED",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface ProjectDocumentFile {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  uploadedAt: Date;
}

export interface ProjectAttrs {
  projectNumber: string;
  lead: Types.ObjectId;
  customer: Types.ObjectId;
  quotation: Types.ObjectId;
  status: ProjectStatus;
  systemCapacityKw: number;
  assignedEmployeeId: Types.ObjectId | null;
  documents: ProjectDocumentFile[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDocument = HydratedDocument<ProjectAttrs>;

const projectDocumentFileSchema = new Schema<ProjectDocumentFile>(
  {
    id: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

const projectSchema = new Schema<ProjectAttrs>(
  {
    projectNumber: { type: String, required: true, unique: true },
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true, unique: true },
    quotation: { type: Schema.Types.ObjectId, ref: "Quotation", required: true },
    status: { type: String, enum: PROJECT_STATUSES, required: true, default: "CREATED" },
    systemCapacityKw: { type: Number, required: true },
    assignedEmployeeId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    documents: { type: [projectDocumentFileSchema], default: [] },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

projectSchema.index({ status: 1 });
projectSchema.index({ assignedEmployeeId: 1 });

export const ProjectModel: Model<ProjectAttrs> = model<ProjectAttrs>("Project", projectSchema);
