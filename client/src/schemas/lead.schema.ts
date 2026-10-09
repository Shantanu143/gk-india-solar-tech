import { z } from "zod";

/** Indian mobile: the 10-digit national number (country code +91 is shown beside the field, not typed). */
const MOBILE_REGEX = /^[6-9]\d{9}$/;

function mobileNumber(label: string) {
  const sentenceCase = label.charAt(0).toUpperCase() + label.slice(1);
  return z
    .string()
    .trim()
    .min(1, `Please enter your ${label}.`)
    .length(10, `${sentenceCase} must be exactly 10 digits.`)
    .regex(MOBILE_REGEX, `Enter a valid ${label} — it should start with 6, 7, 8 or 9.`);
}

export const leadSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name."),
    mobile: mobileNumber("mobile number"),
    sameAsMobile: z.boolean(),
    whatsapp: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .optional()
      .or(z.literal("")),
    address: z.string().trim().min(5, "Please enter your address."),
  })
  .superRefine((data, ctx) => {
    if (data.sameAsMobile) return;
    const whatsapp = mobileNumber("WhatsApp number").safeParse(data.whatsapp ?? "");
    if (!whatsapp.success) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: whatsapp.error.issues[0]?.message ?? "Please enter a valid WhatsApp number." });
    }
  });

export type LeadFormValues = z.infer<typeof leadSchema>;
