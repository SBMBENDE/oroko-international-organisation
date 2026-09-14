import "server-only";
import { connectDB } from "@/lib/db";
import NewsFlash from "@/models/NewsFlash";

export interface ActiveNewsFlash {
  id: string;
  title: string;
  message: string;
}

export async function getActiveNewsFlashes(limit = 5): Promise<ActiveNewsFlash[]> {
  await connectDB();

  const flashes = await NewsFlash.find({
    status: "published",
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return flashes.map((f) => ({ id: f._id.toString(), title: f.title, message: f.message }));
}
