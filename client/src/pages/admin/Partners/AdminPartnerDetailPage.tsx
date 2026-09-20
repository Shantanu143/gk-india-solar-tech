import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Ban,
  CheckCircle2,
  FileText,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Seo } from "@/components/layout/Seo";
import { Avatar } from "@/features/crm/components/Avatar";
import { ConfirmDialog } from "@/features/crm/components/ConfirmDialog";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { GlassPanel } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { useAuth } from "@/features/crm/hooks/authContext";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { RejectPartnerModal } from "@/features/partners/components/RejectPartnerModal";
import { useAdminPartner } from "@/features/partners/hooks/useAdminPartners";
import { useSetPartnerStatus } from "@/features/partners/hooks/useAdminPartnerMutations";
import type { InstallationPartnerProfile } from "@/features/partners/types/partner";
import { PARTNER_STATUS_LABEL, PARTNER_TYPE_LABEL } from "@/features/partners/types/partner";
import { PARTNER_STATUS_TONE } from "@/features/partners/utils/partnerStatusConfig";
import { formatDate, formatDateTime } from "@/lib/format";

const CAPACITY_FIELDS: { key: keyof InstallationPartnerProfile; label: string; suffix?: string }[] = [
  { key: "yearsOfExperience", label: "Years of Experience" },
  { key: "teamSize", label: "Team Size" },
  { key: "electricians", label: "Electricians" },
  { key: "installers", label: "Installers" },
  { key: "weldersFabricators", label: "Welders / Fabricators" },
  { key: "dailyInstallationCapacityKw", label: "Daily Capacity", suffix: "kW" },
  { key: "expectedLabourRate", label: "Expected Labour Rate", suffix: "₹/kW" },
];

const CAPABILITY_FIELDS: { key: keyof InstallationPartnerProfile; label: string }[] = [
  { key: "residentialExperience", label: "Residential Installations" },
  { key: "commercialExperience", label: "Commercial Installations" },
  { key: "industrialExperience", label: "Industrial Installations" },
  { key: "onGridExperience", label: "On-grid Systems" },
  { key: "offGridExperience", label: "Off-grid Systems" },
  { key: "canSiteSurvey", label: "Site Survey" },
  { key: "canStructureFabrication", label: "Structure Fabrication" },
  { key: "canElectricalWork", label: "Electrical Work" },
];

type ConfirmAction = "APPROVE" | "SUSPEND" | "REINSTATE";

