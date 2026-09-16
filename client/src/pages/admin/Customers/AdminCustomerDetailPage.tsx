import { Link, useParams } from "react-router-dom";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { GlassPanel } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { Avatar } from "@/features/crm/components/Avatar";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { useCustomer } from "@/features/customers/hooks/useCustomers";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { useProjectForCustomer } from "@/features/projects/hooks/useProjects";
import { PROJECT_TYPE_LABEL } from "@/features/leads/types/lead";
import { formatDate } from "@/lib/format";

export function AdminCustomerDetailPage() {
  const { customerId = "" } = useParams<{ customerId: string }>();
  const { data: customer, isLoading, isError, refetch } = useCustomer(customerId);
  const { data: project } = useProjectForCustomer(customerId);

  if (isLoading) return <SkeletonRows rows={6} />;
  if (isError || !customer) {
    return <ErrorState title="We couldn't display this customer." description="They may have been removed or the link is incorrect." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Seo title={`${customer.fullName} | GK India SolarTech CRM`} description="Customer detail." path={CRM_ROUTES.adminCustomerDetail(customerId)} noindex />
      <PageHeader
        title={customer.fullName}
        description={`${PROJECT_TYPE_LABEL[customer.projectType]} · Customer since ${formatDate(customer.createdAt)}`}
        actions={
          <Link to={CRM_ROUTES.adminLeadDetail(customer.leadId)} className="text-sm font-semibold text-navy hover:text-orange">
            View Original Lead
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <GlassPanel className="p-5">
          <div className="flex items-center gap-3">
            <Avatar name={customer.fullName} />
            <div>
              <p className="font-semibold text-navy">{customer.fullName}</p>
              <p className="text-xs text-muted-foreground">{customer.systemCapacityKw ? `${customer.systemCapacityKw} kW system` : "System capacity pending"}</p>
            </div>
          </div>

          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2.5 text-foreground/80">
              <Phone className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
              <span>{customer.mobile}</span>
            </div>
            {customer.whatsapp && customer.whatsapp !== customer.mobile && (
              <div className="flex items-center gap-2.5 text-foreground/80">
                <MessageCircle className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                <span>{customer.whatsapp}</span>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-2.5 text-foreground/80">
                <Mail className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                <span>{customer.email}</span>
              </div>
            )}
            <div className="flex items-start gap-2.5 text-foreground/80">
              <MapPin className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
              <span>{customer.address}</span>
            </div>
          </dl>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h2 className="text-base font-bold text-navy">Installation Project</h2>
          {project ? (
            <Link
              to={CRM_ROUTES.adminProjectDetail(project.id)}
              className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-sm hover:border-orange/40"
            >
              <div>
                <p className="font-mono text-xs text-muted-foreground">{project.projectNumber}</p>
                <p className="mt-1 font-semibold text-navy">{project.systemCapacityKw} kW</p>
              </div>
              <div className="flex items-center gap-2">
                <ProjectStatusBadge status={project.status} />
                <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </Link>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No project has been created for this customer yet.</p>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
