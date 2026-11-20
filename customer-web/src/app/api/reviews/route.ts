import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../../../lib/firebase-admin";
import { getApprovedReviews, jsonError, rateLimit, clientIp } from "../../../lib/booking/server";
import { addDevReview } from "../../../lib/booking/dev-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = await getApprovedReviews(100);
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  if (!rateLimit(`review:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return jsonError("Too many submissions. Please wait a few minutes.", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid review payload.", 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name.length < 2) {
    return jsonError("Please enter your name.", 400);
  }

  const ratingRaw = Number(body.rating);
  const rating = Number.isInteger(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : 5;

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (text.length < 5) {
    return jsonError("Please write a few words about your makeup experience.", 400);
  }

  const eventType = typeof body.eventType === "string" && body.eventType.trim() ? body.eventType.trim() : "Signature Bridal Makeup";
  const city = typeof body.city === "string" && body.city.trim() ? body.city.trim() : "Jodhpur";
  const date = typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date.trim())
    ? body.date.trim()
    : new Date().toISOString().slice(0, 10);
  const bookingId = typeof body.bookingId === "string" ? body.bookingId.trim() : "";

  const newReviewData = {
    bookingId: bookingId || undefined,
    name,
    rating,
    text,
    eventType,
    city,
    date,
    approved: true, // Auto-approve so it shows on the site immediately
  };

  try {
    const db = adminDb();
    const docRef = await db.collection("reviews").add({
      ...newReviewData,
      createdAt: FieldValue.serverTimestamp(),
    });

    try {
      revalidateTag("reviews");
    } catch {}

    // Also update dev-store in case of dev mode
    const devRev = addDevReview({
      id: docRef.id,
      ...newReviewData,
    });

    return NextResponse.json({
      ok: true,
      review: devRev,
      message: "Thank you! Your review has been submitted and is now featured on our website.",
    });
  } catch (err: any) {
    console.warn("[reviews/create] Firestore offline in dev, saving to dev-store:", err?.message || err);
    const devRev = addDevReview(newReviewData);

    try {
      revalidateTag("reviews");
    } catch {}

    return NextResponse.json({
      ok: true,
      review: devRev,
      message: "Thank you! Your review has been submitted and is now featured on our website.",
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return jsonError("Review ID required", 400);

    try {
      const db = adminDb();
      await db.collection("reviews").doc(id).delete();
    } catch {}

    try {
      revalidateTag("reviews");
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return jsonError(err?.message || "Failed to delete review", 500);
  }
}
