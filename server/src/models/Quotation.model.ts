import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";
import { PRODUCT_CATEGORIES, type ProductCategory } from "./Product.model";

export const QUOTATION_STATUSES = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"] as const;
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

export interface QuotationItem {
  _id: Types.ObjectId;
  productId: Types.ObjectId | null;
  description: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  amount: number;
}

/** A site photo attached to the quotation — stored as a base64 data URI (same convention as survey photos) and printed in the PDF. */
export interface QuotationImage {
  id: string;
  url: string;
  fileName: string;
}

export interface EmiEstimate {
  principal: number;
  tenureYears: number;
  monthlyEmi: number;
}

export interface QuotationAttrs {
  quotationNumber: string;
  lead: Types.ObjectId;
  finalConfiguration: Types.ObjectId | null;
  items: QuotationItem[];
  subtotal: number;
  subsidyAmount: number;
  discountAmount: number;
  totalAmount: number;
  emiEstimate?: EmiEstimate;
  /** Site-survey photos the preparer attached; every one is printed on the "Site survey photos" pages of the PDF. */
  surveyImages: QuotationImage[];
  validUntil: string;
  status: QuotationStatus;
  notes?: string;
  preparedBy: string;
  gstRatePercent: number;
  /** Unguessable token for the public, login-free PDF link sent to the customer. */
  shareToken?: string;
  sentAt?: Date;
  whatsappSentAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type QuotationDocument = HydratedDocument<QuotationAttrs>;

const quotationItemSchema = new Schema<QuotationItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", default: null },
  description: { type: String, required: true, trim: true },
  category: { type: String, enum: PRODUCT_CATEGORIES, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
});

const emiEstimateSchema = new Schema<EmiEstimate>(
  {
    principal: { type: Number, required: true },
    tenureYears: { type: Number, required: true },
    monthlyEmi: { type: Number, required: true },
  },
  { _id: false },
);

const quotationImageSchema = new Schema<QuotationImage>(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  { _id: false },
);

const quotationSchema = new Schema<QuotationAttrs>(
  {
    quotationNumber: { type: String, required: true, unique: true },
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true, unique: true },
    finalConfiguration: { type: Schema.Types.ObjectId, ref: "FinalSolarConfiguration", default: null },
    items: { type: [quotationItemSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    subsidyAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    emiEstimate: { type: emiEstimateSchema },
    surveyImages: { type: [quotationImageSchema], default: [] },
    validUntil: { type: String, required: true },
    status: { type: String, enum: QUOTATION_STATUSES, required: true, default: "DRAFT" },
    notes: { type: String, trim: true },
    preparedBy: { type: String, required: true },
    gstRatePercent: { type: Number, required: true, default: 8.9 },
    shareToken: { type: String, index: true, sparse: true },
    sentAt: { type: Date },
    whatsappSentAt: { type: Date },
    respondedAt: { type: Date },
  },
  { timestamps: true },
);

export const QuotationModel: Model<QuotationAttrs> = model<QuotationAttrs>("Quotation", quotationSchema);
