import { NextResponse } from "next/server";
import { adminBucket } from "../../../../lib/firebase-admin";

export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string" || typeof (file as Blob).arrayBuffer !== "function") {
      return NextResponse.json({ error: "Please choose an image file to upload." }, { status: 400 });
    }

    const blob = file as File;
    const contentType = (blob.type || "").toLowerCase();
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files (JPG, PNG, WebP) are supported." }, { status: 400 });
    }

    if (blob.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image file must be under 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await blob.arrayBuffer());

    try {
      const bucket = adminBucket();
      const ext = (contentType.split("/")[1] || "jpg").replace(/[^a-z0-9]/gi, "");
      const cleanName = (blob.name || "image")
        .replace(/\.[^.]*$/, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .slice(0, 40);
      const storagePath = `site_media/${Date.now()}-${cleanName}.${ext}`;
      const bucketFile = bucket.file(storagePath);

      await bucketFile.save(buffer, {
        resumable: false,
        contentType,
        metadata: { contentType },
      });

      // Try making public or get signed URL
      try {
        await bucketFile.makePublic();
        const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
        return NextResponse.json({ ok: true, url });
      } catch {
        const [signedUrl] = await bucketFile.getSignedUrl({
          action: "read",
          expires: "03-01-2035",
        });
        return NextResponse.json({ ok: true, url: signedUrl });
      }
    } catch {
      // In local dev when bucket is offline, return base64 data URL so preview works immediately!
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${contentType};base64,${base64}`;
      return NextResponse.json({ ok: true, url: dataUrl });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to upload image" }, { status: 500 });
  }
}
