import app from "./app";
import logger from "./config/logger";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    logger.info("🚀 Starting Riona AI Agent server...");

    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running on port ${PORT}`);
      logger.info(`📱 Dashboard available at http://localhost:${PORT}`);
      logger.info("🤖 Riona AI Agent ready for automation");
      console.log(
        `\n🌟 Riona AI Agent Dashboard\n📱 Open: http://localhost:${PORT}\n✅ Status: Ready\n`,
      );
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
