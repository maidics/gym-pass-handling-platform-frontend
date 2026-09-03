import i18n from "i18next";

export function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const d = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateTime(date: Date | string | null | undefined) {
  const d = toDate(date);
  if (!d) return "—";

  return new Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatTimeOnly(date: Date | string | null | undefined) {
  const d = toDate(date);
  if (!d) return "—";

  return new Intl.DateTimeFormat(i18n.language, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDateOnly(d: Date | null | undefined) {
  if (!d) return "—";

  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  ).toLocaleDateString(i18n.language, {});
}
