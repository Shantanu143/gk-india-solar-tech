import { z } from "zod";
import { FOLLOW_UP_PRIORITIES, FOLLOW_UP_STATUSES, FOLLOW_UP_TYPES } from "../models/FollowUp.model";

export const listFollowUpsQuerySchema = z.object({
  assignedEmployeeId: z.string().optional(),
  leadId: z.string().optional(),
  status: z.enum(FOLLOW_UP_STATUSES).optional(),
  type: z.enum(FOLLOW_UP_TYPES).optional(),
  scope: z.enum(["today", "overdue", "upcoming", "completed"]).optional(),
});
export type ListFollowUpsQuery = z.infer<typeof listFollowUpsQuerySchema>;

/** `assignedEmployeeId` is never accepted from the client — a follow-up is always self-assigned to whoever creates it. */
export const createFollowUpSchema = z.object({
  leadId: z.string().min(1, "leadId is required."),
  type: z.enum(FOLLOW_UP_TYPES),
  date: z.string().min(1),
  time: z.string().min(1),
  priority: z.enum(FOLLOW_UP_PRIORITIES).default("MEDIUM"),
  notes: z.string().trim().optional(),
});
export type CreateFollowUpInput = z.infer<typeof createFollowUpSchema>;

export const completeFollowUpSchema = z.object({
  outcome: z.string().trim().min(1, "Enter the outcome of this follow-up."),
  scheduleNext: z.boolean().optional(),
  nextDate: z.string().optional(),
  nextTime: z.string().optional(),
  nextType: z.enum(FOLLOW_UP_TYPES).optional(),
  nextPriority: z.enum(FOLLOW_UP_PRIORITIES).optional(),
  nextNotes: z.string().trim().optional(),
});
export type CompleteFollowUpInput = z.infer<typeof completeFollowUpSchema>;

export const rescheduleFollowUpSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  reason: z.string().trim().optional(),
});
export type RescheduleFollowUpInput = z.infer<typeof rescheduleFollowUpSchema>;
