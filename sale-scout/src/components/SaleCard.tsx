import type { ScoredSale } from "../types";
import { scoreBucket } from "../lib/scoring";
import { categoryThumbnail } from "../lib/categoryArt";

interface SaleCardProps {
  sale: ScoredSale;
  selected: boolean;
  onSelect: (id: string) => void;
}

function formatWindow(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    hour: "numeric",
    minute: start.getMinutes() === 0 ? undefined : "numeric",
  };
  return `${start.toLocaleTimeString([], opts)} – ${end.toLocaleTimeString([], {
    hour: "numeric",
    minute: end.getMinutes() === 0 ? undefined : "numeric",
  })}`;
}

export default function SaleCard({ sale, selected, onSelect }: SaleCardProps) {
  return (
    <div
      className={`sale-card${selected ? " selected" : ""}`}
      onClick={() => onSelect(sale.id)}
    >
      <div className="sale-card-body">
        <img
          className="sale-thumb"
          src={sale.photos?.[0] ?? categoryThumbnail(sale.category)}
          alt=""
          aria-hidden="true"
        />
        <div className="sale-card-text">
          <div className="sale-card-header">
            <h3>{sale.title}</h3>
            <span className={`score-badge score-${scoreBucket(sale.score)}`}>
              {sale.score}%
            </span>
          </div>
          <div className="meta">{sale.address}</div>
          <div className="meta">{formatWindow(sale.startsAt, sale.endsAt)}</div>
          <div className="meta">
            {sale.category} &middot; via {sale.source}
          </div>
        </div>
      </div>
    </div>
  );
}
