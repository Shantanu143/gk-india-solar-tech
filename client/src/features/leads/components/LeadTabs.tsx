import * as Tabs from "@radix-ui/react-tabs";
import { FileStack } from "lucide-react";
import { GlassPanel } from "@/features/crm/components/GlassPanel";
import { ComingSoonTab } from "@/features/leads/components/ComingSoonTab";
import { LeadActivityTab } from "@/features/leads/components/LeadActivityTab";
import { LeadFollowUpsTab } from "@/features/leads/components/LeadFollowUpsTab";
import { LeadOverviewTab } from "@/features/leads/components/LeadOverviewTab";
import type { Lead } from "@/features/leads/types/lead";
import { LeadQuotationTab } from "@/features/quotations/components/LeadQuotationTab";
import { LeadSurveyTab } from "@/features/surveys/components/LeadSurveyTab";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "followups", label: "Follow-ups" },
  { value: "survey", label: "Survey" },
  { value: "quotation", label: "Quotation" },
  { value: "documents", label: "Documents" },
];

export function LeadTabs({ lead }: { lead: Lead }) {
  return (
    <Tabs.Root defaultValue="overview">
      <GlassPanel className="p-1.5 sm:p-2">
        <Tabs.List className="no-scrollbar flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors",
                "hover:text-navy data-[state=active]:bg-white/70 data-[state=active]:text-navy data-[state=active]:shadow-soft",
              )}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </GlassPanel>

      <div className="pt-5">
        <Tabs.Content value="overview">
          <LeadOverviewTab lead={lead} />
        </Tabs.Content>
        <Tabs.Content value="activity">
          <LeadActivityTab leadId={lead.id} />
        </Tabs.Content>
        <Tabs.Content value="followups">
          <LeadFollowUpsTab lead={lead} />
        </Tabs.Content>
        <Tabs.Content value="survey">
          <LeadSurveyTab lead={lead} />
        </Tabs.Content>
        <Tabs.Content value="quotation">
          <LeadQuotationTab lead={lead} />
        </Tabs.Content>
        <Tabs.Content value="documents">
          <ComingSoonTab
            icon={FileStack}
            title="No documents uploaded yet"
            description="Document uploads will be available in a future update."
          />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}