export function AdminPartnerDetailPage() {
  const { partnerId = "" } = useParams<{ partnerId: string }>();
  const { data: partner, isLoading, isError, refetch } = useAdminPartner(partnerId);
  const { can } = useAuth();
  const setStatus = useSetPartnerStatus();

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [justApprovedId, setJustApprovedId] = useState<string | null>(null);

  if (isLoading) return <SkeletonRows rows={6} />;
  if (isError || !partner) {
    return (
      <ErrorState
        title="We couldn't display this partner."
        description="They may have been removed or the link is incorrect."
        onRetry={() => refetch()}
      />
    );
  }

  const canManage = can("partners.manage");
  const installationProfile = partner.type === "INSTALLATION_SERVICE" ? partner.installationProfile : undefined;

  const confirmConfig: { title: string; description: string; confirmLabel: string; destructive?: boolean; status: "APPROVED" | "SUSPENDED" } | null =
    confirmAction === "APPROVE"
      ? {
          title: "Approve This Partner?",
          description: `${partner.name} will be approved and assigned a Partner ID. They'll be notified and gain access to the partner portal.`,
          confirmLabel: "Approve",
          status: "APPROVED",
        }
      : confirmAction === "SUSPEND"
        ? {
            title: "Suspend This Partner?",
            description: `${partner.name} will immediately lose access to the partner portal until reinstated.`,
            confirmLabel: "Suspend",
            destructive: true,
            status: "SUSPENDED",
          }
        : confirmAction === "REINSTATE"
          ? {
              title: "Reinstate This Partner?",
              description: `${partner.name} will regain access to the partner portal as an approved partner.`,
              confirmLabel: "Reinstate",
              status: "APPROVED",
            }
          : null;

  return (
    <div className="flex flex-col gap-5">
      <Seo title={`${partner.name} | GK India SolarTech CRM`} description="Partner application detail." path={CRM_ROUTES.adminPartnerDetail(partnerId)} noindex />

      <PageHeader
        title={partner.name}
        description={`${PARTNER_TYPE_LABEL[partner.type]}${partner.companyName ? ` · ${partner.companyName}` : ""}`}
        actions={
          canManage ? (
            <>
              {partner.applicationStatus === "PENDING" && (
                <>
                  <Button size="sm" className="gap-1.5" onClick={() => setConfirmAction("APPROVE")}>
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" className="gap-1.5 text-error" onClick={() => setRejectOpen(true)}>
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    Reject
                  </Button>
                </>
              )}
              {partner.applicationStatus === "APPROVED" && (
                <Button size="sm" variant="secondary" className="gap-1.5 text-error" onClick={() => setConfirmAction("SUSPEND")}>
                  <Ban className="h-4 w-4" aria-hidden="true" />
                  Suspend
                </Button>
              )}
              {partner.applicationStatus === "SUSPENDED" && (
                <Button size="sm" className="gap-1.5" onClick={() => setConfirmAction("REINSTATE")}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reinstate
                </Button>
              )}
            </>
          ) : undefined
        }
      />

      {justApprovedId && (
        <GlassPanel className="flex items-center gap-3 border-green/30 bg-green/10 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-green" aria-hidden="true" />
          <p className="text-sm text-navy">
            Partner approved. Their assigned Partner ID is <span className="font-mono font-bold">{justApprovedId}</span>.
          </p>
        </GlassPanel>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={partner.name} size="lg" />
              <div>
                <p className="font-semibold text-navy">{partner.name}</p>
                <p className="text-xs text-muted-foreground">{PARTNER_TYPE_LABEL[partner.type]}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <StatusBadge label={PARTNER_STATUS_LABEL[partner.applicationStatus]} tone={PARTNER_STATUS_TONE[partner.applicationStatus]} />
              {partner.partnerId && <span className="font-mono text-xs text-muted-foreground">{partner.partnerId}</span>}
            </div>
          </div>

          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2.5 text-foreground/80">
              <Phone className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
              <span>{partner.mobile}</span>
            </div>
            {partner.whatsapp && partner.whatsapp !== partner.mobile && (
              <div className="flex items-center gap-2.5 text-foreground/80">
                <MessageCircle className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                <span>{partner.whatsapp}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-foreground/80">
              <Mail className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
              <span>{partner.email}</span>
            </div>
            <div className="flex items-start gap-2.5 text-foreground/80">
              <MapPin className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
              <span>
                {[partner.address.addressLine, partner.address.city, partner.address.district, partner.address.state].filter(Boolean).join(", ")}
              </span>
            </div>
            {partner.howHeard && (
              <div className="text-xs text-muted-foreground">
                Heard about us via: <span className="text-foreground/80">{partner.howHeard}</span>
              </div>
            )}
          </dl>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h2 className="text-base font-bold text-navy">Application Status</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge label={PARTNER_STATUS_LABEL[partner.applicationStatus]} tone={PARTNER_STATUS_TONE[partner.applicationStatus]} />
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Applied On</dt>
              <dd className="text-foreground/80">{formatDate(partner.createdAt)}</dd>
            </div>
            {partner.reviewedAt && (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Reviewed On</dt>
                <dd className="text-foreground/80">{formatDateTime(partner.reviewedAt)}</dd>
              </div>
            )}
            {partner.reviewedBy && (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Reviewed By</dt>
                <dd className="font-mono text-xs text-foreground/80">{partner.reviewedBy}</dd>
              </div>
            )}
          </dl>

          {partner.applicationStatus === "REJECTED" && partner.rejectionReason && (
            <div className="mt-4 rounded-lg border border-error/20 bg-error/5 p-3">
              <p className="text-xs font-semibold text-error">Rejection Reason</p>
              <p className="mt-1 text-sm text-foreground/80">{partner.rejectionReason}</p>
            </div>
          )}
        </GlassPanel>
      </div>

      {installationProfile && (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <GlassPanel className="p-5">
              <h2 className="text-base font-bold text-navy">Experience &amp; Capacity</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                {CAPACITY_FIELDS.map(({ key, label, suffix }) => {
                  const value = installationProfile[key];
                  if (value === undefined) return null;
                  return (
                    <div key={key}>
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="mt-0.5 font-semibold text-navy">
                        {String(value)}
                        {suffix ? ` ${suffix}` : ""}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </GlassPanel>

            <GlassPanel className="p-5">
              <h2 className="text-base font-bold text-navy">Capabilities</h2>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {CAPABILITY_FIELDS.map(({ key, label }) => {
                  const value = Boolean(installationProfile[key]);
                  return (
                    <li key={key} className="flex items-center gap-2">
                      {value ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                      )}
                      <span className={value ? "text-foreground/80" : "text-muted-foreground/70"}>{label}</span>
                    </li>
                  );
                })}
              </ul>
            </GlassPanel>
          </div>

          <GlassPanel className="p-5">
            <h2 className="text-base font-bold text-navy">Service Districts</h2>
            {installationProfile.serviceDistricts.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No service districts listed.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {installationProfile.serviceDistricts.map((district) => (
                  <span key={district} className="rounded-full bg-navy/8 px-3 py-1 text-xs font-medium text-navy">
                    {district}
                  </span>
                ))}
              </div>
            )}
          </GlassPanel>

          <GlassPanel className="p-5">
            <h2 className="text-base font-bold text-navy">Project Photos</h2>
            {installationProfile.projectPhotos.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No project photos uploaded.</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {installationProfile.projectPhotos.map((photo, index) => (
                  <a
                    key={index}
                    href={photo}
                    target="_blank"
                    rel="noreferrer"
                    className="block aspect-square overflow-hidden rounded-lg border border-border bg-surface-muted"
                  >
                    <img src={photo} alt={`Project photo ${index + 1}`} className="h-full w-full object-cover" />
                  </a>
                ))}
              </div>
            )}
          </GlassPanel>

          <div className="grid gap-5 lg:grid-cols-2">
            <GlassPanel className="p-5">
              <h2 className="text-base font-bold text-navy">Documents</h2>
              {!installationProfile.documents || installationProfile.documents.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No documents uploaded.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2.5">
                  {installationProfile.documents.map((doc, index) => (
                    <li key={index} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 text-sm">
                      <span className="flex items-center gap-2 text-foreground/80">
                        <FileText className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                        {doc.label}
                      </span>
                      <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-navy hover:underline">
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </GlassPanel>

            <GlassPanel className="p-5">
              <h2 className="flex items-center gap-2 text-base font-bold text-navy">
                <Landmark className="h-4 w-4" aria-hidden="true" />
                Bank Details
              </h2>
              {installationProfile.bankDetails ? (
                <dl className="mt-4 flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Account Holder</dt>
                    <dd className="text-foreground/80">{installationProfile.bankDetails.accountHolderName}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Bank</dt>
                    <dd className="text-foreground/80">{installationProfile.bankDetails.bankName}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Account Number</dt>
                    <dd className="font-mono text-foreground/80">{installationProfile.bankDetails.accountNumber}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">IFSC</dt>
                    <dd className="font-mono text-foreground/80">{installationProfile.bankDetails.ifsc}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {canManage ? "No bank details on file yet." : "Bank details are only visible to administrators."}
                </p>
              )}
            </GlassPanel>
          </div>
        </>
      )}

      {confirmConfig && (
        <ConfirmDialog
          open
          onOpenChange={() => setConfirmAction(null)}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmLabel={confirmConfig.confirmLabel}
          destructive={confirmConfig.destructive}
          isLoading={setStatus.isPending}
          onConfirm={() =>
            setStatus.mutate(
              { id: partner.id, status: confirmConfig.status },
              {
                onSuccess: (updated) => {
                  setConfirmAction(null);
                  if (confirmConfig.status === "APPROVED" && updated.partnerId) setJustApprovedId(updated.partnerId);
                },
              },
            )
          }
        />
      )}

      {rejectOpen && <RejectPartnerModal open onOpenChange={setRejectOpen} partner={partner} />}
    </div>
  );
}
