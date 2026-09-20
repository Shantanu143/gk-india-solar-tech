import { useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { PartnerApplyFormValues } from "@/schemas/partner.schema";
import { PartnerDocumentUploader } from "@/pages/Partners/components/PartnerDocumentUploader";
import { PartnerPhotoUploader } from "@/pages/Partners/components/PartnerPhotoUploader";

interface InstallationProfileFieldsProps {
  register: UseFormRegister<PartnerApplyFormValues>;
  errors: FieldErrors<PartnerApplyFormValues>;
  watch: UseFormWatch<PartnerApplyFormValues>;
  setValue: UseFormSetValue<PartnerApplyFormValues>;
}

interface NumberFieldProps {
  id: string;
  label: string;
  register: UseFormRegister<PartnerApplyFormValues>;
  name: keyof PartnerApplyFormValues & (
    | "yearsOfExperience"
    | "teamSize"
    | "electricians"
    | "installers"
    | "weldersFabricators"
    | "dailyInstallationCapacityKw"
    | "expectedLabourRate"
  );
  error?: string;
}

function NumberField({ id, label, register, name, error }: NumberFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" inputMode="numeric" min={0} invalid={!!error} {...register(name)} />
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  register: UseFormRegister<PartnerApplyFormValues>;
  name:
    | "residentialExperience"
    | "commercialExperience"
    | "industrialExperience"
    | "onGridExperience"
    | "offGridExperience"
    | "canSiteSurvey"
    | "canStructureFabrication"
    | "canElectricalWork";
}

function CheckboxField({ id, label, register, name }: CheckboxFieldProps) {
  return (
    <label htmlFor={id} className="flex min-h-11 items-center gap-2.5 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-navy">
      <input id={id} type="checkbox" className="h-4 w-4 shrink-0 rounded border-border accent-orange" {...register(name)} />
      {label}
    </label>
  );
}

/**
 * Extended registration fields shown only when the "Installation / Service" partner type is
 * selected. Photo and document uploads follow the app-wide "no real storage backend" pattern:
 * files are compressed/read client-side into base64 data URLs and submitted directly in the JSON body.
 */
export function InstallationProfileFields({ register, errors, watch, setValue }: InstallationProfileFieldsProps) {
  const [docNames, setDocNames] = useState<{ identity?: string; business?: string; experience?: string }>({});

  const projectPhotos = watch("projectPhotos");
  const identityDocument = watch("identityDocument");
  const businessDocument = watch("businessDocument");
  const experienceDocument = watch("experienceDocument");

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface-muted/50 p-4 sm:p-6">
      <div>
        <h3 className="text-base font-bold text-navy">Installation & Service Details</h3>
        <p className="mt-1 text-sm text-muted-foreground">Tell us about your team and installation capacity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField id="yearsOfExperience" label="Years of Experience" register={register} name="yearsOfExperience" error={errors.yearsOfExperience?.message} />
        <NumberField id="teamSize" label="Total Team Size" register={register} name="teamSize" error={errors.teamSize?.message} />
        <NumberField id="electricians" label="Electricians" register={register} name="electricians" error={errors.electricians?.message} />
        <NumberField id="installers" label="Installers" register={register} name="installers" error={errors.installers?.message} />
        <NumberField id="weldersFabricators" label="Welders / Fabricators" register={register} name="weldersFabricators" error={errors.weldersFabricators?.message} />
        <NumberField
          id="dailyInstallationCapacityKw"
          label="Daily Installation Capacity (kW)"
          register={register}
          name="dailyInstallationCapacityKw"
          error={errors.dailyInstallationCapacityKw?.message}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-navy">Experience With</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <CheckboxField id="residentialExperience" label="Residential" register={register} name="residentialExperience" />
          <CheckboxField id="commercialExperience" label="Commercial" register={register} name="commercialExperience" />
          <CheckboxField id="industrialExperience" label="Industrial" register={register} name="industrialExperience" />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-navy">System Type</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <CheckboxField id="onGridExperience" label="On-Grid" register={register} name="onGridExperience" />
          <CheckboxField id="offGridExperience" label="Off-Grid" register={register} name="offGridExperience" />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-navy">Capabilities</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <CheckboxField id="canSiteSurvey" label="Site Survey" register={register} name="canSiteSurvey" />
          <CheckboxField id="canStructureFabrication" label="Structure Fabrication" register={register} name="canStructureFabrication" />
          <CheckboxField id="canElectricalWork" label="Electrical Work" register={register} name="canElectricalWork" />
        </div>
      </div>

      <PartnerPhotoUploader photos={projectPhotos} onChange={(photos) => setValue("projectPhotos", photos, { shouldValidate: true })} />

      <div>
        <Label htmlFor="serviceDistricts">Service Districts</Label>
        <Input id="serviceDistricts" placeholder="e.g. Pune, Pimpri-Chinchwad, Nashik" {...register("serviceDistricts")} />
        <p className="mt-1.5 text-xs text-muted-foreground">Separate multiple districts with commas.</p>
      </div>

      <NumberField id="expectedLabourRate" label="Expected Labour Rate (₹ per kW, optional)" register={register} name="expectedLabourRate" error={errors.expectedLabourRate?.message} />

      <div>
        <p className="text-sm font-semibold text-navy">Documents</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Upload copies for verification — PDF, JPG or PNG.</p>
        <div className="mt-2 flex flex-col gap-3">
          <PartnerDocumentUploader
            label="Identity Document"
            value={identityDocument}
            fileName={docNames.identity}
            onChange={(dataUrl, fileName) => {
              setValue("identityDocument", dataUrl, { shouldValidate: true });
              setDocNames((prev) => ({ ...prev, identity: fileName }));
            }}
          />
          <PartnerDocumentUploader
            label="Business Document"
            value={businessDocument}
            fileName={docNames.business}
            onChange={(dataUrl, fileName) => {
              setValue("businessDocument", dataUrl, { shouldValidate: true });
              setDocNames((prev) => ({ ...prev, business: fileName }));
            }}
          />
          <PartnerDocumentUploader
            label="Experience/Certification"
            value={experienceDocument}
            fileName={docNames.experience}
            onChange={(dataUrl, fileName) => {
              setValue("experienceDocument", dataUrl, { shouldValidate: true });
              setDocNames((prev) => ({ ...prev, experience: fileName }));
            }}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-navy">Bank Details</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Optional now — needed later for commission payouts.</p>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="bankAccountHolderName">Account Holder Name</Label>
            <Input id="bankAccountHolderName" {...register("bankDetails.accountHolderName")} />
          </div>
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" {...register("bankDetails.bankName")} />
          </div>
          <div>
            <Label htmlFor="bankAccountNumber">Account Number</Label>
            <Input id="bankAccountNumber" inputMode="numeric" {...register("bankDetails.accountNumber")} />
          </div>
          <div>
            <Label htmlFor="bankIfsc">IFSC Code</Label>
            <Input id="bankIfsc" className="uppercase" {...register("bankDetails.ifsc")} />
          </div>
        </div>
      </div>
    </div>
  );
}
