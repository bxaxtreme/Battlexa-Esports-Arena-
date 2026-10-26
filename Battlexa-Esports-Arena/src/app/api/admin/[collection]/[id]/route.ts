import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { isContentCollection } from "@/lib/collections";

export async function PATCH(request: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { collection, id } = await params;
  if (!isContentCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  try {
    const data = await request.json();
    if (!data || typeof data !== "object" || Array.isArray(data) || !String(data.title || "").trim()) return NextResponse.json({ error: "A JSON object with a title is required." }, { status: 400 });
    delete data._id; delete data.id; delete data.createdAt;
    const db = await getDb();
    const result = await db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: { ...data, title: String(data.title).trim(), updatedAt: new Date().toISOString() } });
    return result.matchedCount ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Item not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update item" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { collection, id } = await params;
  if (!isContentCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  try {
    const db = await getDb();
    const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Item not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete item" }, { status: 500 });
  }
}
