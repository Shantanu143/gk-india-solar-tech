import { Building2, Check, HardHat, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { PARTNER_TYPES, PARTNER_TYPE_DESCRIPTION, PARTNER_TYPE_LABEL, type PartnerType } from "@/schemas/partner.schema";

const PARTNER_TYPE_ICON = {
  SALES_REFERRAL: Users,
  INSTALLATION_SERVICE: HardHat,
  EPC_PROJECT: Building2,
} as const;

interface PartnerTypeSelectorProps {
  value: PartnerType;
  onChange: (type: PartnerType) => void;
}

/** Mobile-first: full-width stacked cards with a large tap target, matching `ProjectTypeCard`'s selection pattern. */
export function PartnerTypeSelector({ value, onChange }: PartnerTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {PARTNER_TYPES.map((type) => {
        const Icon = PARTNER_TYPE_ICON[type];
        const selected = value === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            aria-pressed={selected}
            className={cn(
              "flex w-full flex-col items-start gap-3 rounded-xl border-2 bg-surface p-5 text-left transition-colors duration-200 hover:border-navy/30",
              selected ? "border-orange bg-orange/5" : "border-border",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                  selected ? "bg-orange text-white" : "bg-navy/8 text-navy",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {selected && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-white">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}
            </div>
            <div>
              <p className="font-bold text-navy">{PARTNER_TYPE_LABEL[type]}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{PARTNER_TYPE_DESCRIPTION[type]}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
