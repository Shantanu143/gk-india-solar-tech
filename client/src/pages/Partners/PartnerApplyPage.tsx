import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ROUTES } from "@/constant/routes";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { InstallationProfileFields } from "@/pages/Partners/components/InstallationProfileFields";
import { PartnerTypeSelector } from "@/pages/Partners/components/PartnerTypeSelector";
import { partnerApplySchema, toPartnerApplyRequest, type PartnerApplyFormValues, type PartnerApplyValues } from "@/schemas/partner.schema";
import { applyAsPartner } from "@/services/partnerApplicationService";
import { ApiError } from "@/services/apiClient";

const DEFAULT_VALUES: PartnerApplyFormValues = {
  type: "SALES_REFERRAL",
  name: "",
  companyName: "",
  email: "",
  password: "",
  mobile: "",
  sameAsMobile: true,
  whatsapp: "",
  address: { state: "", district: "", city: "", addressLine: "" },
  howHeard: "",
  yearsOfExperience: undefined,
  teamSize: undefined,
  electricians: undefined,
  installers: undefined,
  weldersFabricators: undefined,
  dailyInstallationCapacityKw: undefined,
  residentialExperience: false,
  commercialExperience: false,
  industrialExperience: false,
  onGridExperience: false,
  offGridExperience: false,
  canSiteSurvey: false,
  canStructureFabrication: false,
  canElectricalWork: false,
  projectPhotos: [],
  serviceDistricts: "",
  expectedLabourRate: undefined,
  identityDocument: undefined,
  businessDocument: undefined,
  experienceDocument: undefined,
  bankDetails: { accountHolderName: "", bankName: "", accountNumber: "", ifsc: "" },
};

export function PartnerApplyPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PartnerApplyFormValues, unknown, PartnerApplyValues>({
    resolver: zodResolver(partnerApplySchema),
    defaultValues: DEFAULT_VALUES,
  });

  const applyMutation = useMutation({
    mutationFn: applyAsPartner,
    onSuccess: () => navigate(ROUTES.partnerApplySuccess),
  });

  const type = watch("type");
  const sameAsMobile = watch("sameAsMobile");

  function onSubmit(values: PartnerApplyValues) {
    applyMutation.mutate(toPartnerApplyRequest(values));
  }

  return (
    <>
      <Seo
        title="Partner Registration | GK India SolarTech"
        description="Register as a GK India SolarTech partner — sales/referral, installation/service or EPC/project — and start earning commission."
        path={ROUTES.partnerApply}
        noindex
      />

      <section className="py-10 sm:py-14">
        <Container className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Partner Program</span>
            <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">Register as a Partner</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Applications are reviewed by our team. You'll be able to sign in once your account is approved.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-8">
            <div>
              <p className="mb-3 text-sm font-bold text-navy">Partner Type</p>
              <PartnerTypeSelector value={type} onChange={(next) => setValue("type", next, { shouldValidate: true })} />
              {errors.type && <p className="mt-1.5 text-xs text-error">{errors.type.message}</p>}
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-6">
              <h2 className="text-base font-bold text-navy">Your Details</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" invalid={!!errors.name} {...register("name")} />
                  {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name (optional)</Label>
                  <Input id="companyName" invalid={!!errors.companyName} {...register("companyName")} />
                  {errors.companyName && <p className="mt-1.5 text-xs text-error">{errors.companyName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
                  {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput id="password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
                  {errors.password && <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" type="tel" inputMode="tel" invalid={!!errors.mobile} {...register("mobile")} />
                  {errors.mobile && <p className="mt-1.5 text-xs text-error">{errors.mobile.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 flex h-6.5 items-center gap-2 text-sm font-medium text-navy">
                    <input type="checkbox" className="h-4 w-4 rounded border-border accent-orange" {...register("sameAsMobile")} />
                    WhatsApp same as mobile
                  </label>
                  {!sameAsMobile && (
                    <>
                      <Input id="whatsapp" type="tel" inputMode="tel" invalid={!!errors.whatsapp} {...register("whatsapp")} />
                      {errors.whatsapp && <p className="mt-1.5 text-xs text-error">{errors.whatsapp.message}</p>}
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" invalid={!!errors.address?.state} {...register("address.state")} />
                  {errors.address?.state && <p className="mt-1.5 text-xs text-error">{errors.address.state.message}</p>}
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input id="district" invalid={!!errors.address?.district} {...register("address.district")} />
                  {errors.address?.district && <p className="mt-1.5 text-xs text-error">{errors.address.district.message}</p>}
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" invalid={!!errors.address?.city} {...register("address.city")} />
                  {errors.address?.city && <p className="mt-1.5 text-xs text-error">{errors.address.city.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="addressLine">Address Line (optional)</Label>
                <Textarea id="addressLine" rows={2} {...register("address.addressLine")} />
              </div>

              <div>
                <Label htmlFor="howHeard">How Did You Hear About Us? (optional)</Label>
                <Input id="howHeard" placeholder="e.g. Referral, social media, Google search" {...register("howHeard")} />
              </div>
            </div>

            {type === "INSTALLATION_SERVICE" && (
              <InstallationProfileFields register={register} errors={errors} watch={watch} setValue={setValue} />
            )}

            {applyMutation.isError && (
              <p className="text-sm text-error">
                {applyMutation.error instanceof ApiError ? applyMutation.error.message : "Couldn't submit your application. Please try again."}
              </p>
            )}

            <Button type="submit" size="lg" disabled={applyMutation.isPending} className="w-full">
              {applyMutation.isPending ? "Submitting…" : "Submit Application"}
            </Button>
          </form>
        </Container>
      </section>
    </>
  );
}
