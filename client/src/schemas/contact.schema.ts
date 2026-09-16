import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().trim().min(2, "Please enter your first name"),
  lastName: z.string().trim().min(2, "Please enter your last name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  message: z.string().trim().min(10, "Please share a few details about your requirement").max(300, "Keep your message under 300 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
