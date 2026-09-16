import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { RANGE_OPTIONS, type DateRangeOption } from "@/features/crm/utils/dateRange";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  description: string;
  range: DateRangeOption;
  onRangeChange: (range: DateRangeOption) => void;
  invalidateKey: readonly unknown[];
}

export function DashboardHeader({ title, description, range, onRangeChange, invalidateKey }: DashboardHeaderProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: invalidateKey });
    setRefreshing(false);
  }

  return (
    <PageHeader
      title={title}
      description={description}
      actions={
        <>
          <div className="flex rounded-xl border border-white/60 bg-white/50 p-0.5 backdrop-blur-md">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => onRangeChange(option.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap",
                  range === option.key ? "bg-navy text-white" : "text-muted-foreground hover:text-navy",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1.5">
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} aria-hidden="true" />
            Refresh
          </Button>
        </>
      }
    />
  );
}
