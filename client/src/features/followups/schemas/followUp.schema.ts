import { z } from "zod";

export const followUpSchema = z.object({
  type: z.enum(["CALL", "WHATSAPP", "EMAIL", "MEETING", "OTHER"]),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  notes: z.string().trim().optional(),
});

export type FollowUpFormValues = z.infer<typeof followUpSchema>;

export const completeFollowUpSchema = z
  .object({
    outcome: z.string().trim().min(3, "Please describe the outcome."),
    scheduleNext: z.boolean(),
    nextDate: z.string().optional(),
    nextTime: z.string().optional(),
    nextType: z.enum(["CALL", "WHATSAPP", "EMAIL", "MEETING", "OTHER"]).optional(),
    nextPriority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    nextNotes: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scheduleNext) {
      if (!data.nextDate) ctx.addIssue({ code: "custom", path: ["nextDate"], message: "Next follow-up date is required." });
      if (!data.nextTime) ctx.addIssue({ code: "custom", path: ["nextTime"], message: "Next follow-up time is required." });
    }
  });

export type CompleteFollowUpFormValues = z.infer<typeof completeFollowUpSchema>;

export const rescheduleFollowUpSchema = z.object({
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  reason: z.string().trim().optional(),
});

export type RescheduleFollowUpFormValues = z.infer<typeof rescheduleFollowUpSchema>;
