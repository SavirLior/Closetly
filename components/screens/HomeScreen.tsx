import { ArrowRight, ChevronRight, Plus, Shirt, Sparkles } from "lucide-react";
import type { OutfitLook, ViewName, WardrobeItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FashionImage } from "@/components/ui/FashionImage";

type Props = {
  items: WardrobeItem[];
  savedLooks: OutfitLook[];
  onNavigate: (view: ViewName) => void;
  onAddItem: () => void;
  onOpenItem: (item: WardrobeItem) => void;
  onStyleItem: (id: string) => void;
};

export function HomeScreen({ items, savedLooks, onNavigate, onAddItem, onOpenItem, onStyleItem }: Props) {
  const featured = items.slice(0, 4);
  const lookItems = ["w3", "w8", "w13"].map((id) => items.find((item) => item.id === id)).filter(Boolean) as WardrobeItem[];
  return (
    <main className="screen home-screen">
      <header className="home-intro">
        <div><span className="eyebrow">FRIDAY · TEL AVIV · 31°C</span><h1>Good afternoon, Lior.</h1></div>
        <button className="add-circle" onClick={onAddItem} aria-label="Add clothing"><Plus size={22} /></button>
      </header>

      <section className="hero-editorial">
        <div className="hero-editorial__copy">
          <span className="hero-kicker"><Sparkles size={15} /> STYLED FROM YOUR WARDROBE</span>
          <h2>What are you<br />wearing <em>today?</em></h2>
          <p>Tell us the plan. We’ll find the right pieces from the clothes you already own.</p>
          <button className="prompt-cta" onClick={() => onNavigate("outfits")}><span>What are you dressing for?</span><ArrowRight size={19} /></button>
          <div className="quick-prompts"><button onClick={() => onNavigate("outfits")}>Date tonight</button><button onClick={() => onNavigate("outfits")}>University</button><button onClick={() => onNavigate("outfits")}>Clean minimal</button></div>
        </div>
        <div className="hero-editorial__image">
          <FashionImage src="https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=1400&q=88" alt="Neutral clothing on a wardrobe rail" width={1400} height={1200} priority sizes="(max-width: 820px) 100vw, 45vw" />
          <div className="hero-stat"><strong>{items.length}</strong><span>pieces<br />ready to style</span></div>
          <span className="image-label">THE WEEKDAY EDIT · 01</span>
        </div>
      </section>

      <section className="home-actions">
        <button className="home-action home-action--dark" onClick={() => onNavigate("outfits")}><span className="home-action__icon"><Sparkles size={21} /></span><span><small>START WITH A PLAN</small><strong>Create a look</strong><em>Occasion, weather, mood—tell us anything.</em></span><ArrowRight size={20} /></button>
        <button className="home-action" onClick={() => onNavigate("wardrobe")}><span className="home-action__icon"><Shirt size={21} /></span><span><small>START WITH A PIECE</small><strong>Style an item</strong><em>Choose something you definitely want to wear.</em></span><ArrowRight size={20} /></button>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">YOUR NEWEST PIECES</span><h2>Recently added</h2></div><button onClick={() => onNavigate("wardrobe")}>View wardrobe <ChevronRight size={16} /></button></div>
        <div className="recent-grid">{featured.map((item, index) => <button key={item.id} className={`recent-card recent-card--${index + 1}`} onClick={() => onOpenItem(item)}><FashionImage src={item.imageUrl} alt={item.name} /><span><strong>{item.name}</strong><small>{item.category} · {item.primaryColor}</small></span></button>)}</div>
      </section>

      <section className="daily-edit">
        <div className="daily-edit__copy"><span className="eyebrow">OUTFIT INSPIRATION · 94% MATCH</span><h2>The easy<br /><em>date-night edit.</em></h2><p>Smart enough for dinner, relaxed enough for everything after.</p><Button variant="dark" onClick={() => onNavigate("outfits")}>See this look <ArrowRight size={16} /></Button></div>
        <div className="daily-edit__items">{lookItems.map((item) => <button key={item.id} onClick={() => onStyleItem(item.id)}><FashionImage src={item.imageUrl} alt={item.name} sizes="(max-width: 820px) 33vw, 20vw" /><span>{item.name}</span></button>)}</div>
      </section>

      {savedLooks.length > 0 && <section className="saved-preview"><span className="eyebrow">SAVED FOR LATER</span><h2>{savedLooks.length} looks are waiting.</h2><button onClick={() => onNavigate("saved")}>Open saved looks <ArrowRight size={16} /></button></section>}
    </main>
  );
}
