import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { StoredUpload } from "@/models/StoredUpload";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED_FOLDERS = ["products", "gallery", "pages", "misc"];
const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") || "");

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ success: false, error: "Invalid folder" }, { status: 400 });
  }

  const ext = ALLOWED_MIME[file.type];
  if (!ext) {
    return NextResponse.json({ success: false, error: "Unsupported file type" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "File too large (max 8MB)" }, { status: 400 });
  }

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await connectDB();
  await StoredUpload.create({
    folder,
    filename,
    mimeType: file.type,
    size: file.size,
    data: buffer,
  });

  return NextResponse.json({
    success: true,
    url: `/api/uploads/${folder}/${filename}`,
    filename,
    size: file.size,
    folder,
  });
}
