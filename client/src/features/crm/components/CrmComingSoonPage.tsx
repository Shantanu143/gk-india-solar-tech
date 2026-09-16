import type { LucideIcon } from "lucide-react";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";

interface CrmComingSoonPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  seoPath: string;
}

/** Every sidebar item routes somewhere real — features not built yet say so plainly instead of dead-ending. */
export function CrmComingSoonPage({ icon: Icon, title, description, seoPath }: CrmComingSoonPageProps) {
  return (
    <div className="flex flex-col gap-5">
      <Seo title={`${title} | GK India SolarTech CRM`} description={description} path={seoPath} noindex />
      <PageHeader title={title} />
      <Card className="flex flex-col items-center justify-center gap-3 p-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/8 text-navy">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="text-base font-bold text-navy">Coming Soon</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </Card>
    </div>
  );
}
