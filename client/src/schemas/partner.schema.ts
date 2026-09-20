import { z } from "zod";
import { PARTNER_TYPES, PARTNER_TYPE_LABEL, type PartnerAddress, type PartnerBankDetails, type PartnerType } from "@/features/partners/types/partner";

export { PARTNER_TYPES, PARTNER_TYPE_LABEL };
export type { PartnerType };

/** Short marketing/registration copy for each partner type — presentational only, not part of the shared partner domain model. */
export const PARTNER_TYPE_DESCRIPTION: Record<PartnerType, string> = {
  SALES_REFERRAL:
    "For electricians, dealers, shop owners and connectors who refer customers looking for solar and earn commission whenever a referral books a system.",
  INSTALLATION_SERVICE:
    "For installation teams, electricians and fabricators who carry out on-site installation, structure fabrication and electrical work for booked projects.",
  EPC_PROJECT:
    "For established EPC contractors who can take on complete solar projects end-to-end, from execution through commissioning.",
};

/** 10-15 chars, digits/+/-/space — mirrors server/src/validation/partner.validation.ts. */
const PHONE_REGEX = /^[0-9+\-\s]{10,15}$/;

/** Min 8 chars, at least one letter and one number — mirrors server/src/validation/partner.validation.ts. */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

/** Native `<input>` values arrive as `""` for "not set" — treat that the same as omitted. */
function emptyToUndefined(value: unknown) {
  return value === "" || value === null ? undefined : value;
}

const optionalCount = z.preprocess(emptyToUndefined, z.coerce.number().min(0, "Must be 0 or more.").optional());
const optionalRate = z.preprocess(emptyToUndefined, z.coerce.number().min(0, "Must be 0 or more.").optional());

const addressSchema = z.object({
  state: z.string().trim().min(1, "Please enter your state."),
  district: z.string().trim().min(1, "Please enter your district."),
  city: z.string().trim().min(1, "Please enter your city."),
  addressLine: z.string().trim().optional(),
});

const bankDetailsFieldsSchema = z.object({
  accountHolderName: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  accountNumber: z.string().trim().optional(),
  ifsc: z.string().trim().optional(),
});

/**
 * Backs the whole `PartnerApplyPage` form regardless of which partner type is selected — the
 * installation-only fields simply aren't rendered (and aren't required) unless
 * `type === "INSTALLATION_SERVICE"`. `toPartnerApplyRequest` below is what actually shapes the
 * three different request payloads the server's discriminated union expects.
 */
export const partnerApplySchema = z
  .object({
    type: z.enum(PARTNER_TYPES, { message: "Select a partner type." }),
    name: z.string().trim().min(2, "Please enter your full name."),
    companyName: z.string().trim().optional(),
    email: z.string().trim().email("Please enter a valid email address."),
    password: passwordSchema,
    mobile: z.string().trim().regex(PHONE_REGEX, "Please enter a valid mobile number."),
    sameAsMobile: z.boolean(),
    whatsapp: z.string().trim().optional(),
    address: addressSchema,
    howHeard: z.string().trim().optional(),

    // Installation / Service partner profile — required (see superRefine below), and only sent to
    // the API, when type === "INSTALLATION_SERVICE".
    yearsOfExperience: optionalCount,
    teamSize: optionalCount,
    electricians: optionalCount,
    installers: optionalCount,
    weldersFabricators: optionalCount,
    dailyInstallationCapacityKw: optionalCount,
    residentialExperience: z.boolean(),
    commercialExperience: z.boolean(),
    industrialExperience: z.boolean(),
    onGridExperience: z.boolean(),
    offGridExperience: z.boolean(),
    canSiteSurvey: z.boolean(),
    canStructureFabrication: z.boolean(),
    canElectricalWork: z.boolean(),
    projectPhotos: z.array(z.string()),
    /** Raw comma-separated input, e.g. "Pune, Pimpri-Chinchwad" — split into an array in `toPartnerApplyRequest`. */
    serviceDistricts: z.string().trim().optional(),
    expectedLabourRate: optionalRate,
    identityDocument: z.string().optional(),
    businessDocument: z.string().optional(),
    experienceDocument: z.string().optional(),
    bankDetails: bankDetailsFieldsSchema,
  })
  .superRefine((data, ctx) => {
    if (!data.sameAsMobile && !PHONE_REGEX.test(data.whatsapp ?? "")) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Please enter a valid WhatsApp number." });
    }

    if (data.type !== "INSTALLATION_SERVICE") return;

    if (data.yearsOfExperience === undefined) {
      ctx.addIssue({ code: "custom", path: ["yearsOfExperience"], message: "Enter your years of experience." });
    }
    if (data.teamSize === undefined) {
      ctx.addIssue({ code: "custom", path: ["teamSize"], message: "Enter your team size." });
    }
    if (data.electricians === undefined) {
      ctx.addIssue({ code: "custom", path: ["electricians"], message: "Enter your number of electricians." });
    }
    if (data.installers === undefined) {
      ctx.addIssue({ code: "custom", path: ["installers"], message: "Enter your number of installers." });
    }
    if (data.weldersFabricators === undefined) {
      ctx.addIssue({ code: "custom", path: ["weldersFabricators"], message: "Enter your number of welders/fabricators." });
    }
    if (data.dailyInstallationCapacityKw === undefined) {
      ctx.addIssue({ code: "custom", path: ["dailyInstallationCapacityKw"], message: "Enter your daily installation capacity." });
    }
  });

