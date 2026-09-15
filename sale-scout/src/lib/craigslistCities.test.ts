import { describe, expect, it } from "vitest";
import { nearestCraigslistCity } from "./craigslistCities";

describe("nearestCraigslistCity", () => {
  it("picks the exact city when the point matches its center", () => {
    const city = nearestCraigslistCity({ lat: 30.2672, lng: -97.7431 });
    expect(city.subdomain).toBe("austin");
  });

  it("picks the closest city for a nearby point", () => {
    const city = nearestCraigslistCity({ lat: 40.73, lng: -74.0 });
    expect(city.subdomain).toBe("newyork");
  });

  it("still returns a city for a far-flung point (nearest fallback)", () => {
    const city = nearestCraigslistCity({ lat: 64.2008, lng: -149.4937 });
    expect(city.subdomain).toBeTruthy();
  });
});
