import type { Types } from "mongoose";
import { FollowUpModel, type FollowUpAttrs, type FollowUpStatus } from "../models/FollowUp.model";

export interface CreateFollowUpInput extends Omit<FollowUpAttrs, "createdAt" | "updatedAt" | "lead" | "assignedEmployeeId"> {
  lead: string | Types.ObjectId;
  assignedEmployeeId: string | Types.ObjectId;
}

export type UpdateFollowUpInput = Partial<Omit<FollowUpAttrs, "createdAt" | "updatedAt" | "lead" | "assignedEmployeeId">>;

export type FollowUpScope = "today" | "overdue" | "upcoming" | "completed";

export interface FollowUpFilters {
  assignedEmployeeId?: string;
  status?: FollowUpStatus;
  scope?: FollowUpScope;
}

function istToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function istNowTime(): string {
  return new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
}

function buildScopeQuery(scope: FollowUpScope | undefined): Record<string, unknown> {
  if (!scope) return {};
  const today = istToday();
  if (scope === "today") return { status: "PENDING", date: today };
  if (scope === "overdue") {
    return { status: "PENDING", $or: [{ date: { $lt: today } }, { date: today, time: { $lt: istNowTime() } }] };
  }
  if (scope === "upcoming") return { status: "PENDING", date: { $gte: today } };
  if (scope === "completed") return { status: "COMPLETED" };
  return {};
}

export const followUpRepository = {
  list(filters: FollowUpFilters) {
    const query: Record<string, unknown> = { ...buildScopeQuery(filters.scope) };
    if (filters.assignedEmployeeId) query.assignedEmployeeId = filters.assignedEmployeeId;
    if (filters.status) query.status = filters.status;

    return FollowUpModel.find(query).sort({ date: 1, time: 1 });
  },

  findById(id: string) {
    return FollowUpModel.findById(id);
  },

  create(input: CreateFollowUpInput) {
    return FollowUpModel.create(input);
  },

  updateById(id: string, updates: UpdateFollowUpInput) {
    return FollowUpModel.findByIdAndUpdate(id, updates, { new: true });
  },
};
