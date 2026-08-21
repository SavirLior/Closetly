import { Bookmark, Home, Plus, Shirt, Sparkles, UserRound } from "lucide-react";
import type { ViewName } from "@/lib/types";

const navigation = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "wardrobe" as const, label: "Wardrobe", icon: Shirt },
  { id: "outfits" as const, label: "Create Outfit", icon: Sparkles },
  { id: "saved" as const, label: "Saved Looks", icon: Bookmark },
  { id: "profile" as const, label: "Profile", icon: UserRound },
];

type Props = {
  view: ViewName;
  onNavigate: (view: ViewName) => void;
  onAddItem: () => void;
  itemCount: number;
  onOpenOnboarding: () => void;
};

export function AppNavigation({ view, onNavigate, onAddItem, itemCount, onOpenOnboarding }: Props) {
  return (
    <>
      <aside className="desktop-nav">
        <button className="brand" onClick={() => onNavigate("home")} aria-label="Closetly home">
          <span className="brand__mark">C</span>
          <span>CLOSETLY</span>
        </button>
        <nav aria-label="Primary navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-link ${view === id ? "nav-link--active" : ""}`}
              onClick={() => onNavigate(id)}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span>{label}</span>
              {id === "wardrobe" && <span className="nav-count">{itemCount}</span>}
            </button>
          ))}
        </nav>
        <div className="desktop-nav__bottom">
          <button className="add-piece-card" onClick={onAddItem}>
            <Plus size={18} />
            <span>Add a piece</span>
            <small>Photo → styled</small>
          </button>
          <button className="profile-chip" onClick={onOpenOnboarding}>
            <span className="avatar">LS</span>
            <span><strong>Lior</strong><small>Demo wardrobe</small></span>
          </button>
        </div>
      </aside>

      <header className="mobile-header">
        <button className="brand brand--mobile" onClick={() => onNavigate("home")}>
          <span className="brand__mark">C</span><span>CLOSETLY</span>
        </button>
        <button className="avatar" onClick={onOpenOnboarding}>LS</button>
      </header>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button key={id} className={view === id ? "active" : ""} onClick={() => onNavigate(id)}>
            <Icon size={20} strokeWidth={1.8} /><span>{label === "Create Outfit" ? "Create" : label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
