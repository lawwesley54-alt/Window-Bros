import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { type LatLngBoundsExpression, type LatLngTuple } from "leaflet";
import type { ScoredSale } from "../types";
import { scoreBucket } from "../lib/scoring";
import { categoryThumbnail } from "../lib/categoryArt";
import { directionsUrl } from "../lib/geo";

const BUCKET_COLOR: Record<string, string> = {
  high: "#3ecf8e",
  mid: "#f0b429",
  low: "#949cab",
};

function createSaleIcon(score: number) {
  const bucket = scoreBucket(score);
  const color = BUCKET_COLOR[bucket];
  const size = bucket === "high" ? 34 : bucket === "mid" ? 28 : 22;

  return L.divIcon({
    className: "sale-marker",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};color:#0f1115;font-weight:700;
      display:flex;align-items:center;justify-content:center;
      font-size:${size > 28 ? 11 : 9}px;
      border:2px solid rgba(15,17,21,0.6);
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    ">${score}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function Recenter({ center }: { center: LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1]]);
  return null;
}

function BoundsWatcher({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: LatLngBoundsExpression) => void;
}) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
  });
  useEffect(() => {
    onBoundsChange(map.getBounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

interface MapViewProps {
  sales: ScoredSale[];
  center: LatLngTuple;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onVote: (id: string, kind: "stillHere" | "over") => void;
  onBoundsChange: (bounds: LatLngBoundsExpression) => void;
}

export default function MapView({
  sales,
  center,
  selectedId,
  onSelect,
  onVote,
  onBoundsChange,
}: MapViewProps) {
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const icons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    for (const sale of sales) {
      map.set(sale.id, createSaleIcon(sale.score));
    }
    return map;
  }, [sales]);

  useEffect(() => {
    if (selectedId) {
      markerRefs.current[selectedId]?.openPopup();
    }
  }, [selectedId]);

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} />
      <BoundsWatcher onBoundsChange={onBoundsChange} />
      <MarkerClusterGroup chunkedLoading>
        {sales.map((sale) => (
          <Marker
            key={sale.id}
            position={[sale.lat, sale.lng]}
            icon={icons.get(sale.id)}
            ref={(ref) => {
              markerRefs.current[sale.id] = ref;
            }}
            eventHandlers={{ click: () => onSelect(sale.id) }}
          >
            <Popup>
              <div className="popup-content">
                <img
                  className="popup-thumb"
                  src={sale.photos?.[0] ?? categoryThumbnail(sale.category)}
                  alt=""
                  aria-hidden="true"
                />
                <h3>{sale.title}</h3>
                <div className="meta">
                  {sale.address} &middot; {sale.score}% likely still active
                </div>
                <a href={directionsUrl(sale)} target="_blank" rel="noreferrer">
                  Get directions
                </a>
                <ul className="score-breakdown">
                  {sale.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                {sale.sourceUrl && (
                  <a href={sale.sourceUrl} target="_blank" rel="noreferrer">
                    View original listing ({sale.source})
                  </a>
                )}
                <div className="vote-row">
                  <button type="button" onClick={() => onVote(sale.id, "stillHere")}>
                    👍 Still here
                  </button>
                  <button type="button" onClick={() => onVote(sale.id, "over")}>
                    👎 Sale's over
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
