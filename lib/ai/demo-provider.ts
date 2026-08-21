import type { ClothingVisionProvider, OutfitAIProvider, OutfitRankingInput } from "./providers";
import type { DetectedClothingItem } from "./schemas";
import type { OutfitLook } from "../types";

export class DemoClothingVisionProvider implements ClothingVisionProvider {
  async analyzeClothing(): Promise<DetectedClothingItem[]> {
    return [{
      category: "Tops",
      subcategory: "Oxford shirt",
      name: "Light Blue Oxford Shirt",
      primaryColor: "Light Blue",
      secondaryColors: [],
      pattern: { value: "Solid", confidence: 0.96 },
      material: { value: "Cotton", confidence: 0.72 },
      fit: { value: "Regular", confidence: 0.81 },
      styles: ["Smart Casual", "Classic"],
      seasons: ["Spring", "Summer", "Fall"],
      formality: 6,
      description: "Light blue Oxford shirt with a clean, regular silhouette.",
    }];
  }
}

export class DemoOutfitAIProvider implements OutfitAIProvider {
  async rankOutfits(input: OutfitRankingInput): Promise<OutfitLook[]> {
    return input.candidates.slice(0, 3).map((candidate, index) => ({
      id: `ranked-${index + 1}`,
      title: ["Balanced Ease", "Quiet Contrast", "Soft Structure"][index] ?? `Look ${index + 1}`,
      occasion: "Everyday",
      style: "Smart Casual",
      score: candidate.deterministicScore,
      explanation: "The colors, formality and silhouettes work together while keeping the outfit useful and easy to wear.",
      itemIds: candidate.itemIds,
    }));
  }
}
