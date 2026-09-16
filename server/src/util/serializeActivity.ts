import type { ActivityDocument } from "../models/Activity.model";

export function toPublicActivity(activity: ActivityDocument) {
  return {
    id: activity._id.toString(),
    leadId: activity.lead.toString(),
    type: activity.type,
    actorName: activity.actorName,
    description: activity.description,
    metadata: activity.metadata,
    createdAt: activity.createdAt.toISOString(),
  };
}

export type PublicActivity = ReturnType<typeof toPublicActivity>;
