import type { Sale, ScoreBreakdown } from "../types";

const HOUR_MS = 60 * 60 * 1000;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * How active the posted time window makes the sale look, before any other
 * signal is applied. Three regimes: not started yet, currently within the
 * posted window, or past the posted end time (which decays fast — most
 * sales that say "9am-1pm" really do wind down close to 1pm).
 */
function timeWindowScore(
  sale: Sale,
  now: Date,
): { value: number; reason: string } {
  const startsAt = new Date(sale.startsAt).getTime();
  const endsAt = new Date(sale.endsAt).getTime();
  const nowMs = now.getTime();

  if (nowMs < startsAt) {
    const hoursUntilStart = (startsAt - nowMs) / HOUR_MS;
    if (hoursUntilStart <= 48) {
      const value = 55 + clamp(48 - hoursUntilStart, 0, 48) * 0.3;
      return {
        value: clamp(value, 55, 70),
        reason: `Upcoming — starts in ${Math.round(hoursUntilStart)}h`,
      };
    }
    const daysOut = hoursUntilStart / 24;
    return {
      value: clamp(50 - daysOut * 3, 15, 55),
      reason: `Scheduled ${Math.round(daysOut)} day(s) out`,
    };
  }

  if (nowMs <= endsAt) {
    const totalWindow = Math.max(endsAt - startsAt, HOUR_MS);
    const elapsed = nowMs - startsAt;
    const remainingFraction = clamp(1 - elapsed / totalWindow, 0, 1);
    const value = 80 + 15 * remainingFraction;
    return {
      value,
      reason: `Currently within posted hours (${Math.round(
        (1 - remainingFraction) * 100,
      )}% elapsed)`,
    };
  }

  const hoursPast = (nowMs - endsAt) / HOUR_MS;
  const value = clamp(70 * Math.exp(-hoursPast / 3), 2, 70);
  return {
    value,
    reason: `${Math.round(hoursPast)}h past the posted end time`,
  };
}

function freshnessAdjustment(
  sale: Sale,
  now: Date,
): { value: number; reason: string | null } {
  const lastTouch = new Date(sale.updatedAt ?? sale.postedAt).getTime();
  const hoursSince = (now.getTime() - lastTouch) / HOUR_MS;

  if (hoursSince <= 6) {
    return { value: 5, reason: `Confirmed ${Math.round(hoursSince)}h ago` };
  }
  if (hoursSince <= 24) {
    return { value: 0, reason: null };
  }
  if (hoursSince <= 72) {
    return {
      value: -10,
      reason: `No update in ${Math.round(hoursSince / 24)} day(s)`,
    };
  }
  return {
    value: -20,
    reason: `Stale listing — no update in ${Math.round(hoursSince / 24)} days`,
  };
}

function corroborationAdjustment(sale: Sale): {
  value: number;
  reason: string | null;
} {
  if (sale.corroboratingSources <= 1) {
    return { value: 0, reason: null };
  }
  const value = clamp((sale.corroboratingSources - 1) * 4, 0, 10);
  return {
    value,
    reason: `Corroborated by ${sale.corroboratingSources} sources`,
  };
}

function voteAdjustment(sale: Sale): { value: number; reason: string | null } {
  const net = sale.votes.stillHere - sale.votes.over;
  if (net === 0) {
    return { value: 0, reason: null };
  }
  const value = clamp(net * 3, -25, 25);
  const direction = net > 0 ? "say it's still going" : "say it's over";
  return {
    value,
    reason: `${Math.abs(net)} net user vote(s) ${direction}`,
  };
}

/**
 * Computes a transparent 0-100 "likelihood this sale is still active"
 * score for a listing at a given point in time. Every contributing
 * factor is pure and testable in isolation; this function just combines
 * them and clamps the result.
 */
export function computeLikelihoodScore(
  sale: Sale,
  now: Date = new Date(),
): ScoreBreakdown {
  const time = timeWindowScore(sale, now);
  const freshness = freshnessAdjustment(sale, now);
  const corroboration = corroborationAdjustment(sale);
  const votes = voteAdjustment(sale);

  const raw = time.value + freshness.value + corroboration.value + votes.value;
  const score = Math.round(clamp(raw, 0, 100));

  const reasons = [time.reason, freshness.reason, corroboration.reason, votes.reason].filter(
    (r): r is string => r !== null,
  );

  return { score, reasons };
}

export type ScoreBucket = "high" | "mid" | "low";

export function scoreBucket(score: number): ScoreBucket {
  if (score >= 70) return "high";
  if (score >= 40) return "mid";
  return "low";
}
