import { JWT } from "google-auth-library";

export const SHOWROOM_TIME_ZONE = "America/Los_Angeles";

const SLOT_MINUTES = 60;
const FIRST_HOUR = 10;
const LAST_START_HOUR = 16;
const HORIZON_DAYS = 14;
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

type CivilDate = { year: number; month: number; day: number };
type CivilTime = CivilDate & { hour: number; minute: number };

export type OpenSlot = {
  start: string;
  end: string;
  label: string;
};

type BusyRange = { start: number; end: number };

type Credentials = {
  email: string;
  key: string;
  calendarId: string;
};

export type SlotQueryResult =
  | { configured: false }
  | {
      configured: true;
      slots: OpenSlot[];
      message?: string;
    };

export type BookingResult =
  | { configured: false }
  | { configured: true; booked: false; message: string; slots: OpenSlot[] }
  | {
      configured: true;
      booked: true;
      start: string;
      end: string;
      label: string;
    };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function normalizePrivateKey(rawKey: string) {
  let key = rawKey.trim().replace(/^["']|["']$/g, "");
  // Next.js / dotenv may leave literal \n or already-expanded newlines.
  for (let i = 0; i < 4; i += 1) {
    if (!key.includes("\\n")) break;
    key = key.replace(/\\n/g, "\n");
  }
  return key.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function readCredentials(): Credentials | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();
  if (!email || !calendarId || !rawKey) return null;
  const key = normalizePrivateKey(rawKey);
  if (!key.includes("BEGIN PRIVATE KEY")) return null;
  return { email, key, calendarId };
}

function partsInZone(date: Date) {
  const bag: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat("en-US", {
    timeZone: SHOWROOM_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)) {
    if (part.type !== "literal") bag[part.type] = part.value;
  }
  const hour = Number(bag.hour);
  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
    hour: hour === 24 ? 0 : hour,
    minute: Number(bag.minute),
    weekday: bag.weekday,
  };
}

export function zonedToUtc(time: CivilTime) {
  const utcGuess = Date.UTC(
    time.year,
    time.month - 1,
    time.day,
    time.hour,
    time.minute,
  );
  const observed = partsInZone(new Date(utcGuess));
  const observedUtc = Date.UTC(
    observed.year,
    observed.month - 1,
    observed.day,
    observed.hour,
    observed.minute,
  );
  return new Date(utcGuess - (observedUtc - utcGuess));
}

export function toOffsetIso(date: Date) {
  const parts = partsInZone(date);
  const wall = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
  );
  const offsetMinutes = Math.round((wall - date.getTime()) / 60000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}:00${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
}

function addDays(date: CivilDate, days: number): CivilDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function civilKey(date: CivilDate) {
  return date.year * 10000 + date.month * 100 + date.day;
}

export function parseShowroomDate(value: string): CivilDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function weekdayOf(date: CivilDate) {
  return partsInZone(zonedToUtc({ ...date, hour: 12, minute: 0 })).weekday;
}

function slotLabel(start: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SHOWROOM_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(start);
}

export function buildOpenSlots({
  now,
  busy,
  date,
  limit,
}: {
  now: Date;
  busy: BusyRange[];
  date?: CivilDate;
  limit?: number;
}): { slots: OpenSlot[]; message?: string } {
  const today = partsInZone(now);
  const todayDate = { year: today.year, month: today.month, day: today.day };
  const lastDate = addDays(todayDate, HORIZON_DAYS - 1);

  if (date) {
    const key = civilKey(date);
    if (key < civilKey(todayDate) || key > civilKey(lastDate)) {
      return {
        slots: [],
        message:
          "Showroom visits can be scheduled up to 14 days ahead. Call the showroom for a later date.",
      };
    }
    if (weekdayOf(date) === "Sunday") {
      return { slots: [], message: "The showroom is closed on Sunday." };
    }
  }

  const slots: OpenSlot[] = [];
  for (let offset = 0; offset < HORIZON_DAYS; offset += 1) {
    const day = addDays(todayDate, offset);
    if (date && civilKey(day) !== civilKey(date)) continue;
    if (weekdayOf(day) === "Sunday") continue;

    for (let hour = FIRST_HOUR; hour <= LAST_START_HOUR; hour += 1) {
      const start = zonedToUtc({ ...day, hour, minute: 0 });
      const end = new Date(start.getTime() + SLOT_MINUTES * 60 * 1000);
      if (start.getTime() <= now.getTime()) continue;
      const blocked = busy.some(
        (range) => start.getTime() < range.end && end.getTime() > range.start,
      );
      if (blocked) continue;
      slots.push({
        start: toOffsetIso(start),
        end: toOffsetIso(end),
        label: slotLabel(start),
      });
      if (limit && slots.length >= limit) return { slots };
    }
  }

  if (slots.length === 0) {
    return {
      slots,
      message: date
        ? "There are no open visit times on that day."
        : "There are no open visit times in the next 14 days.",
    };
  }

  return { slots };
}

async function calendarRequest(
  credentials: Credentials,
  path: string,
  body: unknown,
) {
  const auth = new JWT({
    email: credentials.email,
    key: credentials.key,
    scopes: [CALENDAR_SCOPE],
  });
  const access = await auth.getAccessToken();
  if (!access.token) {
    return { ok: false as const, message: "The showroom calendar could not be reached." };
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Google Calendar request failed", response.status, path);
    return { ok: false as const, message: "The showroom calendar could not be reached." };
  }

  return { ok: true as const, json: (await response.json()) as unknown };
}

function windowFor(now: Date, date?: CivilDate) {
  const today = partsInZone(now);
  const startDate = date ?? {
    year: today.year,
    month: today.month,
    day: today.day,
  };
  const endDate = date ?? addDays(startDate, HORIZON_DAYS - 1);
  return {
    timeMin: zonedToUtc({ ...startDate, hour: 0, minute: 0 }).toISOString(),
    timeMax: zonedToUtc({ ...endDate, hour: 17, minute: 0 }).toISOString(),
  };
}

async function readBusy(credentials: Credentials, now: Date, date?: CivilDate) {
  const result = await calendarRequest(credentials, "/freeBusy", {
    ...windowFor(now, date),
    timeZone: SHOWROOM_TIME_ZONE,
    items: [{ id: credentials.calendarId }],
  });
  if (!result.ok) return result;

  const calendars = (result.json as { calendars?: Record<string, {
    busy?: Array<{ start?: string; end?: string }>;
    errors?: unknown[];
  }> }).calendars;
  const calendarIds = calendars ? Object.keys(calendars) : [];
  const calendar =
    calendars?.[credentials.calendarId] ??
    (calendarIds.length === 1 ? calendars?.[calendarIds[0]] : undefined);
  if (!calendar || (calendar.errors && calendar.errors.length > 0)) {
    return {
      ok: false as const,
      message: "The showroom calendar could not be read.",
    };
  }

  const busy: BusyRange[] = [];
  for (const range of calendar.busy ?? []) {
    if (!range.start || !range.end) continue;
    const start = new Date(range.start).getTime();
    const end = new Date(range.end).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) continue;
    busy.push({ start, end });
  }
  return { ok: true as const, busy };
}

