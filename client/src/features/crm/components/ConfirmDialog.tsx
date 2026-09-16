import { Button } from "@/components/ui/Button";
import { Modal } from "@/features/crm/components/Modal";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
}

/** Reserve this for meaningful destructive/state-changing actions — not for routine navigation. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive,
  isLoading,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={destructive ? "bg-error hover:bg-error/90" : undefined}
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </Button>
        </>
      }
    />
  );
}
