import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type NewsFlashStatus = "draft" | "published" | "scheduled";

export interface INewsFlash extends Document {
  title: string;
  message: string;
  image?: string;
  author: Types.ObjectId;
  authorName: string;
  status: NewsFlashStatus;
  publishAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsFlashSchema = new Schema<INewsFlash>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    image: { type: String, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true, trim: true },
    status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
    publishAt: { type: Date },
  },
  { timestamps: true }
);

NewsFlashSchema.index({ status: 1, createdAt: -1 });

const NewsFlash: Model<INewsFlash> =
  mongoose.models.NewsFlash ?? mongoose.model<INewsFlash>("NewsFlash", NewsFlashSchema);

export default NewsFlash;
