import { format, formatDistance, formatRelative } from "date-fns";

export function formatDate(date: string | Date, formatStr: string = "MMM d, yyyy"): string {
  return format(new Date(date), formatStr);
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

export function formatRelativeDate(date: string | Date): string {
  return formatRelative(new Date(date), new Date());
}

export function isOverdue(date: string | Date): boolean {
  return new Date(date) < new Date();
}

export function getDaysUntil(date: string | Date): number {
  const diff = new Date(date).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
