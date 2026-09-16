import { z } from "zod";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export const leadSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name."),
    mobile: z.string().trim().regex(MOBILE_REGEX, "Please enter a valid mobile number."),
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
    if (!data.sameAsMobile && !MOBILE_REGEX.test(data.whatsapp ?? "")) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Please enter a valid WhatsApp number." });
    }
  });

export type LeadFormValues = z.infer<typeof leadSchema>;
