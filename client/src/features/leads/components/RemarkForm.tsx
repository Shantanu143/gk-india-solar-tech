import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/features/crm/hooks/authContext";
import { useAddRemark } from "@/features/leads/hooks/useLeadMutations";
import { remarkSchema, type RemarkFormValues } from "@/features/leads/schemas/remark.schema";
import type { Lead } from "@/features/leads/types/lead";

export function RemarkForm({ lead }: { lead: Lead }) {
  const { user } = useAuth();
  const addRemark = useAddRemark();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RemarkFormValues>({ resolver: zodResolver(remarkSchema), defaultValues: { interest: lead.interest, remark: "" } });

  function onSubmit(values: RemarkFormValues) {
    addRemark.mutate(
      { leadId: lead.id, remark: values.remark, interest: values.interest, actorName: user?.name ?? "System" },
      { onSuccess: () => reset({ interest: values.interest, remark: "" }) },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
      <div>
        <Label htmlFor="interest">Customer Interest</Label>
        <select
          id="interest"
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
          {...register("interest")}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div>
        <Label htmlFor="remark">Remark</Label>
        <Textarea
          id="remark"
          rows={3}
          placeholder="Customer interested in 5 kW solar. Site survey required."
          invalid={!!errors.remark}
          {...register("remark")}
        />
        {errors.remark && <p className="mt-1.5 text-xs text-error">{errors.remark.message}</p>}
      </div>
      {addRemark.isError && <p className="text-xs text-error">Couldn't save this remark. Please try again.</p>}
      <Button type="submit" size="sm" className="self-start" disabled={addRemark.isPending}>
        {addRemark.isPending ? "Saving…" : "Save Remark"}
      </Button>
    </form>
  );
}
