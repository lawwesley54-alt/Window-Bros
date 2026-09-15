const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const DAY_RE = /\b(sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat)[a-z]*\b/i;

const TIME_RANGE_RE =
  /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|–|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;

interface TimeOfDay {
  hour24: number;
  minute: number;
}

function resolveTimeRange(
  h1: number,
  m1: number,
  mer1: string | undefined,
  h2: number,
  m2: number,
  mer2: string | undefined,
): { start: TimeOfDay; end: TimeOfDay } {
  function to24(hour: number, meridiem: string): number {
    const h = hour % 12;
    return meridiem === "pm" ? h + 12 : h;
  }

  // Default assumption when neither side specifies am/pm: a sale runs
  // from morning into afternoon (the overwhelmingly common real case).
  let startMer = mer1?.toLowerCase() ?? mer2?.toLowerCase() ?? "am";
  let endMer = mer2?.toLowerCase() ?? mer1?.toLowerCase() ?? "pm";

  let startHour24 = to24(h1, startMer);
  let endHour24 = to24(h2, endMer);

  // If that produces a non-positive (or absurdly short) duration and
  // meridiems were inferred rather than explicit, flip the inferred side.
  if (endHour24 * 60 + m2 <= startHour24 * 60 + m1) {
    if (!mer2) {
      endMer = startMer === "am" ? "pm" : "am";
      endHour24 = to24(h2, endMer);
    } else if (!mer1) {
      startMer = endMer === "am" ? "pm" : "am";
      startHour24 = to24(h1, startMer);
    }
  }

  return {
    start: { hour24: startHour24, minute: m1 },
    end: { hour24: endHour24, minute: m2 },
  };
}

/**
 * Finds the next date on/after `reference` (inclusive) whose weekday
 * matches the given day name (e.g. "Sat"). Multi-day spans ("Fri-Sat")
 * only use the first day mentioned — a deliberate simplification.
 */
function nextDateForWeekday(reference: Date, dayToken: string): Date {
  const target = WEEKDAYS.findIndex((d) => dayToken.toLowerCase().startsWith(d));
  if (target === -1) return reference;

  const refDay = reference.getDay();
  const diff = (target - refDay + 7) % 7;
  const result = new Date(reference);
  result.setDate(result.getDate() + diff);
  return result;
}

export interface ExtractedTimeWindow {
  startsAt: string;
  endsAt: string;
}

/**
 * Best-effort extraction of a sale's date/time window from free-text
 * (e.g. a Craigslist title or Reddit post body) like "Sat 8am-2pm" or
 * "Saturday 9-3". Returns null when no time range is found, so callers
 * can fall back to a cruder heuristic.
 */
export function extractTimeWindow(
  text: string,
  reference: Date,
): ExtractedTimeWindow | null {
  const timeMatch = TIME_RANGE_RE.exec(text);
  if (!timeMatch) return null;

  const [, h1, min1, mer1, h2, min2, mer2] = timeMatch;
  const { start, end } = resolveTimeRange(
    parseInt(h1, 10),
    min1 ? parseInt(min1, 10) : 0,
    mer1,
    parseInt(h2, 10),
    min2 ? parseInt(min2, 10) : 0,
    mer2,
  );

  const dayMatch = DAY_RE.exec(text);
  const baseDate = dayMatch ? nextDateForWeekday(reference, dayMatch[1]) : reference;

  const startsAt = new Date(baseDate);
  startsAt.setHours(start.hour24, start.minute, 0, 0);
  const endsAt = new Date(baseDate);
  endsAt.setHours(end.hour24, end.minute, 0, 0);

  return { startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() };
}

const ADDRESS_RE =
  /\b\d{1,6}\s+(?:[A-Z][a-zA-Z']*\s){1,4}(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Boulevard|Blvd|Lane|Ln|Court|Ct|Way|Place|Pl|Parkway|Pkwy|Circle|Cir|Terrace|Ter)\.?\b/;

const BLOCK_RE = /\b\d{1,6}00?\s+[Bb]lock\s+of\s+(?:[A-Z][a-zA-Z']*\s?){1,4}/;

/** Best-effort street address extraction from free text. Returns null when nothing looks like an address. */
export function extractAddress(text: string): string | null {
  const block = BLOCK_RE.exec(text);
  if (block) return block[0].trim();

  const address = ADDRESS_RE.exec(text);
  if (address) return address[0].trim();

  return null;
}
