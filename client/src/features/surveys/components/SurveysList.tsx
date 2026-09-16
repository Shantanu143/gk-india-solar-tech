import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { cn } from "@/lib/utils";
import { SurveyCard } from "@/features/surveys/components/SurveyCard";
import { SurveyStatusBadge } from "@/features/surveys/components/SurveyStatusBadge";
import { useStartSurvey } from "@/features/surveys/hooks/useSurveyMutations";
import { useSurveys } from "@/features/surveys/hooks/useSurveys";
import type { GetSurveysParams } from "@/features/surveys/services/surveyService";
import type { Survey } from "@/features/surveys/types/survey";
import { getEmployeeById } from "@/features/employees/utils/employeeCache";
import { formatDate, formatTime } from "@/lib/format";

const SCOPES: { key: NonNullable<GetSurveysParams["scope"]> | "all"; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "completed", label: "Completed" },
  { key: "all", label: "All" },
];

interface SurveysListProps {
  relevantToEmployeeId?: string;
  detailPath: (surveyId: string) => string;
  initialScope?: (typeof SCOPES)[number]["key"];
  /** Admin's company-wide view is read-only — starting the on-site form is the engineer's job. */
  showStartAction?: boolean;
}

export function SurveysList({ relevantToEmployeeId, detailPath, initialScope = "upcoming", showStartAction = true }: SurveysListProps) {
  const [scope, setScope] = useState<(typeof SCOPES)[number]["key"]>(initialScope);
  const navigate = useNavigate();
  const startSurvey = useStartSurvey();

  const { data: surveys = [], isLoading, isError, refetch } = useSurveys({
    relevantToEmployeeId,
    scope: scope === "all" ? undefined : scope,
  });

  function handleStart(survey: Survey) {
    startSurvey.mutate(survey.id, { onSuccess: () => navigate(detailPath(survey.id)) });
  }

  const columns: DataTableColumn<Survey>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (s) => (
        <Link to={detailPath(s.id)} className="font-semibold text-navy hover:text-orange">
          {s.customerName}
        </Link>
      ),
    },
    { key: "location", header: "Location", render: (s) => <span className="text-sm text-foreground/80">{s.location.city}</span> },
    { key: "date", header: "Date", render: (s) => <span className="text-sm text-foreground/80">{formatDate(`${s.date}T00:00:00`)}</span> },
    { key: "time", header: "Time", render: (s) => <span className="text-sm text-foreground/80">{formatTime(`${s.date}T${s.time}:00`)}</span> },
    {
      key: "engineer",
      header: "Engineer",
      render: (s) => <span className="text-sm text-foreground/80">{getEmployeeById(s.engineerId)?.name ?? "—"}</span>,
    },
    { key: "status", header: "Status", render: (s) => <SurveyStatusBadge status={s.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (s) => (
        <div className="flex gap-3 whitespace-nowrap">
          <button
            type="button"
            onClick={() => navigate(detailPath(s.id))}
            className="text-xs font-semibold text-navy hover:underline"
          >
            View
          </button>
          {showStartAction && s.status === "SCHEDULED" && (
            <button
              type="button"
              disabled={startSurvey.isPending}
              onClick={() => handleStart(s)}
              className="text-xs font-semibold text-orange-dark hover:underline"
            >
              Start Survey
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {SCOPES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setScope(s.key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
              scope === s.key ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/60 bg-white/55 p-2 shadow-[0_8px_32px_-12px_rgba(0,22,63,0.12)] backdrop-blur-xl sm:p-4">
        <DataTable
          columns={columns}
          rows={surveys}
          rowKey={(s) => s.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          emptyTitle={scope === "today" ? "No surveys today" : scope === "upcoming" ? "No upcoming surveys" : "No surveys found"}
          emptyDescription="Site surveys scheduled from a lead will show up here."
          renderMobileCard={(s) => <SurveyCard survey={s} detailHref={detailPath(s.id)} />}
        />
      </div>
    </div>
  );
}
