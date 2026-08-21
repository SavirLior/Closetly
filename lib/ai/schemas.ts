import { z } from "zod";

const uncertainString = z.object({
  value: z.string(),
  confidence: z.number().min(0).max(1),
});

export const detectedClothingItemSchema = z.object({
  category: z.enum(["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"]),
  subcategory: z.string().min(1),
  name: z.string().min(1),
  primaryColor: z.string().min(1),
  secondaryColors: z.array(z.string()).default([]),
  pattern: uncertainString,
  material: uncertainString,
  fit: uncertainString,
  styles: z.array(z.string()).min(1),
  seasons: z.array(z.string()).min(1),
  formality: z.number().int().min(1).max(10),
  description: z.string().min(1).max(240),
});

export const detectedClothingItemsSchema = z.array(detectedClothingItemSchema).min(1).max(8);
export type DetectedClothingItem = z.infer<typeof detectedClothingItemSchema>;

export const outfitIntentSchema = z.object({
  prompt: z.string().max(600),
  occasion: z.string().max(60),
  style: z.string().max(60),
  formality: z.number().int().min(1).max(10),
  lockedItemId: z.string().optional(),
  weather: z.string().max(160).optional(),
});
