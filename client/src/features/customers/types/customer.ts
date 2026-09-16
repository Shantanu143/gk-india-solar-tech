import type { ProjectType } from "@/types/solarEstimate";

export interface Customer {
  id: string;
  leadId: string;
  fullName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  address: string;
  projectType: ProjectType;
  systemCapacityKw?: number;
  assignedEmployeeId: string | null;
  createdAt: string;
  updatedAt: string;
}
