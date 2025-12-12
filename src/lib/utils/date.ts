import { format, formatDistance, parseISO, isValid } from "date-fns";
import { de } from "date-fns/locale";

/**
 * Formats a date to Swiss format (DD.MM.YYYY)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "-";

  return format(dateObj, "dd.MM.yyyy", { locale: de });
}

/**
 * Formats a date with time to Swiss format (DD.MM.YYYY HH:mm)
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "-";

  return format(dateObj, "dd.MM.yyyy HH:mm", { locale: de });
}

/**
 * Formats a date to long Swiss format (e.g., "15. Januar 2024")
 */
export function formatDateLong(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "-";

  return format(dateObj, "d. MMMM yyyy", { locale: de });
}

/**
 * Formats a relative time (e.g., "vor 3 Tagen", "in 2 Wochen")
 */
export function formatRelativeTime(
  date: Date | string | null | undefined
): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "-";

  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: de,
  });
}

/**
 * Formats a date range to Swiss format
 */
export function formatDateRange(
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined
): string {
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  if (formattedStart === "-" && formattedEnd === "-") return "-";
  if (formattedStart === "-") return `bis ${formattedEnd}`;
  if (formattedEnd === "-") return `ab ${formattedStart}`;

  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Converts a date to ISO date string for HTML input[type="date"]
 */
export function toDateInputValue(
  date: Date | string | null | undefined
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "";

  return format(dateObj, "yyyy-MM-dd");
}

/**
 * Checks if a date is in the past
 */
export function isPastDate(date: Date | string | null | undefined): boolean {
  if (!date) return false;

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;

  return dateObj < new Date();
}

/**
 * Checks if a date is in the future
 */
export function isFutureDate(date: Date | string | null | undefined): boolean {
  if (!date) return false;

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;

  return dateObj > new Date();
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date | string | null | undefined): boolean {
  if (!date) return false;

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;

  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}
