import { app } from "./app";
import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/db";
import { logger } from "./config/logger";

async function main() {
  await connectDatabase();
  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  async function shutdown() {
    logger.info("SIGTERM received. Shutting down gracefully…");
    server.close();
    await disconnectDatabase();
    process.exit(0);
  }

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
