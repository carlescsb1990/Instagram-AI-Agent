import { Router } from "express";

const router = Router();

// Simple working routes
router.get("/", (_req, res) => {
  res.json({
    name: "Riona AI Agent",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      status: "/status",
    },
  });
});

router.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get("/status", (_req, res) => {
  res.json({
    server: "running",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
