import type { DetectedClothingItem } from "./schemas";
import type { OutfitLook, WardrobeItem } from "../types";

export interface ClothingVisionProvider {
  analyzeClothing(imageUrl: string): Promise<DetectedClothingItem[]>;
}

export type OutfitRankingInput = {
  prompt: string;
  candidates: Array<{ itemIds: string[]; deterministicScore: number }>;
  wardrobe: Pick<WardrobeItem, "id" | "name" | "category" | "primaryColor" | "styles" | "formality">[];
  lockedItemId?: string;
};

export interface OutfitAIProvider {
  rankOutfits(input: OutfitRankingInput): Promise<OutfitLook[]>;
}

export interface EmbeddingProvider {
  embedText(value: string): Promise<number[]>;
  embedImage(imageUrl: string): Promise<number[]>;
}
