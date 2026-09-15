import { useEffect, useMemo, useState } from "react";
import type { LatLngBounds, LatLngBoundsExpression, LatLngTuple } from "leaflet";
import MapView from "./components/MapView";
import FilterBar from "./components/FilterBar";
import SaleList from "./components/SaleList";
import { mockSource } from "./sources/mockSource";
import { computeLikelihoodScore } from "./lib/scoring";
import { distanceMiles } from "./lib/geo";
import { geocodeAddress } from "./lib/geocode";
import type { Sale, SaleCategory, ScoredSale } from "./types";

const DEFAULT_CENTER: LatLngTuple = [30.2672, -97.7431];
const ALL_CATEGORIES: SaleCategory[] = ["garage", "estate", "moving", "yard", "other"];
const SCORE_REFRESH_MS = 30_000;

type VoteOverrides = Record<string, { stillHere: number; over: number }>;

export default function App() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [center, setCenter] = useState<LatLngTuple>(DEFAULT_CENTER);
  const [radiusMiles, setRadiusMiles] = useState(10);
  const [activeCategories, setActiveCategories] = useState<Set<SaleCategory>>(
    new Set(ALL_CATEGORIES),
  );
  const [minScore, setMinScore] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [voteOverrides, setVoteOverrides] = useState<VoteOverrides>({});
  const [searching, setSearching] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Locating you…");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLabel("Austin, TX (demo — location unavailable)");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setLocationLabel("Your location");
      },
      () => setLocationLabel("Austin, TX (demo — location denied)"),
      { timeout: 8000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mockSource.fetchSales({ lat: center[0], lng: center[1], radiusMiles }).then(setSales);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1]]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), SCORE_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const scoredSales: ScoredSale[] = useMemo(() => {
    return sales.map((sale) => {
      const votes = voteOverrides[sale.id]
        ? {
            stillHere: sale.votes.stillHere + voteOverrides[sale.id].stillHere,
            over: sale.votes.over + voteOverrides[sale.id].over,
          }
        : sale.votes;
      const withVotes = { ...sale, votes };
      const { score, reasons } = computeLikelihoodScore(withVotes, now);
      return { ...withVotes, score, reasons };
    });
  }, [sales, voteOverrides, now]);

  const withinRadius = useMemo(() => {
    return scoredSales.filter((sale) => {
      if (!activeCategories.has(sale.category)) return false;
      if (sale.score < minScore) return false;
      const miles = distanceMiles({ lat: center[0], lng: center[1] }, sale);
      return miles <= radiusMiles;
    });
  }, [scoredSales, activeCategories, minScore, center, radiusMiles]);

  const visibleOnMap = withinRadius;

  const listSales = useMemo(() => {
    if (!bounds) return withinRadius;
    return withinRadius.filter((sale) => bounds.contains([sale.lat, sale.lng]));
  }, [withinRadius, bounds]);

  function toggleCategory(category: SaleCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function handleVote(id: string, kind: "stillHere" | "over") {
    setVoteOverrides((prev) => {
      const current = prev[id] ?? { stillHere: 0, over: 0 };
      return {
        ...prev,
        [id]: { ...current, [kind]: current[kind] + 1 },
      };
    });
  }

  async function handleSearch(query: string) {
    setSearching(true);
    try {
      const result = await geocodeAddress(query);
      if (result) {
        setCenter([result.lat, result.lng]);
        setLocationLabel(result.label);
      }
    } finally {
      setSearching(false);
    }
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setLocationLabel("Your location");
        setSearching(false);
      },
      () => setSearching(false),
      { timeout: 8000 },
    );
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="brand">
          <h1>Sale Scout</h1>
          <span>{locationLabel}</span>
        </div>
        <div className="legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: "#3ecf8e" }} />
            Likely active (70%+)
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: "#f0b429" }} />
            Uncertain (40-69%)
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: "#949cab" }} />
            Probably over (&lt;40%)
          </span>
          <span>
            {visibleOnMap.length} sale(s) within {radiusMiles} mi
          </span>
        </div>
      </div>
      <div className="main-layout">
        <aside className="sidebar">
          <FilterBar
            activeCategories={activeCategories}
            onToggleCategory={toggleCategory}
            radiusMiles={radiusMiles}
            onRadiusChange={setRadiusMiles}
            minScore={minScore}
            onMinScoreChange={setMinScore}
            onSearch={handleSearch}
            onUseMyLocation={handleUseMyLocation}
            searching={searching}
          />
          <SaleList sales={listSales} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>
        <div className="map-pane">
          <MapView
            sales={visibleOnMap}
            center={center}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onVote={handleVote}
            onBoundsChange={(b: LatLngBoundsExpression) => setBounds(b as LatLngBounds)}
          />
        </div>
      </div>
    </div>
  );
}
