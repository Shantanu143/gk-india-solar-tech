/**
 * Runs a real local MongoDB for development, persisted to disk under `server/.data/mongodb`
 * (gitignored) — not a Homebrew/Docker install, but not the ephemeral in-RAM instance used for
 * one-off test verification either. Data survives restarts of this script and of the machine.
 *
 * Usage: npm run dev:db   (leave running in its own terminal/background process)
 */
const path = require("node:path");
const fs = require("node:fs");
const { MongoMemoryServer } = require("mongodb-memory-server");

const dbPath = path.join(__dirname, "..", ".data", "mongodb");
fs.mkdirSync(dbPath, { recursive: true });

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: { port: 27018, dbPath, dbName: "gk-india-solartech", storageEngine: "wiredTiger" },
    // We manage this dbPath ourselves — never let it be wiped out from under us.
    binary: { checkMD5: false },
  });
  console.log("DEV_DB_READY", mongod.getUri());
  console.log(`Data persisted at: ${dbPath}`);

  process.on("SIGINT", async () => {
    await mongod.stop({ doCleanup: false });
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await mongod.stop({ doCleanup: false });
    process.exit(0);
  });
})();
