"use client";

import { useMemo, useState } from "react";
import { Grid2X2, Heart, LayoutGrid, Plus, Search, SlidersHorizontal } from "lucide-react";
import type { WardrobeItem } from "@/lib/types";
import { ItemCard } from "@/components/wardrobe/ItemCard";
import { Button } from "@/components/ui/button";

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"];

type Props = {
  items: WardrobeItem[];
  onAddItem: () => void;
  onOpenItem: (item: WardrobeItem) => void;
  onFavorite: (id: string) => void;
};

export function WardrobeScreen({ items, onAddItem, onOpenItem, onFavorite }: Props) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [compact, setCompact] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [color, setColor] = useState("All colors");
  const [style, setStyle] = useState("All styles");
  const [season, setSeason] = useState("All seasons");

  const filtered = useMemo(() => {
    const matching = items.filter((item) =>
      (category === "All" || item.category === category) &&
      (!favoritesOnly || item.favorite) &&
      (color === "All colors" || item.primaryColor === color) &&
      (style === "All styles" || item.styles.includes(style)) &&
      (season === "All seasons" || item.seasons.includes(season)) &&
      `${item.name} ${item.primaryColor} ${item.styles.join(" ")}`.toLowerCase().includes(search.toLowerCase()),
    );
    return [...matching].sort((a, b) => sort === "A–Z" ? a.name.localeCompare(b.name) : b.createdAt.localeCompare(a.createdAt));
  }, [items, category, search, favoritesOnly, sort, color, style, season]);

  return (
    <main className="screen wardrobe-screen">
      <header className="screen-header">
        <div><span className="eyebrow">YOUR DIGITAL CLOSET · {items.length} PIECES</span><h1>Wardrobe</h1><p>Everything you own, ready to wear in new ways.</p></div>
        <Button variant="dark" onClick={onAddItem}><Plus size={17} /> Add clothing</Button>
      </header>

      <div className="wardrobe-toolbar">
        <div className="category-tabs">{categories.map((value) => <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>{value}<span>{value === "All" ? items.length : items.filter((item) => item.category === value).length}</span></button>)}</div>
        <div className="toolbar-row">
          <label className="search-box"><Search size={17} /><input placeholder="Search your wardrobe" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <button className={favoritesOnly ? "tool-button active" : "tool-button"} onClick={() => setFavoritesOnly((value) => !value)}><Heart size={17} fill={favoritesOnly ? "currentColor" : "none"} /><span>Favorites</span></button>
          <button className={advancedOpen ? "tool-button active" : "tool-button"} onClick={() => setAdvancedOpen((value) => !value)}><SlidersHorizontal size={17} /><span>Filters</span></button>
          <label className="sort-select">Sort <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest</option><option>A–Z</option></select></label>
          <div className="view-toggle"><button className={!compact ? "active" : ""} onClick={() => setCompact(false)} aria-label="Grid view"><LayoutGrid size={17} /></button><button className={compact ? "active" : ""} onClick={() => setCompact(true)} aria-label="Compact grid"><Grid2X2 size={17} /></button></div>
        </div>
        {advancedOpen && <div className="advanced-filters"><label>Color<select value={color} onChange={(event) => setColor(event.target.value)}><option>All colors</option>{[...new Set(items.map((item) => item.primaryColor))].sort().map((value) => <option key={value}>{value}</option>)}</select></label><label>Style<select value={style} onChange={(event) => setStyle(event.target.value)}><option>All styles</option>{[...new Set(items.flatMap((item) => item.styles))].sort().map((value) => <option key={value}>{value}</option>)}</select></label><label>Season<select value={season} onChange={(event) => setSeason(event.target.value)}><option>All seasons</option>{["Spring", "Summer", "Fall", "Winter"].map((value) => <option key={value}>{value}</option>)}</select></label><button onClick={() => { setColor("All colors"); setStyle("All styles"); setSeason("All seasons"); }}>Clear</button></div>}
      </div>

      {filtered.length ? (
        <div className={`wardrobe-grid ${compact ? "wardrobe-grid--compact" : ""}`}>{filtered.map((item) => <ItemCard key={item.id} item={item} compact={compact} onOpen={onOpenItem} onFavorite={onFavorite} />)}</div>
      ) : (
        <div className="empty-state"><span><ShirtIcon /></span><h2>{items.length ? "No pieces match this edit." : "Your wardrobe is empty."}</h2><p>{items.length ? "Try clearing a filter or searching for something else." : "Add your first piece and we’ll start building looks around your clothes."}</p><Button variant="dark" onClick={onAddItem}>Add clothing</Button></div>
      )}
    </main>
  );
}

function ShirtIcon() {
  return <span aria-hidden="true">✦</span>;
}
