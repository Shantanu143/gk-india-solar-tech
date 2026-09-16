export type DateRangeOption = "today" | "week" | "month" | "quarter";

export const RANGE_OPTIONS: { key: DateRangeOption; label: string; days: number }[] = [
  { key: "today", label: "Today", days: 1 },
  { key: "week", label: "This Week", days: 7 },
  { key: "month", label: "This Month", days: 30 },
  { key: "quarter", label: "This Quarter", days: 90 },
];

export function daysForRange(range: DateRangeOption): number {
  return RANGE_OPTIONS.find((o) => o.key === range)?.days ?? 30;
}
