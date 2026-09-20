import { z } from "zod";

/** Matches the backend's `updatePartnerStatusSchema` minimum exactly (`server/src/validation/partner.validation.ts`). */
export const rejectPartnerSchema = z.object({
  rejectionReason: z.string().trim().min(3, "Provide a rejection reason."),
});
export type RejectPartnerFormValues = z.infer<typeof rejectPartnerSchema>;
