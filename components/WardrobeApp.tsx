"use client";

import { useState } from "react";
import { AppNavigation } from "@/components/layout/AppNavigation";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { WardrobeScreen } from "@/components/screens/WardrobeScreen";
import { OutfitStudio } from "@/components/screens/OutfitStudio";
import { SavedLooksScreen } from "@/components/screens/SavedLooksScreen";
import { PreferencesScreen } from "@/components/screens/PreferencesScreen";
import { AddItemModal } from "@/components/wardrobe/AddItemModal";
import { ItemDetailModal } from "@/components/wardrobe/ItemDetailModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { DEFAULT_PREFERENCES, DEMO_LOOKS, DEMO_WARDROBE } from "@/lib/demo-data";
import type { OutfitLook, UserPreferences, ViewName, WardrobeItem } from "@/lib/types";

export function WardrobeApp() {
  const [view, setView] = useState<ViewName>("home");
  const [items, setItems] = useState<WardrobeItem[]>(DEMO_WARDROBE);
  const [looks, setLooks] = useState<OutfitLook[]>(DEMO_LOOKS);
  const [savedLooks, setSavedLooks] = useState<OutfitLook[]>([{ ...DEMO_LOOKS[1], saved: true }]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [lockedItemId, setLockedItemId] = useState<string>();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(true);

  function navigate(next: ViewName) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function favoriteItem(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item));
    setSelectedItem((current) => current?.id === id ? { ...current, favorite: !current.favorite } : current);
  }

  function addItems(newItems: WardrobeItem[]) {
    setItems((current) => [...newItems, ...current]);
    navigate("wardrobe");
  }

  function deleteItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    setSelectedItem(null);
  }

  function updateItem(updated: WardrobeItem) {
    setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelectedItem(updated);
  }

  function styleItem(id: string) {
    const locked = items.find((item) => item.id === id);
    if (locked) {
      setLooks((current) => current.map((look) => {
        const roleIndex = look.itemIds.findIndex((itemId) => items.find((item) => item.id === itemId)?.category === locked.category);
        const itemIds = roleIndex >= 0
          ? look.itemIds.map((itemId, index) => index === roleIndex ? id : itemId)
          : [id, ...look.itemIds].slice(0, 4);
        return { ...look, itemIds };
      }));
    }
    setLockedItemId(id);
    setSelectedItem(null);
    navigate("outfits");
  }

  function feedback(id: string, value: "LOVE" | "DISLIKE") {
    setLooks((current) => current.map((look) => look.id === id ? { ...look, feedback: look.feedback === value ? undefined : value } : look));
    void fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ outfitId: id, type: value }) }).catch(() => undefined);
  }

  function saveLook(id: string) {
    const look = looks.find((candidate) => candidate.id === id);
    if (!look) return;
    const alreadySaved = savedLooks.some((candidate) => candidate.id === id);
    setSavedLooks((current) => alreadySaved ? current.filter((candidate) => candidate.id !== id) : [{ ...look, saved: true }, ...current]);
    setLooks((current) => current.map((candidate) => candidate.id === id ? { ...candidate, saved: !alreadySaved } : candidate));
    if (!alreadySaved) void fetch("/api/saved", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ outfitId: id, title: look.title }) }).catch(() => undefined);
  }

  function replaceItem(lookId: string, itemId: string) {
    const currentItem = items.find((item) => item.id === itemId);
    const look = looks.find((candidate) => candidate.id === lookId);
    if (!currentItem || !look) return;
    const replacement = items.find((item) => item.category === currentItem.category && item.id !== itemId && !look.itemIds.includes(item.id));
    if (!replacement) return;
    setLooks((current) => current.map((candidate) => candidate.id === lookId ? {
      ...candidate,
      itemIds: candidate.itemIds.map((id) => id === itemId ? replacement.id : id),
      score: Math.max(80, candidate.score - 2),
      explanation: `${candidate.explanation} Swapped in ${replacement.name.toLowerCase()} for a fresh variation.`,
    } : candidate));
  }

  function duplicateLook(id: string) {
    const look = savedLooks.find((candidate) => candidate.id === id);
    if (look) setSavedLooks((current) => [{ ...look, id: `${look.id}-copy-${Date.now()}`, title: `${look.title} — variation` }, ...current]);
  }

  return (
    <div className="app-shell">
      <AppNavigation view={view} onNavigate={navigate} onAddItem={() => setUploadOpen(true)} itemCount={items.length} onOpenOnboarding={() => { setOnboardingOpen(true); }} />
      <div className="app-content">
        {view === "home" && <HomeScreen items={items} savedLooks={savedLooks} onNavigate={navigate} onAddItem={() => setUploadOpen(true)} onOpenItem={setSelectedItem} onStyleItem={styleItem} />}
        {view === "wardrobe" && <WardrobeScreen items={items} onAddItem={() => setUploadOpen(true)} onOpenItem={setSelectedItem} onFavorite={favoriteItem} />}
        {view === "outfits" && <OutfitStudio items={items} looks={looks} lockedItemId={lockedItemId} onLockedItemChange={setLockedItemId} onLooksChange={setLooks} onFeedback={feedback} onSave={saveLook} onReplace={replaceItem} />}
        {view === "saved" && <SavedLooksScreen looks={savedLooks} items={items} onDelete={(id) => setSavedLooks((current) => current.filter((look) => look.id !== id))} onDuplicate={duplicateLook} onRename={(id, title) => setSavedLooks((current) => current.map((look) => look.id === id ? { ...look, title } : look))} onCreate={() => navigate("outfits")} />}
        {view === "profile" && <PreferencesScreen preferences={preferences} onChange={setPreferences} onOpenOnboarding={() => setOnboardingOpen(true)} />}
      </div>
      <AddItemModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSave={addItems} />
      <ItemDetailModal key={selectedItem?.id ?? "no-item"} item={selectedItem} onClose={() => setSelectedItem(null)} onFavorite={favoriteItem} onDelete={deleteItem} onStyle={styleItem} onUpdate={updateItem} />
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} onAddFirstItem={() => setUploadOpen(true)} />
    </div>
  );
}
