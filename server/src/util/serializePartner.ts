import type { PartnerDocument } from "../models/Partner.model";

export interface SerializePartnerOptions {
  /** Only an ADMIN (never a SALES_MANAGER, even with `partners.view`) sees bank details/documents,
   * and a self-view (`GET /me`) always passes `true` — there's nothing to redact from yourself. */
  includeSensitive: boolean;
}

export function toPublicPartner(partner: PartnerDocument, options: SerializePartnerOptions) {
  const { includeSensitive } = options;
  const ip = partner.installationProfile;

  const installationProfile = ip
    ? {
        yearsOfExperience: ip.yearsOfExperience,
        teamSize: ip.teamSize,
        electricians: ip.electricians,
        installers: ip.installers,
        weldersFabricators: ip.weldersFabricators,
        dailyInstallationCapacityKw: ip.dailyInstallationCapacityKw,
        residentialExperience: ip.residentialExperience,
        commercialExperience: ip.commercialExperience,
        industrialExperience: ip.industrialExperience,
        onGridExperience: ip.onGridExperience,
        offGridExperience: ip.offGridExperience,
        canSiteSurvey: ip.canSiteSurvey,
        canStructureFabrication: ip.canStructureFabrication,
        canElectricalWork: ip.canElectricalWork,
        projectPhotos: ip.projectPhotos,
        serviceDistricts: ip.serviceDistricts,
        expectedLabourRate: ip.expectedLabourRate,
        ...(includeSensitive ? { bankDetails: ip.bankDetails, documents: ip.documents } : {}),
      }
    : undefined;

  return {
    id: partner._id.toString(),
    partnerId: partner.partnerId,
    user: partner.user.toString(),
    type: partner.type,
    name: partner.name,
    companyName: partner.companyName,
    mobile: partner.mobile,
    whatsapp: partner.whatsapp,
    email: partner.email,
    address: partner.address,
    howHeard: partner.howHeard,
    applicationStatus: partner.applicationStatus,
    reviewedBy: partner.reviewedBy ? partner.reviewedBy.toString() : null,
    reviewedAt: partner.reviewedAt ? partner.reviewedAt.toISOString() : undefined,
    rejectionReason: partner.rejectionReason,
    installationProfile,
    createdAt: partner.createdAt.toISOString(),
    updatedAt: partner.updatedAt.toISOString(),
  };
}

export type PublicPartner = ReturnType<typeof toPublicPartner>;
