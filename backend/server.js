import "dotenv/config";
import { createApp } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { hydrateFromDb } from "./src/config/hydrate.js";

const PORT = process.env.PORT || 5000;

async function start() {
  const connected = await connectDB();
  if (connected) await hydrateFromDb();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`GreatHire Teamora API listening on http://localhost:${PORT}`);
    if (!connected) {
      console.warn("[db] Running without MongoDB — data will not persist across restarts.");
    }
  });
}

start();
