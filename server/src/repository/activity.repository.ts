import type { Types } from "mongoose";
import { ActivityModel, type ActivityAttrs } from "../models/Activity.model";

export interface CreateActivityInput extends Omit<ActivityAttrs, "createdAt" | "lead"> {
  lead: string | Types.ObjectId;
}

export const activityRepository = {
  listForLead(leadId: string) {
    return ActivityModel.find({ lead: leadId }).sort({ createdAt: -1 });
  },

  create(input: CreateActivityInput) {
    return ActivityModel.create(input);
  },
};
