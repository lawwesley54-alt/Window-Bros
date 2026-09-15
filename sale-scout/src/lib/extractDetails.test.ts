import { describe, expect, it } from "vitest";
import { extractAddress, extractTimeWindow } from "./extractDetails";

// A fixed Tuesday reference date for deterministic weekday math.
const REFERENCE = new Date("2026-09-15T12:00:00");

describe("extractTimeWindow", () => {
  it("parses an explicit am/pm range", () => {
    const result = extractTimeWindow("Garage sale Sat 8am-2pm", REFERENCE);
    expect(result).not.toBeNull();
    const start = new Date(result!.startsAt);
    const end = new Date(result!.endsAt);
    expect(start.getHours()).toBe(8);
    expect(end.getHours()).toBe(14);
  });

  it("infers am-then-pm when neither side has a marker", () => {
    const result = extractTimeWindow("Estate sale Saturday 9-3", REFERENCE);
    expect(result).not.toBeNull();
    const start = new Date(result!.startsAt);
    const end = new Date(result!.endsAt);
    expect(start.getHours()).toBe(9);
    expect(end.getHours()).toBe(15);
  });

  it("infers the missing meridiem from the marked side", () => {
    const result = extractTimeWindow("Yard sale 8-2pm", REFERENCE);
    expect(result).not.toBeNull();
    const start = new Date(result!.startsAt);
    const end = new Date(result!.endsAt);
    expect(start.getHours()).toBe(8);
    expect(end.getHours()).toBe(14);
  });

  it("moves the date forward to the next matching weekday", () => {
    // REFERENCE is a Tuesday; "Sat" should land on the coming Saturday.
    const result = extractTimeWindow("Multi-family sale Sat 8am-1pm", REFERENCE);
    expect(result).not.toBeNull();
    const start = new Date(result!.startsAt);
    expect(start.getDay()).toBe(6); // Saturday
    expect(start >= REFERENCE).toBe(true);
  });

  it("uses the reference date when no weekday is mentioned", () => {
    const result = extractTimeWindow("Garage sale 8am-2pm", REFERENCE);
    expect(result).not.toBeNull();
    const start = new Date(result!.startsAt);
    expect(start.getDate()).toBe(REFERENCE.getDate());
  });

  it("returns null when no time range is present", () => {
    expect(extractTimeWindow("Big garage sale this weekend, lots of stuff", REFERENCE)).toBeNull();
  });
});

describe("extractAddress", () => {
  it("extracts a standard street address", () => {
    expect(extractAddress("Huge sale at 1234 Main St, everything must go")).toBe(
      "1234 Main St",
    );
  });

  it("extracts a 'block of' style address", () => {
    expect(extractAddress("Sale at the 1200 block of Elm Street this weekend")).toContain(
      "1200 block of Elm Street",
    );
  });

  it("returns null when no address-like text is present", () => {
    expect(extractAddress("Garage sale Saturday, lots of tools and furniture")).toBeNull();
  });
});
