"use client";

import { useState } from "react";
import { Bell, Check, ChevronRight, LogOut, ShieldCheck, SlidersHorizontal, Sparkles, UserRound } from "lucide-react";
import type { UserPreferences } from "@/lib/types";
import { Button } from "@/components/ui/button";

const styleOptions = ["Minimal", "Casual", "Smart Casual", "Streetwear", "Classic", "Old Money", "Sporty", "Formal", "Scandinavian", "Vintage"];
const colorOptions = ["Black", "White", "Navy", "Beige", "Brown", "Grey", "Blue", "Green", "Burgundy"];

type Props = { preferences: UserPreferences; onChange: (preferences: UserPreferences) => void; onOpenOnboarding: () => void };

export function PreferencesScreen({ preferences, onChange, onOpenOnboarding }: Props) {
  const [saved, setSaved] = useState(false);
  const toggle = (field: "preferredStyles" | "favoriteColors", value: string) => onChange({ ...preferences, [field]: preferences[field].includes(value) ? preferences[field].filter((item) => item !== value) : [...preferences[field], value] });
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 1400); };
  return (
    <main className="screen preferences-screen">
      <header className="screen-header"><div><span className="eyebrow">YOUR STYLE, YOUR RULES</span><h1>Preferences</h1><p>Fine-tune what Closetly notices when it builds your looks.</p></div><Button variant="dark" onClick={save}>{saved ? <Check size={16} /> : <Sparkles size={16} />} {saved ? "Saved" : "Save changes"}</Button></header>
      <div className="profile-hero"><span className="profile-hero__avatar">LS</span><div><h2>Lior Savir</h2><p>lior@example.com · Demo wardrobe</p></div><button onClick={onOpenOnboarding}>Edit profile <ChevronRight size={16} /></button></div>
      <section className="preferences-layout">
        <div className="preferences-main">
          <div className="preference-card"><div className="preference-card__heading"><span><Sparkles size={18} /></span><div><h3>Your style language</h3><p>These styles get a gentle scoring boost.</p></div></div><div className="selection-grid selection-grid--profile">{styleOptions.map((style) => <button key={style} className={preferences.preferredStyles.includes(style) ? "selected" : ""} onClick={() => toggle("preferredStyles", style)}>{preferences.preferredStyles.includes(style) && <Check size={14} />}{style}</button>)}</div></div>
          <div className="preference-card"><div className="preference-card__heading"><span><SlidersHorizontal size={18} /></span><div><h3>Color preferences</h3><p>Colors you reach for most often.</p></div></div><div className="color-selection color-selection--profile">{colorOptions.map((color) => <button key={color} className={preferences.favoriteColors.includes(color) ? "selected" : ""} onClick={() => toggle("favoriteColors", color)}><span style={{ background: color.toLowerCase() }} />{color}</button>)}</div></div>
          <div className="preference-card"><div className="preference-card__heading"><span><SlidersHorizontal size={18} /></span><div><h3>Default formality</h3><p>How polished should everyday suggestions feel?</p></div></div><div className="range-wrap range-wrap--profile"><input type="range" min="1" max="10" value={preferences.preferredFormality} onChange={(event) => onChange({ ...preferences, preferredFormality: Number(event.target.value) })} /><div><span>Very relaxed</span><strong>{preferences.preferredFormality}/10</strong><span>Very formal</span></div></div></div>
        </div>
        <aside className="account-panel"><h3>Account</h3><button><UserRound size={17} /><span><strong>Personal details</strong><small>Name and email</small></span><ChevronRight size={16} /></button><button><Bell size={17} /><span><strong>Notifications</strong><small>Outfit reminders</small></span><ChevronRight size={16} /></button><button><ShieldCheck size={17} /><span><strong>Privacy & data</strong><small>Your wardrobe stays yours</small></span><ChevronRight size={16} /></button><button className="sign-out"><LogOut size={17} /><span><strong>Sign out</strong><small>End this session</small></span></button><div className="learning-note"><Sparkles size={16} /><p><strong>Transparent learning</strong>Closetly adjusts simple preference scores from your likes and dislikes. You can reset them anytime.</p></div></aside>
      </section>
    </main>
  );
}
