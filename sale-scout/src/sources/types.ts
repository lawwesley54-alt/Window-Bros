import type { Sale } from "../types";

export interface SaleSearchParams {
  /** Center latitude to search around. */
  lat: number;
  /** Center longitude to search around. */
  lng: number;
  /** Search radius in miles. */
  radiusMiles: number;
}

/**
 * A pluggable listing source. Each adapter is responsible for turning
 * whatever a source exposes (RSS, an authorized API, user submissions)
 * into normalized `Sale` records. The map/scoring UI never talks to a
 * source directly — only through this interface — so a new source can be
 * added without touching any rendering or scoring code.
 */
export interface SaleSourceAdapter {
  id: Sale["source"];
  label: string;
  fetchSales(params: SaleSearchParams): Promise<Sale[]>;
}
