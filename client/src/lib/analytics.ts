export type AnalyticsEvent =
  | "solar_estimate_started"
  | "project_type_selected"
  | "location_completed"
  | "bill_entered"
  | "bill_uploaded"
  | "solar_calculation_completed"
  | "recommendation_viewed"
  | "subsidy_viewed"
  | "emi_calculated"
  | "proposal_form_started"
  | "lead_form_submitted"
  | "lead_created";

/**
 * TODO(backend/analytics): wire this up to a real analytics platform (GA4, Segment, ...) once one
 * is configured for the project. Every call site in the wizard already fires through here, so
 * connecting a real provider later needs no changes at the call sites.
 */
function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.debug("[analytics]", event, properties ?? {});
  }
}

export const analytics = { track };
