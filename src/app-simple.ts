import express, { Application } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { runInstagram } from "./client/Instagram";
import logger, { setupErrorHandlers } from "./config/logger";
import { setup_HandleError } from "./utils";
import { connectDB } from "./config/db";
import simpleRoutes from "./routes/simple";

// Set up error handlers
setupErrorHandlers();
dotenv.config();

const app: Application = express();

// Connect to database
connectDB();

// Basic middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple routes
app.use("/", simpleRoutes);

const runAgents = async () => {
  while (true) {
    logger.info("Starting Instagram agent iteration...");
    await runInstagram();
    logger.info("Instagram agent iteration finished.");
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }
};

export { runAgents };
export default app;
