import { lazy } from "react";

export const PartnerDashboardPage = lazy(() =>
  import("@/pages/partner/Dashboard/PartnerDashboardPage").then((m) => ({ default: m.PartnerDashboardPage })),
);
export const PartnerProfilePage = lazy(() =>
  import("@/pages/partner/Profile/PartnerProfilePage").then((m) => ({ default: m.PartnerProfilePage })),
);
export const PartnerLeadsPage = lazy(() =>
  import("@/pages/partner/Leads/PartnerLeadsPage").then((m) => ({ default: m.PartnerLeadsPage })),
);
export const PartnerLeadDetailPage = lazy(() =>
  import("@/pages/partner/Leads/PartnerLeadDetailPage").then((m) => ({ default: m.PartnerLeadDetailPage })),
);
export const PartnerProjectsPage = lazy(() =>
  import("@/pages/partner/Projects/PartnerProjectsPage").then((m) => ({ default: m.PartnerProjectsPage })),
);
export const PartnerCommissionsPage = lazy(() =>
  import("@/pages/partner/Commissions/PartnerCommissionsPage").then((m) => ({ default: m.PartnerCommissionsPage })),
);
