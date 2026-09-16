import { followUpRepository, type FollowUpFilters } from "../repository/followUp.repository";
import { leadRepository } from "../repository/lead.repository";
import { activityService } from "./activity.service";
import { ApiError } from "../util/ApiError";
import { toPublicFollowUp, type PublicFollowUp } from "../util/serializeFollowUp";
import type { FollowUpPriority, FollowUpType } from "../models/FollowUp.model";

export interface CreateFollowUpInput {
  leadId: string;
  assignedEmployeeId: string;
  type: FollowUpType;
  date: string;
  time: string;
  priority: FollowUpPriority;
  notes?: string;
  actorName: string;
}

export interface CompleteFollowUpInput {
  id: string;
  outcome: string;
  actorName: string;
  scheduleNext?: boolean;
  nextDate?: string;
  nextTime?: string;
  nextType?: FollowUpType;
  nextPriority?: FollowUpPriority;
  nextNotes?: string;
}

export interface CompleteFollowUpResult {
  completed: PublicFollowUp;
  nextFollowUp: PublicFollowUp | null;
}

export const followUpService = {
  async getFollowUps(filters: FollowUpFilters): Promise<PublicFollowUp[]> {
    const items = await followUpRepository.list(filters);
    return items.map(toPublicFollowUp);
  },

  async getFollowUp(id: string): Promise<PublicFollowUp> {
    const followUp = await followUpRepository.findById(id);
    if (!followUp) throw ApiError.notFound("Follow-up not found.");
    return toPublicFollowUp(followUp);
  },

  async createFollowUp(input: CreateFollowUpInput): Promise<PublicFollowUp> {
    const lead = await leadRepository.findById(input.leadId);
    if (!lead) throw ApiError.notFound("Lead not found.");

    const followUp = await followUpRepository.create({
      lead: input.leadId,
      customerName: lead.customer.fullName,
      assignedEmployeeId: input.assignedEmployeeId,
      type: input.type,
      date: input.date,
      time: input.time,
      status: "PENDING",
      priority: input.priority,
      notes: input.notes,
      createdBy: input.actorName,
    });

    await activityService.log({
      leadId: input.leadId,
      type: "FOLLOW_UP_CREATED",
      actorName: input.actorName,
      description: `Follow-up scheduled — ${input.type} on ${input.date} at ${input.time}`,
    });

    return toPublicFollowUp(followUp);
  },

  async completeFollowUp(input: CompleteFollowUpInput): Promise<CompleteFollowUpResult> {
    const existing = await followUpRepository.findById(input.id);
    if (!existing) throw ApiError.notFound("Follow-up not found.");

    const followUp = await followUpRepository.updateById(input.id, {
      status: "COMPLETED",
      completedAt: new Date(),
      outcome: input.outcome,
    });
    if (!followUp) throw ApiError.notFound("Follow-up not found.");

    await activityService.log({
      leadId: followUp.lead.toString(),
      type: "FOLLOW_UP_COMPLETED",
      actorName: input.actorName,
      description: `Follow-up completed — ${input.outcome}`,
    });

    let nextFollowUp: PublicFollowUp | null = null;
    if (input.scheduleNext && input.nextDate && input.nextTime && input.nextType) {
      nextFollowUp = await followUpService.createFollowUp({
        leadId: followUp.lead.toString(),
        assignedEmployeeId: followUp.assignedEmployeeId.toString(),
        type: input.nextType,
        date: input.nextDate,
        time: input.nextTime,
        priority: input.nextPriority ?? followUp.priority,
        notes: input.nextNotes,
        actorName: input.actorName,
      });
    }

    return { completed: toPublicFollowUp(followUp), nextFollowUp };
  },

  async rescheduleFollowUp(input: { id: string; date: string; time: string; reason?: string; actorName: string }): Promise<PublicFollowUp> {
    const existing = await followUpRepository.findById(input.id);
    if (!existing) throw ApiError.notFound("Follow-up not found.");

    const followUp = await followUpRepository.updateById(input.id, {
      date: input.date,
      time: input.time,
      rescheduledFrom: { date: existing.date, time: existing.time },
    });
    if (!followUp) throw ApiError.notFound("Follow-up not found.");

    await activityService.log({
      leadId: followUp.lead.toString(),
      type: "FOLLOW_UP_RESCHEDULED",
      actorName: input.actorName,
      description: `Follow-up rescheduled to ${input.date} at ${input.time}${input.reason ? ` — ${input.reason}` : ""}`,
    });

    return toPublicFollowUp(followUp);
  },

  async cancelFollowUp(input: { id: string; actorName: string }): Promise<PublicFollowUp> {
    const followUp = await followUpRepository.updateById(input.id, { status: "CANCELLED" });
    if (!followUp) throw ApiError.notFound("Follow-up not found.");

    await activityService.log({
      leadId: followUp.lead.toString(),
      type: "FOLLOW_UP_CANCELLED",
      actorName: input.actorName,
      description: "Follow-up cancelled",
    });

    return toPublicFollowUp(followUp);
  },
};
