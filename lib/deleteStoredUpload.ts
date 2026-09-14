import { connectDB } from "@/lib/mongodb";
import { StoredUpload } from "@/models/StoredUpload";

export async function deleteStoredUploadByUrl(url?: string | null) {
  if (!url || !url.startsWith("/api/uploads/")) return;

  const parts = url.replace("/api/uploads/", "").split("/");
  if (parts.length !== 2) return;
  const [folder, filename] = parts;

  try {
    await connectDB();
    await StoredUpload.deleteOne({ folder, filename });
  } catch (err) {
    console.error("Failed to delete stored upload:", err);
  }
}
