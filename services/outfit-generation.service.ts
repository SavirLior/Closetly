import type { OutfitAIProvider } from "@/lib/ai/providers";
import { OutfitScoringService } from "@/lib/outfit-engine/outfit-scoring.service";
import type { OutfitLook, UserPreferences, WardrobeItem } from "@/lib/types";

type GenerationInput = {
  prompt: string;
  wardrobe: WardrobeItem[];
  occasion: string;
  style: string;
  formality: number;
  season: string;
  preferences: UserPreferences;
  lockedItemId?: string;
};

export class OutfitGenerationService {
  constructor(private readonly scoring: OutfitScoringService, private readonly ai: OutfitAIProvider) {}

  async generate(input: GenerationInput): Promise<OutfitLook[]> {
    const tops = input.wardrobe.filter((item) => item.category === "Tops");
    const bottoms = input.wardrobe.filter((item) => item.category === "Bottoms");
    const shoes = input.wardrobe.filter((item) => item.category === "Shoes");
    const outerwear = input.wardrobe.filter((item) => item.category === "Outerwear");
    const candidates: WardrobeItem[][] = [];

    for (const top of tops) for (const bottom of bottoms) for (const shoe of shoes) {
      const base = [top, bottom, shoe];
      candidates.push(base);
      for (const layer of outerwear.slice(0, 4)) candidates.push([...base, layer]);
    }

    const eligible = candidates
      .filter((candidate) => !input.lockedItemId || candidate.some((item) => item.id === input.lockedItemId))
      .map((candidate) => ({
        itemIds: candidate.map((item) => item.id),
        deterministicScore: this.scoring.score(candidate, { style: input.style, formality: input.formality, season: input.season, preferences: input.preferences }),
      }))
      .sort((a, b) => b.deterministicScore - a.deterministicScore)
      .slice(0, 12);

    if (!eligible.length) throw new Error("NOT_ENOUGH_MATCHING_PIECES");
    return this.ai.rankOutfits({
      prompt: input.prompt,
      candidates: eligible,
      wardrobe: input.wardrobe,
      lockedItemId: input.lockedItemId,
    });
  }
}
