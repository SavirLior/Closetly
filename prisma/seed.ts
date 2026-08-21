import { PrismaClient, AnalysisStatus, WardrobeCategory } from "@prisma/client";

const prisma = new PrismaClient();

const demoItems = [
  ["Essential White Tee", "TOPS", "T-shirt", "White", "Cotton", 2],
  ["Soft Black Tee", "TOPS", "T-shirt", "Black", "Cotton", 2],
  ["Light Blue Oxford", "TOPS", "Oxford shirt", "Light Blue", "Cotton", 6],
  ["Crisp White Oxford", "TOPS", "Oxford shirt", "White", "Cotton", 7],
  ["Sand Knitted Polo", "TOPS", "Polo", "Beige", "Cotton knit", 6],
  ["Washed Blue Jeans", "BOTTOMS", "Jeans", "Blue", "Denim", 3],
  ["Straight Black Jeans", "BOTTOMS", "Jeans", "Black", "Denim", 4],
  ["Stone Chinos", "BOTTOMS", "Chinos", "Beige", "Cotton twill", 6],
  ["Navy Tailored Trousers", "BOTTOMS", "Trousers", "Navy", "Wool blend", 8],
  ["Charcoal Pleated Trousers", "BOTTOMS", "Trousers", "Grey", "Wool blend", 7],
  ["Oatmeal Overshirt", "OUTERWEAR", "Overshirt", "Beige", "Cotton", 4],
  ["Navy Unstructured Blazer", "OUTERWEAR", "Blazer", "Navy", "Wool blend", 8],
  ["Clean White Sneakers", "SHOES", "Sneakers", "White", "Leather", 3],
  ["Black Court Sneakers", "SHOES", "Sneakers", "Black", "Leather", 3],
  ["Chestnut Penny Loafers", "SHOES", "Loafers", "Brown", "Leather", 8],
  ["Slim Black Belt", "ACCESSORIES", "Belt", "Black", "Leather", 6],
  ["Cognac Leather Belt", "ACCESSORIES", "Belt", "Brown", "Leather", 6],
] as const;

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@closetly.style" },
    update: {},
    create: { email: "demo@closetly.style", name: "Closetly Demo", preferences: { create: { preferredStyles: ["Minimal", "Smart Casual", "Classic"], favoriteColors: ["Navy", "White", "Beige"], preferredFits: ["Regular", "Relaxed"], preferredFormality: 6, onboardingComplete: true } } },
  });

  await prisma.wardrobeItem.deleteMany({ where: { userId: user.id } });
  await prisma.wardrobeItem.createMany({ data: demoItems.map(([name, category, subcategory, primaryColor, material, formality]) => ({ userId: user.id, name, category: category as WardrobeCategory, subcategory, primaryColor, material, materialConfidence: 0.78, fit: "Regular", fitConfidence: 0.8, styles: formality >= 6 ? ["Smart Casual", "Classic"] : ["Minimal", "Casual"], seasons: ["Spring", "Summer", "Fall"], formality, description: `${primaryColor} ${subcategory.toLowerCase()} from the demo wardrobe.`, analysisStatus: AnalysisStatus.CONFIRMED })) });
  console.log(`Seeded ${demoItems.length} wardrobe pieces for ${user.email}`);
}

main().finally(() => prisma.$disconnect());
