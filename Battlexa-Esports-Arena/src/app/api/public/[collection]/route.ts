import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isContentCollection } from "@/lib/collections";
import { sampleContent } from "@/lib/seed";

export async function GET(_: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isContentCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  try {
    const db = await getDb();
    const items = await db.collection(collection).find({}).sort({ createdAt: -1 }).limit(100).toArray();
    return NextResponse.json(items.map(({ _id, ...rest }) => ({ id: String(_id), ...rest })));
  } catch (error) {
    console.error("Public API database fallback:", error instanceof Error ? error.message : error);
    return NextResponse.json(sampleContent[collection]);
  }
}
