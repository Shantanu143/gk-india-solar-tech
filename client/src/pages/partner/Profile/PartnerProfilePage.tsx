import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Seo } from "@/components/layout/Seo";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { StatusBadge } from "@/features/crm/components/StatusBadge";
import type { StatusTone } from "@/features/leads/utils/leadStatusConfig";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { useUpdatePartnerProfile } from "@/features/partners/hooks/usePartnerMutations";
import { usePartnerProfile } from "@/features/partners/hooks/usePartnerProfile";
import { updatePartnerProfileSchema, type UpdatePartnerProfileFormValues } from "@/features/partners/schemas/partner.schema";
import type { UpdatePartnerProfilePayload } from "@/features/partners/services/partnerService";
import { PARTNER_STATUS_LABEL, PARTNER_TYPE_LABEL, type PartnerApplicationStatus } from "@/features/partners/types/partner";
import { ApiError } from "@/services/apiClient";

const STATUS_TONE: Record<PartnerApplicationStatus, StatusTone> = {
  APPROVED: "green",
  PENDING: "amber",
  REJECTED: "red",
  SUSPENDED: "red",
};

export function PartnerProfilePage() {
  const { data: partner, isLoading, isError, refetch } = usePartnerProfile();
  const updateProfile = useUpdatePartnerProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdatePartnerProfileFormValues>({
    // See the matching comment in SubmitLeadModal.tsx — a type-only cast for a pre-existing
    // zod v4 / @hookform/resolvers generic mismatch on nested-object schemas in this repo.
    resolver: zodResolver(updatePartnerProfileSchema) as Resolver<UpdatePartnerProfileFormValues>,
  });

  useEffect(() => {
    if (!partner) return;
    reset({
      companyName: partner.companyName ?? "",
      mobile: partner.mobile,
      whatsapp: partner.whatsapp,
      howHeard: partner.howHeard ?? "",
      address: {
        state: partner.address.state,
        district: partner.address.district,
        city: partner.address.city,
        addressLine: partner.address.addressLine ?? "",
      },
      serviceDistricts: partner.installationProfile?.serviceDistricts?.join(", ") ?? "",
      expectedLabourRate: partner.installationProfile?.expectedLabourRate,
      bankAccountHolderName: partner.installationProfile?.bankDetails?.accountHolderName ?? "",
      bankName: partner.installationProfile?.bankDetails?.bankName ?? "",
      bankAccountNumber: partner.installationProfile?.bankDetails?.accountNumber ?? "",
      bankIfsc: partner.installationProfile?.bankDetails?.ifsc ?? "",
    });
  }, [partner, reset]);

  if (isLoading) {
    return <SkeletonRows rows={6} />;
  }
  if (isError || !partner) {
    return <ErrorState title="Couldn't load your profile." onRetry={() => refetch()} />;
  }

  const isInstallationPartner = partner.type === "INSTALLATION_SERVICE";

  function onSubmit(values: UpdatePartnerProfileFormValues) {
    const hasBankDetails = !!(values.bankAccountHolderName || values.bankName || values.bankAccountNumber || values.bankIfsc);

    const payload: UpdatePartnerProfilePayload = {
      companyName: values.companyName || undefined,
      mobile: values.mobile || undefined,
      whatsapp: values.whatsapp || undefined,
      howHeard: values.howHeard || undefined,
      address: {
        state: values.address.state,
        district: values.address.district,
        city: values.address.city,
        addressLine: values.address.addressLine || undefined,
      },
    };

    if (isInstallationPartner) {
      payload.installationProfile = {
        serviceDistricts: values.serviceDistricts
          ? values.serviceDistricts
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean)
          : undefined,
        expectedLabourRate: values.expectedLabourRate || undefined,
        bankDetails: hasBankDetails
          ? {
              accountHolderName: values.bankAccountHolderName ?? "",
              bankName: values.bankName ?? "",
              accountNumber: values.bankAccountNumber ?? "",
              ifsc: values.bankIfsc ?? "",
            }
          : undefined,
      };
    }

    updateProfile.mutate(payload);
  }

  return (
    <div className="flex flex-col gap-5">
      <Seo title="My Profile | Partner Portal | GK India SolarTech" description="Manage your partner profile." path={CRM_ROUTES.partnerProfile} noindex />
      <PageHeader title="My Profile" description="Keep your contact and business details up to date." />

      <Card className="flex flex-wrap items-center gap-x-8 gap-y-3 p-4 sm:p-5">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Partner ID</p>
          <p className="text-sm font-bold text-navy">{partner.partnerId ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Partner Type</p>
          <p className="text-sm font-bold text-navy">{PARTNER_TYPE_LABEL[partner.type]}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Application Status</p>
          <StatusBadge label={PARTNER_STATUS_LABEL[partner.applicationStatus]} tone={STATUS_TONE[partner.applicationStatus]} />
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          <div>
            <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Contact Details</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={partner.name} disabled />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={partner.email} disabled />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" {...register("companyName")} />
              </div>
              <div>
                <Label htmlFor="howHeard">How Did You Hear About Us</Label>
                <Input id="howHeard" {...register("howHeard")} />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" type="tel" invalid={!!errors.mobile} {...register("mobile")} />
                {errors.mobile && <p className="mt-1.5 text-xs text-error">{errors.mobile.message}</p>}
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" type="tel" invalid={!!errors.whatsapp} {...register("whatsapp")} />
                {errors.whatsapp && <p className="mt-1.5 text-xs text-error">{errors.whatsapp.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Address</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="address.state">State</Label>
                <Input id="address.state" invalid={!!errors.address?.state} {...register("address.state")} />
                {errors.address?.state && <p className="mt-1.5 text-xs text-error">{errors.address.state.message}</p>}
              </div>
              <div>
                <Label htmlFor="address.district">District</Label>
                <Input id="address.district" invalid={!!errors.address?.district} {...register("address.district")} />
                {errors.address?.district && <p className="mt-1.5 text-xs text-error">{errors.address.district.message}</p>}
              </div>
              <div>
                <Label htmlFor="address.city">City</Label>
                <Input id="address.city" invalid={!!errors.address?.city} {...register("address.city")} />
                {errors.address?.city && <p className="mt-1.5 text-xs text-error">{errors.address.city.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address.addressLine">Address Line</Label>
                <Textarea id="address.addressLine" rows={2} {...register("address.addressLine")} />
              </div>
            </div>
          </div>

          {isInstallationPartner && (
            <div>
              <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Installation &amp; Service Details</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="serviceDistricts">Service Districts (comma-separated)</Label>
                  <Input id="serviceDistricts" placeholder="e.g. Pune, Nashik, Nagpur" {...register("serviceDistricts")} />
                </div>
                <div>
                  <Label htmlFor="expectedLabourRate">Expected Labour Rate (₹/kW)</Label>
                  <Input id="expectedLabourRate" type="number" min={0} step="0.01" {...register("expectedLabourRate")} />
                  {errors.expectedLabourRate && <p className="mt-1.5 text-xs text-error">{errors.expectedLabourRate.message}</p>}
                </div>
              </div>

              <h3 className="mt-5 text-xs font-bold tracking-wide text-muted-foreground uppercase">Bank Details (for commission payouts)</h3>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="bankAccountHolderName">Account Holder Name</Label>
                  <Input id="bankAccountHolderName" {...register("bankAccountHolderName")} />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" {...register("bankName")} />
                </div>
                <div>
                  <Label htmlFor="bankAccountNumber">Account Number</Label>
                  <Input id="bankAccountNumber" {...register("bankAccountNumber")} />
                </div>
                <div>
                  <Label htmlFor="bankIfsc">IFSC Code</Label>
                  <Input id="bankIfsc" {...register("bankIfsc")} />
                </div>
              </div>

              {(partner.installationProfile?.documents?.length ?? 0) > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Documents on File</h3>
                  <ul className="mt-2 flex flex-col gap-1">
                    {partner.installationProfile!.documents!.map((doc) => (
                      <li key={doc.url} className="text-sm text-foreground/80">
                        {doc.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {updateProfile.isError && (
            <p className="text-sm text-error">
              {updateProfile.error instanceof ApiError ? updateProfile.error.message : "Couldn't save these changes. Please try again."}
            </p>
          )}
          {updateProfile.isSuccess && (
            <p className="text-sm font-semibold text-green">Profile updated successfully.</p>
          )}

          <div className="flex justify-end border-t border-border pt-4">
            <Button type="submit" disabled={updateProfile.isPending || !isDirty} className="w-full sm:w-auto">
              {updateProfile.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
