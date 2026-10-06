import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { StoredUpload } from "@/models/StoredUpload";

export const runtime = "nodejs";

const ALLOWED_FOLDERS = ["products", "gallery", "pages", "misc"];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return new NextResponse("Not found", { status: 404 });
  }

  await connectDB();
  const upload = await StoredUpload.findOne({ folder, filename }).lean();

  if (!upload) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Under .lean(), a Buffer-typed field comes back as a raw BSON Binary
  // wrapper object ({ buffer, sub_type, position }), not a plain Buffer —
  // Buffer.from() on that wrapper silently yields 0 bytes since it isn't
  // array-like. The actual bytes live on its `.buffer` property.
  const raw = upload.data as unknown as { buffer: Buffer } | Buffer;
  const bytes = Buffer.isBuffer(raw) ? raw : raw.buffer;

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": upload.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
