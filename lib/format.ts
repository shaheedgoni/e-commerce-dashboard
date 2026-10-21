const formatDateVar = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatDateTimeVar = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  year: "numeric",
});

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export function formatDate(date: string) {
  return formatDateVar.format(new Date(date));
}

export function formatDateTime(date: string) {
  return formatDateTimeVar.format(new Date(date));
}

export function formatNaira(kobo: number) {
  return naira.format(kobo / 100);
}
