import dotenv from "dotenv";
import logger from "./config/logger";
import { shutdown } from "./services";
import app, { runAgents } from "./app";
import { initAgent } from "./Agent/index";
import { setup_HandleError } from "./utils";

dotenv.config();

async function startServer() {
  try {
    await initAgent();
  } catch (err) {
    logger.error("Error during agent initialization:", err);
    process.exit(1);
  }

  const server = app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server is running on port ${process.env.PORT || 3000}`);

    // Start the agents after the server is running
    runAgents().catch((error) => {
      setup_HandleError(error, "Error running agents:");
    });
  });

  process.on("SIGTERM", () => {
    logger.info("Received SIGTERM signal.");
    shutdown(server);
  });
  process.on("SIGINT", () => {
    logger.info("Received SIGINT signal.");
    shutdown(server);
  });
}

startServer();
