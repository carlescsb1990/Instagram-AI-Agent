import { Router, Request, Response } from "express";
import { connectDB } from "../config/db";
import mongoose from "mongoose";
import { geminiApiKeys } from "../secret";

const router = Router();

// Basic health check
router.get("/", async (_req: Request, res: Response) => {
  try {
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        server: "running",
        database: await checkDatabaseHealth(),
        ai: await checkAIHealth(),
        memory: getMemoryUsage(),
        system: getSystemInfo(),
      },
    };

    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Detailed health check
router.get("/detailed", async (_req: Request, res: Response) => {
  try {
    const detailedHealth = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: await getDatabaseDetails(),
        ai: await getAIDetails(),
        social_clients: await getSocialClientsStatus(),
        agent_system: await getAgentSystemStatus(),
      },
      performance: {
        memory: getDetailedMemoryUsage(),
        cpu: process.cpuUsage(),
        uptime: {
          seconds: process.uptime(),
          formatted: formatUptime(process.uptime()),
        },
      },
    };

    res.status(200).json(detailedHealth);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Readiness probe (Kubernetes-style)
router.get("/ready", async (_req: Request, res: Response) => {
  try {
    // Check if all critical services are ready
    const dbReady = (await checkDatabaseHealth()) === "connected";
    const aiReady = (await checkAIHealth()) === "available";

    if (dbReady || process.env.NODE_ENV === "development") {
      res
        .status(200)
        .json({ status: "ready", timestamp: new Date().toISOString() });
    } else {
      res
        .status(503)
        .json({ status: "not ready", timestamp: new Date().toISOString() });
    }
  } catch (error) {
    res
      .status(503)
      .json({
        status: "not ready",
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
});

// Liveness probe (Kubernetes-style)
router.get("/live", (req: Request, res: Response) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Helper functions
async function checkDatabaseHealth(): Promise<string> {
  if (process.env.NODE_ENV === "development" && !process.env.MONGODB_URI) {
    return "disabled";
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return "connected";
    } else {
      return "disconnected";
    }
  } catch (error) {
    return "error";
  }
}

async function checkAIHealth(): Promise<string> {
  try {
    return geminiApiKeys.length > 0 ? "available" : "unavailable";
  } catch (error) {
    return "error";
  }
}

function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(usage.external / 1024 / 1024)} MB`,
  };
}

function getDetailedMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: usage.rss,
    heapTotal: usage.heapTotal,
    heapUsed: usage.heapUsed,
    external: usage.external,
    arrayBuffers: usage.arrayBuffers || 0,
  };
}

function getSystemInfo() {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    pid: process.pid,
  };
}

async function getDatabaseDetails() {
  if (process.env.NODE_ENV === "development" && !process.env.MONGODB_URI) {
    return {
      status: "disabled",
      reason: "Development mode without MongoDB URI",
    };
  }

  return {
    status: await checkDatabaseHealth(),
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || "N/A",
    name: mongoose.connection.name || "N/A",
  };
}

async function getAIDetails() {
  return {
    status: await checkAIHealth(),
    provider: "Google Gemini",
    apiKeysCount: geminiApiKeys.length,
    model: "gemini-2.0-flash",
  };
}

async function getSocialClientsStatus() {
  return {
    instagram: {
      status: process.env.IGusername ? "configured" : "not configured",
      automated: process.env.IGusername ? true : false,
    },
    twitter: {
      status: process.env.TWITTER_API_KEY ? "configured" : "not configured",
      automated: process.env.TWITTER_API_KEY ? true : false,
    },
    github: {
      status: "available",
      automated: false,
    },
  };
}

async function getAgentSystemStatus() {
  return {
    status: "running",
    characters: [
      "ArcanEdge.System.Agent",
      "elon.character",
      "sample.character",
    ],
    activeCharacter: "ArcanEdge.System.Agent",
  };
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}

export default router;
