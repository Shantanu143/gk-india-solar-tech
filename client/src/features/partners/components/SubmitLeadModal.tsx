import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { FileText, Loader2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/features/crm/components/Modal";
import { PROJECT_TYPE_LABEL } from "@/features/leads/types/lead";
import { useSubmitPartnerLead } from "@/features/partners/hooks/usePartnerLeadMutations";
import { submitPartnerLeadSchema, type SubmitPartnerLeadFormValues } from "@/features/partners/schemas/partner.schema";
import type { SubmitPartnerLeadPayload } from "@/features/partners/services/partnerService";
import { ApiError } from "@/services/apiClient";
import { calculateSolarRecommendation } from "@/services/solarCalculationService";
import type { ProjectType } from "@/types/solarEstimate";

interface SubmitLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "submit-partner-lead-form";
const PROJECT_TYPES: ProjectType[] = ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"];

export function SubmitLeadModal({ open, onOpenChange }: SubmitLeadModalProps) {
  const [billFileName, setBillFileName] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitPartnerLeadFormValues>({
    // zod v4's inferred schema types and @hookform/resolvers' `Resolver` generic don't structurally
    // line up for nested-object schemas under this repo's installed versions (the same cast is
    // needed anywhere else in this codebase a nested zod schema is resolved) — this is a type-level
    // cast only, the resolver behaves identically at runtime.
    resolver: zodResolver(submitPartnerLeadSchema) as Resolver<SubmitPartnerLeadFormValues>,
    defaultValues: { projectType: "RESIDENTIAL" },
  });

  const submitLead = useSubmitPartnerLead();
  // Mirrors how SolarEstimatePage stages its own calculation step: a distinct "calculating" phase
  // before the lead is actually submitted, since solarRecommendation must be computed first.
  const calculateMutation = useMutation({ mutationFn: calculateSolarRecommendation });

  const isSubmitting = calculateMutation.isPending || submitLead.isPending;

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setBillFileName(undefined);
      calculateMutation.reset();
      submitLead.reset();
    }
    onOpenChange(nextOpen);
  }

  function onFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setBillFileName(file.name);
    e.target.value = "";
  }

  async function onSubmit(values: SubmitPartnerLeadFormValues) {
    try {
      const recommendation = await calculateMutation.mutateAsync({
        projectType: values.projectType,
        location: values.location,
        electricity: { mode: "BILL", monthlyBill: values.monthlyBill, billMeta: null },
      });

      const payload: SubmitPartnerLeadPayload = {
        customer: {
          fullName: values.customer.fullName,
          mobile: values.customer.mobile,
          whatsapp: values.customer.whatsapp,
          email: values.customer.email || undefined,
          address: values.customer.address,
        },
        projectType: values.projectType,
        location: values.location,
        monthlyBill: values.monthlyBill,
        billDocumentName: billFileName,
        solarRecommendation: {
          recommendedCapacity: recommendation.recommendedCapacity,
          estimatedPanels: recommendation.estimatedPanels,
          panelCapacity: recommendation.panelCapacity,
          recommendedInverter: recommendation.recommendedInverter,
        },
        requirement: values.requirement || undefined,
        preferredContactTime: values.preferredContactTime || undefined,
        remarks: values.remarks || undefined,
      };

      submitLead.mutate(payload, { onSuccess: () => handleClose(false) });
    } catch {
      // calculateMutation.isError renders the failure below — nothing else to do here.
    }
  }

  const error = submitLead.isError ? submitLead.error : calculateMutation.isError ? calculateMutation.error : null;

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Submit New Lead"
      description="Refer a customer — we'll take it from here and keep you posted."
      size="lg"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting} className="gap-1.5">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {calculateMutation.isPending ? "Calculating…" : submitLead.isPending ? "Submitting…" : "Submit Lead"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <div>
          <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Customer Details</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customer.fullName">Full Name</Label>
              <Input id="customer.fullName" invalid={!!errors.customer?.fullName} {...register("customer.fullName")} />
              {errors.customer?.fullName && <p className="mt-1.5 text-xs text-error">{errors.customer.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="customer.email">Email (optional)</Label>
              <Input id="customer.email" type="email" invalid={!!errors.customer?.email} {...register("customer.email")} />
              {errors.customer?.email && <p className="mt-1.5 text-xs text-error">{errors.customer.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="customer.mobile">Mobile</Label>
              <Input id="customer.mobile" type="tel" invalid={!!errors.customer?.mobile} {...register("customer.mobile")} />
              {errors.customer?.mobile && <p className="mt-1.5 text-xs text-error">{errors.customer.mobile.message}</p>}
            </div>
            <div>
              <Label htmlFor="customer.whatsapp">WhatsApp</Label>
              <Input id="customer.whatsapp" type="tel" invalid={!!errors.customer?.whatsapp} {...register("customer.whatsapp")} />
              {errors.customer?.whatsapp && <p className="mt-1.5 text-xs text-error">{errors.customer.whatsapp.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="customer.address">Customer Address</Label>
              <Textarea id="customer.address" rows={2} invalid={!!errors.customer?.address} {...register("customer.address")} />
              {errors.customer?.address && <p className="mt-1.5 text-xs text-error">{errors.customer.address.message}</p>}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Site &amp; Requirement</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <select
                id="projectType"
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
                {...register("projectType")}
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {PROJECT_TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="monthlyBill">Avg. Monthly Electricity Bill (₹)</Label>
              <Input id="monthlyBill" type="number" min={0} invalid={!!errors.monthlyBill} {...register("monthlyBill")} />
              {errors.monthlyBill && <p className="mt-1.5 text-xs text-error">{errors.monthlyBill.message}</p>}
            </div>
            <div>
              <Label htmlFor="location.pincode">Pincode</Label>
              <Input id="location.pincode" invalid={!!errors.location?.pincode} {...register("location.pincode")} />
              {errors.location?.pincode && <p className="mt-1.5 text-xs text-error">{errors.location.pincode.message}</p>}
            </div>
            <div>
              <Label htmlFor="location.city">City</Label>
              <Input id="location.city" invalid={!!errors.location?.city} {...register("location.city")} />
              {errors.location?.city && <p className="mt-1.5 text-xs text-error">{errors.location.city.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="location.address">Site Address</Label>
              <Textarea id="location.address" rows={2} invalid={!!errors.location?.address} {...register("location.address")} />
              {errors.location?.address && <p className="mt-1.5 text-xs text-error">{errors.location.address.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label>Electricity Bill (optional)</Label>
              {billFileName ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  <FileText className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground/80">{billFileName}</span>
                  <button
                    type="button"
                    aria-label="Remove attached file"
                    onClick={() => setBillFileName(undefined)}
                    className="text-muted-foreground hover:text-navy"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-sm font-semibold text-navy hover:bg-navy/5">
                  <Paperclip className="h-4 w-4" aria-hidden="true" />
                  Attach Bill (PDF/Image)
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={onFileSelected} />
                </label>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Notes (optional)</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="requirement">Customer Requirement</Label>
              <Textarea id="requirement" rows={2} {...register("requirement")} />
            </div>
            <div>
              <Label htmlFor="preferredContactTime">Preferred Contact Time</Label>
              <Input id="preferredContactTime" placeholder="e.g. Weekday evenings" {...register("preferredContactTime")} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" rows={2} {...register("remarks")} />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-error">{error instanceof ApiError ? error.message : "Couldn't submit this lead. Please try again."}</p>
        )}
      </form>
    </Modal>
  );
}
