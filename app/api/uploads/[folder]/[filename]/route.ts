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

  // Content-Length is intentionally omitted — if the stored `size` field ever
  // drifted from the actual byte length of `data` (e.g. a historical upload
  // edge case), a client would wait forever for bytes that never arrive,
  // since the body is already fully buffered here, let the runtime compute
  // the correct length itself instead of trusting a stored value.
  const bytes = Buffer.from(upload.data as unknown as Buffer);

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": upload.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
