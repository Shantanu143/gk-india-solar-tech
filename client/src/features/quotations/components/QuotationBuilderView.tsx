import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Link } from "react-router-dom";
import { CheckCircle2, Download, Mail, Plus, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { GlassPanel } from "@/features/crm/components/GlassPanel";
import { Modal } from "@/features/crm/components/Modal";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { useAuth } from "@/features/crm/hooks/authContext";
import { useLead } from "@/features/leads/hooks/useLead";
import type { SendQuotationResult } from "@/features/quotations/types/quotation";
import type { Lead } from "@/features/leads/types/lead";
import { LOST_REASON_LABEL, type LostReason } from "@/features/leads/types/lead";
import {
  canSharePdfFile,
  downloadQuotationPdf,
  fetchQuotationPdfFile,
  savePdfFile,
  sharePdfFile,
} from "@/features/quotations/services/quotationService";
import {
  useAcceptQuotation,
  useRejectQuotation,
  useSendQuotation,
  useUpdateQuotationItems,
} from "@/features/quotations/hooks/useQuotationMutations";
import { useQuotation } from "@/features/quotations/hooks/useQuotation";
import { QuotationStatusBadge } from "@/features/quotations/components/QuotationStatusBadge";
import type { Quotation, QuotationItem } from "@/features/quotations/types/quotation";
import { PRODUCT_CATEGORY_LABEL } from "@/features/products/types/product";
import { formatDate, formatInr } from "@/lib/format";
import { ApiError } from "@/services/apiClient";

interface QuotationBuilderViewProps {
  quotationId: string;
  leadDetailPath: (leadId: string) => string;
}

let tempIdCounter = 0;
function nextTempId(): string {
  tempIdCounter += 1;
  return `temp-${tempIdCounter}`;
}

export function QuotationBuilderView({ quotationId, leadDetailPath }: QuotationBuilderViewProps) {
  const { data: quotation, isLoading, isError, refetch } = useQuotation(quotationId);
  const { data: lead } = useLead(quotation?.leadId);

  if (isLoading) return <SkeletonRows rows={6} />;
  if (isError || !quotation) {
    return <ErrorState title="We couldn't display this quotation." description="It may have been removed or the link is incorrect." onRetry={() => refetch()} />;
  }

  // Keyed on the quotation id so navigating between two different quotations remounts this with
  // fresh local edit state, while a background refetch of the SAME quotation (e.g. after our own
  // save) doesn't wipe out in-progress edits.
  return <QuotationBuilder key={quotation.id} quotation={quotation} lead={lead} leadDetailPath={leadDetailPath} />;
}

interface QuotationBuilderProps {
  quotation: Quotation;
  lead: Lead | undefined;
  leadDetailPath: (leadId: string) => string;
}

function QuotationBuilder({ quotation, lead, leadDetailPath }: QuotationBuilderProps) {
  const { can } = useAuth();
  const updateItems = useUpdateQuotationItems();
  const sendQuotation = useSendQuotation();
  const acceptQuotation = useAcceptQuotation();
  const rejectQuotation = useRejectQuotation();

  const [items, setItems] = useState<QuotationItem[]>(quotation.items);
  const [discountAmount, setDiscountAmount] = useState(quotation.discountAmount);
  const [notes, setNotes] = useState(quotation.notes ?? "");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [lostReason, setLostReason] = useState<LostReason | "">("");
  const [downloading, setDownloading] = useState(false);
  const [sentInfo, setSentInfo] = useState<SendQuotationResult | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [preparingPdf, setPreparingPdf] = useState(false);
  const [savedForChat, setSavedForChat] = useState(false);

  const isDraft = quotation.status === "DRAFT";
  const isSent = quotation.status === "SENT";
  const canEdit = can("quotations.create");
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalAmount = Math.max(0, subtotal - quotation.subsidyAmount - discountAmount);
  // Blank descriptions and non-positive quantities pass client state fine but 400 at the server —
  // block Save/Send on them here instead of letting the request fail with no clue which row is bad.
  const hasInvalidItems = items.some((item) => !item.description.trim() || item.quantity <= 0);
  const isMutating = updateItems.isPending || sendQuotation.isPending;

  function updateItem(id: string, patch: Partial<Pick<QuotationItem, "description" | "quantity" | "unitPrice">>) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch };
        return { ...next, amount: next.quantity * next.unitPrice };
      }),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addItem() {
    setItems((prev) => [...prev, { id: nextTempId(), productId: null, description: "", category: "OTHER", quantity: 1, unitPrice: 0, amount: 0 }]);
  }

  function itemsPayload() {
    return items.map((item) => ({
      productId: item.productId,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount,
    }));
  }

  function handleSaveDraft() {
    updateItems.mutate({ id: quotation.id, items: itemsPayload(), discountAmount, notes });
  }

  const customerName = lead?.customer.fullName ?? "the customer";
  const canShareFile = pdfFile ? canSharePdfFile(pdfFile) : false;

  function shareTitle(result: SendQuotationResult) {
    return `Solar quotation ${result.quotation.quotationNumber}`;
  }

  /**
   * Marks the quotation sent, then fetches the real PDF so it can go into the customer's WhatsApp as
   * a file. If this tap is still "fresh" and the device can share files, the share sheet opens
   * straight away; otherwise the panel below offers one more tap (browsers only allow the share
   * sheet from a tap, and the save + send round-trips can outlast it).
   */
  function deliver() {
    setShareError(null);
    setPdfFile(null);
    setSavedForChat(false);
    sendQuotation.mutate(quotation.id, {
      onSuccess: async (result) => {
        setSentInfo(result);
        setPreparingPdf(true);
        try {
          const file = await fetchQuotationPdfFile(result.quotation);
          setPdfFile(file);
          if (navigator.userActivation?.isActive && canSharePdfFile(file)) {
            await sharePdfFile(file, shareTitle(result), result.caption);
          }
        } catch {
          setShareError("Couldn't prepare the PDF for sharing. Use Download PDF, or send the link instead.");
        } finally {
          setPreparingPdf(false);
        }
      },
    });
  }

  async function handleShareFile() {
    if (!pdfFile || !sentInfo) return;
    setShareError(null);
    try {
      await sharePdfFile(pdfFile, shareTitle(sentInfo), sentInfo.caption);
    } catch {
      setShareError("Couldn't open the share sheet. Use “Download PDF & open WhatsApp chat” instead.");
    }
  }

  /** For devices that can't attach files themselves: save the PDF, open the customer's chat with the message typed in. */
  function handleSaveAndOpenChat() {
    if (!pdfFile || !sentInfo) return;
    savePdfFile(pdfFile);
    window.open(sentInfo.whatsappChatLink, "_blank", "noopener");
    setSavedForChat(true);
  }

  function handleSend() {
    updateItems.mutate({ id: quotation.id, items: itemsPayload(), discountAmount, notes }, { onSuccess: deliver });
  }

  async function downloadPdf(target: Quotation) {
    setDownloading(true);
    try {
      await downloadQuotationPdf(target);
    } finally {
      setDownloading(false);
    }
  }

  function handleDownload() {
    return downloadPdf(quotation);
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={quotation.quotationNumber}
        description={lead ? `${lead.customer.fullName} · ${lead.leadId}` : undefined}
        actions={
          <>
            <QuotationStatusBadge status={quotation.status} />
            {lead && (
              <Link to={leadDetailPath(lead.id)} className="text-sm font-semibold text-navy hover:text-orange">
                View Lead
              </Link>
            )}
          </>
        }
      />

      <GlassPanel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Description</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">Unit Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">Amount</th>
                {isDraft && canEdit && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody>
              {items.map((item) =>
                isDraft && canEdit ? (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2">
                      <Input
                        value={item.description}
                        invalid={!item.description.trim()}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        className="h-9"
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground/70">{PRODUCT_CATEGORY_LABEL[item.category]}</td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                        className="h-9 text-right"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })}
                        className="h-9 text-right"
                      />
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-navy">{formatInr(item.quantity * item.unitPrice)}</td>
                    <td className="px-2 py-2">
                      <button type="button" onClick={() => removeItem(item.id)} aria-label="Remove item" className="text-muted-foreground hover:text-error">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-foreground/70">{PRODUCT_CATEGORY_LABEL[item.category]}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatInr(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy">{formatInr(item.amount)}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {isDraft && canEdit && (
          <div className="border-t border-border px-4 py-3">
            <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={addItem}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Line Item
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-1.5 border-t border-border bg-surface-muted/40 px-4 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground/90">{formatInr(subtotal)}</span>
          </div>
          {quotation.subsidyAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Govt. Subsidy</span>
              <span className="font-medium text-green">- {formatInr(quotation.subsidyAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Discount</span>
            {isDraft && canEdit ? (
              <Input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                className="h-8 w-32 text-right"
              />
            ) : (
              <span className="font-medium text-foreground/90">- {formatInr(quotation.discountAmount)}</span>
            )}
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-base">
            <span className="font-bold text-navy">Total Payable</span>
            <span className="font-bold text-navy">{formatInr(isDraft ? totalAmount : quotation.totalAmount)}</span>
          </div>
          {quotation.emiEstimate && (
            <p className="mt-1 text-xs text-muted-foreground">
              Est. EMI {formatInr(quotation.emiEstimate.monthlyEmi)}/month over {quotation.emiEstimate.tenureYears} years
            </p>
          )}
          <p className="text-xs text-muted-foreground">Valid until {formatDate(`${quotation.validUntil}T00:00:00`)}</p>
        </div>
      </GlassPanel>

      <GlassPanel className="p-4">
        <Label htmlFor="quotation-notes">Notes</Label>
        {isDraft && canEdit ? (
          <Textarea id="quotation-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes for the customer…" />
        ) : (
          <p className="text-sm text-foreground/80">{quotation.notes || "—"}</p>
        )}
      </GlassPanel>

      <div className="flex flex-wrap items-center gap-2">
        {isDraft && canEdit && (
          <>
            <Button type="button" variant="secondary" disabled={isMutating || hasInvalidItems} onClick={handleSaveDraft}>
              {updateItems.isPending ? "Saving…" : "Save Draft"}
            </Button>
            <Button type="button" className="gap-1.5" disabled={isMutating || items.length === 0 || hasInvalidItems} onClick={handleSend}>
              <WhatsAppIcon className="h-4 w-4" />
              {sendQuotation.isPending ? "Sending…" : "Send on WhatsApp"}
            </Button>
          </>
        )}

        {isSent && canEdit && (
          <>
            <Button
              type="button"
              className="gap-1.5 bg-green hover:bg-green/90"
              disabled={acceptQuotation.isPending}
              onClick={() => acceptQuotation.mutate(quotation.id)}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {acceptQuotation.isPending ? "Accepting…" : "Mark Accepted"}
            </Button>
            <Button type="button" variant="secondary" className="gap-1.5 text-error" onClick={() => setRejectOpen(true)}>
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Mark Rejected
            </Button>
          </>
        )}

        {!isDraft && (
          <Button type="button" variant="secondary" className="gap-1.5" disabled={downloading} onClick={handleDownload}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {downloading ? "Preparing…" : "Download PDF"}
          </Button>
        )}

        {!isDraft && lead && (
          <>
            <Button type="button" variant="secondary" className="gap-1.5" disabled={sendQuotation.isPending} onClick={deliver}>
              <WhatsAppIcon className="h-4 w-4" />
              {sendQuotation.isPending ? "Sending…" : quotation.whatsappSentAt ? "Resend on WhatsApp" : "Send on WhatsApp"}
            </Button>
            {lead.customer.email && (
              <Button asChild variant="secondary" className="gap-1.5">
                <a
                  href={`mailto:${lead.customer.email}?subject=${encodeURIComponent(
                    `Your Solar Quotation ${quotation.quotationNumber}`,
                  )}&body=${encodeURIComponent(
                    // mailto: can't attach files — link to the PDF when this session has its share link, else ask the sender to attach the downloaded PDF.
                    `Hi ${lead.customer.fullName},\n\nYour solar quotation ${quotation.quotationNumber} is ready (${formatInr(quotation.totalAmount)} net effective price).\n\n${
                      sentInfo ? `View / download the PDF: ${sentInfo.pdfUrl}\n\n` : ""
                    }Thanks,\nGK India SolarTech`,
                  )}`}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email Customer
                </a>
              </Button>
            )}
          </>
        )}
      </div>

      {isDraft && canEdit && (
        <p className="text-xs text-muted-foreground">
          "Send on WhatsApp" marks the quotation sent, moves the lead forward, and shares the PDF file itself — pick WhatsApp and the customer's chat in the share sheet and the PDF goes straight in. If this device can't attach files, it downloads the PDF and opens the chat so you can attach it.
        </p>
      )}

      {isDraft && hasInvalidItems && (
        <p className="text-sm text-error">Every line item needs a description and a quantity greater than 0 before you can save or send this quotation.</p>
      )}

      {sentInfo && (
        <div className="flex flex-col gap-3 rounded-xl border border-green/30 bg-green/5 p-4 text-sm text-navy" role="status">
          <div className="flex items-start gap-3">
            <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#25D366]" />
            <p className="min-w-0 flex-1">
              <strong>Quotation marked as sent.</strong>{" "}
              {preparingPdf
                ? "Preparing the PDF…"
                : pdfFile && canShareFile
                  ? `Share the PDF with ${customerName}: choose WhatsApp and their chat, and the file goes straight in.`
                  : pdfFile
                    ? `This device can't attach files by itself — download the PDF and attach it in ${customerName}'s WhatsApp chat.`
                    : "The PDF couldn't be prepared — use Download PDF below or send the link."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pdfFile && canShareFile && (
              <Button type="button" size="sm" className="gap-1.5 bg-[#25D366] hover:bg-[#1fb857]" onClick={handleShareFile}>
                <WhatsAppIcon className="h-4 w-4" /> Share PDF on WhatsApp
              </Button>
            )}
            {pdfFile && (
              <Button
                type="button"
                size="sm"
                variant={canShareFile ? "secondary" : "primary"}
                className={canShareFile ? "gap-1.5" : "gap-1.5 bg-[#25D366] hover:bg-[#1fb857]"}
                onClick={handleSaveAndOpenChat}
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Download PDF &amp; open WhatsApp chat
              </Button>
            )}
            <Button asChild size="sm" variant="tertiary">
              <a href={sentInfo.whatsappLink} target="_blank" rel="noreferrer">
                Send PDF link instead
              </a>
            </Button>
          </div>
          {savedForChat && pdfFile && (
            <p className="text-xs text-muted-foreground">
              {pdfFile.name} is in your downloads. In WhatsApp tap the paperclip → Document, pick it, then press send.
            </p>
          )}
        </div>
      )}
      {shareError && <p className="text-sm text-error">{shareError}</p>}

      {(updateItems.isError || sendQuotation.isError) && (
        <p className="text-sm text-error">
          {updateItems.error instanceof ApiError
            ? updateItems.error.message
            : sendQuotation.error instanceof ApiError
              ? sendQuotation.error.message
              : "Something went wrong saving this quotation. Please try again."}
        </p>
      )}

      <Modal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Mark Quotation Rejected"
        description="This marks the lead as Lost. A reason helps the team track why quotations don't convert."
        size="sm"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!lostReason || rejectQuotation.isPending}
              className="bg-error hover:bg-error/90"
              onClick={() =>
                rejectQuotation.mutate(
                  { id: quotation.id, lostReason: lostReason || undefined },
                  { onSuccess: () => setRejectOpen(false) },
                )
              }
            >
              {rejectQuotation.isPending ? "Saving…" : "Mark Rejected"}
            </Button>
          </>
        }
      >
        <Label htmlFor="reject-reason">Reason</Label>
        <select
          id="reject-reason"
          value={lostReason}
          onChange={(e) => setLostReason(e.target.value as LostReason)}
          className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
        >
          <option value="">Select a reason</option>
          {Object.entries(LOST_REASON_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Modal>
    </div>
  );
}
