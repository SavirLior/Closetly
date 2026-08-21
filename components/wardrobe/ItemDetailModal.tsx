"use client";

import { useState } from "react";
import { ArrowRight, Check, Heart, Pencil, Trash2, X } from "lucide-react";
import type { WardrobeItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FashionImage } from "@/components/ui/FashionImage";

type Props = {
  item: WardrobeItem | null;
  onClose: () => void;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onStyle: (id: string) => void;
  onUpdate: (item: WardrobeItem) => void;
};

export function ItemDetailModal({ item, onClose, onFavorite, onDelete, onStyle, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item);
  if (!item) return null;
  const visible = draft ?? item;
  function save() { if (draft) onUpdate(draft); setEditing(false); }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="item-detail modal-sheet" role="dialog" aria-modal="true" aria-label={item.name} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <div className="item-detail__image-wrap">
          <FashionImage src={item.imageUrl} alt={item.name} width={1000} height={1300} sizes="(max-width: 820px) 100vw, 55vw" />
          <span className="editorial-caption">YOUR PIECE · {item.category.toUpperCase()}</span>
        </div>
        <div className="item-detail__content">
          <div className="eyebrow">{visible.subcategory}</div>
          {editing ? <input className="detail-title-input" value={visible.name} onChange={(event) => setDraft({ ...visible, name: event.target.value })} /> : <h2>{visible.name}</h2>}
          <p className="item-detail__description">{visible.description}</p>
          <div className="attribute-grid">
            <div><small>Color</small>{editing ? <input value={visible.primaryColor} onChange={(event) => setDraft({ ...visible, primaryColor: event.target.value })} /> : <strong>{visible.primaryColor}</strong>}</div>
            <div><small>Material</small>{editing ? <input value={visible.material} onChange={(event) => setDraft({ ...visible, material: event.target.value })} /> : <strong>{visible.material}</strong>}</div>
            <div><small>Fit</small>{editing ? <input value={visible.fit} onChange={(event) => setDraft({ ...visible, fit: event.target.value })} /> : <strong>{visible.fit}</strong>}</div>
            <div><small>Formality</small>{editing ? <input type="number" min="1" max="10" value={visible.formality} onChange={(event) => setDraft({ ...visible, formality: Number(event.target.value) })} /> : <strong>{visible.formality}/10</strong>}</div>
          </div>
          <div className="tag-row">{item.styles.map((style) => <span key={style}>{style}</span>)}</div>
          <div className="item-detail__actions">
            <Button variant="dark" size="lg" onClick={() => onStyle(item.id)}>
              Build an outfit around this <ArrowRight size={17} />
            </Button>
            <div className="icon-actions">
              <button onClick={() => onFavorite(item.id)} aria-label="Favorite"><Heart size={18} fill={item.favorite ? "currentColor" : "none"} /></button>
              <button onClick={editing ? save : () => setEditing(true)} aria-label={editing ? "Save changes" : "Edit"}>{editing ? <Check size={18} /> : <Pencil size={18} />}</button>
              <button onClick={() => onDelete(item.id)} aria-label="Delete"><Trash2 size={18} /></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
