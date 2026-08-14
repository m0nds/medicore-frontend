import type { AppointmentStatus } from "@/types/appointment.type";

// Generate and download an .ics calendar file for the booked appointment.
export function downloadIcs(opts: {
  title: string;
  start: Date;
  durationMin: number;
  description?: string;
}) {
  const stamp = (d: Date) =>
    `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
  const end = new Date(opts.start.getTime() + opts.durationMin * 60_000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MediCore//Appointment//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(opts.start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${opts.title}`,
    opts.description
      ? `DESCRIPTION:${opts.description.replace(/\n/g, "\\n")}`
      : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const url = URL.createObjectURL(
    new Blob([ics], { type: "text/calendar;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "medicore-appointment.ics";
  a.click();
  URL.revokeObjectURL(url);
}

// Pre-filled Google Calendar event (opens the "create event" page — no .ics needed).
export function googleCalendarUrl(opts: {
  title: string;
  start: Date;
  durationMin: number;
  description?: string;
}) {
  const stamp = (d: Date) =>
    `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
  const end = new Date(opts.start.getTime() + opts.durationMin * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${stamp(opts.start)}/${stamp(end)}`,
  });
  if (opts.description) params.set("details", opts.description);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Standard clinic hours — placeholder until the backend exposes real availability.
export const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const h = 9 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

export const initialsOf = (name?: string) =>
  (name ?? "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

export const to12h = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
};

export const combineDateTime = (date: Date, time: string) => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
};

// Shared semantic badge variants — single source of truth for status pills.
export const STATUS_VARIANT: Record<
  AppointmentStatus,
  'success' | 'info' | 'progress' | 'neutral' | 'danger' | 'muted'
> = {
  SCHEDULED: 'info',
  CONFIRMED: 'success',
  IN_PROGRESS: 'progress',
  COMPLETED: 'neutral',
  CANCELLED: 'danger',
  NO_SHOW: 'muted',
};

export function dateFormatter(dateStr: string | null | undefined) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);

  const timeZone = 'Africa/Lagos';

  // 1. Get the day with the correct timezone
  const day = parseInt(
    new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone }).format(date)
  );

  const getSuffix = (d: number) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  // 2. Format the Month, Year, and Time with the correct timezone
  const month = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone,
  }).format(date);
  const year = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone,
  }).format(date);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(date);

  // 3. Combine into "5th Jul, 2024 12:00 AM"
  return `${day}${getSuffix(day)} ${month}, ${year} ${time}`;
}

export function shortDateFormatter(dateStr: string | null | undefined) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);

  const timeZone = 'Africa/Lagos';

  const day = parseInt(
    new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone }).format(date)
  );

  const getSuffix = (d: number) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const month = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone,
  }).format(date);
  const year = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone,
  }).format(date);

  return `${day}${getSuffix(day)} ${month}, ${year}`;
}

export function numberWithCommas2(n: number | string) {
  const val = Math.round(Number(n) * 100) / 100;

  const parts = val.toString().split('.');

  const num =
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (parts[1] ? '.' + parts[1] : '');

  return num;
}

export function numberWithCommas(n: number | string) {
  const num = Number(parseFloat(n.toString()).toFixed(2)).toLocaleString('en', {
    minimumFractionDigits: 2,
  });

  return num;
}