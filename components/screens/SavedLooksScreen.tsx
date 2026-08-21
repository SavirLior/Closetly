import { Bookmark, Copy, MoreHorizontal, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import type { OutfitLook, WardrobeItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FashionImage } from "@/components/ui/FashionImage";

type Props = {
  looks: OutfitLook[];
  items: WardrobeItem[];
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
};

export function SavedLooksScreen({ looks, items, onDelete, onDuplicate, onCreate, onRename }: Props) {
  return (
    <main className="screen saved-screen">
      <header className="screen-header"><div><span className="eyebrow">YOUR PERSONAL EDIT</span><h1>Saved looks</h1><p>Outfits worth remembering, made entirely from your wardrobe.</p></div><Button variant="dark" onClick={onCreate}><Sparkles size={16} /> Create a look</Button></header>
      {looks.length ? <div className="saved-grid">{looks.map((look, index) => {
        const lookItems = look.itemIds.map((id) => items.find((item) => item.id === id)).filter(Boolean) as WardrobeItem[];
        return <article className="saved-card" key={look.id}>
          <div className={`saved-card__composition saved-card__composition--${Math.min(lookItems.length, 4)}`}>{lookItems.map((item) => <FashionImage key={item.id} src={item.imageUrl} alt={item.name} sizes="(max-width: 820px) 33vw, 16vw" />)}<span className="saved-card__index">{String(index + 1).padStart(2, "0")}</span></div>
          <div className="saved-card__content"><div><span className="eyebrow">{look.occasion} · {look.score}% MATCH</span><h2>{look.title}</h2><p>{lookItems.map((item) => item.name).join(" · ")}</p></div><button aria-label="Rename look" onClick={() => { const title = window.prompt("Name this look", look.title); if (title?.trim()) onRename(look.id, title.trim()); }}><MoreHorizontal size={19} /></button></div>
          <div className="saved-card__actions"><button onClick={() => onCreate()}><RefreshCw size={15} /> Variation</button><button onClick={() => onDuplicate(look.id)}><Copy size={15} /> Duplicate</button><button onClick={() => onDelete(look.id)}><Trash2 size={15} /> Delete</button></div>
        </article>;
      })}</div> : <div className="empty-state"><span><Bookmark size={24} /></span><h2>No saved looks yet.</h2><p>Looks you love will appear here.</p><Button variant="dark" onClick={onCreate}>Create your first look</Button></div>}
    </main>
  );
}
