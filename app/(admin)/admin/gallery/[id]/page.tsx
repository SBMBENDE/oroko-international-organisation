import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import GalleryAlbum from "@/models/GalleryAlbum";
import { Types } from "mongoose";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { AlbumImagesManager } from "@/components/admin/gallery/AlbumImagesManager";
import { ToggleAlbumButton } from "@/components/admin/gallery/ToggleAlbumButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.GALLERY_MANAGE)) redirect("/admin");
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) notFound();

  await connectDB();
  const album = await GalleryAlbum.findById(id).lean();
  if (!album) notFound();

  return (
    <div>
      <PageHeader
        title={album.title}
        description={album.description || "No description"}
        action={<ToggleAlbumButton id={id} isPublished={album.isPublished} />}
      />
      <Card>
        <CardContent className="pt-4">
          <AlbumImagesManager
            albumId={id}
            images={album.images.map((img) => ({ id: img._id!.toString(), url: img.url, caption: img.caption }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
