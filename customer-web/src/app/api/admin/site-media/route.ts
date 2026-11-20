import { NextResponse } from "next/server";
import { adminDb } from "../../../../lib/firebase-admin";
import { getSiteMedia } from "../../../../lib/booking/server";
import { updateDevSiteMedia } from "../../../../lib/booking/dev-store";
import type { SiteMedia } from "../../../../lib/site-images";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const media = await getSiteMedia();
    return NextResponse.json({ media });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load site media" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SiteMedia>;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    try {
      const db = adminDb();
      await db.doc("settings/site_media").set(body, { merge: true });
    } catch {
      // In dev mode when Firestore emulator is offline, update dev-store
      updateDevSiteMedia(body);
    }

    // Also update dev store memory for instant client refresh
    updateDevSiteMedia(body);

    const updated = await getSiteMedia();
    return NextResponse.json({ ok: true, media: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update site media" }, { status: 500 });
  }
}
