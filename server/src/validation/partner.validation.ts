import { z } from "zod";
import { PARTNER_APPLICATION_STATUSES, PARTNER_TYPES } from "../models/Partner.model";

// Same rules as `employee.validation.ts`'s `passwordSchema` — kept in sync by hand since partners
// are provisioned through a public endpoint, not the admin employee-creation flow.
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

const phoneSchema = z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number.");

const partnerAddressSchema = z.object({
  state: z.string().trim().min(1, "State is required."),
  district: z.string().trim().min(1, "District is required."),
  city: z.string().trim().min(1, "City is required."),
  addressLine: z.string().trim().max(300).optional(),
});

const partnerDocumentInputSchema = z.object({
  label: z.string().trim().min(1, "Document label is required."),
  url: z.string().trim().min(1, "Document file is required."),
});

const partnerBankDetailsInputSchema = z.object({
  accountHolderName: z.string().trim().min(1, "Account holder name is required."),
  bankName: z.string().trim().min(1, "Bank name is required."),
  accountNumber: z.string().trim().min(1, "Account number is required."),
  ifsc: z.string().trim().min(1, "IFSC code is required."),
});

const installationProfileInputSchema = z.object({
  yearsOfExperience: z.coerce.number().min(0),
  teamSize: z.coerce.number().min(0),
  electricians: z.coerce.number().min(0),
  installers: z.coerce.number().min(0),
  weldersFabricators: z.coerce.number().min(0),
  dailyInstallationCapacityKw: z.coerce.number().min(0),
  residentialExperience: z.boolean(),
  commercialExperience: z.boolean(),
  industrialExperience: z.boolean(),
  onGridExperience: z.boolean(),
  offGridExperience: z.boolean(),
  canSiteSurvey: z.boolean(),
  canStructureFabrication: z.boolean(),
  canElectricalWork: z.boolean(),
  projectPhotos: z.array(z.string()).optional(),
  serviceDistricts: z.array(z.string()).optional(),
  expectedLabourRate: z.coerce.number().min(0).optional(),
  documents: z.array(partnerDocumentInputSchema).optional(),
  bankDetails: partnerBankDetailsInputSchema.optional(),
});
export type InstallationProfileInput = z.infer<typeof installationProfileInputSchema>;

const basePartnerApplicationFields = {
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  companyName: z.string().trim().max(150).optional(),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: passwordSchema,
  mobile: phoneSchema,
  whatsapp: phoneSchema,
  address: partnerAddressSchema,
  howHeard: z.string().trim().max(200).optional(),
};

/** Public — a prospective partner's self-registration. `installationProfile` is required exactly
 * when `type === "INSTALLATION_SERVICE"`, enforced via the discriminated union below. */
export const applyPartnerSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(PARTNER_TYPES[0]), // SALES_REFERRAL
    ...basePartnerApplicationFields,
  }),
  z.object({
    type: z.literal(PARTNER_TYPES[1]), // INSTALLATION_SERVICE
    ...basePartnerApplicationFields,
    installationProfile: installationProfileInputSchema,
  }),
  z.object({
    type: z.literal(PARTNER_TYPES[2]), // EPC_PROJECT
    ...basePartnerApplicationFields,
  }),
]);
export type ApplyPartnerInput = z.infer<typeof applyPartnerSchema>;

/** A partner's self-service edit — everything else (`type`, `applicationStatus`, `partnerId`,
 * `email`, `user`) is simply not accepted here, and unknown keys are stripped, not merged. */
export const updateMyPartnerSchema = z.object({
  companyName: z.string().trim().max(150).optional(),
  mobile: phoneSchema.optional(),
  whatsapp: phoneSchema.optional(),
  address: partnerAddressSchema.optional(),
  howHeard: z.string().trim().max(200).optional(),
  installationProfile: z
    .object({
      serviceDistricts: z.array(z.string()).optional(),
      expectedLabourRate: z.coerce.number().min(0).optional(),
      projectPhotos: z.array(z.string()).optional(),
      documents: z.array(partnerDocumentInputSchema).optional(),
      bankDetails: partnerBankDetailsInputSchema.optional(),
    })
    .optional(),
});
export type UpdateMyPartnerInput = z.infer<typeof updateMyPartnerSchema>;

export const listPartnersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(200).default(20),
  status: z.enum(PARTNER_APPLICATION_STATUSES).optional(),
  type: z.enum(PARTNER_TYPES).optional(),
  search: z.string().trim().optional(),
});
export type ListPartnersQuery = z.infer<typeof listPartnersQuerySchema>;

export const updatePartnerStatusSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED", "SUSPENDED"], { message: "Select a valid status." }),
    rejectionReason: z.string().trim().min(3, "Provide a rejection reason.").optional(),
  })
  .refine((data) => data.status !== "REJECTED" || !!data.rejectionReason, {
    message: "A rejection reason is required when rejecting a partner.",
    path: ["rejectionReason"],
  });
export type UpdatePartnerStatusInput = z.infer<typeof updatePartnerStatusSchema>;
