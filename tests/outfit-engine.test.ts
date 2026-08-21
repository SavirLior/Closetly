import test from "node:test";
import assert from "node:assert/strict";
import { colorCompatibility } from "../lib/outfit-engine/color-compatibility";
import { OutfitScoringService } from "../lib/outfit-engine/outfit-scoring.service";
import { OutfitGenerationService } from "../services/outfit-generation.service";
import { DemoOutfitAIProvider } from "../lib/ai/demo-provider";
import { DEFAULT_PREFERENCES, DEMO_WARDROBE } from "../lib/demo-data";

test("neutral and tonal colors score highly", () => {
  assert.ok(colorCompatibility(["White", "Navy", "Beige"]) >= 0.9);
  assert.ok(colorCompatibility(["Black", "Grey", "White"]) >= 0.9);
});

test("deterministic outfit score stays in a useful percentage range", () => {
  const selected = ["w3", "w8", "w13"].map((id) => DEMO_WARDROBE.find((item) => item.id === id)!);
  const score = new OutfitScoringService().score(selected, { style: "Smart Casual", formality: 6, season: "Summer", preferences: DEFAULT_PREFERENCES });
  assert.ok(score >= 75 && score <= 100);
});

test("locked wardrobe item appears in every generated look", async () => {
  const service = new OutfitGenerationService(new OutfitScoringService(), new DemoOutfitAIProvider());
  const looks = await service.generate({ prompt: "Date tonight", wardrobe: DEMO_WARDROBE, occasion: "Date", style: "Smart Casual", formality: 6, season: "Summer", preferences: DEFAULT_PREFERENCES, lockedItemId: "w13" });
  assert.equal(looks.length, 3);
  assert.ok(looks.every((look) => look.itemIds.includes("w13")));
  assert.ok(looks.every((look) => look.itemIds.every((id) => DEMO_WARDROBE.some((item) => item.id === id))));
});
