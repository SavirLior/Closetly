import { detectedClothingItemsSchema, type DetectedClothingItem } from "@/lib/ai/schemas";
import type { BackgroundRemovalProvider } from "@/lib/storage/storage-provider";
import type { ClothingVisionProvider } from "@/lib/ai/providers";

export class ClothingAnalysisService {
  constructor(
    private readonly visionProvider: ClothingVisionProvider,
    private readonly backgroundRemovalProvider: BackgroundRemovalProvider,
  ) {}

  async analyze(imageUrl: string): Promise<{ cleanImageUrl: string; items: DetectedClothingItem[] }> {
    const [{ imageUrl: cleanImageUrl }, rawItems] = await Promise.all([
      this.backgroundRemovalProvider.removeBackground(imageUrl),
      this.visionProvider.analyzeClothing(imageUrl),
    ]);
    return { cleanImageUrl, items: detectedClothingItemsSchema.parse(rawItems) };
  }
}
