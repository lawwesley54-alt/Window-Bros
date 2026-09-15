export type SaleCategory =
  | "garage"
  | "estate"
  | "moving"
  | "yard"
  | "other";

export type SaleSource =
  | "user"
  | "craigslist"
  | "estatesales.net"
  | "estatesales.org"
  | "facebook"
  | "reddit";

export interface SaleVotes {
  /** Number of users who reported the sale is still going, recently. */
  stillHere: number;
  /** Number of users who reported the sale is over, recently. */
  over: number;
}

export interface Sale {
  id: string;
  title: string;
  category: SaleCategory;
  /** Display address. Can be a neighborhood-level approximation before the sale opens. */
  address: string;
  lat: number;
  lng: number;
  /** ISO 8601 datetime the sale is scheduled to start. */
  startsAt: string;
  /** ISO 8601 datetime the sale is scheduled to end. */
  endsAt: string;
  source: SaleSource;
  sourceUrl?: string;
  photos?: string[];
  description?: string;
  /** ISO 8601 datetime the listing was first posted. */
  postedAt: string;
  /** ISO 8601 datetime the listing was last confirmed/updated by its source. */
  updatedAt: string;
  /** How many independent sources reported the same sale (address + date match). */
  corroboratingSources: number;
  votes: SaleVotes;
}

export interface ScoreBreakdown {
  /** Final clamped 0-100 score. */
  score: number;
  /** Human-readable factors that produced the score, for UI transparency. */
  reasons: string[];
}

/** A Sale with its computed likelihood score attached, as used throughout the UI. */
export type ScoredSale = Sale & ScoreBreakdown;