/**
 * Because several fields above go through `z.preprocess`/`z.coerce` (empty string → undefined →
 * coerced number), the schema's input shape (what `register`/`watch` actually hold) differs from its
 * output shape (what a successful submit produces). `zodResolver` types itself accordingly
 * (`Resolver<z.input<Schema>, Context, z.output<Schema>>`), so `useForm` must be parameterized the
 * same way: `useForm<PartnerApplyFormValues, unknown, PartnerApplyValues>` — using `z.infer` (i.e.
 * the output type) for both would make TypeScript reject the resolver as a type mismatch.
 */
export type PartnerApplyFormValues = z.input<typeof partnerApplySchema>;
export type PartnerApplyValues = z.output<typeof partnerApplySchema>;

// ---- API request shape ----------------------------------------------------
// Matches `POST /api/partners/apply`'s discriminated-union body exactly (see server-side
// `server/src/validation` for the source of truth this mirrors).

export interface PartnerApplyRequest {
  type: PartnerType;
  name: string;
  companyName?: string;
  email: string;
  password: string;
  mobile: string;
  whatsapp: string;
  address: PartnerAddress;
  howHeard?: string;
  installationProfile?: {
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
    projectPhotos?: string[];
    serviceDistricts?: string[];
    expectedLabourRate?: number;
    documents?: { label: string; url: string }[];
    bankDetails?: PartnerBankDetails;
  };
}

/** Builds the exact `POST /api/partners/apply` body from validated (post-parse) form values. */
export function toPartnerApplyRequest(values: PartnerApplyValues): PartnerApplyRequest {
  const base: PartnerApplyRequest = {
    type: values.type,
    name: values.name.trim(),
    companyName: values.companyName?.trim() || undefined,
    email: values.email.trim(),
    password: values.password,
    mobile: values.mobile.trim(),
    whatsapp: values.sameAsMobile ? values.mobile.trim() : (values.whatsapp ?? "").trim(),
    address: {
      state: values.address.state.trim(),
      district: values.address.district.trim(),
      city: values.address.city.trim(),
      addressLine: values.address.addressLine?.trim() || undefined,
    },
    howHeard: values.howHeard?.trim() || undefined,
  };

  if (values.type !== "INSTALLATION_SERVICE") return base;

  const documents = (
    [
      { label: "Identity Document", url: values.identityDocument },
      { label: "Business Document", url: values.businessDocument },
      { label: "Experience/Certification", url: values.experienceDocument },
    ] as { label: string; url: string | undefined }[]
  ).filter((doc): doc is { label: string; url: string } => !!doc.url);

  const bank = values.bankDetails;
  const bankDetails: PartnerBankDetails | undefined =
    bank?.accountHolderName && bank.bankName && bank.accountNumber && bank.ifsc
      ? {
          accountHolderName: bank.accountHolderName.trim(),
          bankName: bank.bankName.trim(),
          accountNumber: bank.accountNumber.trim(),
          ifsc: bank.ifsc.trim(),
        }
      : undefined;

  const serviceDistricts = values.serviceDistricts
    ? values.serviceDistricts
        .split(",")
        .map((district) => district.trim())
        .filter(Boolean)
    : undefined;

  return {
    ...base,
    installationProfile: {
      yearsOfExperience: values.yearsOfExperience ?? 0,
      teamSize: values.teamSize ?? 0,
      electricians: values.electricians ?? 0,
      installers: values.installers ?? 0,
      weldersFabricators: values.weldersFabricators ?? 0,
      dailyInstallationCapacityKw: values.dailyInstallationCapacityKw ?? 0,
      residentialExperience: values.residentialExperience,
      commercialExperience: values.commercialExperience,
      industrialExperience: values.industrialExperience,
      onGridExperience: values.onGridExperience,
      offGridExperience: values.offGridExperience,
      canSiteSurvey: values.canSiteSurvey,
      canStructureFabrication: values.canStructureFabrication,
      canElectricalWork: values.canElectricalWork,
      projectPhotos: values.projectPhotos.length ? values.projectPhotos : undefined,
      serviceDistricts,
      expectedLabourRate: values.expectedLabourRate,
      documents: documents.length ? documents : undefined,
      bankDetails,
    },
  };
}
