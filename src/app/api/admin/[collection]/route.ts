import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { isContentCollection } from "@/lib/collections";

export async function GET(_: Request, { params }: { params: Promise<{ collection: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { collection } = await params;
  if (!isContentCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  try {
    const db = await getDb();
    const rows = await db.collection(collection).find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(rows.map(({ _id, ...row }) => ({ id: String(_id), ...row })));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { collection } = await params;
  if (!isContentCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  try {
    const data = await request.json();
    if (!data || typeof data !== "object" || Array.isArray(data) || !String(data.title || "").trim()) {
      return NextResponse.json({ error: "A JSON object with a title is required." }, { status: 400 });
    }
    const db = await getDb();
    const now = new Date().toISOString();
    const result = await db.collection(collection).insertOne({ ...data, title: String(data.title).trim(), createdAt: now, updatedAt: now });
    return NextResponse.json({ ok: true, id: String(result.insertedId) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save item" }, { status: 400 });
  }
}
