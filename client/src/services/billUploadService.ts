import { mockDelay } from "./apiClient";
import type { UploadedBillMeta } from "@/types/solarEstimate";

/**
 * TODO(backend): replace with a real multipart upload to `POST /api/documents/upload` once storage
 * exists. The component already models uploading/uploaded/error states, so swapping this
 * implementation won't require UI changes.
 */
export async function uploadElectricityBill(file: File): Promise<UploadedBillMeta> {
  const meta: UploadedBillMeta = { fileName: file.name, fileSizeBytes: file.size, fileType: file.type };
  return mockDelay(meta, 1100);
}
