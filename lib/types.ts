export type WardrobeCategory =
  | "Tops"
  | "Bottoms"
  | "Outerwear"
  | "Shoes"
  | "Accessories";

export type WardrobeItem = {
  id: string;
  name: string;
  category: WardrobeCategory;
  subcategory: string;
  primaryColor: string;
  secondaryColors: string[];
  pattern: string;
  material: string;
  materialConfidence?: number;
  fit: string;
  styles: string[];
  seasons: string[];
  formality: number;
  description: string;
  imageUrl: string;
  favorite: boolean;
  createdAt: string;
};

export type OutfitItemRole = "top" | "bottom" | "outerwear" | "shoes" | "accessory";

export type OutfitLook = {
  id: string;
  title: string;
  occasion: string;
  style: string;
  score: number;
  explanation: string;
  itemIds: string[];
  feedback?: "LOVE" | "DISLIKE";
  saved?: boolean;
};

export type ViewName = "home" | "wardrobe" | "outfits" | "saved" | "profile";

export type UserPreferences = {
  preferredStyles: string[];
  favoriteColors: string[];
  dislikedColors: string[];
  preferredFits: string[];
  preferredFormality: number;
};
