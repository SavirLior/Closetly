import { Heart } from "lucide-react";
import type { WardrobeItem } from "@/lib/types";
import { FashionImage } from "@/components/ui/FashionImage";

type Props = {
  item: WardrobeItem;
  compact?: boolean;
  onOpen: (item: WardrobeItem) => void;
  onFavorite: (id: string) => void;
};

export function ItemCard({ item, compact, onOpen, onFavorite }: Props) {
  return (
    <article className={`item-card ${compact ? "item-card--compact" : ""}`}>
      <button className="item-card__image" onClick={() => onOpen(item)} aria-label={`Open ${item.name}`}>
        <FashionImage src={item.imageUrl} alt={item.name} />
        <span className="item-card__number">{item.id.replace(/\D/g, "").padStart(2, "0")}</span>
      </button>
      <button
        className={`heart-button ${item.favorite ? "heart-button--active" : ""}`}
        onClick={() => onFavorite(item.id)}
        aria-label={item.favorite ? `Remove ${item.name} from favorites` : `Favorite ${item.name}`}
      >
        <Heart size={17} fill={item.favorite ? "currentColor" : "none"} />
      </button>
      <button className="item-card__meta" onClick={() => onOpen(item)}>
        <span>{item.name}</span>
        <small>{item.primaryColor} · {item.subcategory}</small>
      </button>
    </article>
  );
}
