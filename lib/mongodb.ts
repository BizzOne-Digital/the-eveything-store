import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      // Tuned for serverless: a small pool avoids holding onto stale
      // connections across cold starts, and a short server-selection
      // timeout means a genuinely unreachable cluster fails fast with a
      // clear error instead of hanging until the platform kills the
      // function (which otherwise surfaces as an opaque 500/504).
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 20000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Clear the cached promise so the next request gets a fresh connection
    // attempt instead of reusing (and immediately re-throwing from) this
    // failed one.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
