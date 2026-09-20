import { partnerRepository } from "../repository/partner.repository";
import { userRepository } from "../repository/user.repository";
import { notificationService } from "./notification.service";
import { hashPassword } from "../util/password";
import { ApiError } from "../util/ApiError";
import { toPublicPartner, type PublicPartner } from "../util/serializePartner";
import type { InstallationPartnerProfile } from "../models/Partner.model";
import type {
  ApplyPartnerInput,
  InstallationProfileInput,
  ListPartnersQuery,
  UpdateMyPartnerInput,
  UpdatePartnerStatusInput,
} from "../validation/partner.validation";

export interface ListPartnersResult {
  items: PublicPartner[];
  total: number;
  page: number;
  pageSize: number;
}

function buildInstallationProfile(input: InstallationProfileInput): InstallationPartnerProfile {
  return {
    yearsOfExperience: input.yearsOfExperience,
    teamSize: input.teamSize,
    electricians: input.electricians,
    installers: input.installers,
    weldersFabricators: input.weldersFabricators,
    dailyInstallationCapacityKw: input.dailyInstallationCapacityKw,
    residentialExperience: input.residentialExperience,
    commercialExperience: input.commercialExperience,
    industrialExperience: input.industrialExperience,
    onGridExperience: input.onGridExperience,
    offGridExperience: input.offGridExperience,
    canSiteSurvey: input.canSiteSurvey,
    canStructureFabrication: input.canStructureFabrication,
    canElectricalWork: input.canElectricalWork,
    projectPhotos: input.projectPhotos ?? [],
    serviceDistricts: input.serviceDistricts ?? [],
    expectedLabourRate: input.expectedLabourRate,
    documents: (input.documents ?? []).map((doc) => ({ ...doc, uploadedAt: new Date() })),
    bankDetails: input.bankDetails,
  };
}

