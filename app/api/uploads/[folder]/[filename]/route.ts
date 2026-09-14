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

  return new NextResponse(upload.data as unknown as Buffer, {
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(upload.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
