import { AlertTriangle, Clock, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerApplicationStatus } from "@/features/partners/types/partner";

interface PartnerApplicationBannerProps {
  status: PartnerApplicationStatus;
  rejectionReason?: string;
  className?: string;
}

const BANNER_CONFIG: Record<
  Exclude<PartnerApplicationStatus, "APPROVED">,
  { icon: LucideIcon; tone: string; title: string; fallback: string }
> = {
  PENDING: {
    icon: Clock,
    tone: "border-amber-200 bg-amber-50 text-amber-800",
    title: "Your partner application is pending review",
    fallback: "Our team is reviewing your details. You'll be able to submit leads as soon as you're approved.",
  },
  REJECTED: {
    icon: XCircle,
    tone: "border-error/30 bg-error/5 text-error",
    title: "Your partner application was not approved",
    fallback: "Please contact our partner support team for more details.",
  },
  SUSPENDED: {
    icon: AlertTriangle,
    tone: "border-error/30 bg-error/5 text-error",
    title: "Your partner account is currently suspended",
    fallback: "Please contact our partner support team to resolve this.",
  },
};

/** Shown in place of/above the normal partner dashboard whenever the partner isn't (or is no
 * longer) APPROVED — nothing renders once they are. */
export function PartnerApplicationBanner({ status, rejectionReason, className }: PartnerApplicationBannerProps) {
  if (status === "APPROVED") return null;
  const config = BANNER_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border p-4 sm:p-5", config.tone, className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-sm font-bold">{config.title}</p>
        <p className="mt-1 text-sm opacity-90">{rejectionReason || config.fallback}</p>
      </div>
    </div>
  );
}
