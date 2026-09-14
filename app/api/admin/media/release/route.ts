import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { deleteStoredUploadByUrl } from "@/lib/deleteStoredUpload";

const releaseSchema = z.object({
  url: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = releaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await deleteStoredUploadByUrl(parsed.data.url);
  return NextResponse.json({ success: true });
}
