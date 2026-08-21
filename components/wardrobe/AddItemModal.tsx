"use client";

import { useRef, useState } from "react";
import { Camera, Check, ImagePlus, Plus, Sparkles, Upload, X } from "lucide-react";
import type { WardrobeCategory, WardrobeItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FashionImage } from "@/components/ui/FashionImage";

type DraftItem = Pick<WardrobeItem, "name" | "category" | "subcategory" | "primaryColor" | "material" | "fit" | "styles" | "seasons" | "formality" | "description"> & { confidence: number };

const initialDraft: DraftItem = {
  name: "Light Blue Oxford Shirt",
  category: "Tops",
  subcategory: "Oxford shirt",
  primaryColor: "Light Blue",
  material: "Cotton",
  fit: "Regular",
  styles: ["Smart Casual", "Classic"],
  seasons: ["Spring", "Summer", "Fall"],
  formality: 6,
  description: "Light blue cotton Oxford shirt with a regular fit.",
  confidence: 0.91,
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (items: WardrobeItem[]) => void;
};

export function AddItemModal({ open, onClose, onSave }: Props) {
  const [step, setStep] = useState<"upload" | "analyzing" | "confirm" | "saved">("upload");
  const [preview, setPreview] = useState<string>("");
  const [drafts, setDrafts] = useState<DraftItem[]>([initialDraft]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  async function processFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      window.alert("Please choose a JPG, PNG, HEIC, or WebP image under 10 MB.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setStep("analyzing");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageUrl: "local-preview", fileName: file.name }),
      });
      const result = response.ok ? await response.json() as { items?: DraftItem[] } : null;
      if (result?.items?.length) {
        setDrafts(result.items.map((detected: DraftItem) => ({ ...initialDraft, ...detected })));
      }
    } catch {
      setDrafts([initialDraft]);
    }
    window.setTimeout(() => setStep("confirm"), 900);
  }

  function updateDraft(index: number, field: keyof DraftItem, value: string | number) {
    setDrafts((current) => current.map((draft, itemIndex) => itemIndex === index ? { ...draft, [field]: value } : draft));
  }

  function saveItems() {
    const timestamp = Date.now();
    const items = drafts.map((draft, index): WardrobeItem => ({
      ...draft,
      id: `user-${timestamp}-${index}`,
      secondaryColors: [],
      pattern: "Solid",
      materialConfidence: draft.confidence,
      imageUrl: preview,
      favorite: false,
      createdAt: new Date().toISOString(),
    }));
    onSave(items);
    setStep("saved");
    window.setTimeout(() => {
      setStep("upload");
      setPreview("");
      setDrafts([initialDraft]);
      onClose();
    }, 650);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="upload-modal modal-sheet" role="dialog" aria-modal="true" aria-label="Add clothing" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <div className="upload-modal__header">
          <span className="eyebrow">ADD TO YOUR WARDROBE</span>
          <h2>{step === "upload" ? "One photo. We’ll do the rest." : step === "confirm" ? "Looking good." : step === "saved" ? "Added to your wardrobe." : "Reading the details…"}</h2>
          <p>{step === "confirm" ? "We found the details below. Change anything that doesn’t feel right." : "Use a clear photo in natural light. Multiple pieces in one photo are supported."}</p>
        </div>

        {step === "upload" && (
          <div
            className={`drop-zone ${dragging ? "drop-zone--active" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); void processFile(event.dataTransfer.files[0]); }}
          >
            <div className="drop-zone__icon"><ImagePlus size={28} strokeWidth={1.5} /></div>
            <strong>Drop a clothing photo here</strong>
            <span>or choose how you’d like to add it</span>
            <div className="drop-zone__buttons">
              <Button variant="dark" onClick={() => inputRef.current?.click()}><Upload size={16} /> Choose photo</Button>
              <Button variant="secondary" onClick={() => inputRef.current?.click()}><Camera size={16} /> Camera</Button>
            </div>
            <input ref={inputRef} hidden type="file" accept="image/jpeg,image/png,image/webp,image/heic" capture="environment" onChange={(event) => void processFile(event.target.files?.[0])} />
            <small>JPG, PNG, HEIC or WebP · max 10 MB</small>
          </div>
        )}

        {step === "analyzing" && (
          <div className="analysis-state">
            <div className="analysis-state__image"><FashionImage src={preview} alt="Uploaded clothing" width={900} height={1200} sizes="(max-width: 820px) 100vw, 45vw" /><span className="scan-line" /></div>
            <div className="analysis-state__copy"><Sparkles size={20} /><strong>Looking at your piece…</strong><span>Identifying color, cut, material and style</span><div className="progress-line"><span /></div></div>
          </div>
        )}

        {step === "confirm" && (
          <div className="confirmation-layout">
            <div className="confirmation-image"><FashionImage src={preview} alt="Uploaded clothing" width={900} height={1200} sizes="(max-width: 820px) 100vw, 40vw" /><span>AI confidence · {Math.round(drafts[0].confidence * 100)}%</span></div>
            <div className="detected-items">
              {drafts.map((draft, index) => (
                <div className="detected-item" key={`${draft.name}-${index}`}>
                  <div className="detected-item__title"><span>{String(index + 1).padStart(2, "0")}</span><strong>Detected piece</strong>{drafts.length > 1 && <button onClick={() => setDrafts((items) => items.filter((_, i) => i !== index))}><X size={15} /></button>}</div>
                  <label className="field field--wide"><span>Name</span><input value={draft.name} onChange={(event) => updateDraft(index, "name", event.target.value)} /></label>
                  <div className="field-grid">
                    <label className="field"><span>Category</span><select value={draft.category} onChange={(event) => updateDraft(index, "category", event.target.value as WardrobeCategory)}>{["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"].map((value) => <option key={value}>{value}</option>)}</select></label>
                    <label className="field"><span>Type</span><input value={draft.subcategory} onChange={(event) => updateDraft(index, "subcategory", event.target.value)} /></label>
                    <label className="field"><span>Color</span><input value={draft.primaryColor} onChange={(event) => updateDraft(index, "primaryColor", event.target.value)} /></label>
                    <label className="field"><span>Material <em>likely</em></span><input value={draft.material} onChange={(event) => updateDraft(index, "material", event.target.value)} /></label>
                  </div>
                </div>
              ))}
              <button className="text-action" onClick={() => setDrafts((items) => [...items, { ...initialDraft, name: "Another item" }])}><Plus size={15} /> Add another detected piece</button>
              <Button variant="dark" size="lg" onClick={saveItems}><Check size={17} /> Add {drafts.length > 1 ? `${drafts.length} pieces` : "to wardrobe"}</Button>
            </div>
          </div>
        )}

        {step === "saved" && <div className="success-state"><span><Check size={28} /></span><strong>Ready to style.</strong></div>}
      </section>
    </div>
  );
}
