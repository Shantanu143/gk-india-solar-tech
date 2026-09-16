import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { leadSchema, type LeadFormValues } from "@/schemas/lead.schema";

interface LeadCaptureFormProps {
  defaultAddress: string;
  isSubmitting: boolean;
  submitError: boolean;
  onSubmit: (values: LeadFormValues) => void;
}

export function LeadCaptureForm({ defaultAddress, isSubmitting, submitError, onSubmit }: LeadCaptureFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { sameAsMobile: true, address: defaultAddress, whatsapp: "", email: "" },
  });

  const sameAsMobile = watch("sameAsMobile");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" invalid={!!errors.fullName} {...register("fullName")} />
        {errors.fullName && <p className="mt-1.5 text-xs text-error">{errors.fullName.message}</p>}
      </div>

      <div>
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input id="mobile" type="tel" inputMode="numeric" invalid={!!errors.mobile} {...register("mobile")} />
        {errors.mobile && <p className="mt-1.5 text-xs text-error">{errors.mobile.message}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-navy">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-orange" {...register("sameAsMobile")} />
          WhatsApp number same as mobile number
        </label>
        {!sameAsMobile && (
          <div className="mt-3">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              type="tel"
              inputMode="numeric"
              invalid={!!errors.whatsapp}
              {...register("whatsapp")}
            />
            {errors.whatsapp && <p className="mt-1.5 text-xs text-error">{errors.whatsapp.message}</p>}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
        {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" rows={3} invalid={!!errors.address} {...register("address")} />
        {errors.address && <p className="mt-1.5 text-xs text-error">{errors.address.message}</p>}
      </div>

      {submitError && (
        <p className="text-sm text-error">We couldn't submit your request right now. Please try again.</p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting…" : "Get Free Solar Proposal"}
      </Button>
    </form>
  );
}
