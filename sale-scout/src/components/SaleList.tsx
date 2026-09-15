import type { ScoredSale } from "../types";
import SaleCard from "./SaleCard";

interface SaleListProps {
  sales: ScoredSale[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function SaleList({ sales, selectedId, onSelect }: SaleListProps) {
  if (sales.length === 0) {
    return (
      <div className="empty-state">
        No sales match your filters in this area. Try widening the radius or
        panning the map.
      </div>
    );
  }

  return (
    <div className="sale-list">
      {sales.map((sale) => (
        <SaleCard
          key={sale.id}
          sale={sale}
          selected={sale.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
