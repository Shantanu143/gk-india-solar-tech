import { z } from "zod";

const phoneSchema = z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number.");

/** A plain, optional email — kept simple (no literal/union gymnastics) since it's the only truly
 * optional-but-validated free-text field on either form here. */
const optionalEmailSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), { message: "Enter a valid email address." });

export const partnerProfileAddressSchema = z.object({
  state: z.string().trim().min(1, "State is required."),
  district: z.string().trim().min(1, "District is required."),
  city: z.string().trim().min(1, "City is required."),
  addressLine: z.string().trim().max(300).optional(),
});

/**
 * Partner's self-service profile edit. Mirrors `server/src/validation/partner.validation.ts`'s
 * `updateMyPartnerSchema` whitelist exactly — only these fields (plus `installationProfile`, only
 * meaningful for an INSTALLATION_SERVICE partner) are ever accepted by `PATCH /partners/me`.
 * Bank details are flattened here for the form and re-nested into `bankDetails` before the request
 * is sent (see `PartnerProfilePage`).
 */
export const updatePartnerProfileSchema = z.object({
  companyName: z.string().trim().max(150).optional(),
  mobile: phoneSchema,
  whatsapp: phoneSchema,
  howHeard: z.string().trim().max(200).optional(),
  address: partnerProfileAddressSchema,
  serviceDistricts: z.string().trim().optional(),
  expectedLabourRate: z.coerce.number().min(0, "Enter a valid rate.").optional(),
  bankAccountHolderName: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  bankAccountNumber: z.string().trim().optional(),
  bankIfsc: z.string().trim().optional(),
});
export type UpdatePartnerProfileFormValues = z.infer<typeof updatePartnerProfileSchema>;

/**
 * The partner dashboard's "Submit New Lead" form. Mirrors
 * `server/src/validation/partnerLead.validation.ts`'s `createPartnerLeadSchema` for
 * customer/location/monthlyBill — `solarRecommendation` isn't collected here at all, it's computed
 * client-side from `projectType` + `monthlyBill` via `calculateSolarRecommendation` right before
 * submit (see `SubmitLeadModal`).
 */
export const submitPartnerLeadSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2, "Enter the customer's full name."),
    mobile: phoneSchema,
    whatsapp: phoneSchema,
    email: optionalEmailSchema,
    address: z.string().trim().min(3, "Enter the customer's address."),
  }),
  projectType: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"], { message: "Select a project type." }),
  location: z.object({
    pincode: z.string().trim().min(4, "Enter a valid pincode."),
    city: z.string().trim().min(2, "Enter the city."),
    address: z.string().trim().min(3, "Enter the site address."),
  }),
  monthlyBill: z.coerce.number().positive("Enter the average monthly electricity bill."),
  billDocumentName: z.string().trim().optional(),
  requirement: z.string().trim().optional(),
  preferredContactTime: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
});
export type SubmitPartnerLeadFormValues = z.infer<typeof submitPartnerLeadSchema>;
