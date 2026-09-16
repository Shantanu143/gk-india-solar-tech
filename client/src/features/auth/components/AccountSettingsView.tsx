import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/features/auth/hooks/authContext";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/features/auth/schemas/auth.schema";
import { ApiError } from "@/services/apiClient";

/** Shared by the Admin, Employee and Customer settings pages — the same profile/password endpoints work for any authenticated user regardless of role. */
export function AccountSettingsView() {
  const { user, updateProfile, changePassword } = useAuth();

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  async function onProfileSubmit(values: UpdateProfileFormValues) {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSaved(false);
    try {
      await updateProfile({ name: values.name, phone: values.phone || undefined });
      setProfileSaved(true);
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Couldn't save your profile. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  }

  const passwordForm = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function onPasswordSubmit(values: ChangePasswordFormValues) {
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSaved(false);
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setPasswordSaved(true);
      passwordForm.reset();
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Couldn't change your password. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-navy">Profile</h2>
        <div>
          <Label htmlFor="settings-name">Full Name</Label>
          <Input id="settings-name" invalid={!!profileForm.formState.errors.name} {...profileForm.register("name")} />
          {profileForm.formState.errors.name && <p className="mt-1.5 text-xs text-error">{profileForm.formState.errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="settings-email">Email</Label>
          <Input id="settings-email" value={user.email} disabled />
          <p className="mt-1.5 text-xs text-muted-foreground">Your email can&rsquo;t be changed.</p>
        </div>
        <div>
          <Label htmlFor="settings-phone">Phone</Label>
          <Input id="settings-phone" type="tel" invalid={!!profileForm.formState.errors.phone} {...profileForm.register("phone")} />
          {profileForm.formState.errors.phone && <p className="mt-1.5 text-xs text-error">{profileForm.formState.errors.phone.message}</p>}
        </div>
        {profileError && <p className="text-sm text-error">{profileError}</p>}
        {profileSaved && <p className="text-sm text-green">Profile updated.</p>}
        <Button type="submit" size="md" className="self-start" disabled={profileSaving}>
          {profileSaving ? "Saving…" : "Save Profile"}
        </Button>
      </form>

      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} noValidate className="flex flex-col gap-4 border-t border-border pt-6">
        <h2 className="text-base font-bold text-navy">Change Password</h2>
        <div>
          <Label htmlFor="current-password">Current Password</Label>
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            invalid={!!passwordForm.formState.errors.currentPassword}
            {...passwordForm.register("currentPassword")}
          />
          {passwordForm.formState.errors.currentPassword && (
            <p className="mt-1.5 text-xs text-error">{passwordForm.formState.errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            invalid={!!passwordForm.formState.errors.newPassword}
            {...passwordForm.register("newPassword")}
          />
          {passwordForm.formState.errors.newPassword && (
            <p className="mt-1.5 text-xs text-error">{passwordForm.formState.errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="confirm-new-password">Confirm New Password</Label>
          <PasswordInput
            id="confirm-new-password"
            autoComplete="new-password"
            invalid={!!passwordForm.formState.errors.confirmPassword}
            {...passwordForm.register("confirmPassword")}
          />
          {passwordForm.formState.errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-error">{passwordForm.formState.errors.confirmPassword.message}</p>
          )}
        </div>
        {passwordError && <p className="text-sm text-error">{passwordError}</p>}
        {passwordSaved && <p className="text-sm text-green">Password changed. Use it next time you sign in.</p>}
        <Button type="submit" size="md" className="self-start" disabled={passwordSaving}>
          {passwordSaving ? "Saving…" : "Change Password"}
        </Button>
      </form>
    </div>
  );
}
