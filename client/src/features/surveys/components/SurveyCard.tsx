import { Link } from "react-router-dom";
import { Calendar, MapPin, User } from "lucide-react";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { SurveyStatusBadge } from "@/features/surveys/components/SurveyStatusBadge";
import type { Survey } from "@/features/surveys/types/survey";
import { getEmployeeById } from "@/features/employees/utils/employeeCache";
import { formatDate, formatTime } from "@/lib/format";

interface SurveyCardProps {
  survey: Survey;
  detailHref: string;
}

export function SurveyCard({ survey, detailHref }: SurveyCardProps) {
  const engineer = getEmployeeById(survey.engineerId);

  return (
    <Link to={detailHref} className="block">
      <Card className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-bold text-navy">{survey.customerName}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              {survey.location.city}
            </p>
          </div>
          <SurveyStatusBadge status={survey.status} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-foreground/80">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {formatDate(`${survey.date}T00:00:00`)} · {formatTime(`${survey.date}T${survey.time}:00`)}
          </span>
          {engineer && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {engineer.name}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
