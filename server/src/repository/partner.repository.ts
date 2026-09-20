import type { Types } from "mongoose";
import {
  PartnerModel,
  type InstallationPartnerProfile,
  type PartnerAddress,
  type PartnerApplicationStatus,
  type PartnerType,
} from "../models/Partner.model";

export interface CreatePartnerInput {
  user: Types.ObjectId | string;
  type: PartnerType;
  name: string;
  companyName?: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: PartnerAddress;
  howHeard?: string;
  installationProfile?: InstallationPartnerProfile;
}

export interface PartnerFilters {
  status?: PartnerApplicationStatus;
  type?: PartnerType;
  search?: string;
}

export interface ListPartnersParams extends PartnerFilters {
  page: number;
  pageSize: number;
}

function buildFilterQuery(filters: PartnerFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (filters.status) query.applicationStatus = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.search) {
    const q = filters.search.trim();
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: rx }, { email: rx }, { companyName: rx }];
  }
  return query;
}

export const partnerRepository = {
  create(input: CreatePartnerInput) {
    return PartnerModel.create({
      ...input,
      partnerId: null,
      applicationStatus: "PENDING",
      reviewedBy: null,
    });
  },

  findById(id: string) {
    return PartnerModel.findById(id);
  },

  findByUserId(userId: string) {
    return PartnerModel.findOne({ user: userId });
  },

  /** Loosely typed on purpose: callers pass either flat top-level fields (status review) or
   * dot-notation paths like `"installationProfile.serviceDistricts"` (partner self-update) so a
   * partial `installationProfile` edit never clobbers the rest of that subdocument. */
  updateById(id: string, updates: Record<string, unknown>) {
    return PartnerModel.findByIdAndUpdate(id, updates, { new: true });
  },

  async list(params: ListPartnersParams) {
    const { page, pageSize, ...filters } = params;
    const query = buildFilterQuery(filters);

    const [items, total] = await Promise.all([
      PartnerModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      PartnerModel.countDocuments(query),
    ]);

    return { items, total };
  },

  /** Mirrors `leadRepository.nextLeadId()`'s counting pattern, formatted as "GKST-PT-0001" (no
   * year component). Based on partners that already hold an id, so PENDING/REJECTED applicants
   * (still `partnerId: null`) never consume a slot in the sequence. */
  async nextPartnerId(): Promise<string> {
    const count = await PartnerModel.countDocuments({ partnerId: { $ne: null } });
    return `GKST-PT-${String(count + 1).padStart(4, "0")}`;
  },
};
