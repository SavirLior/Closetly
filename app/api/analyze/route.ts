import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/auth/auth.service";

const requestSchema = z.object({ imageUrl: z.string().min(1).max(2_000), fileName: z.string().max(240).optional() });

export async function POST(request: Request) {
  try {
    await requireApiUser();
    const input = requestSchema.parse(await request.json());
    const multiple = /outfit|look|full/i.test(input.fileName ?? "");
    const base = {
      category: "Tops",
      subcategory: "Oxford shirt",
      name: "Light Blue Oxford Shirt",
      primaryColor: "Light Blue",
      material: "Cotton",
      fit: "Regular",
      styles: ["Smart Casual", "Classic"],
      seasons: ["Spring", "Summer", "Fall"],
      formality: 6,
      description: "Light blue cotton Oxford shirt with a regular fit.",
      confidence: 0.91,
    };
    const items = multiple ? [
      base,
      { ...base, category: "Bottoms", subcategory: "Jeans", name: "Mid Blue Straight Jeans", primaryColor: "Blue", material: "Denim", formality: 3, confidence: 0.88 },
      { ...base, category: "Shoes", subcategory: "Sneakers", name: "Clean White Sneakers", primaryColor: "White", material: "Leather", formality: 3, confidence: 0.84 },
    ] : [base];
    return NextResponse.json({ provider: "demo", items });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: "That image could not be analyzed. Please try another photo." }, { status: 400 });
    return NextResponse.json({ message: "Clothing analysis is temporarily unavailable." }, { status: 503 });
  }
}
