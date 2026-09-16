import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/features/crm/components/EmptyState";

interface ComingSoonTabProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Used for tabs whose full feature (Survey, Quotation, Documents) hasn't been built yet — never a dead end. */
export function ComingSoonTab({ icon, title, description }: ComingSoonTabProps) {
  return <EmptyState icon={icon} title={title} description={description} className="py-16" />;
}
