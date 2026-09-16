import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/features/auth/hooks/authContext";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { signupCustomerSchema, type SignupFormValues } from "@/features/auth/schemas/auth.schema";
import { ApiError } from "@/services/apiClient";
import type { AuthUser } from "@/features/auth/types/auth";

interface SignupFormProps {
  /** Both flows share the exact same fields — only which endpoint gets called differs. */
  mode: "customer" | "employeeSetup";
  onSuccess: (user: AuthUser) => void;
}

export function SignupForm({ mode, onSuccess }: SignupFormProps) {
  const { signupCustomer, employeeSetup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupCustomerSchema) });

  const mutation = useMutation({
    mutationFn: (values: SignupFormValues) => (mode === "customer" ? signupCustomer(values) : employeeSetup(values)),
    onSuccess,
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="flex flex-col gap-3">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" autoComplete="name" invalid={!!errors.name} className="h-11" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} className="h-11" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" type="tel" autoComplete="tel" invalid={!!errors.phone} className="h-11" {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" autoComplete="new-password" invalid={!!errors.password} className="h-11" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          invalid={!!errors.confirmPassword}
          className="h-11"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-error">{errors.confirmPassword.message}</p>}
      </div>

      {mutation.isError && (
        <p className="text-sm text-error">
          {mutation.error instanceof ApiError ? mutation.error.message : "Couldn't create your account. Please try again."}
        </p>
      )}

      <Button type="submit" size="md" className="mt-1 w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating account…" : mode === "customer" ? "Create Account" : "Create Admin Account"}
      </Button>
    </form>
  );
}
