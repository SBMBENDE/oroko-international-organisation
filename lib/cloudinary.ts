import "server-only";
import { v2 as cloudinary } from "cloudinary";

// Configured once at module load — server-only, never sent to the browser
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
