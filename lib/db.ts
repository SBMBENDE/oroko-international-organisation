import "server-only";
import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.__mongooseCache ?? {
  conn: null,
  promise: null,
};
global.__mongooseCache = cached;

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your .env.local file."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
