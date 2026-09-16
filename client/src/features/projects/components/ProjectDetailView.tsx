import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { GlassPanel } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { useCustomer } from "@/features/customers/hooks/useCustomers";
import { useProject } from "@/features/projects/hooks/useProjects";
import { useAddProjectDocument, useUpdateProjectStatus } from "@/features/projects/hooks/useProjectMutations";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES } from "@/features/projects/types/project";
import { getAllowedNextProjectStatuses, isTerminalProjectStatus, projectStatusIndex } from "@/features/projects/utils/projectWorkflow";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

interface ProjectDetailViewProps {
  projectId: string;
  leadDetailPath: (leadId: string) => string;
  canManage: boolean;
}

export function ProjectDetailView({ projectId, leadDetailPath, canManage }: ProjectDetailViewProps) {
  const { data: project, isLoading, isError, refetch } = useProject(projectId);
  const { data: customer } = useCustomer(project?.customerId);
  const updateStatus = useUpdateProjectStatus();
  const addDocument = useAddProjectDocument();
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <SkeletonRows rows={6} />;
  if (isError || !project) {
    return <ErrorState title="We couldn't display this project." description="It may have been removed or the link is incorrect." onRetry={() => refetch()} />;
  }

  const currentIndex = projectStatusIndex(project.status);
  const nextStatuses = getAllowedNextProjectStatuses(project.status);
  const locked = isTerminalProjectStatus(project.status);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadStatus("uploading");
    const reader = new FileReader();
    reader.onload = () => {
      addDocument.mutate(
        { id: projectId, document: { id: `doc-${Date.now()}`, fileName: file.name, fileType: file.type, url: String(reader.result) } },
        { onSuccess: () => setUploadStatus("idle"), onError: () => setUploadStatus("error") },
      );
    };
    reader.onerror = () => setUploadStatus("error");
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={project.projectNumber}
        description={customer ? `${customer.fullName} · ${project.systemCapacityKw} kW` : undefined}
        actions={
          <>
            <ProjectStatusBadge status={project.status} />
            <Link to={leadDetailPath(project.leadId)} className="text-sm font-semibold text-navy hover:text-orange">
              View Lead
            </Link>
          </>
        }
      />

      <GlassPanel className="p-5">
        <h2 className="text-base font-bold text-navy">Progress</h2>
        <ol className="mt-4 flex flex-col gap-0">
          {PROJECT_STATUSES.map((status, index) => {
            const isDone = index < currentIndex || locked;
            const isCurrent = index === currentIndex && !locked;
            return (
              <li key={status} className="relative flex gap-3 pb-6 last:pb-0">
                {index < PROJECT_STATUSES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn("absolute top-6 left-[11px] h-full w-px", isDone ? "bg-green" : "bg-border")}
                  />
                )}
                <span
                  className={cn(
                    "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isDone ? "bg-green text-white" : isCurrent ? "bg-orange text-white" : "bg-surface-muted text-muted-foreground",
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : index + 1}
                </span>
                <div className="pt-0.5">
                  <p className={cn("text-sm font-semibold", isCurrent ? "text-navy" : isDone ? "text-foreground/80" : "text-muted-foreground")}>
                    {PROJECT_STATUS_LABEL[status]}
                  </p>
                  {isCurrent && canManage && nextStatuses.length > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      className="mt-2 gap-1.5"
                      disabled={updateStatus.isPending}
                      onClick={() => updateStatus.mutate({ id: project.id, status: nextStatuses[0] })}
                    >
                      {updateStatus.isPending ? "Updating…" : `Advance to ${PROJECT_STATUS_LABEL[nextStatuses[0]]}`}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        {updateStatus.isError && <p className="mt-2 text-sm text-error">Couldn't update the project status. Please try again.</p>}
      </GlassPanel>

      <GlassPanel className="p-5">
        <h2 className="text-base font-bold text-navy">Documents</h2>
        <div className="mt-3 flex flex-col gap-2">
          {project.documents.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>}
          {project.documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              download={doc.fileName}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface p-3 text-sm text-foreground/80 hover:border-orange/40"
            >
              <FileText className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
              <span className="truncate">{doc.fileName}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</span>
            </a>
          ))}
        </div>

        {canManage && (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploadStatus === "uploading"}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy/25 text-sm font-semibold text-navy hover:bg-navy/5"
            >
              {uploadStatus === "uploading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
              {uploadStatus === "uploading" ? "Uploading…" : "Upload Document"}
            </button>
            {uploadStatus === "error" && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-error">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Couldn't upload this file. Please try again.
              </p>
            )}
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </>
        )}
      </GlassPanel>
    </div>
  );
}
