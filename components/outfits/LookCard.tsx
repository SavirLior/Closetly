import { Bookmark, Heart, Lock, RefreshCw, ThumbsDown } from "lucide-react";
import type { OutfitLook, WardrobeItem } from "@/lib/types";
import { FashionImage } from "@/components/ui/FashionImage";

type Props = {
  look: OutfitLook;
  index: number;
  items: WardrobeItem[];
  onFeedback: (id: string, feedback: "LOVE" | "DISLIKE") => void;
  onSave: (id: string) => void;
  onReplace: (lookId: string, itemId: string) => void;
  lockedItemId?: string;
};

export function LookCard({ look, index, items, onFeedback, onSave, onReplace, lockedItemId }: Props) {
  const lookItems = look.itemIds.map((id) => items.find((item) => item.id === id)).filter(Boolean) as WardrobeItem[];
  return (
    <article className="look-card">
      <header className="look-card__header"><span>LOOK {String(index + 1).padStart(2, "0")}</span><strong>{look.score}% match</strong></header>
      <div className={`look-composition look-composition--${Math.min(lookItems.length, 4)}`}>
        {lookItems.map((item) => (
          <div className="look-piece" key={item.id}>
            <FashionImage src={item.imageUrl} alt={item.name} sizes="(max-width: 820px) 50vw, 18vw" />
            <div className="look-piece__overlay"><span>{item.name}</span>{item.id === lockedItemId ? <button disabled><Lock size={13} /> Locked</button> : <button onClick={() => onReplace(look.id, item.id)}><RefreshCw size={13} /> Replace</button>}</div>
          </div>
        ))}
      </div>
      <div className="look-card__content">
        <div className="look-meta"><span>{look.occasion}</span><span>{look.style}</span></div>
        <h3>{look.title}</h3>
        <p>{look.explanation}</p>
        <div className="look-piece-list">{lookItems.map((item) => <span key={item.id}>{item.name}</span>)}</div>
      </div>
      <footer className="look-card__footer">
        <div><button className={look.feedback === "LOVE" ? "active" : ""} onClick={() => onFeedback(look.id, "LOVE")}><Heart size={16} fill={look.feedback === "LOVE" ? "currentColor" : "none"} /> Love it</button><button className={look.feedback === "DISLIKE" ? "active" : ""} onClick={() => onFeedback(look.id, "DISLIKE")}><ThumbsDown size={15} /> Not for me</button></div>
        <button className={look.saved ? "active" : ""} onClick={() => onSave(look.id)}><Bookmark size={16} fill={look.saved ? "currentColor" : "none"} /> {look.saved ? "Saved" : "Save look"}</button>
      </footer>
    </article>
  );
}
