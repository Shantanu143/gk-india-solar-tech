import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EstimateNavigation } from "@/components/solar/EstimateNavigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { locationSchema, type LocationFormValues } from "@/schemas/location.schema";
import type { LocationData } from "@/types/solarEstimate";

interface LocationFormProps {
  defaultValues: LocationData | null;
  onBack: () => void;
  onSubmit: (data: LocationData) => void;
}

export function LocationForm({ defaultValues, onBack, onSubmit }: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: defaultValues ?? { pincode: "", city: "", address: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-5">
        <div>
          <Label htmlFor="pincode">PIN Code</Label>
          <Input
            id="pincode"
            inputMode="numeric"
            maxLength={6}
            placeholder="411001"
            invalid={!!errors.pincode}
            aria-describedby={errors.pincode ? "pincode-error" : undefined}
            {...register("pincode")}
          />
          {errors.pincode && (
            <p id="pincode-error" className="mt-1.5 text-xs text-error">
              {errors.pincode.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Pune"
            invalid={!!errors.city}
            aria-describedby={errors.city ? "city-error" : undefined}
            {...register("city")}
          />
          {errors.city && (
            <p id="city-error" className="mt-1.5 text-xs text-error">
              {errors.city.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            rows={3}
            placeholder="Customer installation address"
            invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            {...register("address")}
          />
          {errors.address && (
            <p id="address-error" className="mt-1.5 text-xs text-error">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      <EstimateNavigation onBack={onBack} nextLabel="Continue" submitType />
    </form>
  );
}
