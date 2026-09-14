import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { StoredUpload } from "@/models/StoredUpload";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const folder = searchParams.get("folder") || "";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Number(searchParams.get("limit") || 30));

  const query: Record<string, unknown> = {};
  if (search) query.filename = { $regex: search, $options: "i" };
  if (folder) query.folder = folder;

  const [items, total] = await Promise.all([
    StoredUpload.find(query)
      .select("-data")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    StoredUpload.countDocuments(query),
  ]);

  return NextResponse.json({ items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
}
