const NEUTRALS = new Set(["black", "white", "grey", "gray", "navy", "beige", "cream", "brown"]);

const COLOR_FAMILIES: Record<string, string[]> = {
  blue: ["navy", "light blue", "blue", "denim"],
  earth: ["beige", "cream", "brown", "olive", "tan", "camel"],
  mono: ["black", "white", "grey", "gray"],
};

export function colorCompatibility(colors: string[]): number {
  const normalized = colors.map((color) => color.toLowerCase());
  const unique = [...new Set(normalized)];
  if (unique.length <= 1) return 0.92;
  const neutralCount = unique.filter((color) => NEUTRALS.has(color)).length;
  if (neutralCount >= unique.length - 1) return 0.95;

  const inSameFamily = Object.values(COLOR_FAMILIES).some((family) =>
    unique.every((color) => family.includes(color) || NEUTRALS.has(color)),
  );
  if (inSameFamily) return 0.9;
  if (unique.length > 3) return 0.58;
  return 0.76;
}
