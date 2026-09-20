export const PARTNER_TYPES = ["SALES_REFERRAL", "INSTALLATION_SERVICE", "EPC_PROJECT"] as const;
export type PartnerType = (typeof PARTNER_TYPES)[number];

export const PARTNER_APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const;
export type PartnerApplicationStatus = (typeof PARTNER_APPLICATION_STATUSES)[number];

export const PARTNER_TYPE_LABEL: Record<PartnerType, string> = {
  SALES_REFERRAL: "Sales / Referral Partner",
  INSTALLATION_SERVICE: "Installation / Service Partner",
  EPC_PROJECT: "EPC / Project Partner",
};

export const PARTNER_STATUS_LABEL: Record<PartnerApplicationStatus, string> = {
  PENDING: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

export interface PartnerAddress {
  state: string;
  district: string;
  city: string;
  addressLine?: string;
}

export interface PartnerDocumentFile {
  label: string;
  url: string;
  uploadedAt: string;
}

export interface PartnerBankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

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
  /** Present only when the caller is entitled to see them (self view, or an ADMIN with partners.view). */
  bankDetails?: PartnerBankDetails;
  documents?: PartnerDocumentFile[];
}

/** Mirrors `server/src/util/serializePartner.ts`'s `toPublicPartner` output exactly. */
export interface Partner {
  id: string;
  partnerId: string | null;
  user: string;
  type: PartnerType;
  name: string;
  companyName?: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: PartnerAddress;
  howHeard?: string;
  applicationStatus: PartnerApplicationStatus;
  reviewedBy: string | null;
  reviewedAt?: string;
  rejectionReason?: string;
  installationProfile?: InstallationPartnerProfile;
  createdAt: string;
  updatedAt: string;
}

/** `GET /api/partners/me/dashboard` response shape (`server/src/service/partnerDashboard.service.ts`). */
export interface PartnerDashboard {
  partnerId: string | null;
  applicationStatus: PartnerApplicationStatus;
  totalLeads: number;
  newLeads: number;
  activeLeads: number;
  bookings: number;
  lostLeads: number;
  completedProjects: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
}

/** `GET /api/dashboard/partner-performance` row shape (admin report). */
export interface PartnerPerformanceRow {
  partnerId: string;
  partnerCode: string | null;
  partnerName: string;
  partnerType: PartnerType;
  totalLeads: number;
  bookings: number;
  totalCommission: number;
  paidCommission: number;
}