export async function listOpenSlots(dateValue?: string): Promise<SlotQueryResult> {
  const credentials = readCredentials();
  if (!credentials) return { configured: false };

  let date: CivilDate | undefined;
  if (dateValue) {
    const parsed = parseShowroomDate(dateValue);
    if (!parsed) {
      return {
        configured: true,
        slots: [],
        message: "Use a date in YYYY-MM-DD format.",
      };
    }
    date = parsed;
  }

  const now = new Date();
  const busy = await readBusy(credentials, now, date);
  if (!busy.ok) {
    return { configured: true, slots: [], message: busy.message };
  }

  const built = buildOpenSlots({
    now,
    busy: busy.busy,
    date,
    limit: date ? undefined : 9,
  });
  if (!date && built.slots.length > 8) {
    return {
      configured: true,
      slots: built.slots.slice(0, 8),
      message:
        "These are the next 8 open times. Ask for a specific date to see the rest of that day.",
    };
  }
  return { configured: true, ...built };
}

export async function bookShowroomVisit(input: {
  start: string;
  name: string;
  email: string;
  phone: string;
  flooringType: string;
  projectType: string;
  notes?: string;
}): Promise<BookingResult> {
  const credentials = readCredentials();
  if (!credentials) return { configured: false };

  const requested = new Date(input.start);
  if (Number.isNaN(requested.getTime())) {
    return {
      configured: true,
      booked: false,
      message: "That time was not recognized. Ask for the open times again.",
      slots: [],
    };
  }

  const requestedParts = partsInZone(requested);
  const date = {
    year: requestedParts.year,
    month: requestedParts.month,
    day: requestedParts.day,
  };
  const now = new Date();
  const busy = await readBusy(credentials, now, date);
  if (!busy.ok) {
    return { configured: true, booked: false, message: busy.message, slots: [] };
  }

  const built = buildOpenSlots({ now, busy: busy.busy, date });
  const match = built.slots.find(
    (slot) => Math.abs(new Date(slot.start).getTime() - requested.getTime()) < 1000,
  );
  if (!match) {
    return {
      configured: true,
      booked: false,
      message: built.message ?? "That time is not open.",
      slots: built.slots,
    };
  }

  const description = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Flooring: ${input.flooringType}`,
    `Project: ${input.projectType}`,
    input.notes ? `Notes: ${input.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const created = await calendarRequest(
    credentials,
    `/calendars/${encodeURIComponent(credentials.calendarId)}/events`,
    {
      summary: `Showroom visit — ${input.name}`,
      description,
      start: { dateTime: match.start, timeZone: SHOWROOM_TIME_ZONE },
      end: { dateTime: match.end, timeZone: SHOWROOM_TIME_ZONE },
    },
  );
  if (!created.ok) {
    return {
      configured: true,
      booked: false,
      message: "That time could not be reserved. Please call the showroom.",
      slots: built.slots,
    };
  }

  return {
    configured: true,
    booked: true,
    start: match.start,
    end: match.end,
    label: match.label,
  };
}
