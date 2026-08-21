import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/auth/auth.service";
import { getDb } from "@/db";
import { outfitFeedback } from "@/db/schema";

const schema = z.object({ outfitId: z.string().min(1).max(120), type: z.enum(["LOVE", "DISLIKE"]), reason: z.string().max(120).optional() });

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const input = schema.parse(await request.json());
    await getDb().insert(outfitFeedback).values({ id: crypto.randomUUID(), userId: user.id, outfitId: input.outfitId, type: input.type, reason: input.reason, createdAt: new Date() });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: "Invalid feedback." }, { status: 400 });
    return NextResponse.json({ ok: true, persisted: false });
  }
}
