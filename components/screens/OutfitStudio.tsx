"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, CloudSun, Lock, RefreshCw, Sparkles, WandSparkles, X } from "lucide-react";
import type { OutfitLook, WardrobeItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LookCard } from "@/components/outfits/LookCard";
import { FashionImage } from "@/components/ui/FashionImage";

const occasions = ["Everyday", "Work", "University", "Date", "Dinner", "Party", "Wedding", "Travel", "Weekend"];
const styles = ["Casual", "Minimal", "Smart Casual", "Streetwear", "Classic", "Old Money", "Sporty", "Formal"];

type Props = {
  items: WardrobeItem[];
  looks: OutfitLook[];
  lockedItemId?: string;
  onLockedItemChange: (id?: string) => void;
  onLooksChange: (looks: OutfitLook[]) => void;
  onFeedback: (id: string, feedback: "LOVE" | "DISLIKE") => void;
  onSave: (id: string) => void;
  onReplace: (lookId: string, itemId: string) => void;
};

export function OutfitStudio({ items, looks, lockedItemId, onLockedItemChange, onLooksChange, onFeedback, onSave, onReplace }: Props) {
  const [prompt, setPrompt] = useState(() => lockedItemId ? "Build three smart casual looks around my selected piece." : "Date tonight, smart casual, not too formal.");
  const [occasion, setOccasion] = useState("Date");
  const [style, setStyle] = useState("Smart Casual");
  const [formality, setFormality] = useState(6);
  const [generated, setGenerated] = useState(Boolean(lockedItemId));
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(0);
  const lockedItem = useMemo(() => items.find((item) => item.id === lockedItemId), [items, lockedItemId]);

  function generate() {
    setLoading(true);
    setGenerated(false);
    setLoadingMessage(0);
    const first = window.setTimeout(() => setLoadingMessage(1), 450);
    const second = window.setTimeout(() => setLoadingMessage(2), 900);
    window.setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      onLooksChange(looks.map((look, index) => ({ ...look, occasion, style, score: Math.max(82, look.score - index), itemIds: lockedItemId && !look.itemIds.includes(lockedItemId) ? [lockedItemId, ...look.itemIds.slice(1)] : look.itemIds })));
    }, 1450);
    return () => { window.clearTimeout(first); window.clearTimeout(second); };
  }

  if (loading) {
    const messages = ["Looking at your wardrobe…", "Matching colors and styles…", "Finding the best combinations…"];
    return <main className="screen generation-loading"><span className="loading-orbit"><WandSparkles size={28} /></span><div className="eyebrow">YOUR WARDROBE · IN PROGRESS</div><h1>{messages[loadingMessage]}</h1><p>Building complete looks from the {items.length} pieces you own.</p><div className="loading-steps">{messages.map((message, index) => <span key={message} className={index <= loadingMessage ? "active" : ""}>{index < loadingMessage ? <Check size={14} /> : String(index + 1).padStart(2, "0")} {message}</span>)}</div></main>;
  }

  if (generated) {
    return (
      <main className="screen results-screen">
        <header className="results-header"><div><span className="eyebrow">CURATED FROM YOUR WARDROBE</span><h1>Three ways to wear it.</h1><p>{prompt}</p></div><Button variant="secondary" onClick={() => setGenerated(false)}>Edit request</Button></header>
        {lockedItem && <div className="locked-banner"><Lock size={16} /><FashionImage src={lockedItem.imageUrl} alt="" width={90} height={90} sizes="45px" /><span><small>LOCKED INTO EVERY LOOK</small><strong>{lockedItem.name}</strong></span><button onClick={() => onLockedItemChange(undefined)}><X size={16} /></button></div>}
        <div className="looks-list">{looks.map((look, index) => <LookCard key={look.id} look={look} index={index} items={items} lockedItemId={lockedItemId} onFeedback={onFeedback} onSave={onSave} onReplace={onReplace} />)}</div>
        <div className="generate-more"><span className="eyebrow">NOT QUITE RIGHT?</span><h2>There are more ways to wear what you own.</h2><Button variant="dark" onClick={generate}><RefreshCw size={16} /> Generate another three</Button></div>
      </main>
    );
  }

  return (
    <main className="screen outfit-studio">
      <header className="screen-header outfit-header"><div><span className="eyebrow">PERSONAL STYLIST · YOUR CLOTHES ONLY</span><h1>Create an outfit</h1><p>Tell us what the day calls for. We’ll style it from what you own.</p></div><div className="weather-pill"><CloudSun size={18} /><span><strong>31°C</strong><small>Tel Aviv · Humid</small></span></div></header>
      <section className="stylist-form">
        <div className="stylist-form__main">
          <label className="prompt-field"><span>WHAT ARE YOU DRESSING FOR?</span><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Date tonight, smart casual, not too formal." /><small>{prompt.length}/600</small></label>
          <div className="suggestion-row"><span>TRY</span>{["University, relaxed", "Clean and minimal", "Weekend trip"].map((value) => <button key={value} onClick={() => setPrompt(value)}>{value}</button>)}</div>
          <div className="selector-block"><div className="selector-label"><span>01</span><strong>Occasion</strong><small>Where are you going?</small></div><div className="choice-chips">{occasions.map((value) => <button key={value} className={occasion === value ? "active" : ""} onClick={() => setOccasion(value)}>{value}</button>)}</div></div>
          <div className="selector-block"><div className="selector-label"><span>02</span><strong>Style</strong><small>How should it feel?</small></div><div className="choice-chips">{styles.map((value) => <button key={value} className={style === value ? "active" : ""} onClick={() => setStyle(value)}>{value}</button>)}</div></div>
          <div className="selector-block formality-block"><div className="selector-label"><span>03</span><strong>Formality</strong><small>Set the tone.</small></div><div className="range-wrap"><input type="range" min="1" max="10" value={formality} onChange={(event) => setFormality(Number(event.target.value))} /><div><span>Relaxed</span><strong>{formality}/10</strong><span>Formal</span></div></div></div>
        </div>
        <aside className="stylist-form__aside">
          <div className="locked-selector">
            <span className="eyebrow">BUILD AROUND A PIECE</span><h3>Definitely wearing something?</h3><p>Lock one wardrobe item into every look.</p>
            {lockedItem ? <div className="locked-piece"><FashionImage src={lockedItem.imageUrl} alt={lockedItem.name} width={90} height={90} sizes="45px" /><span><small>LOCKED</small><strong>{lockedItem.name}</strong></span><button onClick={() => onLockedItemChange(undefined)}><X size={16} /></button></div> : <label className="item-select"><Sparkles size={17} /><select defaultValue="" onChange={(event) => onLockedItemChange(event.target.value || undefined)}><option value="">Choose a wardrobe item</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown size={16} /></label>}
          </div>
          <div className="generation-summary"><div><span>Occasion</span><strong>{occasion}</strong></div><div><span>Style</span><strong>{style}</strong></div><div><span>Formality</span><strong>{formality}/10</strong></div><div><span>Weather</span><strong>Warm</strong></div></div>
          <Button variant="dark" size="lg" onClick={generate} disabled={items.length < 3}>Create three looks <ArrowRight size={17} /></Button>
          <small className="wardrobe-note"><Sparkles size={13} /> Using only your {items.length} wardrobe pieces</small>
        </aside>
      </section>
    </main>
  );
}
