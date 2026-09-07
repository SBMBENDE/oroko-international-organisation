import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGalleryImage {
  _id?: Types.ObjectId;
  url: string;
  caption?: string;
  order: number;
}

export interface IGalleryAlbum extends Document {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  images: IGalleryImage[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    url: { type: String, required: true, trim: true },
    caption: { type: String, trim: true, maxlength: 200 },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const GalleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    description: { type: String, trim: true, maxlength: 500 },
    coverImage: { type: String, trim: true },
    images: { type: [GalleryImageSchema], default: [] },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GalleryAlbumSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = `${this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()}-${Date.now().toString(36)}`;
  }
});

GalleryAlbumSchema.index({ isPublished: 1, createdAt: -1 });

const GalleryAlbum: Model<IGalleryAlbum> =
  mongoose.models.GalleryAlbum ??
  mongoose.model<IGalleryAlbum>("GalleryAlbum", GalleryAlbumSchema);

export default GalleryAlbum;
