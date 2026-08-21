"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FashionImage } from "@/components/ui/FashionImage";

const styles = ["Minimal", "Casual", "Smart Casual", "Streetwear", "Classic", "Old Money", "Sporty", "Formal", "Scandinavian", "Vintage"];
const colors = ["Black", "White", "Navy", "Beige", "Brown", "Grey", "Blue", "Green"];

type Props = { open: boolean; onClose: () => void; onAddFirstItem: () => void };

export function OnboardingModal({ open, onClose, onAddFirstItem }: Props) {
  const [step, setStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState(["Minimal", "Smart Casual"]);
  const [selectedColors, setSelectedColors] = useState(["Navy", "Beige"]);

  if (!open) return null;
  const toggle = (value: string, selected: string[], setSelected: (values: string[]) => void) =>
    setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-label="Welcome to Closetly">
      <button className="onboarding__close" onClick={onClose} aria-label="Explore demo wardrobe"><X size={20} /></button>
      <div className="onboarding__visual">
        <FashionImage src="https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=1600&q=88" alt="A refined neutral wardrobe" width={1600} height={1200} priority sizes="50vw" />
        <div className="onboarding__brand"><span className="brand__mark">C</span><span>CLOSETLY</span></div>
        <div className="onboarding__quote">“A better way to wear<br />what you already own.”</div>
        <span className="onboarding__credit">YOUR WARDROBE · INTELLIGENTLY STYLED</span>
      </div>
      <div className="onboarding__panel">
        <div className="step-dots">{[0, 1, 2, 3].map((dot) => <span key={dot} className={dot <= step ? "active" : ""} />)}</div>
        {step === 0 && (
          <div className="onboarding__content onboarding__content--welcome">
            <div className="eyebrow">WELCOME</div>
            <h1>Your clothes.<br /><em>More possibilities.</em></h1>
            <p>Closetly learns your wardrobe and creates outfits using only the pieces you actually own.</p>
            <label className="email-field"><Mail size={18} /><input type="email" placeholder="Email address" aria-label="Email address" /></label>
            <Button variant="dark" size="lg" onClick={() => setStep(1)}>Continue with email <ArrowRight size={17} /></Button>
            <button className="demo-link" onClick={onClose}>Explore the demo wardrobe</button>
            <small>By continuing, you agree to our Terms and Privacy Policy.</small>
          </div>
        )}
        {step === 1 && (
          <div className="onboarding__content">
            <div className="eyebrow">01 · YOUR STYLE</div><h2>What feels like you?</h2><p>Choose as many as you like. We’ll use this as a starting point.</p>
            <div className="selection-grid">{styles.map((style) => <button key={style} className={selectedStyles.includes(style) ? "selected" : ""} onClick={() => toggle(style, selectedStyles, setSelectedStyles)}>{selectedStyles.includes(style) && <Check size={15} />}{style}</button>)}</div>
            <div className="onboarding__footer"><button onClick={() => setStep(0)}><ArrowLeft size={17} /> Back</button><Button variant="dark" onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></Button></div>
          </div>
        )}
        {step === 2 && (
          <div className="onboarding__content">
            <div className="eyebrow">02 · THE DETAILS</div><h2>A little more about you.</h2><p>Optional, but helpful for recommendations that feel right.</p>
            <span className="field-label">COLORS YOU LOVE</span>
            <div className="color-selection">{colors.map((color) => <button key={color} className={selectedColors.includes(color) ? "selected" : ""} onClick={() => toggle(color, selectedColors, setSelectedColors)}><span style={{ background: color.toLowerCase() }} />{color}</button>)}</div>
            <span className="field-label">PREFERRED FIT</span><div className="segmented"><button>Fitted</button><button className="active">Regular</button><button>Relaxed</button><button>Oversized</button></div>
            <div className="onboarding__footer"><button onClick={() => setStep(1)}><ArrowLeft size={17} /> Back</button><Button variant="dark" onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></Button></div>
          </div>
        )}
        {step === 3 && (
          <div className="onboarding__content onboarding__content--final">
            <span className="sparkle-orb"><Sparkles size={28} /></span><div className="eyebrow">YOU’RE ALL SET</div><h2>Let’s add your first piece.</h2><p>Take a photo and our AI will identify the details. You’ll always have the final say.</p>
            <Button variant="dark" size="lg" onClick={() => { onClose(); onAddFirstItem(); }}>Add my first piece <ArrowRight size={17} /></Button>
            <button className="demo-link" onClick={onClose}>I’ll do this later</button>
          </div>
        )}
      </div>
    </div>
  );
}
