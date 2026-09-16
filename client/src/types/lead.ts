/** Lead-capture types. General contact inquiries only in Feature 1 — the full lead pipeline arrives in Feature 4. */

export interface ContactInquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}
