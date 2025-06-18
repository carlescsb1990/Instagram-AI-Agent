import mongoose from "mongoose";
import logger from "./logger";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.trim() === "") {
    if (process.env.NODE_ENV === "development") {
      logger.warn(
        "MongoDB URI not provided. Running in development mode without database.",
      );
      return;
    } else {
      logger.error("MongoDB URI is required in production mode");
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(mongoUri, {
      // These options are no longer necessary
    });
    logger.info("MongoDB connected");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      logger.warn(
        "MongoDB connection failed in development mode. Continuing without database:",
        error,
      );
      return;
    } else {
      logger.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }
};
