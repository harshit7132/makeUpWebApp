import { NextResponse } from "next/server";
import { adminDb } from "../../../../lib/firebase-admin";
import { getGalleryItems } from "../../../../lib/booking/server";
import { addDevGalleryItem } from "../../../../lib/booking/dev-store";
import type { GalleryPhoto } from "../../../../lib/site-images";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getGalleryItems();
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load gallery" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<GalleryPhoto>;
    const { title, category, desc, src, full, ratio, images } = body;

    if (!title || !src) {
      return NextResponse.json({ error: "Title and main photo URL are required." }, { status: 400 });
    }

    const cleanImages = Array.isArray(images) ? images.filter((img) => typeof img === "string" && img.trim().length > 0) : [];

    const newItem: GalleryPhoto = {
      id: body.id || `gal-${Date.now()}`,
      title: title.trim(),
      category: (category as any) || "Bridal",
      desc: (desc || "").trim(),
      src: src.trim(),
      full: (full || src).trim(),
      ratio: typeof ratio === "number" && ratio > 0 ? ratio : 2 / 3,
      images: cleanImages.length > 0 ? cleanImages : undefined,
      sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 1,
    };

    try {
      const db = adminDb();
      const docRef = newItem.id ? db.collection("gallery").doc(newItem.id) : db.collection("gallery").doc();
      newItem.id = docRef.id;
      await docRef.set({
        ...newItem,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // In dev mode when offline, store in dev-store
      addDevGalleryItem(newItem);
    }

    addDevGalleryItem(newItem);

    return NextResponse.json({ ok: true, item: newItem });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create gallery item" }, { status: 500 });
  }
}
