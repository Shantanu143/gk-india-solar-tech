import { z } from "zod";

export const locationSchema = z.object({
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code."),
  city: z.string().trim().min(2, "Please enter your city."),
  address: z.string().trim().min(5, "Please enter your installation address."),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