export const partnerService = {
  /** Public — a prospective partner's self-registration. No login tokens are issued here; the
   * partner logs in separately once an admin approves the application. */
  async applyAsPartner(input: ApplyPartnerInput): Promise<PublicPartner> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw ApiError.conflict("An account with this email already exists.");

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "PARTNER",
    });

    const partner = await partnerRepository.create({
      user: user._id,
      type: input.type,
      name: input.name,
      companyName: input.companyName,
      mobile: input.mobile,
      whatsapp: input.whatsapp,
      email: input.email,
      address: input.address,
      howHeard: input.howHeard,
      installationProfile:
        input.type === "INSTALLATION_SERVICE" ? buildInstallationProfile(input.installationProfile) : undefined,
    });

    await notificationService.notifyRoles(["ADMIN", "SALES_MANAGER"], {
      type: "PARTNER_APPLICATION_SUBMITTED",
      title: "New Partner Application",
      description: `${input.name} applied as a ${input.type} partner`,
    });

    return toPublicPartner(partner, { includeSensitive: true });
  },

  /**
   * Admin-only — creates a partner directly, pre-approved with a Partner ID assigned immediately
   * (skips the pending-review step, since an admin creating the account is itself the approval).
   * Reuses the exact same fields/validation as public self-registration (`applyAsPartner`) — the
   * only difference is who's vouching for the account and its resulting status.
   */
  async createByAdmin(input: ApplyPartnerInput, reviewerId: string): Promise<PublicPartner> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw ApiError.conflict("An account with this email already exists.");

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "PARTNER",
    });

    const partnerId = await partnerRepository.nextPartnerId();
    const partner = await partnerRepository.create({
      user: user._id,
      type: input.type,
      name: input.name,
      companyName: input.companyName,
      mobile: input.mobile,
      whatsapp: input.whatsapp,
      email: input.email,
      address: input.address,
      howHeard: input.howHeard,
      installationProfile:
        input.type === "INSTALLATION_SERVICE" ? buildInstallationProfile(input.installationProfile) : undefined,
    });

    const approved = await partnerRepository.updateById(partner._id.toString(), {
      applicationStatus: "APPROVED",
      partnerId,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    });
    if (!approved) throw ApiError.notFound("Partner not found.");

    await notificationService.notify({
      recipient: user._id.toString(),
      type: "PARTNER_APPROVED",
      title: "Welcome to the Partner Program",
      description: `An administrator created your partner account. Your Partner ID is ${partnerId}. Sign in with the email and password you were given.`,
    });

    return toPublicPartner(approved, { includeSensitive: true });
  },

  async getMyProfile(userId: string): Promise<PublicPartner> {
    const partner = await partnerRepository.findByUserId(userId);
    if (!partner) throw ApiError.notFound("Partner profile not found.");
    return toPublicPartner(partner, { includeSensitive: true });
  },

  async updateMyProfile(userId: string, input: UpdateMyPartnerInput): Promise<PublicPartner> {
    const partner = await partnerRepository.findByUserId(userId);
    if (!partner) throw ApiError.notFound("Partner profile not found.");

    const updates: Record<string, unknown> = {};
    if (input.companyName !== undefined) updates.companyName = input.companyName;
    if (input.mobile !== undefined) updates.mobile = input.mobile;
    if (input.whatsapp !== undefined) updates.whatsapp = input.whatsapp;
    if (input.address !== undefined) updates.address = input.address;
    if (input.howHeard !== undefined) updates.howHeard = input.howHeard;

    // Installation-profile fields only ever apply to installation-service partners, regardless of
    // what the caller sent — an EPC/sales-referral partner's request body simply has no effect here.
    if (input.installationProfile && partner.type === "INSTALLATION_SERVICE") {
      const ip = input.installationProfile;
      if (ip.serviceDistricts !== undefined) updates["installationProfile.serviceDistricts"] = ip.serviceDistricts;
      if (ip.expectedLabourRate !== undefined) updates["installationProfile.expectedLabourRate"] = ip.expectedLabourRate;
      if (ip.projectPhotos !== undefined) updates["installationProfile.projectPhotos"] = ip.projectPhotos;
      if (ip.documents !== undefined) {
        updates["installationProfile.documents"] = ip.documents.map((doc) => ({ ...doc, uploadedAt: new Date() }));
      }
      if (ip.bankDetails !== undefined) updates["installationProfile.bankDetails"] = ip.bankDetails;
    }

    const updated = Object.keys(updates).length > 0 ? await partnerRepository.updateById(partner._id.toString(), updates) : partner;
    if (!updated) throw ApiError.notFound("Partner profile not found.");

    return toPublicPartner(updated, { includeSensitive: true });
  },

  async listPartners(params: ListPartnersQuery): Promise<ListPartnersResult> {
    const { items, total } = await partnerRepository.list(params);
    return {
      items: items.map((item) => toPublicPartner(item, { includeSensitive: false })),
      total,
      page: params.page,
      pageSize: params.pageSize,
    };
  },

  async getPartnerById(id: string, options: { includeSensitive: boolean }): Promise<PublicPartner> {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw ApiError.notFound("Partner not found.");
    return toPublicPartner(partner, options);
  },

  async updatePartnerStatus(id: string, reviewerId: string, input: UpdatePartnerStatusInput): Promise<PublicPartner> {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw ApiError.notFound("Partner not found.");

    const updates: Record<string, unknown> = { reviewedBy: reviewerId, reviewedAt: new Date() };

    if (input.status === "APPROVED") {
      const partnerId = partner.partnerId ?? (await partnerRepository.nextPartnerId());
      updates.applicationStatus = "APPROVED";
      updates.partnerId = partnerId;

      const updated = await partnerRepository.updateById(id, updates);
      if (!updated) throw ApiError.notFound("Partner not found.");

      await notificationService.notify({
        recipient: updated.user.toString(),
        type: "PARTNER_APPROVED",
        title: "Application Approved",
        description: `Welcome aboard! Your Partner ID is ${partnerId}.`,
      });

      return toPublicPartner(updated, { includeSensitive: true });
    }

    if (input.status === "REJECTED") {
      updates.applicationStatus = "REJECTED";
      updates.rejectionReason = input.rejectionReason;

      const updated = await partnerRepository.updateById(id, updates);
      if (!updated) throw ApiError.notFound("Partner not found.");

      await notificationService.notify({
        recipient: updated.user.toString(),
        type: "PARTNER_REJECTED",
        title: "Application Rejected",
        description: `Your partner application was rejected. Reason: ${input.rejectionReason}`,
      });

      return toPublicPartner(updated, { includeSensitive: true });
    }

    // SUSPENDED
    updates.applicationStatus = "SUSPENDED";

    const updated = await partnerRepository.updateById(id, updates);
    if (!updated) throw ApiError.notFound("Partner not found.");

    await notificationService.notify({
      recipient: updated.user.toString(),
      type: "PARTNER_REJECTED",
      title: "Partner Account Suspended",
      description: "Your partner account has been suspended. Contact support for details.",
    });

    return toPublicPartner(updated, { includeSensitive: true });
  },
};
