import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export const PARTNER_TYPES = ["SALES_REFERRAL", "INSTALLATION_SERVICE", "EPC_PROJECT"] as const;
export type PartnerType = (typeof PARTNER_TYPES)[number];

export const PARTNER_APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const;
export type PartnerApplicationStatus = (typeof PARTNER_APPLICATION_STATUSES)[number];

export interface PartnerAddress {
  state: string;
  district: string;
  city: string;
  addressLine?: string;
}

/** Data-URL-backed file, matching the existing precedent in `Survey.model.ts` — no object storage exists yet. */
export interface PartnerDocumentFile {
  label: string;
  url: string;
  uploadedAt: Date;
}

export interface PartnerBankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

/** Only populated when `type === "INSTALLATION_SERVICE"`. */
export interface InstallationPartnerProfile {
  yearsOfExperience: number;
  teamSize: number;
  electricians: number;
  installers: number;
  weldersFabricators: number;
  dailyInstallationCapacityKw: number;
  residentialExperience: boolean;
  commercialExperience: boolean;
  industrialExperience: boolean;
  onGridExperience: boolean;
  offGridExperience: boolean;
  canSiteSurvey: boolean;
  canStructureFabrication: boolean;
  canElectricalWork: boolean;
  projectPhotos: string[];
  serviceDistricts: string[];
  expectedLabourRate?: number;
  documents: PartnerDocumentFile[];
  bankDetails?: PartnerBankDetails;
}

export interface PartnerAttrs {
  /** Assigned on approval, e.g. "GKST-PT-0001" — null while PENDING/REJECTED. */
  partnerId: string | null;
  user: Types.ObjectId;
  type: PartnerType;
  name: string;
  companyName?: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: PartnerAddress;
  howHeard?: string;
  applicationStatus: PartnerApplicationStatus;
  reviewedBy: Types.ObjectId | null;
  reviewedAt?: Date;
  rejectionReason?: string;
  installationProfile?: InstallationPartnerProfile;
  createdAt: Date;
  updatedAt: Date;
}

export type PartnerDocument = HydratedDocument<PartnerAttrs>;

const partnerAddressSchema = new Schema<PartnerAddress>(
  {
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    addressLine: { type: String, trim: true },
  },
  { _id: false },
);

const partnerDocumentFileSchema = new Schema<PartnerDocumentFile>(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

const partnerBankDetailsSchema = new Schema<PartnerBankDetails>(
  {
    accountHolderName: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    ifsc: { type: String, required: true, trim: true, uppercase: true },
  },
  { _id: false },
);

const installationPartnerProfileSchema = new Schema<InstallationPartnerProfile>(
  {
    yearsOfExperience: { type: Number, required: true, min: 0 },
    teamSize: { type: Number, required: true, min: 0 },
    electricians: { type: Number, required: true, min: 0, default: 0 },
    installers: { type: Number, required: true, min: 0, default: 0 },
    weldersFabricators: { type: Number, required: true, min: 0, default: 0 },
    dailyInstallationCapacityKw: { type: Number, required: true, min: 0 },
    residentialExperience: { type: Boolean, required: true, default: false },
    commercialExperience: { type: Boolean, required: true, default: false },
    industrialExperience: { type: Boolean, required: true, default: false },
    onGridExperience: { type: Boolean, required: true, default: false },
    offGridExperience: { type: Boolean, required: true, default: false },
    canSiteSurvey: { type: Boolean, required: true, default: false },
    canStructureFabrication: { type: Boolean, required: true, default: false },
    canElectricalWork: { type: Boolean, required: true, default: false },
    projectPhotos: { type: [String], default: [] },
    serviceDistricts: { type: [String], default: [] },
    expectedLabourRate: { type: Number, min: 0 },
    documents: { type: [partnerDocumentFileSchema], default: [] },
    bankDetails: { type: partnerBankDetailsSchema },
  },
  { _id: false },
);

const partnerSchema = new Schema<PartnerAttrs>(
  {
    // No `unique`/`sparse` here — every unapproved partner has `partnerId: null` (an explicit value,
    // not a missing field), and MongoDB's `sparse` only excludes documents where the field is
    // entirely absent, not ones where it's null. A second pending applicant would collide on that
    // shared `null` under a plain sparse-unique index. The partial index below is the correct fix:
    // it only enforces uniqueness once a real id string has been assigned.
    partnerId: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    type: { type: String, enum: PARTNER_TYPES, required: true },
    name: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: partnerAddressSchema, required: true },
    howHeard: { type: String, trim: true },
    applicationStatus: { type: String, enum: PARTNER_APPLICATION_STATUSES, required: true, default: "PENDING" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
    installationProfile: { type: installationPartnerProfileSchema, default: undefined },
  },
  { timestamps: true },
);

partnerSchema.index({ applicationStatus: 1 });
partnerSchema.index({ type: 1 });
partnerSchema.index({ partnerId: 1 }, { unique: true, partialFilterExpression: { partnerId: { $type: "string" } } });

export const PartnerModel: Model<PartnerAttrs> = model<PartnerAttrs>("Partner", partnerSchema);
