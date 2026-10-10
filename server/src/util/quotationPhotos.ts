import crypto from "node:crypto";
import type { QuotationImage } from "../models/Quotation.model";
import type { SurveyAttrs } from "../models/Survey.model";

/** Mirrored by `MAX_QUOTATION_IMAGES` in the client's quotation types. */
export const MAX_QUOTATION_IMAGES = 20;
// The client downsizes photos to ~1280–1600px JPEGs (a few hundred KB); these only guard against oversized payloads
// and keep a quotation comfortably inside MongoDB's 16 MB document limit.
export const MAX_IMAGE_DATA_URL_LENGTH = 1_500_000;
export const MAX_TOTAL_IMAGE_DATA_LENGTH = 9_000_000;

// Only JPEG/PNG data URIs: that is what the PDF engine can embed, and it keeps the renderer from ever being handed a file path.
const PHOTO_DATA_URL = /^data:image\/(?:jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/;

export function isStorablePhotoUrl(url: string): boolean {
  return url.length <= MAX_IMAGE_DATA_URL_LENGTH && PHOTO_DATA_URL.test(url);
}

/**
 * The photos the site engineer uploaded on a survey (roof photos, then the meter photo), in the shape a
 * quotation stores them. Anything that couldn't be saved on a quotation (a blob: URL, an oversized or
 * non-JPEG/PNG file) is left out, so a copied photo can always be saved back from the quotation builder.
 * Ids are derived from the picture itself, so the same photo never gets two ids.
 */
export function collectSurveyPhotos(survey: Pick<SurveyAttrs, "roofPhotos" | "meterPhoto"> | null | undefined): QuotationImage[] {
  if (!survey) return [];
  const photos = [...(survey.roofPhotos ?? []), ...(survey.meterPhoto ? [survey.meterPhoto] : [])];
  return photos
    .filter((photo) => isStorablePhotoUrl(photo.url))
    .map((photo) => ({
      id: `survey-${crypto.createHash("sha1").update(photo.url).digest("hex").slice(0, 16)}`,
      url: photo.url,
      fileName: (photo.fileName || "survey-photo.jpg").slice(0, 200),
    }));
}

/** `existing` followed by whichever `incoming` photos aren't already there, stopping at the count/size limits. */
export function mergePhotos(existing: QuotationImage[], incoming: QuotationImage[]): QuotationImage[] {
  const merged = [...existing];
  const seen = new Set(merged.map((photo) => photo.url));
  let total = merged.reduce((sum, photo) => sum + photo.url.length, 0);
  for (const photo of incoming) {
    if (seen.has(photo.url)) continue;
    if (merged.length >= MAX_QUOTATION_IMAGES || total + photo.url.length > MAX_TOTAL_IMAGE_DATA_LENGTH) break;
    merged.push(photo);
    seen.add(photo.url);
    total += photo.url.length;
  }
  return merged;
}
