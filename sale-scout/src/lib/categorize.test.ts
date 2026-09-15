import { describe, expect, it } from "vitest";
import { guessCategory } from "./categorize";

describe("guessCategory", () => {
  it("detects estate sales", () => {
    expect(guessCategory("Big ESTATE SALE this weekend")).toBe("estate");
  });

  it("detects moving sales", () => {
    expect(guessCategory("Moving sale — everything must go")).toBe("moving");
  });

  it("detects yard sales", () => {
    expect(guessCategory("Yard sale Saturday 8am")).toBe("yard");
  });

  it("detects garage sales", () => {
    expect(guessCategory("Multi-family garage sale")).toBe("garage");
  });

  it("falls back to other when nothing matches", () => {
    expect(guessCategory("Free furniture, come pick up")).toBe("other");
  });

  it("prioritizes estate over garage when both words appear", () => {
    expect(guessCategory("Estate sale in the garage and yard")).toBe("estate");
  });
});
