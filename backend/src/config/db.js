import mongoose from "mongoose";

mongoose.set("strictQuery", true);

/**
 * Connects to MongoDB. If MONGODB_URI is not set, the server intentionally
 * keeps running on the existing in-memory arrays (dev-friendly fallback) —
 * but logs a clear warning so it's obvious data won't persist across restarts.
 * Returns true if connected, false if running on the in-memory fallback.
 */
export async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "[db] MONGODB_URI not set — running on in-memory data only. " +
        "Data will reset on every server restart. Set MONGODB_URI in .env to enable persistence."
    );
    return false;
  }

  mongoose.connection.on("error", (err) => console.error("[db] MongoDB connection error:", err.message));
  mongoose.connection.on("disconnected", () => console.warn("[db] MongoDB disconnected"));

  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || undefined });
    console.log(`[db] MongoDB connected -> ${mongoose.connection.name}`);
    return true;
  } catch (err) {
    console.error("[db] Failed to connect to MongoDB:", err.message);
    console.warn("[db] Falling back to in-memory data for this run.");
    return false;
  }
}
