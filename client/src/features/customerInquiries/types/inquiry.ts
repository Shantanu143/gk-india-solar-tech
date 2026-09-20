import type { Lead } from "@/features/leads/types/lead";
import type { Project } from "@/features/projects/types/project";

/** Mirrors `server/src/service/customerInquiry.service.ts`'s `CustomerInquiry` shape. */
export interface CustomerInquiry {
  lead: Lead;
  project: Project | null;
}
