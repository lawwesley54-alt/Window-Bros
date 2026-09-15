import { describe, expect, it } from "vitest";
import { computeLikelihoodScore, scoreBucket } from "./scoring";
import type { Sale } from "../types";

function makeSale(overrides: Partial<Sale> = {}): Sale {
  const now = Date.now();
  return {
    id: "test",
    title: "Test sale",
    category: "garage",
    address: "123 Test St",
    lat: 0,
    lng: 0,
    startsAt: new Date(now - 2 * 3600_000).toISOString(),
    endsAt: new Date(now + 2 * 3600_000).toISOString(),
    source: "user",
    postedAt: new Date(now - 20 * 3600_000).toISOString(),
    updatedAt: new Date(now - 1 * 3600_000).toISOString(),
    corroboratingSources: 1,
    votes: { stillHere: 0, over: 0 },
    ...overrides,
  };
}

describe("computeLikelihoodScore", () => {
  it("scores a sale mid-window, recently confirmed, highly", () => {
    const sale = makeSale();
    const { score } = computeLikelihoodScore(sale);
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it("scores a sale well past its end time low", () => {
    const now = Date.now();
    const sale = makeSale({
      startsAt: new Date(now - 10 * 3600_000).toISOString(),
      endsAt: new Date(now - 8 * 3600_000).toISOString(),
      updatedAt: new Date(now - 8 * 3600_000).toISOString(),
    });
    const { score } = computeLikelihoodScore(sale);
    expect(score).toBeLessThan(30);
  });

  it("gives an upcoming sale a moderate, not high, score", () => {
    const now = Date.now();
    const sale = makeSale({
      startsAt: new Date(now + 4 * 3600_000).toISOString(),
      endsAt: new Date(now + 8 * 3600_000).toISOString(),
      updatedAt: new Date(now - 1 * 3600_000).toISOString(),
    });
    const { score } = computeLikelihoodScore(sale);
    expect(score).toBeGreaterThanOrEqual(40);
    expect(score).toBeLessThan(75);
  });

  it("penalizes stale, unconfirmed listings", () => {
    const now = Date.now();
    const fresh = makeSale({ updatedAt: new Date(now - 1 * 3600_000).toISOString() });
    const stale = makeSale({ updatedAt: new Date(now - 96 * 3600_000).toISOString() });
    expect(computeLikelihoodScore(stale).score).toBeLessThan(
      computeLikelihoodScore(fresh).score,
    );
  });

  it("boosts score with corroborating sources", () => {
    const solo = makeSale({ corroboratingSources: 1 });
    const corroborated = makeSale({ corroboratingSources: 4 });
    expect(computeLikelihoodScore(corroborated).score).toBeGreaterThan(
      computeLikelihoodScore(solo).score,
    );
  });

  it("shifts score up when net user votes say it's still going", () => {
    const noVotes = makeSale();
    const positiveVotes = makeSale({ votes: { stillHere: 10, over: 0 } });
    expect(computeLikelihoodScore(positiveVotes).score).toBeGreaterThan(
      computeLikelihoodScore(noVotes).score,
    );
  });

  it("shifts score down when net user votes say it's over", () => {
    const noVotes = makeSale();
    const negativeVotes = makeSale({ votes: { stillHere: 0, over: 10 } });
    expect(computeLikelihoodScore(negativeVotes).score).toBeLessThan(
      computeLikelihoodScore(noVotes).score,
    );
  });

  it("always returns a score clamped between 0 and 100", () => {
    const now = Date.now();
    const extreme = makeSale({
      startsAt: new Date(now - 500 * 3600_000).toISOString(),
      endsAt: new Date(now - 499 * 3600_000).toISOString(),
      updatedAt: new Date(now - 500 * 3600_000).toISOString(),
      corroboratingSources: 1,
      votes: { stillHere: 0, over: 50 },
    });
    const { score } = computeLikelihoodScore(extreme);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("produces human-readable reasons", () => {
    const { reasons } = computeLikelihoodScore(makeSale());
    expect(reasons.length).toBeGreaterThan(0);
    for (const reason of reasons) {
      expect(typeof reason).toBe("string");
    }
  });
});

describe("scoreBucket", () => {
  it("buckets scores into high/mid/low", () => {
    expect(scoreBucket(90)).toBe("high");
    expect(scoreBucket(55)).toBe("mid");
    expect(scoreBucket(10)).toBe("low");
  });
});
