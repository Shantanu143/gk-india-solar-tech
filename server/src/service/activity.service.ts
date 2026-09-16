import { activityRepository } from "../repository/activity.repository";
import { toPublicActivity, type PublicActivity } from "../util/serializeActivity";
import type { ActivityType } from "../models/Activity.model";

export interface LogActivityInput {
  leadId: string;
  type: ActivityType;
  actorName: string;
  description: string;
  metadata?: Record<string, string | number>;
}

/** Shared by every other service — the single place a Lead's audit trail gets written. */
export const activityService = {
  async log(input: LogActivityInput): Promise<void> {
    await activityRepository.create({
      lead: input.leadId,
      type: input.type,
      actorName: input.actorName,
      description: input.description,
      metadata: input.metadata,
    });
  },

  async getForLead(leadId: string): Promise<PublicActivity[]> {
    const items = await activityRepository.listForLead(leadId);
    return items.map(toPublicActivity);
  },
};
