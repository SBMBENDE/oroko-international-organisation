import Link from "next/link";
import { redirect } from "next/navigation";
import { Images } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import GalleryAlbum from "@/models/GalleryAlbum";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/badge";
import { AlbumFormDialog } from "@/components/admin/gallery/AlbumFormDialog";
import { ToggleAlbumButton } from "@/components/admin/gallery/ToggleAlbumButton";

export default async function GalleryPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.GALLERY_MANAGE)) redirect("/admin");
  await connectDB();
  const albums = await GalleryAlbum.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PageHeader title="Gallery" description="Photo albums shown on the public gallery page." action={<AlbumFormDialog />} />

      {albums.length === 0 ? (
        <EmptyState icon={Images} title="No albums yet" description="Create the first album to get started." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Album</th>
            <th>Images</th>
            <th>Status</th>
            <th />
          </AdminTableHead>
          <tbody>
            {albums.map((a) => (
              <AdminTableRow key={a._id.toString()}>
                <td className="font-medium text-oroko-black">
                  <Link href={`/admin/gallery/${a._id.toString()}`} className="hover:underline">{a.title}</Link>
                </td>
                <td>{a.images.length}</td>
                <td>
                  <Badge variant="outline" className={a.isPublished ? "border-transparent bg-oroko-green/10 text-oroko-green" : "text-muted-foreground"}>
                    {a.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="text-right"><ToggleAlbumButton id={a._id.toString()} isPublished={a.isPublished} /></td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
