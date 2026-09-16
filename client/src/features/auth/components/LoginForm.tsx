import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/features/auth/hooks/authContext";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schema";
import { ApiError } from "@/services/apiClient";
import type { AuthUser } from "@/features/auth/types/auth";

interface LoginFormProps {
  onSuccess: (user: AuthUser) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({ mutationFn: login, onSuccess });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="flex flex-col gap-3">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} className="h-11" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" autoComplete="current-password" invalid={!!errors.password} className="h-11" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
      </div>

      {mutation.isError && (
        <p className="text-sm text-error">
          {mutation.error instanceof ApiError ? mutation.error.message : "Couldn't sign you in. Please try again."}
        </p>
      )}

      <Button type="submit" size="md" className="mt-1 w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
