import "server-only";
import { connectDB } from "@/lib/db";
import MembershipType from "@/models/MembershipType";

const DEFAULT_TYPES = [
  { name: "Regular", slug: "regular", order: 0 },
  { name: "Honorary", slug: "honorary", order: 1 },
];

/** Seeds the two initial membership types on first use so Settings always has something to show. */
export async function getMembershipTypes(activeOnly = false) {
  await connectDB();

  const count = await MembershipType.countDocuments({});
  if (count === 0) {
    await MembershipType.insertMany(DEFAULT_TYPES);
  }

  const filter = activeOnly ? { isActive: true } : {};
  const types = await MembershipType.find(filter).sort({ order: 1, name: 1 }).lean();
  return types.map((t) => ({
    id: t._id.toString(),
    name: t.name,
    slug: t.slug,
    description: t.description,
    isActive: t.isActive,
    order: t.order,
  }));
}
