import mongoose from "mongoose";
import { logger } from "./logger.js";

mongoose.set("strictQuery", true);

let isConnected = false;

/**
 * Connects to MongoDB using MONGODB_URI from the environment.
 * Call once at boot, before the server starts accepting requests.
 */
export async function connectDB() {
  if (isConnected) return mongoose.connection;

  let uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env and set MONGODB_URI (local Mongo or a MongoDB Atlas connection string)."
    );
  }

  mongoose.connection.on("connected", () => {
    logger.info({ db: mongoose.connection.name }, "[mongo] connected");
  });
  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "[mongo] connection error");
  });
  mongoose.connection.on("disconnected", () => {
    logger.warn("[mongo] disconnected");
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  isConnected = true;
  await cleanupStaleIndexes();
  return mongoose.connection;
}

/**
 * Drops indexes left over from earlier schema versions that no longer match
 * the current models. Mongoose never drops old indexes on its own when a
 * schema's fields change, so a stale unique index can keep enforcing
 * constraints on fields that don't exist anymore (e.g. every new document
 * colliding on `token: null` after the field was renamed to `tokenHash`).
 * Safe to run on every boot — it's a no-op once the index is gone.
 */
async function cleanupStaleIndexes() {
  try {
    let collections = await mongoose.connection.db.listCollections({ name: "passwordresettokens" }).toArray();
    if (collections.length === 0) return;
    let indexes = await mongoose.connection.db.collection("passwordresettokens").indexes();
    let stale = indexes.find((idx) => idx.name === "token_1");
    if (stale) {
      await mongoose.connection.db.collection("passwordresettokens").dropIndex("token_1");
      logger.info("[mongo] dropped stale passwordresettokens.token_1 index");
    }
  } catch (err) {
    logger.warn({ err }, "[mongo] could not check/drop stale indexes");
  }
}

export async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

export default mongoose;
