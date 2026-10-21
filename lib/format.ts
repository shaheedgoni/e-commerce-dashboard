const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}

export function formatDateTime(date: string) {
  return dateTimeFormatter.format(new Date(date));
}

export function formatNaira(kobo: number) {
  return nairaFormatter.format(kobo / 100);
}

export function captilaze(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getInitials(firstName: string, lastName: string) {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}
