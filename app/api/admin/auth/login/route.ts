import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { signAdminToken, setAdminSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
  }

  await connectDB();
  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });

  if (!admin || !admin.active) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = signAdminToken({
    id: admin._id.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  await setAdminSessionCookie(token);

  return NextResponse.json({ success: true });
}
