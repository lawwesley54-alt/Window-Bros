import { useState } from "react";
import type { FormEvent } from "react";
import type { SaleCategory } from "../types";

const CATEGORIES: { value: SaleCategory; label: string }[] = [
  { value: "garage", label: "Garage" },
  { value: "estate", label: "Estate" },
  { value: "moving", label: "Moving" },
  { value: "yard", label: "Yard" },
  { value: "other", label: "Other" },
];

interface FilterBarProps {
  activeCategories: Set<SaleCategory>;
  onToggleCategory: (category: SaleCategory) => void;
  radiusMiles: number;
  onRadiusChange: (miles: number) => void;
  minScore: number;
  onMinScoreChange: (score: number) => void;
  onSearch: (query: string) => void;
  onUseMyLocation: () => void;
  searching: boolean;
}

export default function FilterBar({
  activeCategories,
  onToggleCategory,
  radiusMiles,
  onRadiusChange,
  minScore,
  onMinScoreChange,
  onSearch,
  onUseMyLocation,
  searching,
}: FilterBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <div className="filter-bar">
      <form onSubmit={handleSubmit} className="filter-row">
        <div style={{ flex: 1 }}>
          <label htmlFor="location-search">Search location</label>
          <input
            id="location-search"
            type="text"
            placeholder="City, zip, or address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>
      <div className="filter-row">
        <button
          type="button"
          className="filter-chip"
          onClick={onUseMyLocation}
          disabled={searching}
        >
          📍 Use my location
        </button>
      </div>

      <div>
        <label>Category</label>
        <div className="filter-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={`filter-chip${activeCategories.has(cat.value) ? " active" : ""}`}
              onClick={() => onToggleCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <div style={{ flex: 1 }}>
          <label htmlFor="radius">Radius: {radiusMiles} mi</label>
          <input
            id="radius"
            type="range"
            min={1}
            max={25}
            value={radiusMiles}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="min-score">Min. likelihood: {minScore}%</label>
          <input
            id="min-score"
            type="range"
            min={0}
            max={100}
            step={5}
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
