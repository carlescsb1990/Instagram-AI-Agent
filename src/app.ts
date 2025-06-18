import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet"; // For securing HTTP headers
import cors from "cors";

import { runInstagram } from "./client/Instagram";
import logger, { setupErrorHandlers } from "./config/logger";
import { setup_HandleError } from "./utils";
import { connectDB } from "./config/db";

// Import route modules
import routes from "./routes";

// Set up process-level error handlers
setupErrorHandlers();

// Initialize environment variables
dotenv.config();

const app: Application = express();

// Connect to the database
connectDB();

// Security middleware
app.use(
  helmet({
    xssFilter: true,
    noSniff: true,
    crossOriginEmbedderPolicy: false, // Allow embedding for development
  }),
);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:3000", "http://127.0.0.1:3000"]
        : [],
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" })); // Increased limit for AI content
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${res.statusCode} in ${duration}ms`);
  });

  next();
});

// API Routes
app.use("/", routes);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
    suggestion: "Check /api/v1 for available endpoints",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled error:", error);

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
    timestamp: new Date().toISOString(),
    requestId: req.headers["x-request-id"] || "unknown",
  });
});

const runAgents = async () => {
  while (true) {
    logger.info("Starting Instagram agent iteration...");
    await runInstagram();
    logger.info("Instagram agent iteration finished.");

    // logger.info("Starting Twitter agent...");
    // await twitterMain();
    // logger.info("Twitter agent finished.");

    // logger.info("Starting GitHub agent...");
    // await githubMain();
    // logger.info("GitHub agent finished.");

    // Wait for 30 seconds before next iteration
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }
};

// Export the runAgents function so it can be called from index.ts
export { runAgents };

export default app;
