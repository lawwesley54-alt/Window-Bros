import type { SaleSourceAdapter } from "./types";
import { generateMockSales } from "../data/mockSales";

/**
 * Stand-in "user submissions + seed data" source so the app is fully
 * demoable without any live network access. Swap or add real adapters
 * (see craigslistRssAdapter.ts) behind the same SaleSourceAdapter
 * interface — the UI doesn't need to change.
 */
export const mockSource: SaleSourceAdapter = {
  id: "user",
  label: "Demo listings",
  async fetchSales(params) {
    return generateMockSales({ lat: params.lat, lng: params.lng });
  },
};
