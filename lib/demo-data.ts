import type { OutfitLook, UserPreferences, WardrobeItem } from "./types";

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=86`;

const item = (
  id: string,
  name: string,
  category: WardrobeItem["category"],
  subcategory: string,
  primaryColor: string,
  material: string,
  styles: string[],
  formality: number,
  imageId: string,
  favorite = false,
): WardrobeItem => ({
  id,
  name,
  category,
  subcategory,
  primaryColor,
  secondaryColors: [],
  pattern: "Solid",
  material,
  materialConfidence: 0.78,
  fit: "Regular",
  styles,
  seasons: ["Spring", "Summer", "Fall"],
  formality,
  description: `${primaryColor} ${material.toLowerCase()} ${subcategory.toLowerCase()} with a clean, versatile silhouette.`,
  imageUrl: image(imageId),
  favorite,
  createdAt: new Date(2026, 7, Number(id.replace(/\D/g, "")) || 1).toISOString(),
});

export const DEMO_WARDROBE: WardrobeItem[] = [
  item("w1", "Essential White Tee", "Tops", "T-shirt", "White", "Cotton", ["Minimal", "Casual"], 2, "photo-1521572163474-6864f9cf17ab", true),
  item("w2", "Soft Black Tee", "Tops", "T-shirt", "Black", "Cotton", ["Minimal", "Streetwear"], 2, "photo-1618354691373-d851c5c3a990"),
  item("w3", "Light Blue Oxford", "Tops", "Oxford shirt", "Light Blue", "Cotton", ["Smart Casual", "Classic"], 6, "photo-1603252109303-2751441dd157", true),
  item("w4", "Crisp White Oxford", "Tops", "Oxford shirt", "White", "Cotton", ["Classic", "Formal"], 7, "photo-1602810318383-e386cc2a3ccf"),
  item("w5", "Sand Knitted Polo", "Tops", "Polo", "Beige", "Cotton knit", ["Old Money", "Smart Casual"], 6, "photo-1576566588028-4147f3842f27"),
  item("w6", "Washed Blue Jeans", "Bottoms", "Jeans", "Blue", "Denim", ["Casual", "Classic"], 3, "photo-1542272604-787c3835535d", true),
  item("w7", "Straight Black Jeans", "Bottoms", "Jeans", "Black", "Denim", ["Minimal", "Streetwear"], 4, "photo-1541099649105-f69ad21f3246"),
  item("w8", "Stone Chinos", "Bottoms", "Chinos", "Beige", "Cotton twill", ["Smart Casual", "Classic"], 6, "photo-1506629082955-511b1aa562c8", true),
  item("w9", "Navy Tailored Trousers", "Bottoms", "Trousers", "Navy", "Wool blend", ["Classic", "Formal"], 8, "photo-1598033129183-c4f50c736f10"),
  item("w10", "Charcoal Pleated Trousers", "Bottoms", "Trousers", "Grey", "Wool blend", ["Minimal", "Smart Casual"], 7, "photo-1515886657613-9f3515b0c78f"),
  item("w11", "Oatmeal Overshirt", "Outerwear", "Overshirt", "Beige", "Cotton", ["Minimal", "Scandinavian"], 4, "photo-1591047139829-d91aecb6caea", true),
  item("w12", "Navy Unstructured Blazer", "Outerwear", "Blazer", "Navy", "Wool blend", ["Smart Casual", "Classic"], 8, "photo-1551488831-00ddcb6c6bd3"),
  item("w13", "Clean White Sneakers", "Shoes", "Sneakers", "White", "Leather", ["Minimal", "Casual"], 3, "photo-1491553895911-0055eca6402d", true),
  item("w14", "Black Court Sneakers", "Shoes", "Sneakers", "Black", "Leather", ["Minimal", "Streetwear"], 3, "photo-1542291026-7eec264c27ff"),
  item("w15", "Chestnut Penny Loafers", "Shoes", "Loafers", "Brown", "Leather", ["Old Money", "Classic"], 8, "photo-1614252369475-531eba835eb1", true),
  item("w16", "Slim Black Belt", "Accessories", "Belt", "Black", "Leather", ["Classic", "Minimal"], 6, "photo-1624222247344-550fb60583dc"),
  item("w17", "Cognac Leather Belt", "Accessories", "Belt", "Brown", "Leather", ["Classic", "Smart Casual"], 6, "photo-1584917865442-de89df76afd3"),
];

export const DEMO_LOOKS: OutfitLook[] = [
  {
    id: "look-1",
    title: "Blue Hour",
    occasion: "Date",
    style: "Smart Casual",
    score: 94,
    explanation: "The soft blue Oxford and stone chinos feel considered without trying too hard. White sneakers keep the look relaxed for the evening.",
    itemIds: ["w3", "w8", "w13"],
  },
  {
    id: "look-2",
    title: "Quiet Weekend",
    occasion: "Weekend",
    style: "Minimal",
    score: 91,
    explanation: "A clean tonal base with relaxed denim. The oatmeal overshirt adds depth while the simple sneakers keep everything effortless.",
    itemIds: ["w1", "w6", "w11", "w13"],
  },
  {
    id: "look-3",
    title: "Soft Structure",
    occasion: "Dinner",
    style: "Classic",
    score: 89,
    explanation: "The knitted polo softens the tailored trousers, while brown loafers add a warm, polished finish that still feels contemporary.",
    itemIds: ["w5", "w9", "w15", "w17"],
  },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  preferredStyles: ["Minimal", "Smart Casual", "Classic"],
  favoriteColors: ["Navy", "White", "Beige"],
  dislikedColors: ["Neon"],
  preferredFits: ["Regular", "Relaxed"],
  preferredFormality: 6,
};
