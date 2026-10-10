import { z } from "zod";
import { QUOTATION_STATUSES } from "../models/Quotation.model";
import { PRODUCT_CATEGORIES } from "../models/Product.model";
import { LOST_REASONS } from "../models/Lead.model";
import { MAX_IMAGE_DATA_URL_LENGTH, MAX_QUOTATION_IMAGES, MAX_TOTAL_IMAGE_DATA_LENGTH } from "../util/quotationPhotos";

export const listQuotationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(500).default(20),
  status: z.enum(QUOTATION_STATUSES).optional(),
  leadId: z.string().trim().optional(),
});
export type ListQuotationsQuery = z.infer<typeof listQuotationsQuerySchema>;

export const createQuotationSchema = z.object({
  leadId: z.string().min(1, "leadId is required."),
});

const quotationItemSchema = z.object({
  productId: z.string().nullable().optional(),
  description: z.string().trim().min(1, "Description is required."),
  category: z.enum(PRODUCT_CATEGORIES),
  quantity: z.coerce.number().positive("Quantity must be greater than 0."),
  unitPrice: z.coerce.number().min(0, "Unit price can't be negative."),
  amount: z.coerce.number().min(0),
});

// Only JPEG/PNG data URIs: that is what the PDF engine can embed, and it keeps the renderer from ever being handed a file path.
const quotationImageSchema = z.object({
  id: z.string().trim().min(1).max(80),
  fileName: z.string().trim().min(1).max(200),
  url: z
    .string()
    .max(MAX_IMAGE_DATA_URL_LENGTH, "Each photo must be smaller than about 1 MB.")
    .regex(/^data:image\/(?:jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/, "Photos must be JPEG or PNG images."),
});

export const updateQuotationItemsSchema = z.object({
  items: z.array(quotationItemSchema).min(1, "A quotation needs at least one line item."),
  surveyImages: z
    .array(quotationImageSchema)
    .max(MAX_QUOTATION_IMAGES, `Attach at most ${MAX_QUOTATION_IMAGES} survey photos.`)
    .refine((images) => new Set(images.map((image) => image.id)).size === images.length, "Survey photos must have unique ids.")
    .refine(
      (images) => images.reduce((sum, image) => sum + image.url.length, 0) <= MAX_TOTAL_IMAGE_DATA_LENGTH,
      "The photos are too large together — remove a few or use smaller ones.",
    )
    .optional(),
  discountAmount: z.coerce.number().min(0).optional(),
  validUntil: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});
export type UpdateQuotationItemsInput = z.infer<typeof updateQuotationItemsSchema>;

export const rejectQuotationSchema = z.object({
  lostReason: z.enum(LOST_REASONS).optional(),
});
