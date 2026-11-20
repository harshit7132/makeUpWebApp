import { NextResponse } from "next/server";
import { adminDb } from "../../../../../lib/firebase-admin";
import { updateDevGalleryItem, deleteDevGalleryItem } from "../../../../../lib/booking/dev-store";
import type { GalleryPhoto } from "../../../../../lib/site-images";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing item ID" }, { status: 400 });

    const updates = (await req.json()) as Partial<GalleryPhoto>;

    try {
      const db = adminDb();
      await db.collection("gallery").doc(id).update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // dev fallback
    }

    const updated = updateDevGalleryItem(id, updates);
    return NextResponse.json({ ok: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing item ID" }, { status: 400 });

    try {
      const db = adminDb();
      await db.collection("gallery").doc(id).delete();
    } catch {
      // dev fallback
    }

    const deleted = deleteDevGalleryItem(id);
    return NextResponse.json({ ok: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete gallery item" }, { status: 500 });
  }
}
