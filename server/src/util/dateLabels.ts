const IST_TIMEZONE = "Asia/Kolkata";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: IST_TIMEZONE });
const timeFormatter = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: IST_TIMEZONE });

/** Human-readable date for activity-log descriptions — mirrors `client/src/lib/format.ts`'s `formatDate`. */
export function formatDateLabel(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`));
}

/** `date` + `time` ("HH:mm") combined into a human-readable time label. */
export function formatTimeLabel(isoDate: string, time: string): string {
  return timeFormatter.format(new Date(`${isoDate}T${time}:00`));
}
