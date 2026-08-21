import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/auth/auth.service";
import { getDb } from "@/db";
import { savedOutfits } from "@/db/schema";

const schema = z.object({ outfitId: z.string().min(1).max(120), title: z.string().min(1).max(120) });

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const input = schema.parse(await request.json());
    await getDb().insert(savedOutfits).values({ id: crypto.randomUUID(), userId: user.id, outfitId: input.outfitId, title: input.title, createdAt: new Date() });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: "That look could not be saved." }, { status: 400 });
    return NextResponse.json({ ok: true, persisted: false });
  }
}
