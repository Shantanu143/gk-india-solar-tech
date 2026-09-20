import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useCreateCommissionRule, useUpdateCommissionRule } from "@/features/commissions/hooks/useCommissionRuleMutations";
import { commissionRuleFormSchema, type CommissionRuleFormValues } from "@/features/commissions/schemas/commissionRule.schema";
import { PAYMENT_TRIGGERS, PAYMENT_TRIGGER_LABEL, COMMISSION_TYPES, type CommissionRule } from "@/features/commissions/types/commission";
import { PARTNER_TYPES, PARTNER_TYPE_LABEL } from "@/features/partners/types/partner";
import { PROJECT_TYPE_LABEL } from "@/features/leads/types/lead";
import { projectTypeSchema } from "@/schemas/projectType.schema";
import { ApiError } from "@/services/apiClient";

interface CommissionRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present in edit mode. `partnerType` is fixed at creation — the field is shown disabled and never sent on update. */
  rule?: CommissionRule;
}

const FORM_ID = "commission-rule-form";
const PROJECT_TYPES = projectTypeSchema.options;

export function CommissionRuleModal({ open, onOpenChange, rule }: CommissionRuleModalProps) {
  const isEdit = !!rule;
  const createRule = useCreateCommissionRule();
  const updateRule = useUpdateCommissionRule();
  const mutation = isEdit ? updateRule : createRule;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CommissionRuleFormValues>({
    resolver: zodResolver(commissionRuleFormSchema),
    defaultValues: {
      partnerType: rule?.partnerType ?? PARTNER_TYPES[0],
      commissionType: rule?.commissionType ?? "PERCENTAGE",
      percent: rule?.percent != null ? String(rule.percent) : "",
      fixedAmount: rule?.fixedAmount != null ? String(rule.fixedAmount) : "",
      applicableProjectType: rule?.applicableProjectType ?? "",
      minSystemCapacityKw: rule?.minSystemCapacityKw != null ? String(rule.minSystemCapacityKw) : "",
      paymentTrigger: rule?.paymentTrigger ?? "ON_BOOKING",
      active: rule?.active ?? true,
    },
  });

  const commissionType = watch("commissionType");

  function onSubmit(values: CommissionRuleFormValues) {
    // Only the field matching the selected commission type is meaningful — never send both.
    const percent = values.commissionType === "PERCENTAGE" && values.percent ? Number(values.percent) : undefined;
    const fixedAmount = values.commissionType === "FIXED" && values.fixedAmount ? Number(values.fixedAmount) : undefined;
    const applicableProjectType = values.applicableProjectType ? values.applicableProjectType : undefined;
    const minSystemCapacityKw = values.minSystemCapacityKw ? Number(values.minSystemCapacityKw) : undefined;

    if (isEdit && rule) {
      // `partnerType` is fixed at creation — the update endpoint doesn't accept it.
      updateRule.mutate(
        {
          id: rule.id,
          commissionType: values.commissionType,
          percent,
          fixedAmount,
          applicableProjectType,
          minSystemCapacityKw,
          paymentTrigger: values.paymentTrigger,
          active: values.active,
        },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createRule.mutate(
        {
          partnerType: values.partnerType,
          commissionType: values.commissionType,
          percent,
          fixedAmount,
          applicableProjectType,
          minSystemCapacityKw,
          paymentTrigger: values.paymentTrigger,
          active: values.active,
        },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Commission Rule" : "New Commission Rule"}
      description={isEdit ? PARTNER_TYPE_LABEL[rule.partnerType] : "Defines how much a partner earns on a booking."}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Rule"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="rule-partnerType">Partner Type</Label>
          <select
            id="rule-partnerType"
            disabled={isEdit}
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange disabled:cursor-not-allowed disabled:opacity-60"
            {...register("partnerType")}
          >
            {PARTNER_TYPES.map((type) => (
              <option key={type} value={type}>
                {PARTNER_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
          {isEdit && <p className="mt-1.5 text-xs text-muted-foreground">Partner type can't be changed after a rule is created.</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rule-commissionType">Commission Type</Label>
            <select
              id="rule-commissionType"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("commissionType")}
            >
              {COMMISSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="rule-paymentTrigger">Payment Trigger</Label>
            <select
              id="rule-paymentTrigger"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("paymentTrigger")}
            >
              {PAYMENT_TRIGGERS.map((trigger) => (
                <option key={trigger} value={trigger}>
                  {PAYMENT_TRIGGER_LABEL[trigger]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {commissionType === "PERCENTAGE" ? (
          <div>
            <Label htmlFor="rule-percent">Percent (%)</Label>
            <Input id="rule-percent" type="number" step="0.1" min="0" max="100" invalid={!!errors.percent} {...register("percent")} />
            {errors.percent && <p className="mt-1.5 text-xs text-error">{errors.percent.message}</p>}
          </div>
        ) : (
          <div>
            <Label htmlFor="rule-fixedAmount">Fixed Amount (₹)</Label>
            <Input id="rule-fixedAmount" type="number" step="1" min="0" invalid={!!errors.fixedAmount} {...register("fixedAmount")} />
            {errors.fixedAmount && <p className="mt-1.5 text-xs text-error">{errors.fixedAmount.message}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rule-applicableProjectType">Applicable Project Type</Label>
            <select
              id="rule-applicableProjectType"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
              {...register("applicableProjectType")}
            >
              <option value="">All Project Types</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {PROJECT_TYPE_LABEL[type]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="rule-minSystemCapacityKw">Min. Capacity (kW)</Label>
            <Input
              id="rule-minSystemCapacityKw"
              type="number"
              step="0.1"
              min="0"
              placeholder="No minimum"
              invalid={!!errors.minSystemCapacityKw}
              {...register("minSystemCapacityKw")}
            />
            {errors.minSystemCapacityKw && <p className="mt-1.5 text-xs text-error">{errors.minSystemCapacityKw.message}</p>}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-navy">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-orange" {...register("active")} />
          Active
        </label>

        {mutation.isError && (
          <p className="text-sm text-error">
            {mutation.error instanceof ApiError ? mutation.error.message : "Couldn't save this rule. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
}
